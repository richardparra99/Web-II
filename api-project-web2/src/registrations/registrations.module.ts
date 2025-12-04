import { Module } from "@nestjs/common";
import { RegistrationsController } from "./registrations.controller";
import { RegistrationsService } from "./registrations.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegistrationEntity } from "./entities/registration.entity";
import { EventEntity } from "../events/entities/event.entity";

@Module({
    imports: [TypeOrmModule.forFeature([RegistrationEntity, EventEntity])],
    controllers: [RegistrationsController],
    providers: [RegistrationsService],
    exports: [RegistrationsService],
})
export class RegistrationsModule {}
