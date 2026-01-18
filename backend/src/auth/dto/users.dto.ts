import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../users/enums/role.enum';
import { Gender } from '../../users/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
    @IsString()
    @IsNotEmpty()
    public readonly firstName: string;
  
    @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
    @IsString()
    @IsNotEmpty()
    public readonly lastName: string;
  
    @ApiProperty({ example: '09123456789', description: 'Phone number of the user' })
    @IsString()
    @IsNotEmpty()
    public readonly phoneNumber: string;
  
    @ApiProperty({ example: 'male', enum: Gender })
    @IsEnum(Gender)
    @IsNotEmpty()
    public readonly gender: Gender;

    @ApiProperty({ example: 'user', enum: Role })
    @IsEnum(Role)
    @IsNotEmpty()
    public readonly role: Role;
  
    @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
    @IsEmail()
    @IsNotEmpty()
    public readonly email: string;
  
    @ApiProperty({ example: 'StrongPassword123', description: 'Password of the user' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public readonly password: string;
}

export class UpdateUserDto {
   @ApiProperty({ example: 'John', description: 'First name of the user' })
    @IsString()
    @IsNotEmpty()
    public firstName: string;
  
    @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
    @IsString()
    @IsNotEmpty()
    public lastName: string;
  
    @ApiProperty({ example: '09123456789', description: 'Phone number of the user' })
    @IsString()
    @IsNotEmpty()
    public phoneNumber: string;
  
    @ApiProperty({ example: 'male', enum: Gender })
    @IsEnum(Gender)
    @IsNotEmpty()
    public gender: Gender;
  
    @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
    @IsEmail()
    @IsNotEmpty()
    public email: string;
  
    @ApiProperty({ example: 'StrongPassword123', description: 'Password of the user' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string;


}

export class AdminUpdateDto {

@ApiProperty({ example: 'John', description: 'First name of the user' })
    @IsString()
    @IsNotEmpty()
    public firstName: string;
  
    @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
    @IsString()
    @IsNotEmpty()
    public lastName: string;
  
    @ApiProperty({ example: '09123456789', description: 'Phone number of the user' })
    @IsString()
    @IsNotEmpty()
    public phoneNumber: string;
  
    @ApiProperty({ example: 'male', enum: Gender })
    @IsEnum(Gender)
    @IsNotEmpty()
    public gender: Gender;
  
    @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
    @IsEmail()
    @IsNotEmpty()
    public email: string;
  
    @ApiProperty({ example: 'StrongPassword123', description: 'Password of the user' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string;


   @ApiProperty({ example: 'user', enum: Role })
    @IsEnum(Role)
    @IsNotEmpty()
    public readonly role: Role;
}