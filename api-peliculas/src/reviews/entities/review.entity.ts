import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pelicula } from "../../peliculas/entities/pelicula.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    texto: string;

    @Column({ type: "int" })
    puntuacion: number;

    @ManyToOne(() => User, user => user.reviews)
    user: User;

    @ManyToOne(() => Pelicula, pelicula => pelicula.reviews)
    pelicula: Pelicula;

    @CreateDateColumn()
    create_at: Date;
}
