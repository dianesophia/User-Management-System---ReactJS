import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Diane' })
  name: string;

  @ApiProperty({ example: 'diane@test.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: 'admin', enum: ['admin', 'user'] })
  role: string;
}
