import { Request } from "express";

export type JwtUser = {
    userId: number;
    email: string;
};

export interface AuthRequest extends Request {
    user: JwtUser;
}
