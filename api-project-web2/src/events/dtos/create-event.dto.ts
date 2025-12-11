import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Min } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    capacity: number;

    @IsOptional()
    @IsString()
    posterUrl?: string;

    @IsOptional()
    @IsNumberString()
    price?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    longitude?: number;
}
