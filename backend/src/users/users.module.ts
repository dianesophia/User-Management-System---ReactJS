import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { PasswordUtility } from '../common/password.utility';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, PasswordUtility],
  controllers: [UsersController],
  exports: [UserService, PasswordUtility],
})
export class UsersModule {}
