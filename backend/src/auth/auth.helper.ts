import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from '../users/users.entity';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Injectable()

export class AuthHelper{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

       // private readonly jwtService: JwtService
    ){}

    public encodePassword(password: string): string{
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
}

