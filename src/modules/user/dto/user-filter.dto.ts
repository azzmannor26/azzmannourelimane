import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/core/dto';
import { RoleName, UserStatus } from 'src/core/enums';

export class UserFiltersDto extends PaginationDto {
  @ApiProperty({
    name: 'id',
    required: false,
    type: Number,
  })
  id?: number;

  @ApiProperty({
    name: 'email',
    required: false,
    type: String,
  })
  email?: string;

  @ApiProperty({
    name: 'first-name',
    required: false,
    type: String,
  })
  first_name?: string;

  @ApiProperty({
    name: 'last-name',
    required: false,
    type: String,
  })
  last_name?: string;

  @ApiProperty({
    name: 'role',
    required: false,
    enum: RoleName,
  })
  role?: RoleName;

  @ApiProperty({ name: 'status', required: false, enum: UserStatus })
  status?: UserStatus;

  constructor(partial: Partial<UserFiltersDto>) {
    super();
    Object.assign(this, partial);
    this.id = this.id !== undefined ? Number(this.id) : undefined;
  }
}
