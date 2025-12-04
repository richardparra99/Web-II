import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventEntity } from "../../events/entities/event.entity";
import { User } from "../../users/entities/user.entity";

export type RegistrationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

@Entity()
export class RegistrationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    participant: User;

    @ManyToOne(() => EventEntity, { eager: true })
    event: EventEntity;

    @Column({
        type: "varchar",
        length: 20,
        default: "PENDING",
    })
    status: RegistrationStatus;

    @Column({ unique: true })
    qrToken: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "datetime", nullable: true })
    cancelledAt?: Date | null;

    @Column({ type: "datetime", nullable: true })
    checkInAt?: Date | null;
}
