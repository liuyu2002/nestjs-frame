import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { RequestIdMiddleware } from "./requestId.middleware";



@Module({
    imports: [
       
    ],
    controllers: [],
    providers: [],
})
export class ModulesMiddleware implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(RequestIdMiddleware)
        .forRoutes('*'); // 应用到所有路由
    }
}