import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

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
}
