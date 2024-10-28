import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: 'Updated content of the comment', required: false })
  @IsNotEmpty()
  @IsString()
  content: string;
}
