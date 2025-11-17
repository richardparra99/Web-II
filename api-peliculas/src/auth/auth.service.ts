import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { UserLoginDto } from "./dtos/user-login.dto";
import { UserRegisterDto } from "./dtos/user-register.dto";
import { UserRegisterReponseDto } from "./dtos/register-response.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async login(body: UserLoginDto): Promise<{ accessToken: string }> {
        const user = await this.usersService.findByEmail(body.email);
        if (!user) {
            throw new UnauthorizedException();
        }

        const hashedPassword = await bcrypt.compare(body.password, user.password);
        if (!hashedPassword) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);
        return { accessToken: token };
    }

    async register(body: UserRegisterDto): Promise<UserRegisterReponseDto> {
        const user = await this.usersService.findByEmail(body.email);
        if (user) {
            throw new ConflictException("El usuario ya existe");
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = await this.usersService.create({
            email: body.email.toLowerCase(),
            password: hashedPassword,
            fullname: body.fullname,
        });
        return { id: newUser.id, email: newUser.email, fullname: newUser.fullname };
    }
}
