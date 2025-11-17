import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { PeliculasService } from "./peliculas.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import type { Request } from "express";
import { PeliculaCreateDto } from "./dtos/pelicula-create.dto";

@Controller("peliculas")
export class PeliculasController {
    constructor(private readonly peliculaService: PeliculasService) {}

    @Get("top")
    getTop() {
        return this.peliculaService.getTop();
    }

    @Get("/")
    findAll() {
        return this.peliculaService.getAll();
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.peliculaService.findOne(id);
    }

    @Post()
    @UseInterceptors(
        FileInterceptor("imagen", {
            storage: diskStorage({
                destination: "./uploads",
                filename(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void {
                    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    const ext = extname(file.originalname);
                    cb(null, `${unique}${ext}`);
                },
            }),
        }),
    )
    create(@UploadedFile() file: Express.Multer.File, @Body() dto: PeliculaCreateDto) {
        const payload = {
            ...dto,
            imagen: file?.filename ?? dto.imagen ?? "",
        };
        return this.peliculaService.create(payload);
    }
}
