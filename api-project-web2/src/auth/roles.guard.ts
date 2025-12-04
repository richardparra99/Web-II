import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../users/user-role.enum";
import { ROLES_KEY } from "./roles.decorator";
import { AuthRequest } from "./auth-request.interface";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest<AuthRequest>();
        const user = request.user;

        if (!user || !user.roles) {
            return false;
        }
        return user.roles.some(role => requiredRoles.includes(role));
    }
}
