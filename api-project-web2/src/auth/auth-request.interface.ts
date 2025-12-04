import { Request } from "express";
import { UserRole } from "../users/user-role.enum";

export type JwtUser = {
    userId: number;
    email: string;
    roles: UserRole[];
};

export interface AuthRequest extends Request {
    user: JwtUser;
}
