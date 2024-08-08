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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../users/user.service");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const typeorm_1 = require("@nestjs/typeorm");
const auth_entity_1 = require("./auth.entity");
const typeorm_2 = require("typeorm");
dotenv.config();
let AuthService = class AuthService {
    constructor(authRepository, userService, jwtService) {
        this.authRepository = authRepository;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validateUser(username, password) {
        const user = await this.userService.findByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            username: user.username,
            sub: user.id,
        };
        return {
            ...user,
            accesstoken: this.jwtService.sign(payload),
            refreshtoken: this.jwtService.sign(payload, { expiresIn: '3d', secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}` }),
        };
    }
    async refreshToken(user) {
        const payload = {
            username: user.username,
            sub: user.id,
        };
        return {
            accesstoken: this.jwtService.sign(payload),
        };
    }
    async SignUp(signUpDto) {
        const usernameExisting = await this.userService.findByUsername(signUpDto.username);
        if (usernameExisting) {
            return { message: 'Username already exists' };
        }
        const emailExisting = await this.userService.findByEmail(signUpDto.email);
        if (emailExisting) {
            return { message: 'Email already exists' };
        }
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        signUpDto.password = hashedPassword;
        await this.userService.save(signUpDto);
        return { message: 'User created' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.AuthEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map