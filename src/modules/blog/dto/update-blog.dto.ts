import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UpdateBlogDto {
  @ApiPropertyOptional({ description: 'Updated title of the blog post', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Updated content of the blog post', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Updated status of the blog post', required: false, enum: UserStatus })
  status?: UserStatus;
}
