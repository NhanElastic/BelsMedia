import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { UserDTO } from "./user.dto";
import { plainToInstance } from "class-transformer";

export type User = any;

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(UserEntity)
         private readonly userRepository: Repository<UserEntity>
    ) {}

    async save(userDTO: UserDTO): Promise<UserDTO>{
        const savedUser = await this.userRepository.save(userDTO);
        return plainToInstance(UserDTO, savedUser);
    }

    async getAll(): Promise<UserDTO[]>{
        const users = await this.userRepository.find();
        return users.map(user => plainToInstance(UserDTO, user));
    }

    async update(id: string, userDTO: UserDTO): Promise<{result: string}>{
        const updateValue = await this.userRepository.update(id, userDTO);
        return {result: 'success'};
    }

    async delete(id: string): Promise<{result: string}>{
        const deleteValue = await this.userRepository.delete(id);
        return {result: 'success'};
    }

    async findOne(id: string): Promise<UserDTO|undefined>{
        const user = await this.userRepository.findOne(id as any);
        if(user){
            return plainToInstance(UserDTO, user);
        }
        return undefined;
    }

    async findByUsername(username: string): Promise<UserDTO|undefined>{
        const user = await this.userRepository.findOneBy({
            username: username,
        })
        if(user){
            return plainToInstance(UserDTO, user);
        }
        return undefined;
    }

    async findByEmail(email: string): Promise<UserDTO|undefined>{
        const user = await this.userRepository.findOneBy({
            email: email,
        });
        if(user){
            return plainToInstance(UserDTO, user);
        }
        return undefined;
    }

    async findUserRefreshtoken(username: string): Promise<UserDTO|undefined>{
        const user = await this.userRepository.findOne({
            where: {username: username},
            relations: ['auth']
        });
        return user ? plainToInstance(UserDTO, user) : undefined;
    }
}