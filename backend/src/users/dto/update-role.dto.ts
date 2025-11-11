import { IsEnum, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  id: string;

  @IsEnum(['AUTHOR', 'ADMIN', 'EDITOR', 'REVIEWER'])
  role: 'AUTHOR' | 'ADMIN' | 'EDITOR' | 'REVIEWER';
}
