import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Not, Repository } from "typeorm";
import { RegistrationEntity } from "./entities/registration.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity } from "../events/entities/event.entity";
import { CreateRegistrationDto } from "./dtos/create-registration.dto";
import { randomUUID } from "crypto";

@Injectable()
export class RegistrationsService {
    constructor(
        @InjectRepository(RegistrationEntity)
        private readonly registrationRepository: Repository<RegistrationEntity>,

        @InjectRepository(EventEntity)
        private readonly eventsRepository: Repository<EventEntity>,
    ) {}

    async create(dto: CreateRegistrationDto, participantId: number): Promise<RegistrationEntity> {
        const event = await this.eventsRepository.findOne({
            where: { id: dto.eventId, isActive: true },
        });
        if (!event) {
            throw new NotFoundException("Evento no encontrado o inactivo");
        }
        const now = new Date();
        if (event.startDate <= now) {
            throw new BadRequestException("No puedes inscribirte a un evento que ya empezó o terminó");
        }
        const existing = this.registrationRepository.findOne({
            where: {
                event: { id: dto.eventId },
                participant: { id: participantId },
                status: Not("CANCELLED"),
            },
        });
        if (await existing) {
            throw new ConflictException("Ya estás inscrito en este evento");
        }
        const currentCount = this.registrationRepository.count({
            where: {
                event: { id: dto.eventId },
                status: Not("CANCELLED"),
            },
        });
        if ((await currentCount) >= event.capacity) {
            throw new BadRequestException("La capacidad del evento está completa");
        }
        const registration = this.registrationRepository.create({
            event: { id: dto.eventId },
            participant: { id: participantId },
            status: "PENDING",
            qrToken: randomUUID(),
        });
        return this.registrationRepository.save(registration);
    }

    findMyRegistrations(userId: number): Promise<RegistrationEntity[]> {
        return this.registrationRepository.find({
            where: {
                participant: { id: userId },
                status: Not("CANCELLED"),
            },
            order: { createdAt: "DESC" },
        });
    }

    async cancel(id: number, userId: number): Promise<void> {
        const registration = await this.registrationRepository.findOne({
            where: { id },
        });

        if (!registration) {
            throw new NotFoundException("Inscripción no encontrada");
        }

        if (registration.participant.id !== userId) {
            throw new ForbiddenException("No puedes cancelar inscripciones de otros");
        }

        if (registration.status === "CANCELLED") {
            throw new BadRequestException("La inscripción ya fue cancelada");
        }

        const now = new Date();
        if (registration.event.startDate <= now) {
            throw new BadRequestException("No puedes cancelar una inscripción de un evento que ya inició");
        }

        registration.status = "CANCELLED";
        registration.cancelledAt = now;
        await this.registrationRepository.save(registration);
    }

    async listByEventForOrganizer(eventId: number, organizerId: number) {
        const event = await this.eventsRepository.findOne({
            where: { id: eventId },
        });
        if (!event) {
            throw new NotFoundException("Evento no encontrado");
        }
        if (event.organizer.id !== organizerId) {
            throw new ForbiddenException("No eres el organizador de este evento");
        }
        return this.registrationRepository.find({
            where: { event: { id: eventId } },
            order: { createdAt: "DESC" },
        });
    }
}
