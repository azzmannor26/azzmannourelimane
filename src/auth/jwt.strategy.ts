import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWT_CONFIG_CONSENTS } from '../core/config';
import { PrismaService } from '../libs/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG_CONSENTS.JWT_SECRET,
    });
  }

  async validate(payload: { id: number }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    delete user.password;
    //console.log('user', user);
    return user;
  }
}
