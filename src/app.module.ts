import { Module } from '@nestjs/common';
import { PrismaModule } from './libs/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './modules/user/services/services';
import { LibsModule } from './libs/libs.module';
import { UserController } from './modules/user/controllers/user.controller';
import { CommentModule } from './modules/comment/comment.module';
import { BlogModule } from './modules/blog/blog.module';
@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), AuthModule, LibsModule, CommentModule,  BlogModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
