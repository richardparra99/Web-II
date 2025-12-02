import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRegisterDto } from "../auth/dtos/user-register.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    createUser(user: UserRegisterDto): Promise<User> {
        const nuevoUsuario = this.userRepository.create(user);
        return this.userRepository.save(nuevoUsuario);
    }
}
