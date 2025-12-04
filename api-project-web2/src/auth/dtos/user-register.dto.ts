import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserRegisterDto {
    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    readonly fullName: string;
}
