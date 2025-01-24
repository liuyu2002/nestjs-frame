import { ApiProperty } from "@nestjs/swagger"
import { IsMobilePhone, IsString } from "class-validator"

export class PALogin {
    @IsString()
    @ApiProperty({ type: String, required: true, description: '账号', example: '18888888888' })
    account!: string

    @IsString()
    @ApiProperty({ type: String, required: true, description: '密码', example: '4297f44b13955235245b2497399d7a93' })
    password!: string
}
