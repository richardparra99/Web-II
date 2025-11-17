import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class ReviewCreateDto {
    @IsNotEmpty()
    @IsString()
    texto: string;

    @IsInt()
    @Min(1)
    @Max(5)
    puntuacion: number;

    @IsInt()
    peliculaId: number;
}
