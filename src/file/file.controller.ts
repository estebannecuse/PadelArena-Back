import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("FILE")
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload-galery/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadMultimedia(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 500000,
            message: 'El archivo no debe pesar mas de 500kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|mp4|webm|wmv|swf)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileService.uploadTournamentMultimedia(id, file);
  }

  @Put('update-flyer/:id')
  updateTournamentFlyer(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 500000,
            message: 'La imagen no puede pesar mas de 500kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileService.UpdateTournamentFlyer(id, file)
  }

  @Put('update-profile-image/:id')
  updateUserProfileImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'La imagen no puede pesar mas de 200kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileService.updateUserProfileImage(id, file)
  }
}
