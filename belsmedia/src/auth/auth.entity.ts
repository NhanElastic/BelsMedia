import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'auth'
})
export class AuthEntity{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({unique: true})
    username: string;

    @OneToOne(() => UserEntity, (user) => user.username, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'username',referencedColumnName: 'username' })
    user: UserEntity;


    @Column({unique: true, type: 'varchar', length: 600, default: 'None'})
    refreshtoken: string;
}