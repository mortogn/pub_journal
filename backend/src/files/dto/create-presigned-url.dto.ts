import { IsNumber, Max } from 'class-validator';

export class CreatePresignedUrlDto {
  @IsNumber()
  @Max(1024 * 1024 * 10) // 10 Mb in bytes
  size: number;
}
