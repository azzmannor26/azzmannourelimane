import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async addComment(data: CreateCommentDto) {
    try {
      return await this.prisma.comment.create({
        data: {
          content: data.content,
          userId: data.userId,
          blogId: data.blogId,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      throw new HttpException('Failed to add comment', HttpStatus.BAD_REQUEST);
    }
  }

  async editComment(id: number, data: UpdateCommentDto) {
    try {
      return await this.prisma.comment.update({
        where: { id },
        data: { content: data.content },
      });
    } catch (error) {
      throw new HttpException('Failed to update comment', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteComment(id: number) {
    try {
      return await this.prisma.comment.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException('Failed to delete comment', HttpStatus.BAD_REQUEST);
    }
  }
}