import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity } from "./entities/event.entity";
import { CreateEventDto } from "./dtos/create-event.dto";
import { UpdateEventDto } from "./dtos/update-event.dto";

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(EventEntity)
        private readonly eventsRepository: Repository<EventEntity>,
    ) {}

    async create(dto: CreateEventDto, organizerId: number): Promise<EventEntity> {
        const event = this.eventsRepository.create({
            title: dto.title,
            description: dto.description,
            location: dto.location,
            startDate: new Date(dto.startDate),
            capacity: dto.capacity,
            posterUrl: dto.posterUrl,
            price: dto.price,
            organizer: { id: organizerId },
            latitude: dto.latitude ?? null,
            longitude: dto.longitude ?? null,
        });
        return this.eventsRepository.save(event);
    }

    findPublic(): Promise<EventEntity[]> {
        const now = new Date();
        return this.eventsRepository.find({
            where: {
                isActive: true,
                startDate: MoreThan(now),
            },
            order: { startDate: "ASC" },
        });
    }

    async findOnePublic(id: number): Promise<EventEntity> {
        const event = await this.eventsRepository.findOne({
            where: { id, isActive: true },
        });
        if (!event) {
            throw new NotFoundException("Evento no encontrado");
        }
        return event;
    }

    async update(id: number, dto: UpdateEventDto, userId: number, isAdmin: boolean): Promise<EventEntity> {
        const event = await this.eventsRepository.findOne({
            where: { id, isActive: true },
        });
        if (!event) {
            throw new NotFoundException("Evento no encontrado");
        }
        if (!isAdmin && event.organizer.id !== userId) {
            throw new ForbiddenException("No eres el organizador de este evento");
        }
        if (dto.title !== undefined) {
            event.title = dto.title;
        }
        if (dto.description !== undefined) {
            event.description = dto.description;
        }
        if (dto.location !== undefined) {
            event.location = dto.location;
        }
        if (dto.startDate !== undefined) {
            event.startDate = new Date(dto.startDate);
        }
        if (dto.capacity !== undefined) {
            event.capacity = dto.capacity;
        }
        if (dto.posterUrl !== undefined) {
            event.posterUrl = dto.posterUrl ?? null;
        }
        if (dto.price !== undefined) {
            event.price = dto.price ?? null;
        }
        if (dto.latitude !== undefined) {
            event.latitude = dto.latitude;
        }
        if (dto.longitude !== undefined) {
            event.longitude = dto.longitude;
        }
        return this.eventsRepository.save(event);
    }

    async remove(id: number, userId: number, isAdmin: boolean): Promise<void> {
        const event = await this.eventsRepository.findOne({
            where: { id, isActive: true },
        });
        if (!event) {
            throw new NotFoundException("Evento no encontrado");
        }

        if (!isAdmin && event.organizer.id !== userId) {
            throw new ForbiddenException("No eres el organizador de este evento");
        }

        event.isActive = false;
        await this.eventsRepository.save(event);
    }
}
