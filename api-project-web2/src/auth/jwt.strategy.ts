import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRole } from "../users/user-role.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>("JWT_SECRET") ?? "dev_secret",
        });
    }
    validate(payload: { sub: number; email: string; roles: UserRole[] }) {
        // lo que retornes aquí queda en req.user
        return { userId: payload.sub, email: payload.email, roles: payload.roles };
    }
}
