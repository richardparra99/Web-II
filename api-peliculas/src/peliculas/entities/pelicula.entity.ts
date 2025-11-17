import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "../../reviews/entities/review.entity";

@Entity()
export class Pelicula {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column({ type: "int" })
    anio: number;

    @Column()
    imagen: string;

    @Column({ type: "float", default: 0 })
    calificacionPromedio: number;

    @OneToMany(() => Review, review => review.pelicula)
    reviews: Review[];

    @CreateDateColumn()
    createdAt: Date;
}
