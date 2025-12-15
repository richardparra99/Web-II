import { IsArray, IsEmail, IsOptional, IsString, ArrayUnique } from "class-validator";
import { UserRole } from "../user-role.enum";

export class AdminUpdateUserDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    roles?: UserRole[];
}
