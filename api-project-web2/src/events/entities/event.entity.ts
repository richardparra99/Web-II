import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class EventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: "text" })
    description: string;

    @Column()
    location: string;

    @Column({ type: "datetime" })
    startDate: Date;

    @Column({ type: "int" })
    capacity: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    posterUrl?: string | null;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    price?: string | null;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: "double", nullable: true })
    latitude?: number | null;

    @Column({ type: "double", nullable: true })
    longitude?: number | null;

    @ManyToOne(() => User, { eager: true })
    organizer: User;
}
