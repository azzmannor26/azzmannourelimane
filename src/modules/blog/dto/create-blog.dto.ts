import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client'; // Ensure this import is correct

export class CreateBlogDto {
  @ApiProperty({ description: 'Title of the blog post', required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Content of the blog post', required: true })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Status of the blog post', required: false, enum: UserStatus })
  @IsOptional()
  status: UserStatus;
}
