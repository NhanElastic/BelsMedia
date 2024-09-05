import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity(
    { name: 'Users' }
)
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column("varchar", { length: 255 })
    firstName: string;

    @Column("varchar", { length: 255 })
    lastName: string;

    @Column("varchar", { length: 255, unique: true })
    username: string;

    @Column("varchar", { length: 255 })
    email: string;

    @Column("varchar", { length: 255 })
    password: string;


    @Column("boolean", {default: false})
    status: boolean;

    @Column("varchar", {nullable: true})
    profileImage: string;

}