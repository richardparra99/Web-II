import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "./user-role.enum";
import * as bcrypt from "bcrypt";
import { AdminCreateUserDto } from "./dtos/admin-create-user.dto";
import { AdminUpdateUserDto } from "./dtos/admin-update-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    createUser(user: Partial<User>): Promise<User> {
        const nuevoUsuario = this.userRepository.create(user);
        return this.userRepository.save(nuevoUsuario);
    }

    async findAllForAdmin(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findUserByRole(role: UserRole): Promise<User[]> {
        return this.userRepository.find({
            where: {
                roles: role,
            },
        });
    }

    //actualizar roles
    async updateRoles(id: number, roles: UserRole[]): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }
        user.roles = roles;
        return this.userRepository.save(user);
    }

    async createByAdmin(dto: AdminCreateUserDto): Promise<User> {
        const exists = await this.userRepository.findOne({
            where: { email: dto.email },
        });

        if (exists) {
            throw new ConflictException("Ya existe un usuario con ese email");
        }

        const hashed = await bcrypt.hash(dto.password, 10);

        const user = this.userRepository.create({
            fullName: dto.fullName,
            email: dto.email,
            password: hashed,
            roles: dto.roles && dto.roles.length > 0 ? dto.roles : [UserRole.PARTICIPANT],
        });

        return this.userRepository.save(user);
    }

    async updateUser(id: number, dto: AdminUpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }

        if (dto.fullName !== undefined) {
            user.fullName = dto.fullName;
        }

        if (dto.email !== undefined) {
            user.email = dto.email;
        }

        if (dto.roles !== undefined) {
            user.roles = dto.roles;
        }

        return this.userRepository.save(user);
    }

    async changePassword(id: number, newPassword: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await this.userRepository.save(user);
    }

    // ELIMINAR usuario (ADMIN)
    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
