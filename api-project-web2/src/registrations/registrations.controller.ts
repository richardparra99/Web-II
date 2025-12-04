import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { RegistrationsService } from "./registrations.service";
import { CreateRegistrationDto } from "./dtos/create-registration.dto";
import type { AuthRequest } from "../auth/auth-request.interface";
import { UserRole } from "../users/user-role.enum";
import { JwtAuthGuard } from "../auth/jwt.guard";

@Controller("registrations")
export class RegistrationsController {
    constructor(private readonly registrationsService: RegistrationsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: CreateRegistrationDto, @Req() req: AuthRequest) {
        const { userId, roles } = req.user;
        const isParticipant = roles?.includes(UserRole.PARTICIPANT) || roles?.includes(UserRole.ADMIN);
        if (!isParticipant) {
            throw new ForbiddenException("Solo los participantes pueden inscribirse");
        }
        return this.registrationsService.create(body, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("my")
    findMy(@Req() req: AuthRequest) {
        const { userId } = req.user;
        return this.registrationsService.findMyRegistrations(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    cancel(@Param("id", ParseIntPipe) id: number, @Req() req: AuthRequest) {
        const { userId } = req.user;
        return this.registrationsService.cancel(id, userId);
    }
}
