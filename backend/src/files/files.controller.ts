import { Body, Controller, Post } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreatePresignedUrlDto } from './dto/create-presigned-url.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthTokenPayload } from 'src/auth/token.type';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('presign')
  async presign(
    @Body() createPresignDto: CreatePresignedUrlDto,
    @CurrentUser() user: AuthTokenPayload,
  ) {
    return this.filesService.generatePdfPresignedUrl(
      user.sub,
      createPresignDto,
    );
  }
}
