import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginatedOutputDto } from '../../../core/dto';
import { ErrorMessages } from '../../../core/messages';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import * as bcryptjs from 'bcryptjs';
import { createPaginator } from 'prisma-pagination';
import { ErrorCodeEnum } from '../../../core/error';
import { UserResponse } from '../../../core/interface';
import { UserStatus } from '../../../core/enums';
import {
  ChangePasswordDto,
  CreateUserResponseDto,
  CreateUsersDto,
  UpdateUsersDto,
  UserFiltersDto,
} from '../dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUsersDto): Promise<CreateUserResponseDto> {
    const password = this.generatePassword(8);
    const newUser: Prisma.UserCreateInput = {
      ...data,
      status: UserStatus.ACTIVE,
      password,
      firstLogin: false,
    };

    try {
      const user = await this.prisma.user.create({
        data: newUser,
      });
      return { email: user.email, password: password };
    } catch (e) {
      if (
        e.code === ErrorCodeEnum.UNIQUE_CONSTRAINT_VIOLATION &&
        e.meta?.target?.includes('email')
      ) {
        throw new HttpException(
          ErrorMessages.EMAIL_ALREADY_EXISTS.replace('{email}', data.email),
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        ErrorMessages.UNKNOWN_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    userId: number,
    data: UserFiltersDto,
  ): Promise<PaginatedOutputDto<User>> {
    const {
      page,
      limit: perPage,
      email,
      first_name,
      last_name,
      role,
      status,
      id,
    } = data;
    const paginate = createPaginator({ perPage });
    try {
      return await paginate<User, Prisma.UserFindManyArgs>(
        this.prisma.user,
        {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            firstLogin: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            role: true,
          },
          where: {
            NOT: [
              {
                id: userId,
              },
            ],
            id: id,
            email: {
              contains: email,
              mode: 'insensitive',
            },
            firstName: {
              contains: first_name,
              mode: 'insensitive',
            },
            lastName: {
              contains: last_name,
              mode: 'insensitive',
            },
            role: role,
            status: status,
          },
          orderBy: {
            id: 'desc',
          },
        },
        {
          page,
        },
      );
    } catch (error) {
      throw new HttpException(
        ErrorMessages.FAILED_TO_RETRIEVE_USERS,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneById(id: number): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        firstLogin: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });

    if (user) {
      return user;
    } else {
      throw new HttpException(
        ErrorMessages.USER_NOT_FOUND.replace('{ID}', `${id}`),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(userId: number, data: UpdateUsersDto): Promise<User> {
    if (data.password) {
      data.password = await bcryptjs.hash(data.password, 10);
    }
    return this.prisma.user.update({
      data,
      where: { id: userId },
    });
  }

  async delete(userId: number): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where: { id: userId },
      });
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === ErrorCodeEnum.P2025) {
          throw new HttpException(
            ErrorMessages.USER_NOT_FOUND.replace('{ID}', `${userId}`),
            HttpStatus.NOT_FOUND,
          );
        }
      }
      throw new HttpException(
        ErrorMessages.UNKNOWN_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(
    currentUser: User,
    data: ChangePasswordDto,
  ): Promise<User> {
    const hashPassword = await bcryptjs.hash(data.confirmPassword, 10);

    // check if the old password is correct
    const isMatch = await bcryptjs.compare(
      data.oldPassword,
      currentUser.password,
    );
    if (!isMatch) {
      throw new HttpException(
        ErrorMessages.INCORRECT_OLD_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }

    // check id the new password is the same as the old one
    if (data.newPassword === data.oldPassword) {
      throw new HttpException(
        ErrorMessages.NEW_PASSWORD_SAME_AS_OLD,
        HttpStatus.BAD_REQUEST,
      );
    }
    //check if the new password and confirm password are the same
    if (data.newPassword !== data.confirmPassword) {
      throw new HttpException(
        ErrorMessages.NEW_PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH,
        HttpStatus.BAD_REQUEST,
      );
    }

    const res = await this.prisma.user.update({
      data: {
        password: hashPassword,
        firstLogin: false,
      },
      where: { id: currentUser.id },
    });

    if (!res) {
      throw new HttpException(
        ErrorMessages.FAILED_TO_CHANGE_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }
    return res;
  }

  generatePassword(length: number): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }
}
