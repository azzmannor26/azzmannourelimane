import { Controller, Post, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ControllerEnum } from '../core/enums';
import { ApiTags } from '@nestjs/swagger';
import { SuccessMessages } from '../core/messages';
import { LoginDto, RegisterUserDto } from 'src/modules/user/dto';

@ApiTags('Auth')
@Controller(`${ControllerEnum.AUTH}`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(ControllerEnum.LOGIN)
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    const result = await this.authService.login(loginDto);

    // save
    const cookie = this.authService.getCookieWithJwtToken(result.accessToken);
    response.setHeader('Set-Cookie', cookie);

    return response.status(200).json({
      statusCode: HttpStatus.OK,
      data: result,
    });
  }

  @Post(ControllerEnum.REGISTER)
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerDto: RegisterUserDto,
  ): Promise<any> {
    const result = await this.authService.register(registerDto);
    return response.status(200).json({
      statusCode: HttpStatus.CREATED,
      data: result,
    });
  }

  @Post(ControllerEnum.LOGOUT)
  async logout(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const cookie = this.authService.getLogoutCookie();
    response.setHeader('Set-Cookie', cookie);
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: SuccessMessages.LOGOUT,
    });
  }
}
