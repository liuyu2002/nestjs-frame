import { TypeOrmModule } from '@nestjs/typeorm';
import { Controller } from './controller';
import { Service } from './service';
import { Module } from '@nestjs/common';
import { User } from 'src/entities/user';
import { CJwt } from 'src/configs/CJwt';
import { MediaFile } from 'src/entities/mediaFile';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, MediaFile])
  ],
  controllers: [Controller],
  providers: [Service],
})
export class ModuleCommon { }
