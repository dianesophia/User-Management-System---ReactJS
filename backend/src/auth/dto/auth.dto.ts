import { IsEmail, IsEnum, IsNotEmpty, IsString, Min, MinLength } from "class-validator";
import { Gender } from "../../users/enums/gender.enum";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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


export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'Password of the user' })
  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class RefreshTokenDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Refresh token of the user' })
    @IsString()
    @IsNotEmpty()
    public readonly refreshToken: string;
}