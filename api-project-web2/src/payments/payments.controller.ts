import { Body, Controller, ForbiddenException, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import type { AuthRequest } from "../auth/auth-request.interface";
import { UserRole } from "../users/user-role.enum";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { ReviewPaymentDto } from "./dtos/review-payment.dto";

@Controller("payments")
export class PaymentsController {
    constructor(private readonly paymentService: PaymentsService) {}

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
    @Patch(":id")
    review(@Param("", ParseIntPipe) id: number, @Body() body: ReviewPaymentDto, @Req() req: AuthRequest) {
        const { userId, roles } = req.user;
        const isOrgnazerOrAdmin = roles?.includes(UserRole.ORGANIZER) || roles?.includes(UserRole.ADMIN);
        if (!isOrgnazerOrAdmin) {
            throw new ForbiddenException("Solo organizadores o administradores pueden revisar pagos");
        }
        return this.paymentService.review(id, body, userId, roles);
    }
}
