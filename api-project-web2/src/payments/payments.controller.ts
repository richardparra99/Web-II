import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import type { AuthRequest } from "../auth/auth-request.interface";
import { UserRole } from "../users/user-role.enum";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { ReviewPaymentDto } from "./dtos/review-payment.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("payments")
export class PaymentsController {
    constructor(private readonly paymentService: PaymentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post("receipt")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: "./uploads/receipts",
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `payment-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    uploadReceipt(@UploadedFile() file: Express.Multer.File, @Req() req: AuthRequest) {
        if (!file) {
            throw new BadRequestException("No se envio el archivo");
        }
        const { roles } = req.user;
        const isParticipant = roles?.includes(UserRole.PARTICIPANT) || roles?.includes(UserRole.ADMIN);
        if (!isParticipant) {
            throw new ForbiddenException("Solo los participantes pueden subir comprobantes");
        }
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const url = `${baseUrl}/uploads/receipts/${file.filename}`;

        // Esta URL se envía luego a POST /payments
        return { url };
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: CreatePaymentDto, @Req() req: AuthRequest) {
        const { userId, roles } = req.user;
        const isParticipant = roles?.includes(UserRole.PARTICIPANT) || roles?.includes(UserRole.ADMIN);

        if (!isParticipant) {
            throw new ForbiddenException("Solo los participantes pueden registrar pagos");
        }

        return this.paymentService.create(body, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("by-registration/:registrationId")
    findByRegistration(@Param("registrationId", ParseIntPipe) registrationId: number, @Req() req: AuthRequest) {
        const { userId, roles } = req.user;
        return this.paymentService.findByRegistrationForUser(registrationId, userId, roles);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id")
    review(@Param("id", ParseIntPipe) id: number, @Body() body: ReviewPaymentDto, @Req() req: AuthRequest) {
        const { userId, roles } = req.user;
        const isOrgnazerOrAdmin = roles?.includes(UserRole.ORGANIZER) || roles?.includes(UserRole.ADMIN);
        if (!isOrgnazerOrAdmin) {
            throw new ForbiddenException("Solo organizadores o administradores pueden revisar pagos");
        }
        return this.paymentService.review(id, body, userId, roles);
    }
}
