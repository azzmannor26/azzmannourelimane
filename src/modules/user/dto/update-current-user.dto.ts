import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class UpdateCurrentUserDto {
  @ApiPropertyOptional({ required: false, type: String })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ required: false, type: String })
  phone?: string;

  @ApiPropertyOptional({ required: false, type: String })
  firstName?: string;

  @ApiPropertyOptional({ required: false, type: String })
  lastName?: string;
}
