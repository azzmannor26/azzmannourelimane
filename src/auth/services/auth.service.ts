import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { ErrorCodeEnum } from '../../core/error';
import * as bcryptjs from 'bcryptjs';
import { User as us } from '../../modules/user/user.model';
import { UserStatus } from '../../core/enums';
import { JWT_CONFIG_CONSENTS } from '../../core/config';
import { ErrorMessages } from '../../core/messages';
import { LoginDto, RegisterUserDto, RegisterUserResponseDto } from '../dto';
import { EmailService } from '../../core/services/email.service';
export class AuthService {
  constructor(
    @Inject(forwardRef(() => PrismaService))
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
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

  async forgotPassword(email: string): Promise<any> {
    console.log('PrismaService:', this.prismaService);  // Debug: Ensure prismaService is not undefined
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException(ErrorMessages.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const token = this.jwtService.sign({ email }, { expiresIn: '1h' });
    
    // Send reset email
    await this.emailService.sendPasswordResetEmail(email, token);

    return { message: 'Password reset link sent' };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException(ErrorMessages.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
    }

    const user = await this.prismaService.user.findUnique({ where: { email: decoded.email } });
    if (!user) {
      throw new HttpException(ErrorMessages.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await this.prismaService.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    return { message: 'Password has been reset successfully' };
  }
}
