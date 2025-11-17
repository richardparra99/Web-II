import { Module } from "@nestjs/common";
import { PeliculasController } from "./peliculas.controller";
import { PeliculasService } from "./peliculas.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pelicula } from "./entities/pelicula.entity";
import { MulterModule } from "@nestjs/platform-express";

@Module({
    controllers: [PeliculasController],
    providers: [PeliculasService],
    imports: [TypeOrmModule.forFeature([Pelicula]), MulterModule.register({ dest: "./uploads" })],
})
export class PeliculasModule {}
