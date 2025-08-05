import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CJwt } from 'src/configs/CJwt';

@Global()
@Module({
    imports: [
        JwtModule.register(CJwt),
    ],
    exports: [JwtModule],
})
export class GlobalJwtModule {} 