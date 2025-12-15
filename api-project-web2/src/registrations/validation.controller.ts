import { Controller, ForbiddenException, Get, Param, Req, UseGuards } from "@nestjs/common";
import { RegistrationsService } from "./registrations.service";
import type { AuthRequest } from "../auth/auth-request.interface";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { UserRole } from "../users/user-role.enum";

@Controller("validation")
export class ValidationController {
    constructor(private readonly registrationsService: RegistrationsService) {}

    @UseGuards(JwtAuthGuard)
    @Get(":token")
    async validate(@Param("token") token: string, @Req() req: AuthRequest) {
        const { roles } = req.user;

        const isValidator = roles?.includes(UserRole.VALIDATOR) || roles?.includes(UserRole.ADMIN) || roles?.includes(UserRole.ORGANIZER);

        if (!isValidator) {
            throw new ForbiddenException("Solo los validadores pueden validar QR");
        }

        return this.registrationsService.validateQrToken(token);
    }
}
