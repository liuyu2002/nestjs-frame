import { JwtModuleOptions } from "@nestjs/jwt";
import env from 'envparsed'


export const CJwt: JwtModuleOptions = {
    secret: env.getStr('JWT_SECRET', 'b-)!I4EN4zl8yKIszCf1'),
    signOptions: {
        expiresIn: env.getStr('JWT_EXPIRESIN', '100d')
    }
}