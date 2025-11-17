import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewCreateDto } from "./dtos/review-create.dto";
import type { AuthRequest } from "../auth/auth-request.interface";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { ReviewUpdateDto } from "./dtos/review-update.dto";

@Controller("reviews")
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @UseGuards(JwtAuthGuard)
    @Post("/")
    create(@Body() dto: ReviewCreateDto, @Req() req: AuthRequest) {
        return this.reviewsService.create(dto, req.user.userId);
    }

    @Get("/pelicula/:id")
    getByPelicula(@Param("id", ParseIntPipe) id: number) {
        return this.reviewsService.findByPelicula(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: ReviewUpdateDto, @Req() req: AuthRequest) {
        return this.reviewsService.update(id, dto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    delete(@Param("id", ParseIntPipe) id: number, @Req() req: AuthRequest) {
        return this.reviewsService.delete(id, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("mine")
    getMyReviews(@Req() req: AuthRequest) {
        return this.reviewsService.findByUser(req.user.userId);
    }
}
