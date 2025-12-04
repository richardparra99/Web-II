import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateRegistrationDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    eventId: number;
}
