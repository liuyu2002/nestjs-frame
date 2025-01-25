liuyu_frame/
│
├── .env                   # 环境变量配置文件
├── .eslintrc.js           # ESLint 配置文件
├── .gitignore             # Git 忽略文件
├── .prettierrc            # Prettier 代码格式化配置
├── README.md              # 项目说明文档
├── nest-cli.json          # Nest.js CLI 配置
├── package.json           # 项目依赖和脚本
├── tsconfig.build.json    # TypeScript 构建配置
├── tsconfig.json          # TypeScript 配置文件
│
├── src/                   # 源代码目录
│   ├── main.ts            # 应用入口文件
│   ├── module.ts          # 主模块文件
│   ├── service.ts         # 服务基类
│   ├── common/            # 公共模块
│   ├── configs/           # 配置文件
│   ├── constants/         # 常量定义
│   ├── decorators/        # 自定义装饰器
│   ├── entities/          # 数据实体
│   ├── guard/             # 守卫
│   ├── httpException/     # HTTP 异常处理
│   ├── interceptor/       # 拦截器
│   ├── logger/            # 日志模块
│   └── modules/           # 业务模块
│       ├── mqtt/          # MQTT 模块
│       │   ├── mqtt.module.ts
│       │   ├── mqtt.service.ts
│       │   └── interfaces/ # MQTT 相关接口定义
│       └── websocket/     # WebSocket 模块
│           ├── websocket.module.ts
│           ├── websocket.gateway.ts
│           └── interfaces/ # WebSocket 相关接口定义
│
├── utils/                 # 工具函数目录
│   ├── error/             # 错误处理工具
│   ├── excel.ts           # Excel 处理工具
│   ├── fileMd5.ts         # 文件MD5工具
│   ├── inform.ts          # 通知工具
│   ├── redis/             # Redis 工具
│   ├── synchronization.ts # 同步工具
│   └── wechat/            # 微信相关工具
│
├── dist/                  # 编译输出目录
├── logs/                  # 日志目录
└── node_modules/          # 依赖包目录