import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { PaymentEntity } from "./entities/payment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RegistrationEntity } from "../registrations/entities/registration.entity";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import { ReviewPaymentDto } from "./dtos/review-payment.dto";
import { UserRole } from "../users/user-role.enum";
import { User } from "../users/entities/user.entity";

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(PaymentEntity)
        private readonly paymentRepo: Repository<PaymentEntity>,

        @InjectRepository(RegistrationEntity)
        private readonly registrationsRepo: Repository<RegistrationEntity>,
    ) {}

    async create(dto: CreatePaymentDto, userId: number): Promise<PaymentEntity> {
        const registration = await this.registrationsRepo.findOne({
            where: { id: dto.registrationId },
        });
        if (!registration) {
            throw new NotFoundException("Inscripción no encontrada");
        }
        if (registration.participant.id !== userId) {
            throw new ForbiddenException("No puedes subir comprobantes de otros participantes");
        }
        if (registration.status === "CANCELLED") {
            throw new BadRequestException("No puedes subir comprobante de una inscripción cancelada");
        }
        const now = new Date();
        if (registration.event.startDate <= now) {
            throw new BadRequestException("No puedes subir comprobante de un evento que ya inició");
        }
        const existing = await this.paymentRepo.findOne({
            where: { registration: { id: dto.registrationId } },
            order: { uploadedAt: "DESC" },
        });
        if (existing && existing.status === "APPROVED") {
            throw new ConflictException("El pago ya fue aprobado");
        }
        let payment: PaymentEntity;
        if (existing && existing.status === "REJECTED") {
            existing.receiptUrl = dto.receiptUrl;
            existing.status = "PENDING";
            existing.uploadedAt = new Date();
            existing.reviewedAt = null;
            existing.reviewedBy = null;
            payment = await this.paymentRepo.save(existing);
        } else {
            payment = this.paymentRepo.create({
                registration: { id: dto.registrationId },
                receiptUrl: dto.receiptUrl,
                status: "PENDING",
            });
            payment = await this.paymentRepo.save(payment);
        }
        return payment;
    }

    async review(id: number, dto: ReviewPaymentDto, reviewId: number, reviewerRoles: UserRole[]): Promise<PaymentEntity> {
        const payment = await this.paymentRepo.findOne({
            where: { id },
        });
        if (!payment) {
            throw new NotFoundException("Pago no encontrado");
        }
        const isAdmin = reviewerRoles?.includes(UserRole.ADMIN) ?? false;
        const isOrganizer = payment.registration.event.organizer.id === reviewId;
        if (!isAdmin && !isOrganizer) {
            throw new ForbiddenException("Solo el organizador del evento o un administrador puede revisar pagos");
        }
        payment.status = dto.status;
        payment.reviewedAt = new Date();
        payment.reviewedBy = { id: reviewId } as User;
        await this.paymentRepo.save(payment);

        const registration = payment.registration;
        if (dto.status === "APPROVED") {
            registration.status = "CONFIRMED";
        } else if (dto.status === "REJECTED") {
            registration.status = "PENDING";
        }
        await this.registrationsRepo.save(registration);
        return payment;
    }

    async findByRegistration(registrationId: number): Promise<PaymentEntity | null> {
        return this.paymentRepo.findOne({
            where: { registration: { id: registrationId } },
            order: { uploadedAt: "DESC" },
        });
    }
}
