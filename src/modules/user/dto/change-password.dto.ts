import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'oldPassword',
    required: true,
    type: String,
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'newPassword',
    type: String,
  })
  @IsString()
  newPassword: string;

  @ApiProperty({
    description: 'confirmPassword',
    type: String,
  })
  @IsString()
  confirmPassword: string;
}
