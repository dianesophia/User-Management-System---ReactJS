import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'diane@test.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
