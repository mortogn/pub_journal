import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { CreatePresignedUrlDto } from './dto/create-presigned-url.dto';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FilesService {
  constructor(
    private s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async generatePdfPresignedUrl(
    userId: string,
    presignedUrlDto: CreatePresignedUrlDto,
  ) {
    const key = `manuscripts/${userId}/${randomUUID()}.pdf`;

    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('R2_BUCKET_NAME')!,
      Key: key,
      ContentType: 'application/pdf',
      ContentLength: presignedUrlDto.size,
    });

    const expiresIn = 10 * 60; // 10 minutes;

    const url = await getSignedUrl(this.s3Client, command, { expiresIn });

    return {
      url,
      key,
      expiresIn,
      requiredHeaders: {
        'Content-Type': 'application/pdf',
      },
    };
  }
}
