import env from 'envparsed';


/**
 * 腾讯云
 * 配置项
 */
export const CTencentCos = {
  needToken: env.getBoolean('COS_NEEDTOKEN', true),
  secretId: env.getStr('COS_SECRETID', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
  secretKey: env.getStr('COS_SECRETKEY', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
  bucket: env.getStr('COS_BUCKET', 'o2-1307232071'),
  region: env.getStr('COS_REGION', 'ap-shanghai'),

  // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，
  // 例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
  allowPrefix: env.getStr('COS_ALLOWPREFIX', 'edges/uploads/*'),

  // 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
  action: [
    // 简单上传
    'name/cos:PutObject',
    'name/cos:PostObject',
    // 分片上传
    'name/cos:InitiateMultipartUpload',
    'name/cos:ListMultipartUploads',
    'name/cos:ListParts',
    'name/cos:UploadPart',
    'name/cos:CompleteMultipartUpload',
  ],
  proxy: env.getStr('COS_PROXY', ''),
  durationSeconds: env.getNumber('COS_DURATIONSECONDS', 1800),


  // 前端需要的域名转换
  urlBefore: env.getStr('COS_URLBEFORE', 'o2-1307232071.cos.ap-shanghai.myqcloud.com'),
  urlAfter: env.getStr('COS_URLAFTER', 'https://o2.orbitsoft.cn'),
}

export const COS_CONFIG = {
  secretId: env.getStr('COS_SECRETID', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
  secretKey: env.getStr('COS_SECRETKEY', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
  bucket: env.getStr('COS_BUCKET', 'o2-1307232071'),
  region: env.getStr('COS_REGION', 'ap-shanghai'),
};