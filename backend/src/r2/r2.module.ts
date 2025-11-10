import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: 'auto',
          endpoint: configService.get<string>('R2_URL')!,
          forcePathStyle: false,
          credentials: {
            accessKeyId: configService.get<string>('R2_ACCESS_KEY_ID')!,
            secretAccessKey: configService.get<string>('R2_SECRET_ACCESS_KEY')!,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [S3Client],
})
export class R2Module {}
