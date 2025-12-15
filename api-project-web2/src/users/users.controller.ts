import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import type { AuthRequest } from "../auth/auth-request.interface";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { UserRole } from "./user-role.enum";
import { UpdateUserRolesDto } from "./dtos/update-user-roles.dto";
import { AdminCreateUserDto } from "./dtos/admin-create-user.dto";
import { AdminUpdateUserDto } from "./dtos/admin-update-user.dto";
import { AdminChangePasswordDto } from "./dtos/admin-change-password.dto";

@Controller("users")
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllForAdmin(@Req() req: AuthRequest) {
        const { roles } = req.user;

        const isAdmin = roles?.includes(UserRole.ADMIN);
        if (!isAdmin) {
            throw new ForbiddenException("Solo los administradores pueden ver la lista de usuarios");
        }
        return this.userService.findAllForAdmin();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id/roles")
    async updateRoles(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateUserRolesDto, @Req() req: AuthRequest) {
        const { roles } = req.user;
        const isAdmin = roles?.includes(UserRole.ADMIN);
        if (!isAdmin) {
            throw new ForbiddenException("Solo los administradores pueden cambiar roles");
        }
        return this.userService.updateRoles(id, body.roles);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createByAdmin(@Body() body: AdminCreateUserDto, @Req() req: AuthRequest) {
        const { roles } = req.user;
        const isAdmin = roles?.includes(UserRole.ADMIN);
        if (!isAdmin) {
            throw new ForbiddenException("Solo los administradores pueden crear usuarios");
        }
        return this.userService.createByAdmin(body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id")
    async updateUser(@Param("id", ParseIntPipe) id: number, @Body() body: AdminUpdateUserDto, @Req() req: AuthRequest) {
        const { roles } = req.user;
        const isAdmin = roles?.includes(UserRole.ADMIN);
        if (!isAdmin) {
            throw new ForbiddenException("Solo los administradores pueden editar usuarios");
        }
        return this.userService.updateUser(id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id/password")
    async changePassword(@Param("id", ParseIntPipe) id: number, @Body() body: AdminChangePasswordDto, @Req() req: AuthRequest) {
        const { roles } = req.user;
        const isAdmin = roles?.includes(UserRole.ADMIN);
        if (!isAdmin) {
            throw new ForbiddenException("Solo los administradores pueden cambiar contraseñas");
        }

        await this.userService.changePassword(id, body.newPassword);
        return { status: "ok" };
    }

    // 6) Eliminar usuario
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteUser(@Param("id", ParseIntPipe) id: number, @Req() req: AuthRequest) {
        const { roles } = req.user;
        const isAdmin = roles?.includes(UserRole.ADMIN);
        if (!isAdmin) {
            throw new ForbiddenException("Solo los administradores pueden eliminar usuarios");
        }

        await this.userService.deleteUser(id);
        return { status: "ok" };
    }
}
