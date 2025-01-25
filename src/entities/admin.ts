import { Column, Entity } from "typeorm";
import { Base } from "./base";

@Entity()
export class Admin extends Base {
    @Column({ comment: '账号' })
    account: string;

    @Column({ comment: '密码' })
    password: string;
}