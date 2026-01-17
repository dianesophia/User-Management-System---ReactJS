import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { join } from 'path';
import { getEnvPath } from './common/helper/env.helper';

const parentDir = join(__dirname, '..');
const envFilePath : string = getEnvPath(parentDir);

@Module({
  imports: [
      ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}
