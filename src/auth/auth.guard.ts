import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserStatus } from '../core/enums';
import { ErrorMessages } from '../core/messages';
import { User } from '@prisma/client';

export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, _info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    //
    this.checkUserStatus(user);

    return user;
  }

  private checkUserStatus(user: User) {
    switch (user.status) {
      case UserStatus.INACTIVE:
        throw new HttpException(
          ErrorMessages.USER_INACTIVE,
          HttpStatus.FORBIDDEN,
        );
      case UserStatus.SUSPENDED:
        throw new HttpException(
          ErrorMessages.USER_SUSPENDED,
          HttpStatus.FORBIDDEN,
        );
      case UserStatus.REJECTED:
        throw new HttpException(
          ErrorMessages.USER_REJECTED,
          HttpStatus.FORBIDDEN,
        );
    }
  }
}
