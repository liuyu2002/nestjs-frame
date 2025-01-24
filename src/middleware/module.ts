import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";



@Module({
    imports: [
       
    ],
    controllers: [],
    providers: [],
})
export class ModulesMiddleware implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply()
        .forRoutes('*'); // 应用到所有路由
    }
}