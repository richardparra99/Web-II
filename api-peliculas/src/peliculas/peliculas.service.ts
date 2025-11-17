import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pelicula } from "./entities/pelicula.entity";
import { PeliculaCreateDto } from "./dtos/pelicula-create.dto";

@Injectable()
export class PeliculasService {
    constructor(
        @InjectRepository(Pelicula)
        private readonly peliculasRepo: Repository<Pelicula>,
    ) {}

    async create(dto: PeliculaCreateDto): Promise<Pelicula> {
        const newPelicula = this.peliculasRepo.create({
            ...dto,
            calificacionPromedio: 0,
        });
        return this.peliculasRepo.save(newPelicula);
    }

    async getAll(): Promise<Pelicula[]> {
        return this.peliculasRepo.find({ order: { createdAt: "DESC" } });
    }

    async findOne(id: number): Promise<Pelicula> {
        const peli = await this.peliculasRepo.findOne({
            where: { id },
            relations: ["reviews", "reviews.user"],
            order: {
                reviews: {
                    create_at: "DESC",
                },
            },
        });
        if (!peli) {
            throw new NotFoundException("Pelicula no encontrada");
        }
        return peli;
    }

    getTop(limit = 20): Promise<Pelicula[]> {
        return this.peliculasRepo.find({
            order: { calificacionPromedio: "DESC" },
            take: limit,
        });
    }
}
