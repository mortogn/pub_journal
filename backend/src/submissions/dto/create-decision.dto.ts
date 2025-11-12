import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateDecisionDto {
  @IsEnum(['ACCEPTED', 'REJECTED', 'REVISION_REQUIRED'])
  outcome: 'ACCEPTED' | 'REJECTED' | 'REVISION_REQUIRED';

  @IsString()
  @IsOptional()
  letterPath?: string;
}
