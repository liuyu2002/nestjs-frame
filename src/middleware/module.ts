import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { RateLimitMiddleware } from "./rateLimitMiddleware";


@Module({
    imports: [
       
    ],
    controllers: [],
    providers: [],
})
export class ModulesMiddleware implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(RateLimitMiddleware)
        .forRoutes('*'); // 应用到所有路由
    }
}