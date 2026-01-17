import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { User } from 'src/users/users.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

    constructor(private configService: ConfigService) {}

    public createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get<string>('DATABASE_HOST', 'localhost'),
            port: this.configService.get<number>('DATABASE_PORT', 3306),
            username: this.configService.get<string>('DATABASE_USERNAME', 'root'),
            password: this.configService.get<string>('DATABASE_PASSWORD', ''),
            database: this.configService.get<string>('DATABASE_NAME', 'user_management'),
            //entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/../migrations/*{.ts,.js}'],
            migrationsTableName: 'typeorm_migrations',
            synchronize: true,
            logger: 'file',
            logging: true,
            entities: [User], 
        }
    }

}