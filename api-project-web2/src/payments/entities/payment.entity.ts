import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RegistrationEntity } from "../../registrations/entities/registration.entity";
import { User } from "../../users/entities/user.entity";

export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED";

@Entity()
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => RegistrationEntity, { eager: true })
    registration: RegistrationEntity;

    @Column()
    receiptUrl: string;

    @Column({ type: "varchar", length: 20, default: "PENDING" })
    status: PaymentStatus;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    uploadedAt: Date;

    @Column({ type: "datetime", nullable: true })
    reviewedAt?: Date | null;

    @ManyToOne(() => User, { nullable: true, eager: true })
    reviewedBy?: User | null;
}
