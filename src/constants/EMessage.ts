export enum EMessage {
    Undefined = "未知错误",  // 客户端非法操作
    Forbidden = "禁止访问",  // 登录，权限不足
    TokenIllegal = "非法token",  // token 过期或解析失败
    UserNotExists = "用户不存在", // 
    UserWasDisabled = "用户被禁用",
    RoleWasDisabled = "用户所在角色组被禁用",
    MobileIsInUse = "手机号被使用",
    PasswordError = "密码错误",
    FormerPasswordError = "旧密码错误",
    PermissionDenied = "权限不足",
    ParamsError = '参数错误',
    DuplicatedParameter = "参数重复",
    DataNotExist = "数据不存在",
    DataExist = "数据已存在",
    UpperLimit = '已达到上限',
    //账号已存在
    AccountExist = '账号已存在',
    ShopNotExist = '门店不存在',
    UserNotExist = '用户不存在',
    //鉴权
    AuthError = '鉴权失败',

}

// src/constants/errorMessages.ts
export const ERROR_MESSAGES = {
    DEFAULT: '服务器内部错误，请稍后重试',
    BAD_REQUEST: '请求参数错误',
    UNAUTHORIZED: '未经授权的访问',
    FORBIDDEN: '访问被拒绝',
    NOT_FOUND: '资源未找到',
    VALIDATION_ERROR: '数据验证失败',
};