import { IsString } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  title: string;

  @IsString()
  abstract: string;

  @IsString({ each: true })
  keywords: string[];

  @IsString()
  manuscriptUrl: string;
}
