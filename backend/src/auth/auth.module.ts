import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';

@Module({
  imports: [TypeOrmModule.forFeature([User])
],
controllers: [AuthController],
providers: [AuthService, AuthHelper],
})

export class AuthModule {}