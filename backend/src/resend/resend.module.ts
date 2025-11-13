import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Resend,
      useFactory: (configService: ConfigService) => {
        return new Resend(configService.get<string>('RESEND_API_KEY'));
      },
      inject: [ConfigService],
    },
  ],
  exports: [Resend],
})
export class ResendModule {}
