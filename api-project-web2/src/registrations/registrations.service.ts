import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Not, Repository } from "typeorm";
import { RegistrationEntity } from "./entities/registration.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity } from "../events/entities/event.entity";
import { CreateRegistrationDto } from "./dtos/create-registration.dto";
import { randomUUID } from "crypto";
import { PaymentEntity, PaymentStatus } from "../payments/entities/payment.entity";

@Injectable()
export class RegistrationsService {
    constructor(
        @InjectRepository(RegistrationEntity)
        private readonly registrationRepository: Repository<RegistrationEntity>,

        @InjectRepository(EventEntity)
        private readonly eventsRepository: Repository<EventEntity>,

        @InjectRepository(PaymentEntity)
        private readonly paymentsRepository: Repository<PaymentEntity>,
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
        const approvidePayment = await this.paymentsRepository.findOne({
            where: {
                registration: { id },
                status: "APPROVED" as PaymentStatus,
            },
        });

        if (approvidePayment) {
            throw new BadRequestException("No puedes cancelar una inscripción con pago confirmado");
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

    async validateQrToken(token: string) {
        const registration = await this.registrationRepository.findOne({
            where: { qrToken: token },
        });
        if (!registration) {
            return { status: "INVALID" as const };
        }

        // Podemos exigir que el evento siga activo
        if (!registration.event.isActive) {
            return { status: "INVALID" as const };
        }

        // Si quieres que solo cuenten las inscripciones CONFIRMED (pago aprobado)
        if (registration.status !== "CONFIRMED") {
            return { status: "INVALID" as const };
        }

        // Ya fue validado antes
        if (registration.checkInAt) {
            return {
                status: "ALREADY_CHECKED_IN" as const,
                participantName: registration.participant.fullName,
                eventTitle: registration.event.title,
                checkInAt: registration.checkInAt,
            };
        }

        // Primera validación: marcar ingreso
        registration.checkInAt = new Date();
        await this.registrationRepository.save(registration);

        return {
            status: "VALID" as const,
            participantName: registration.participant.fullName,
            eventTitle: registration.event.title,
            checkInAt: registration.checkInAt,
        };
    }
}
