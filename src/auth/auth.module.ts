import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../libs/prisma/prisma.service';
import { UserService } from '../modules/user/services/services';
import { JWT_CONFIG_CONSENTS } from '../core/config';
import { AuthController } from './controller/auth.controller';
import { EmailService } from '../core/services/email.service';
@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, UserService, EmailService],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG_CONSENTS.JWT_SECRET,
      signOptions: {
        expiresIn: JWT_CONFIG_CONSENTS.JWT_EXPIRES_IN,
      },
    }),
  ],
})
export class AuthModule {}
