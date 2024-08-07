import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique} from "typeorm";

import { AuthEntity } from "src/auth/auth.entity";
@Entity(
    {
        name: 'users'
    }
)
export class UserEntity{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        default: false,
        nullable: true,
    })
    isActive: boolean;
    
    @Column()
    password: string;


}