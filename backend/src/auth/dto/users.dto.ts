import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../users/enums/role.enum';
import { Gender } from '../../users/enums/gender.enum';

export class CreateUserDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsEmail() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() @MinLength(8) password: string;
  @IsEnum(Gender) @IsNotEmpty() gender: Gender;
  @IsOptional() @IsString() phoneNumber?: string;
  @IsEnum(Role) @IsOptional() role?: Role;
}

export class UpdateUserDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MinLength(8) password?: string;
  @IsOptional() @IsEnum(Gender) gender?: Gender;
  @IsOptional() @IsString() phoneNumber?: string;
  @IsOptional() @IsEnum(Role) role?: Role;
}
