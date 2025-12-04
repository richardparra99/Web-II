import { IsIn, IsNotEmpty } from "class-validator";

export class ReviewPaymentDto {
    @IsNotEmpty()
    @IsIn(["APPROVED", "REJECTED"])
    status: "APPROVED" | "REJECTED";
}
