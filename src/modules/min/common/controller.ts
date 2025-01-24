import {
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Get
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Service } from './service';
import { EPath } from 'src/common/EPath';
import { MRequest } from '../request';
import { ControllerCommon, ControllerMin } from '../minController';
const moment = require('moment');

@ApiTags(`${EPath.min}:小程序公共接口`)
@ApiBearerAuth()
@ControllerCommon('common')
export class Controller {
  constructor(private readonly service: Service) { }


  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传腾讯云文件', description: '该接口用于将文件上传到腾讯云，并返回文件的访问路径。' })
  @ApiConsumes('multipart/form-data')  // 指定接口的请求格式为表单上传文件
  @ApiBody({
    description: '上传文件',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '需要上传的文件',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '文件上传成功' })
  @ApiResponse({ status: 400, description: '上传文件失败' })
  async uploadFile(
    @UploadedFile() file: any,
    @Req() req: MRequest,
  ) {
    return await this.service.uploadFileTencent(file, req.userInfo);

  }

}
