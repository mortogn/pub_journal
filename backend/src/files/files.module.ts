import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { R2Module } from 'src/r2/r2.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [R2Module],
})
export class FilesModule {}
