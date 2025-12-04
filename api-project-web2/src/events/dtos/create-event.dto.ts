import { IsNotEmpty, IsNumberString, IsOptional, IsPositive, IsString } from "class-validator";

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
    @IsString()
    startDate: Date;

    @IsNotEmpty()
    @IsString()
    @IsPositive()
    capacity: number;

    @IsOptional()
    @IsString()
    posterUrl?: string;

    @IsOptional()
    @IsNumberString()
    price?: string;
}
