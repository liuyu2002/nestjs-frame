import env from 'envparsed'

// sm4 加密配置

export const CSm4 = {
    key: env.getStr('SM4_KEY', '2020-09-21XXXXXX'),
    mode: env.getStr('SM4_MODE', 'ecb'),
    iv: env.getStr('SM4_IV', 'UISwD9fW6cFh9SNS'),
    cipherType: 'base64',
}