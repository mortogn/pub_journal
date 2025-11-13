import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { JwtModule } from '@nestjs/jwt';
import { SubmissionsModule } from './submissions/submissions.module';
import { R2Module } from './r2/r2.module';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { ResendModule } from './resend/resend.module';
import { EmailsModule } from './emails/emails.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecret',
    }),
    EventEmitterModule.forRoot(),
    SubmissionsModule,
    R2Module,
    FilesModule,
    UsersModule,
    ResendModule,
    EmailsModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
