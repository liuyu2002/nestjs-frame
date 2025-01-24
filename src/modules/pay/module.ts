import { Module } from "@nestjs/common";
import { ControllerPayHook } from "./controller";
import { ServiceHandlePay } from "./service";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user";






@Module({
    imports: [

    ],
    controllers: [ControllerPayHook],
    providers: [ServiceHandlePay],
    exports: [ServiceHandlePay]
})

export class ModulePay { }