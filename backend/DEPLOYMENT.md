# TaskFlow - 后端数据库部署文档

## 📦 项目结构
```
backend/
├── src/
│   ├── controllers/       # 控制器层
│   │   ├── authController.ts
│   │   └── taskController.ts
│   ├── middleware/        # 中间件
│   │   └── authMiddleware.ts
│   ├── prisma.ts          # Prisma 客户端实例
│   ├── index.ts           # Express 服务器入口
│   └── types/             # TypeScript 类型定义
│       └── task.ts
├── prisma/
│   ├── schema.prisma      # 数据库 Schema
│   └── prisma.config.ts   # Prisma 配置
├── Dockerfile             # Docker 镜像
├── docker-compose.yml     # Docker 编排
├── package.json
├── tsconfig.json
└── .env                   # 环境变量
```

## 🗄️ 数据库模型

### User 用户表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| email | VARCHAR(255) | 邮箱，唯一 |
| password | VARCHAR(255) | 密码哈希 |
| name | VARCHAR(100) | 用户名 |
| avatar | VARCHAR(255) | 头像URL |
| bio | TEXT | 个人简介 |
| isGuest | BOOLEAN | 是否为游客 |
| createdAt | TIMESTAMP | 创建时间 |

### Task 任务表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| userId | UUID | 外键 → users.id |
| title | VARCHAR(255) | 任务标题 |
| priority | ENUM | 优先级（HIGH/MEDIUM/LOW） |
| dueDate | DATE | 截止日期 |
| tags | JSONB | 标签数组 |
| completed | BOOLEAN | 是否完成 |
| createdAt | TIMESTAMP | 创建时间 |
| completedAt | TIMESTAMP | 完成时间 |

### Session 会话表（可选）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| userId | UUID | 外键 |
| token | VARCHAR(255) | JWT Token |
| expiresAt | TIMESTAMP | 过期时间 |

## 🔧 环境配置

### .env 示例
```env
DATABASE_URL="postgresql://taskflow_user:password@localhost:5432/taskflow_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

## 🚀 快速启动

### 本地开发
```bash
# 进入后端目录
cd backend

# 安装依赖
npm ci

# 生成 Prisma 客户端
npx prisma generate

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行迁移（需要数据库）
npx prisma migrate dev --name init
```

### 使用 Docker 部署
```bash
# 构建并启动服务
docker-compose up --build -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 进入容器
docker-compose exec backend sh
```

## 🌐 API 接口

### 认证路由
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息（需要认证）

### 任务路由（需要认证）
- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks` - 创建任务
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务
- `PATCH /api/tasks/:id/complete` - 标记完成

### 用户设置（需要认证）
- `PATCH /api/settings` - 更新用户设置

### 统计路由（需要认证）
- `GET /api/stats/today` - 今日统计
- `GET /api/stats/week` - 本周统计

### 健康检查
- `GET /health` - 服务健康检查

## 🔒 安全措施

1. **密码加密**：使用 bcrypt 对用户密码进行哈希处理
2. **JWT 认证**：使用 JSON Web Token 进行无状态身份验证
3. **SQL 注入防护**：通过 Prisma ORM 自动处理
4. **速率限制**：使用 express-rate-limit 防止暴力破解
5. **HTTPS**：生产环境建议使用 HTTPS
6. **CORS 配置**：限制允许的跨域来源
7. **输入验证**：所有输入数据都应进行验证

## 📊 数据库迁移

### 创建迁移
```bash
npx prisma migrate dev --name migration-name
```

### 应用迁移到数据库
```bash
npx prisma migrate dev --name init
```

### 生成 Prisma 客户端
```bash
npx prisma generate
```

### 查看数据库状态
```bash
npx prisma db pull
```

## 🐛 常见问题

### 数据库连接失败
- 检查 DATABASE_URL 是否正确
- 确保 PostgreSQL 服务已启动
- 检查网络连接

### Prisma 模式验证错误
- 运行 `npx prisma generate` 生成客户端
- 检查 schema.prisma 语法

### JWT 验证失败
- 检查 JWT_SECRET 是否一致
- 检查 Token 是否过期
- 清除 localStorage 后重新登录

## 🚀 生产环境部署

### 使用 PM2
```bash
npm install -g pm2
pm2 start dist/index.js -i max --name "taskflow-backend"
pm2 save
pm2 startup
```

### 使用 Nginx 反向代理
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📝 数据库备份

```bash
# 每日备份
0 0 * * * pg_dump -U taskflow_user -h localhost taskflow_db > /backup/taskflow_$(date +\%Y\%m\%d).sql
```

## 🔄 前端对接

前端需要修改 API 基础路径：
```javascript
// 前端配置
const API_BASE_URL = "http://localhost:3001/api";
```

## 📈 性能优化建议

1. **数据库索引**：为常用查询字段添加索引
2. **连接池**：配置数据库连接池
3. **缓存**：使用 Redis 缓存频繁访问的数据
4. **CDN**：静态资源使用 CDN 加速
5. **负载均衡**：多实例部署，使用负载均衡

## 📄 许可

MIT License
