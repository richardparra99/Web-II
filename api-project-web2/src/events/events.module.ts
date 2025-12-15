import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEntity } from "./entities/event.entity";
import { RegistrationEntity } from "../registrations/entities/registration.entity";
import { PaymentEntity } from "../payments/entities/payment.entity";

@Module({
    imports: [TypeOrmModule.forFeature([EventEntity, RegistrationEntity, PaymentEntity])],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule {}
