import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { In, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity } from "./entities/event.entity";
import { CreateEventDto } from "./dtos/create-event.dto";
import { UpdateEventDto } from "./dtos/update-event.dto";
import { RegistrationEntity } from "../registrations/entities/registration.entity";
import { PaymentEntity } from "../payments/entities/payment.entity";
import { AdminEventStatsItem, AdminEventStatsResult } from "./events-stats.types";

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(EventEntity)
        private readonly eventsRepository: Repository<EventEntity>,

        @InjectRepository(RegistrationEntity)
        private readonly registrationsRepo: Repository<RegistrationEntity>,

        @InjectRepository(PaymentEntity)
        private readonly paymentsRepository: Repository<PaymentEntity>,
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

    async getAdminStats(from?: string, to?: string): Promise<AdminEventStatsResult> {
        let fromDate: Date | undefined;
        let toDate: Date | undefined;

        if (from) {
            fromDate = new Date(from);
        }
        if (to) {
            const tmp = new Date(to);
            // incluir todo el día "to"
            tmp.setHours(23, 59, 59, 999);
            toDate = tmp;
        }

        // 1) Eventos activos en el rango usando QueryBuilder
        const qb = this.eventsRepository.createQueryBuilder("event").where("event.isActive = :isActive", { isActive: true });

        if (fromDate) {
            qb.andWhere("event.startDate >= :fromDate", { fromDate });
        }
        if (toDate) {
            qb.andWhere("event.startDate <= :toDate", { toDate });
        }

        const events = await qb.orderBy("event.startDate", "ASC").getMany();

        if (events.length === 0) {
            return {
                from: from || null,
                to: to || null,
                totalEvents: 0,
                totalRegistrations: 0,
                totalConfirmed: 0,
                totalCancelled: 0,
                totalPending: 0,
                totalApprovedPayments: 0,
                totalPendingPayments: 0,
                totalRejectedPayments: 0,
                totalRevenue: 0,
                events: [],
            };
        }

        const eventIds = events.map(e => e.id);

        // 2) Inscripciones de esos eventos
        const registrations = await this.registrationsRepo.find({
            where: {
                event: {
                    id: In(eventIds),
                },
            },
        });

        const registrationIds = registrations.map(r => r.id);

        // 3) Pagos asociados
        let payments: PaymentEntity[] = [];
        if (registrationIds.length > 0) {
            payments = await this.paymentsRepository.find({
                where: {
                    registration: {
                        id: In(registrationIds),
                    },
                },
            });
        }

        // 4) Inicializar mapa por evento
        const statsMap = new Map<number, AdminEventStatsItem>();

        for (const ev of events) {
            statsMap.set(ev.id, {
                eventId: ev.id,
                title: ev.title,
                startDate: ev.startDate,
                location: ev.location,
                price: ev.price ?? null,
                capacity: ev.capacity,

                totalRegistrations: 0,
                confirmedRegistrations: 0,
                cancelledRegistrations: 0,
                pendingRegistrations: 0,

                approvedPayments: 0,
                pendingPayments: 0,
                rejectedPayments: 0,

                revenue: 0,
            });
        }

        // 5) Contar inscripciones
        for (const reg of registrations) {
            const evId = reg.event.id;
            const item = statsMap.get(evId);
            if (!item) continue;

            item.totalRegistrations += 1;

            if (reg.status === "CONFIRMED") {
                item.confirmedRegistrations += 1;
            } else if (reg.status === "CANCELLED") {
                item.cancelledRegistrations += 1;
            } else if (reg.status === "PENDING") {
                item.pendingRegistrations += 1;
            }
        }

        // 6) Contar pagos y monto recaudado
        for (const pay of payments) {
            const evId = pay.registration.event.id;
            const item = statsMap.get(evId);
            if (!item) continue;

            if (pay.status === "APPROVED") {
                item.approvedPayments += 1;
                const priceNum = item.price ? Number(item.price) : 0;
                item.revenue += priceNum;
            } else if (pay.status === "PENDING") {
                item.pendingPayments += 1;
            } else if (pay.status === "REJECTED") {
                item.rejectedPayments += 1;
            }
        }

        // 7) Totales generales
        let totalRegistrations = 0;
        let totalConfirmed = 0;
        let totalCancelled = 0;
        let totalPending = 0;
        let totalApprovedPayments = 0;
        let totalPendingPayments = 0;
        let totalRejectedPayments = 0;
        let totalRevenue = 0;

        for (const item of statsMap.values()) {
            totalRegistrations += item.totalRegistrations;
            totalConfirmed += item.confirmedRegistrations;
            totalCancelled += item.cancelledRegistrations;
            totalPending += item.pendingRegistrations;
            totalApprovedPayments += item.approvedPayments;
            totalPendingPayments += item.pendingPayments;
            totalRejectedPayments += item.rejectedPayments;
            totalRevenue += item.revenue;
        }

        return {
            from: from || null,
            to: to || null,
            totalEvents: events.length,
            totalRegistrations,
            totalConfirmed,
            totalCancelled,
            totalPending,
            totalApprovedPayments,
            totalPendingPayments,
            totalRejectedPayments,
            totalRevenue,
            events: Array.from(statsMap.values()),
        };
    }
}
