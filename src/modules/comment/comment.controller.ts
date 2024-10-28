import {
    Controller,
    Post,
    Patch,
    Delete,
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
  import { CommentService } from './comment.service';
  import { CreateCommentDto } from './dto/create-comment.dto';
  import { UpdateCommentDto } from './dto/update-comment.dto';
  
  @ApiTags('Comments')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('comments')
  export class CommentController {
    constructor(private readonly commentService: CommentService) {}
  
    @Post()
    @ApiOperation({ summary: 'Add a new comment to a blog post' })
    async addComment(@Body() createCommentDto: CreateCommentDto) {
      return await this.commentService.addComment(createCommentDto);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Edit an existing comment' })
    @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
    async editComment(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateCommentDto: UpdateCommentDto,
    ) {
      return await this.commentService.editComment(id, updateCommentDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a comment by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
    async deleteComment(@Param('id', ParseIntPipe) id: number) {
      return await this.commentService.deleteComment(id);
    }
  }
  