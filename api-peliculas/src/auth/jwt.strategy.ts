import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>("JWT_SECRET") ?? "dev_secret",
        });
    }
    validate(payload: { sub: number; email: string }) {
        // lo que retornes aquí queda en req.user
        return { userId: payload.sub, email: payload.email };
    }
}
