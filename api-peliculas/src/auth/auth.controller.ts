import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UserLoginDto } from "./dtos/user-login.dto";
import { AuthService } from "./auth.service";
import { UserRegisterDto } from "./dtos/user-register.dto";
import { UserRegisterReponseDto } from "./dtos/register-response.dto";
import { JwtAuthGuard } from "./jwt.guard";
import type { AuthRequest } from "./auth-request.interface";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("login")
    login(@Body() body: UserLoginDto): Promise<any> {
        return this.authService.login(body);
    }

    @Post("register")
    register(@Body() body: UserRegisterDto): Promise<UserRegisterReponseDto> {
        return this.authService.register(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Req() req: AuthRequest) {
        return {
            userId: req.user.userId,
            email: req.user.email,
        };
    }
}
