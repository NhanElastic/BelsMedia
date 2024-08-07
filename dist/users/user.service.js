"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const typeorm_2 = require("typeorm");
const user_dto_1 = require("./user.dto");
const class_transformer_1 = require("class-transformer");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async save(userDTO) {
        const savedUser = await this.userRepository.save(userDTO);
        return (0, class_transformer_1.plainToInstance)(user_dto_1.UserDTO, savedUser);
    }
    async getAll() {
        const users = await this.userRepository.find();
        return users.map(user => (0, class_transformer_1.plainToInstance)(user_dto_1.UserDTO, user));
    }
    async update(id, userDTO) {
        const updateValue = await this.userRepository.update(id, userDTO);
        return { result: 'success' };
    }
    async delete(id) {
        const deleteValue = await this.userRepository.delete(id);
        return { result: 'success' };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne(id);
        if (user) {
            return (0, class_transformer_1.plainToInstance)(user_dto_1.UserDTO, user);
        }
        return undefined;
    }
    async findByUsername(username) {
        const user = await this.userRepository.findOneBy({
            username: username,
        });
        if (user) {
            return (0, class_transformer_1.plainToInstance)(user_dto_1.UserDTO, user);
        }
        return undefined;
    }
    async findByEmail(email) {
        const user = await this.userRepository.findOneBy({
            email: email,
        });
        if (user) {
            return (0, class_transformer_1.plainToInstance)(user_dto_1.UserDTO, user);
        }
        return undefined;
    }
    async findUserRefreshtoken(username) {
        const user = await this.userRepository.findOne({
            where: { username: username },
            relations: ['auth']
        });
        return user ? (0, class_transformer_1.plainToInstance)(user_dto_1.UserDTO, user) : undefined;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map