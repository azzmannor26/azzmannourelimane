import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoleName, User } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';

import { ControllerEnum } from 'src/core/enums';
import { UserService } from '../services/services';
import { Roles } from 'src/auth/role/roles.decorator';
import {
  ChangePasswordDto,
  CreateUsersDto,
  UpdateCurrentUserDto,
  UpdateUsersDto,
  UserFiltersDto,
} from '../dto';
import { PaginatedOutputDto } from 'src/core/dto';
import { ErrorMessages } from 'src/core/messages';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller(`${ControllerEnum.USER}`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @Get(ControllerEnum.ALL)
  @ApiOperation({ summary: 'Retrieve a list of all users (admin)' })
  findAll(
    @Req() req: Request,
    @Query() data?: UserFiltersDto,
  ): Promise<PaginatedOutputDto<User>> {
    const user = req.user as User;
    const userId = user.id;
    const newDat = new UserFiltersDto(data);
    return this.userService.findAll(userId, newDat);
  }

  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new user (admin)' })
  create(@Body() data: CreateUsersDto) {
    return this.userService.create(data);
  }

  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve user details by user ID (admin)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  findCurrentUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneById(+id);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve details of the currently authenticated user',
  })
  findOneById(@Req() req: Request) {
    const user = req.user as User;
    const userId = user.id;
    return this.userService.findOneById(+userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the currently authenticated user' })
  updateCurrentlyUser(@Req() req: Request, @Body() data: UpdateCurrentUserDto) {
    const user = req.user as User;
    const userId = user.id;
    return this.userService.update(+userId, data);
  }

  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user details by user ID (admin)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUsersDto,
  ) {
    const user = req.user as User;
    const userId = user.id;
    // you cant change your own role
    if (userId === id && data.role) {
      throw new HttpException(
        ErrorMessages.FORBIDDEN_CHANGE_OWN_ROLE,
        HttpStatus.FORBIDDEN,
      );
    }

    const targetUser = await this.userService.findOneById(id);
    // the admin cant change role of supper admin
    if (
      targetUser.role === RoleName.SUPER_ADMIN &&
      user.role === RoleName.ADMIN
    ) {
      throw new HttpException(
        ErrorMessages.FORBIDDEN_EXCEPTION,
        HttpStatus.FORBIDDEN,
      );
    }

    return this.userService.update(+id, data);
  }

  @Roles(RoleName.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by their ID (super admin)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(+id);
  }

  @ApiOperation({
    summary:
      'Change the password for the current user, typically used during the first login after an admin has reset the password.',
  })
  @Patch('change-password')
  async changePassword(@Req() req: Request, @Body() data: ChangePasswordDto) {
    const user = req.user as User;
    return await this.userService.changePassword(user, data);
  }
}
