import { PassportStrategy } from "@nestjs/passport";
import { AuthHelper } from "./auth.helper";
import { ConfigService } from "@nestjs/config";
import { Strategy, ExtractJwt } from "passport-jwt";
import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "src/users/users.entity";
import { UserService } from "src/users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly authHelper: AuthHelper,
        private readonly config: ConfigService,
        private readonly userService: UserService,
    ){
        const secret = config.get<string>('JWT_SECRET_KEY');

        if(!secret){
            throw new BadRequestException('JWT Secret is not set');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            ignoreExpiration: false,
        });
    }

    async validate(payload: any): Promise<User>{
        // Fetch user from database with all fields including role
        const user = await this.userService.getUser(payload.id);
        
        if (!user) {
            throw new BadRequestException('User not found');
        }
        
        // This user object (with role) will be attached to request.user
        return user;
    }
}