
import { applyDecorators, Controller, UseGuards, } from "@nestjs/common";
import { EPath } from "src/common/EPath";
import { AdminGuard } from "src/guard/AdminGuard";

export function ControllerMin(prefix: string) {
    return applyDecorators(Controller(`${EPath.min}${prefix}`));
}

export function ControllerAdmin(prefix: string) {
    return applyDecorators(Controller(`${EPath.admin}${prefix}`), UseGuards(AdminGuard));
}

export function ControllerCommon(prefix: string) {
    return applyDecorators(Controller(prefix));
}