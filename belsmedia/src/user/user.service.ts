import {Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { UserDTO } from "./dto/user.dto";
import { plainToInstance } from "class-transformer";


@Injectable()
export class UserService{
    constructor(
        @InjectRepository(UserEntity)
         private readonly userRepository: Repository<UserEntity>
    ) {}

    async save(userDTO: UserDTO): Promise<object>{
        const user = this.userRepository.create(userDTO)
        await this.userRepository.save(user);
        return user;

    }
    async findOneById(id: number): Promise<object|undefined>{
        const user = await this.userRepository.findOneBy(id as any);
        return user ? user : undefined;
    }

    async findByUsername(username: string): Promise<UserDTO|undefined>{
        const user = await this.userRepository.findOneBy({
            username: username,
        });
        if(!user){
            throw new NotFoundException()
        }
        return plainToInstance(UserDTO, user);
    }

    async findByEmail(email: string): Promise<object|undefined>{
        const user = await this.userRepository.findOneBy({
            email: email,
        });
        if(user) return user;
        return undefined;
    }

    async convertToJSON(user: object): Promise<UserDTO|undefined>{
        return user ? plainToInstance(UserDTO, user) : undefined;
    }

    async updateUser(username: string, data: any): Promise<object>{
        await this.userRepository.update({username}, data);
        return this.findByUsername(username);

    }


}