import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Service } from './service';
import { CTencentCos } from 'src/configs/CTencent.cos';
import { FileInterceptor } from '@nestjs/platform-express';
/**
 * 前端获取临时证书
 */
@ApiTags(`文件上传模块`)
@Controller()
export class Controllers {
    constructor(
        private readonly service: Service,
    ) { }

    // @Post(`:type/:version/uploads`)
    @ApiOperation({ summary: "文件上传" })
    // @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file) {
        // console.log(file);
        file.url = file.url.replace('https://', '')
        file.url = file.url.replace(CTencentCos.urlBefore, CTencentCos.urlAfter)
        return file;
    }

    // 适配多端的证书
    //@Get(`:type/:version/credential`)
    @ApiOperation({ summary: "文件上传配置" })
    getCredential(@Param('type') type: string, @Param('version') version: string) {
        // const path = `${type}/${version}/`
        return this.service.getCredential()
    }

    // 未经证实的接口
    // @Delete()
    @ApiOperation({ summary: "删除文件" })
    deleteFiles(@Body() files: string[]) {
        return this.service.deleteFiles(files)
    }
}