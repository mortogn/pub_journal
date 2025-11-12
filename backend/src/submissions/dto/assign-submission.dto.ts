import { IsString } from 'class-validator';

export class AssignSubmissionDto {
  @IsString()
  submissionId: string;

  @IsString()
  reviewerId: string;
}
