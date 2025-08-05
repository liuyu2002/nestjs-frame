import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './index';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature(Object.values(entities)),
  ],
  exports: [
    TypeOrmModule.forFeature(Object.values(entities)),
  ],
})
export class EntitiesModule {} 