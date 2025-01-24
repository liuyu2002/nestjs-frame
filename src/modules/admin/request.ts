
import { Request } from "express";
import { User } from "src/entities/user";



export interface MRequest extends Request {
    userId: number
    userInfo: User
}