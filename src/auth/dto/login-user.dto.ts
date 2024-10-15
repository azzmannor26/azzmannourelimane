import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Length(8, 50)
  @ApiProperty({ example: 'superadmin@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'password123' })
  password: string;
}
