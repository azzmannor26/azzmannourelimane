import {
    Controller,
    Post,
    Patch,
    Delete,
    Get,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiParam,
  } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/auth/auth.guard';
  import { BlogService } from './blog.service';
  import { CreateBlogDto } from './dto/create-blog.dto';
  import { UpdateBlogDto } from './dto/update-blog.dto';
  
  @ApiTags('Blogs')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('blogs')
  export class BlogController {
    constructor(private readonly blogService: BlogService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new blog post' })
    async createBlog(@Body() createBlogDto: CreateBlogDto) {
      return await this.blogService.createBlog(createBlogDto);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing blog post' })
    @ApiParam({ name: 'id', type: Number, description: 'Blog ID' })
    async updateBlog(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateBlogDto: UpdateBlogDto,
    ) {
      return await this.blogService.updateBlog(id, updateBlogDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a blog post by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Blog ID' })
    async deleteBlog(@Param('id', ParseIntPipe) id: number) {
      return await this.blogService.deleteBlog(id);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get details of a blog post by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Blog ID' })
    async getBlog(@Param('id', ParseIntPipe) id: number) {
      return await this.blogService.getBlog(id);
    }
  }
  