  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { User } from 'src/users/users.entity';
  import { AuthController } from './auth.controller';
  import { AuthService } from './auth.service';
  import { AuthHelper } from './auth.helper';
  import { JwtModule } from '@nestjs/jwt'
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { UsersModule } from '../users/users.module';
  import { JwtStrategy } from './auth.strategy';
  import { PassportModule } from '@nestjs/passport';
  import { PasswordUtility } from '../common/password.utility';


  @Module({
    imports: [
      PassportModule.register({defaultStrategy: 'jwt', property: 'user'}),
      JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: config.get<number>('JWT_EXPIRES_IN'),
          },

        })
      }),
      TypeOrmModule.forFeature([User]),
      UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, JwtStrategy, PasswordUtility],
  exports: [AuthService, AuthHelper],
  })

  export class AuthModule {}