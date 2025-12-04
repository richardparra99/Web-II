import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    registrationId: number;

    @IsNotEmpty()
    @IsString()
    receiptUrl: string;
}
