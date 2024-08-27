import { Controller, Post, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ControllerEnum } from 'src/core/enums';
import { AuthService } from '../services/auth.service';
import { SuccessMessages } from 'src/core/messages';
import { LoginDto, RegisterUserDto } from '../dto';

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
