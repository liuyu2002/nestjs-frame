// src/mqtt/mqtt.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient;

  onModuleInit() {
    this.client = mqtt.connect(process.env.MQTT_HOST+':'+process.env.MQTT_PORT, {
      username: process.env.MQTT_USERNAME??'', 
      password: process.env.MQTT_PASSWORD??'', 
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('test/topic', (err) => {
        if (!err) {
          console.log('Subscribed to test/topic');
        }
      });
    });

    this.client.on('message', (topic, message) => {
      console.log(`Received message from ${topic}: ${message.toString()}`);
    });
  }

  publish(topic: string, message: string): void {
    this.client.publish(topic, message);
    console.log(`Published message to ${topic}: ${message}`);
  }

  onModuleDestroy() {
    this.client.end();
  }
}