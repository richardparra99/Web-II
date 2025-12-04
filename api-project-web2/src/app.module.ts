import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { EventsModule } from "./events/events.module";
import { RegistrationsModule } from "./registrations/registrations.module";
import { PaymentsModule } from "./payments/payments.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT ?? ""),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: true,
        }),
        AuthModule,
        UsersModule,
        EventsModule,
        RegistrationsModule,
        PaymentsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
