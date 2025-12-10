import { Module } from "@nestjs/common";
import { RegistrationsController } from "./registrations.controller";
import { RegistrationsService } from "./registrations.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegistrationEntity } from "./entities/registration.entity";
import { EventEntity } from "../events/entities/event.entity";
import { PaymentEntity } from "../payments/entities/payment.entity";
import { ValidationController } from "./validation.controller";

@Module({
    imports: [TypeOrmModule.forFeature([RegistrationEntity, EventEntity, PaymentEntity])],
    controllers: [RegistrationsController, ValidationController],
    providers: [RegistrationsService],
    exports: [RegistrationsService],
})
export class RegistrationsModule {}
