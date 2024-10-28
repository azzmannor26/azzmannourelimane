import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'Content of the comment', required: true })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'ID of the user adding the comment', required: true })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'ID of the blog post to which the comment belongs', required: true })
  @IsNotEmpty()
  @IsInt()
  blogId: number;
}
