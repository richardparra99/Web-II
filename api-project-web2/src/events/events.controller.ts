import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dtos/create-event.dto";
import type { AuthRequest } from "../auth/auth-request.interface";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { UserRole } from "../users/user-role.enum";
import { UpdateEventDto } from "./dtos/update-event.dto";

@Controller("events")
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @Get("public")
    getPublicEvents() {
        return this.eventsService.findPublic();
    }

    @Get(":id")
    getEvent(@Param("id", ParseIntPipe) id: number) {
        return this.eventsService.findOnePublic(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createEvent(@Body() body: CreateEventDto, @Req() req: AuthRequest) {
        const { userId, roles } = req.user;
        // Solo ORGANIZER o ADMIN pueden crear eventos
        const isOrganizer = roles?.includes(UserRole.ORGANIZER) || roles?.includes(UserRole.ADMIN);
        if (!isOrganizer) {
            // Lanzamos aquí la excepción para no meter aún RolesGuard
            throw new Error("Solo los organizadores pueden crear eventos");
        }
        return this.eventsService.create(body, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id")
    updateEvent(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateEventDto, @Req() req: AuthRequest) {
        const { userId, roles } = req.user;
        const isAdmin = roles?.includes(UserRole.ADMIN) ?? false;

        return this.eventsService.update(id, body, userId, isAdmin);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    deleteEvent(@Param("id", ParseIntPipe) id: number, @Req() req: AuthRequest) {
        const { userId, roles } = req.user;
        const isAdmin = roles?.includes(UserRole.ADMIN) ?? false;

        return this.eventsService.remove(id, userId, isAdmin);
    }
}
