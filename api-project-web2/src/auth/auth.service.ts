import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserLoginDto } from "./dtos/user-login.dto";
import { UsersService } from "../users/users.service";
import { UserRegisterDto } from "./dtos/user-register.dto";
import { UserRegisterReponseDto } from "./dtos/register-reponse.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserRole } from "../users/user-role.enum";

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
        const hasheadPassword = await bcrypt.compare(body.password, user.password);
        if (!hasheadPassword) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, email: user.email, roles: user.roles };
        const token = await this.jwtService.signAsync(payload);
        return { accessToken: token };
    }

    async register(body: UserRegisterDto): Promise<UserRegisterReponseDto> {
        const user = await this.usersService.findByEmail(body.email);
        if (user) {
            throw new ConflictException("Usuario ya existe");
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const nuevoUsuario = await this.usersService.createUser({
            email: body.email.toLowerCase(),
            password: hashedPassword,
            fullName: body.fullName,
            roles: [UserRole.PARTICIPANT],
        });
        return { id: nuevoUsuario.id, email: nuevoUsuario.email, fullName: nuevoUsuario.fullName } as UserRegisterReponseDto;
    }
}
