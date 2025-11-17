import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { Pelicula } from "../peliculas/entities/pelicula.entity";
import { ReviewCreateDto } from "./dtos/review-create.dto";
import { ReviewUpdateDto } from "./dtos/review-update.dto";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,

        @InjectRepository(Pelicula)
        private peliculaRepository: Repository<Pelicula>,
    ) {}

    async create(dto: ReviewCreateDto, userId: number): Promise<Review> {
        const pelicula = await this.peliculaRepository.findOneBy({ id: dto.peliculaId });
        if (!pelicula) {
            throw new NotFoundException("Pelicula no encontrada");
        }

        const review = this.reviewRepository.create({
            texto: dto.texto,
            puntuacion: dto.puntuacion,
            pelicula: { id: dto.peliculaId },
            user: { id: userId },
        });
        await this.reviewRepository.save(review);
        await this.recalcularPromedio(dto.peliculaId);
        return review;
    }

    async findByPelicula(peliculaId: number): Promise<Review[]> {
        return this.reviewRepository.find({
            where: { pelicula: { id: peliculaId } },
            relations: ["user"],
            order: { create_at: "DESC" },
        });
    }

    async update(id: number, dto: ReviewUpdateDto, userId: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ["user", "pelicula"],
        });
        if (!review) {
            throw new NotFoundException("Review no encontrado");
        }
        if (review.user.id !== userId) {
            throw new NotFoundException("No puedes editar una review de otro usuario");
        }
        Object.assign(review, dto);
        await this.reviewRepository.save(review);
        await this.recalcularPromedio(review.pelicula.id);
        return review;
    }

    async delete(id: number, userId: number): Promise<void> {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ["user", "pelicula"],
        });
        if (!review) {
            throw new NotFoundException("Review no encontrado");
        }

        if (review.user.id !== userId) {
            throw new NotFoundException("No puedes eliminar un review de otro usuario");
        }

        const peliculaId = review.pelicula.id;
        await this.reviewRepository.remove(review);
        await this.recalcularPromedio(peliculaId);
    }

    async findByUser(userId: number) {
        return this.reviewRepository.find({
            where: { user: { id: userId } },
            relations: ["pelicula"],
            order: { create_at: "DESC" },
        });
    }

    private async recalcularPromedio(peliculaId: number): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const resultado = await this.reviewRepository.createQueryBuilder("r").select("AVG(r.puntuacion)", "avg").where("r.peliculaId = :id", { id: peliculaId }).getRawOne();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const promedio = resultado?.avg ? parseFloat(resultado.avg) : 0;

        await this.peliculaRepository.update(peliculaId, {
            calificacionPromedio: promedio,
        });
    }
}
