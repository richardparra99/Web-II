import { BeforeInsert, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "../../reviews/entities/review.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    fullname: string;

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @BeforeInsert()
    normalize() {
        this.email = this.email.toLowerCase().trim();
        this.fullname = this.fullname.trim();
    }
}
