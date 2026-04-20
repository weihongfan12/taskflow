# TaskFlow Backend Architecture

## 🏗️ 系统架构

### 分层架构
```
┌─────────────────────────────────┐
│           HTTP Layer            │  ← Express 路由层
│  ┌─────────────┐  ┌───────────┐  │
│  │ Auth Routes │  │ Task Routes│  │
│  └─────────────┘  └───────────┘  │
└─────────────────────────────────┘
               │
┌─────────────────────────────────┐
│        Middleware Layer         │  ← 认证中间件
│  ┌─────────────┐                │
│  │  JWT Auth   │  ← 验证 Token  │
│  └─────────────┘                │
└─────────────────────────────────┘
               │
┌─────────────────────────────────┐
│        Controller Layer         │  ← 业务逻辑
│  ┌─────────────┐  ┌───────────┐  │
│  │ Auth Ctrl   │  │ Task Ctrl  │  │
│  └─────────────┘  └───────────┘  │
└─────────────────────────────────┘
               │
┌─────────────────────────────────┐
│         Service Layer           │  ← 数据库操作
│  ┌─────────────┐  ┌───────────┐  │
│  │  Prisma     │  │  Logic    │  │
│  └─────────────┘  └───────────┘  │
└─────────────────────────────────┘
               │
┌─────────────────────────────────┐
│         Database Layer          │  ← PostgreSQL
│  ┌─────────────┐  ┌───────────┐  │
│  │    Users    │  │   Tasks   │  │
│  └─────────────┘  └───────────┘  │
│  ┌─────────────┐  ┌───────────┐  │
│  │  Sessions   │  │  Schema   │  │
│  └─────────────┘  └───────────┘  │
└─────────────────────────────────┘
```

## 📊 数据流

### 用户登录
```
Client → POST /api/auth/login
    → Controller → Service → Database
    ← Database ← Service ← Controller
    ← JWT Token (200)
```

### 获取任务列表
```
Client → GET /api/tasks (with Bearer Token)
    → Middleware (Verify JWT)
    → Controller → Service → Database
    ← Database ← Service ← Controller
    ← Tasks Array (200)
```

### 创建任务
```
Client → POST /api/tasks (with Bearer Token + body)
    → Middleware (Verify JWT)
    → Controller → Service → Database
    ← Created Task (201)
```

## 🎯 关键设计决策

### 1. JWT 认证
- 使用 `jsonwebtoken` 库
- Token 过期时间：7 天
- 存储在请求的 Authorization 头中：`Bearer <token>`
- 使用 bcrypt 哈希密码

### 2. 数据库设计
- PostgreSQL 作为关系型数据库
- 外键约束：tasks.userId → users.id
- 枚举类型：Priority (HIGH, MEDIUM, LOW)
- JSONB 字段：tags 数组

### 3. 错误处理
- 统一的错误响应格式：`{ error: "message" }`
- 401：未认证
- 403：认证失败/Token 无效
- 404：资源不存在
- 500：服务器内部错误

### 4. 速率限制
- `express-rate-limit`
- 窗口：15 分钟
- 最大请求：100 次/IP

## 🔐 安全设计

### 密码安全
- 使用 `bcryptjs` 进行哈希
- salt rounds: 10
- 永不存储明文密码

### Token 安全
- JWT 签名使用强密钥
- HTTPS 传输
- 合理过期时间

### SQL 注入防护
- 全部使用 Prisma ORM
- 参数化查询
- 输入验证

### CORS 配置
- 仅允许配置的前端域名
- 支持凭证传输

## 📦 依赖说明

### 生产依赖
- `express`: Web 框架
- `prisma`: ORM & 数据库工具
- `@prisma/client`: 数据库客户端
- `bcryptjs`: 密码哈希
- `jsonwebtoken`: JWT 处理
- `cors`: 跨域支持
- `helmet`: HTTP 头安全
- `express-rate-limit`: 速率限制
- `dotenv`: 环境变量管理

### 开发依赖
- `typescript`: TypeScript 支持
- `@types/*`: 类型定义
- `ts-node`: 运行时 TypeScript
- `nodemon`: 热重载

## 🎨 代码规范

### TypeScript 接口
- 所有请求/响应都有类型定义
- 使用 `interface` 或 `type`
- 导出类型供外部使用

### 错误处理模式
```typescript
try {
  // 业务逻辑
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
```

### 环境变量
- 所有配置通过 `.env` 文件管理
- 生产环境使用环境变量注入
- 敏感信息不提交到版本控制

## 🚀 部署架构

### 单机部署
```
Nginx (反向代理/SSL终止)
    ↓
Node.js (PM2 集群)
    ↓
PostgreSQL
```

### 高可用部署
```
负载均衡器 (LVS/Nginx)
    ↓
┌────────────┐  ┌────────────┐
│ Node.js    │  │ Node.js    │  ← 多实例
│ Instance 1 │  │ Instance 2 │
└────────────┘  └────────────┘
    ↓
PostgreSQL (主从复制)
    ↓
Redis (可选，用于会话存储)
```

## 📝 待办事项

- [ ] 添加 Swagger/OpenAPI 文档
- [ ] 实现完整的会话管理（登出时 blacklist token）
- [ ] 添加邮件验证功能
- [ ] 实现密码重置功能
- [ ] 添加文件上传支持（头像）
- [ ] 实现软删除（逻辑删除）
- [ ] 添加完整的测试套件
- [ ] 配置 CI/CD 流水线
