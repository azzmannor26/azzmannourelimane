import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateCurrentUserDto } from './update-current-user.dto';
import { RoleName, UserStatus } from 'src/core/enums';

export class UpdateUsersDto extends UpdateCurrentUserDto {
  @ApiPropertyOptional({
    required: false,
    enum: RoleName,
    default: RoleName.USER,
  })
  role?: RoleName;

  @ApiPropertyOptional({ required: false, enum: UserStatus })
  status?: UserStatus;

  @ApiPropertyOptional({ required: false, type: String })
  password?: string;
}
