"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshJwtStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
class RefreshJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'refresh-jwt') {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromBodyField("refresh"),
            ignoreExpiration: false,
            secretOrKey: `${process.env.REFRESH_TOKEN_SECRET_KEY}`,
        });
    }
    async validate(payload) {
        return { userId: payload.sub, username: payload.username };
    }
}
exports.RefreshJwtStrategy = RefreshJwtStrategy;
//# sourceMappingURL=refreshtoken.strategy.js.map