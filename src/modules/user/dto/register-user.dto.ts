import { IsEmail } from 'class-validator';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { RoleName } from 'src/core/enums';

@ApiQuery({ name: 'role', enum: RoleName })
export class RegisterUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
