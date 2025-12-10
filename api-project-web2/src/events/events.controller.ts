import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dtos/create-event.dto";
import type { AuthRequest } from "../auth/auth-request.interface";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { UserRole } from "../users/user-role.enum";
import { UpdateEventDto } from "./dtos/update-event.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

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
    @Post("poster")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: "./uploads/poster",
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `event-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    uploadPoster(@UploadedFile() file: Express.Multer.File, @Req() req: AuthRequest) {
        if (!file) {
            throw new BadRequestException("No se envió archivo");
        }

        const { roles } = req.user;
        const isOrganizer = roles?.includes(UserRole.ORGANIZER) || roles?.includes(UserRole.ADMIN);

        if (!isOrganizer) {
            throw new ForbiddenException("Solo organizadores pueden subir posters");
        }

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const url = `${baseUrl}/uploads/posters/${file.filename}`;

        // Esta URL la usarás como posterUrl al crear/editar el evento
        return { url };
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
