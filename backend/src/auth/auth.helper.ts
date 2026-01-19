import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from '../users/users.entity';
import { JwtService } from "@nestjs/jwt";
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from "../users/users.service";
import { UserWithToken } from "./auth.type";
import { PasswordUtility } from "../common/password.utility";

@Injectable()

export class AuthHelper{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly passwordUtility: PasswordUtility
    ){}

    public async decode(token: string): Promise<unknown>{
        return this.jwtService.decode(token);
    }

    public isPasswordValid(password: string, hashedPassword: string): boolean{
        return this.passwordUtility.isPasswordValid(password, hashedPassword);
    }


    public encodePassword(password: string): string{
        return this.passwordUtility.encodePassword(password);
    }


    public generateToken(user: User): UserWithToken{
        const accessToken = this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        
        const refreshToken = this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        },{
            expiresIn: '7d'
        });

        return {
            token: {
                accessToken,
                refreshToken
            },
            user,   
        }
    }

    public async validate(token: string): Promise<boolean | never>{
        const decoded = this.jwtService.verify(token);

        if(!decoded){
            throw new BadRequestException('Invalid token');
        }

        const user = await this.userService.getUser(decoded);

        if(!user){
            throw new UnauthorizedException();
        }

        return true;
    }


    public async getUserFromToken(token: string): Promise<User>{
        const decoded = await this.jwtService.verify(token);

        if(!decoded){
            throw new BadRequestException('Invalid token');
        }

        const user = await this.userService.getUser(decoded.id);
        return user;
    }

}

