import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { ErrorCodeEnum } from '../../core/error';
import * as bcryptjs from 'bcryptjs';
import { User as us } from '../../modules/user/user.model';
import { UserStatus } from '../../core/enums';
import { JWT_CONFIG_CONSENTS } from '../../core/config';
import { ErrorMessages } from '../../core/messages';
import { LoginDto, RegisterUserDto, RegisterUserResponseDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  public getCookieWithJwtToken(token: string) {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${JWT_CONFIG_CONSENTS.JWT_EXPIRES_IN_SECONDS}`;
  }

  public getLogoutCookie(): string {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
  }

  async login(LoginDto: LoginDto): Promise<any> {
    const { email, password } = LoginDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException(
        ErrorMessages.WRONG_EMAIL_OR_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Check user status
    if (user.status === UserStatus.INACTIVE) {
      throw new HttpException(
        ErrorMessages.USER_INACTIVE,
        HttpStatus.UNAUTHORIZED,
      );
    } else if (user.status === UserStatus.SUSPENDED) {
      throw new HttpException(
        ErrorMessages.USER_SUSPENDED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const validatePassword = await bcryptjs.compare(password, user.password);

    if (!validatePassword) {
      throw new HttpException(
        ErrorMessages.WRONG_EMAIL_OR_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const data = {
      id: user.id,
      role: user.role,
      ...(user.firstLogin && { firstLogin: true }),
    };

    return { accessToken: this.jwtService.sign(data) };
  }

  async register(data: RegisterUserDto): Promise<RegisterUserResponseDto> {
    const { password } = data;
    const hashPassword = await bcryptjs.hash(password, 10);
    data.password = hashPassword;

    const NewUser = new us();
    NewUser.email = data.email;
    NewUser.password = hashPassword;
    NewUser.firstName = data.firstName;
    NewUser.lastName = data.lastName;
    NewUser.phone = data.phone;
    NewUser.status = UserStatus.INACTIVE;

    try {
      const res = await this.prismaService.user.create({
        data: NewUser,
      });
      const {
        password: _password,
        firstLogin: _firstLogin,
        status: _status,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        role: _role,
        ...date
      } = res;
      return date;
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
}
