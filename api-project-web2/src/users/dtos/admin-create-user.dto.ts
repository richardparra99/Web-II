import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, ArrayUnique, MinLength } from "class-validator";
import { UserRole } from "../user-role.enum";

export class AdminCreateUserDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    roles?: UserRole[];
}
