import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async createBlog(data: CreateBlogDto) {
    try {
      return await this.prisma.blog.create({
        data: {
          title: data.title,
          content: data.content,
          status: data.status ?? 'ACTIVE', // Default to ACTIVE if not provided
        },
      });
    } catch (error) {
      console.error('Error creating blog:', error);
      throw new HttpException('Failed to create blog', HttpStatus.BAD_REQUEST);
    }
  }

  async updateBlog(id: number, data: UpdateBlogDto) {
    try {
      return await this.prisma.blog.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          status: data.status,
        },
      });
    } catch (error) {
      console.error('Error updating blog:', error);
      throw new HttpException('Failed to update blog', HttpStatus.BAD_REQUEST);
    }
  }

  async getBlog(id: number) {
    try {
      const blog = await this.prisma.blog.findUnique({
        where: { id },
      });

      if (!blog) {
        throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
      }

      return blog;
    } catch (error) {
      console.error('Error retrieving blog:', error);
      throw new HttpException('Failed to retrieve blog', HttpStatus.BAD_REQUEST);
    }
  }

  // New Method to Delete a Blog by ID
  async deleteBlog(id: number) {
    try {
      const blog = await this.prisma.blog.findUnique({ where: { id } });
      if (!blog) {
        throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.blog.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw new HttpException('Failed to delete blog', HttpStatus.BAD_REQUEST);
    }
  }
}
