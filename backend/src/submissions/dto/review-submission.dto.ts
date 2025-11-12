import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ReviewSubmissionDto {
  @IsString()
  @IsOptional()
  commentsToAuthor?: string;

  @IsString()
  @IsOptional()
  commentsToEditor?: string;

  @IsIn(['ACCEPT', 'REJECT', 'MINOR_REVISION', 'MAJOR_REVISION'])
  @IsOptional()
  recommendation?: 'ACCEPT' | 'REJECT' | 'MINOR_REVISION' | 'MAJOR_REVISION';

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  score?: number;
}
