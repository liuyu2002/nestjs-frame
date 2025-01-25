// src/mqtt/mqtt.module.ts

import { Module } from '@nestjs/common';
import { MqttService } from './service';

@Module({
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}