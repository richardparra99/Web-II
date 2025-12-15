import { IsArray, ArrayNotEmpty, IsEnum } from "class-validator";
import { UserRole } from "../user-role.enum";

export class UpdateUserRolesDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(UserRole, { each: true })
    roles: UserRole[];
}
