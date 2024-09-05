import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: `${process.env.ACCESS_TOKEN_SECRET_KEY}`
        });
    }

    async validate(payload: any){
        return {userId: payload.sub, username: payload.username};
    }
}