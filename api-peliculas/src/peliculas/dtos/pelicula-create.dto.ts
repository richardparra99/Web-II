import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";

export class PeliculaCreateDto {
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    titulo: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(1888)
    anio: number;

    @IsString()
    @IsOptional()
    imagen: string;
}
