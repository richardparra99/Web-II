import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { RolesGuard } from "./roles.guard";

@Module({
    imports: [
        ConfigModule.forRoot(),
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>("JWT_SECRET") ?? "dev_secret",
                signOptions: { expiresIn: "7d" },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RolesGuard],
    exports: [AuthService, RolesGuard],
})
export class AuthModule {}
