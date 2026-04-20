# 后端数据库集成计划

## 概述
为本项目添加后端服务，支持用户账号持久化存储和任务内容的数据库保存，替代原有的 localStorage 方案。

## 技术选型
- **框架**: Express.js (Node.js 生态，轻量成熟)
- **数据库**: PostgreSQL (关系型，结构化，用户-任务关联清晰)
- **ORM**: Prisma ORM (类型安全，Schema 可视化)
- **认证**: JWT + bcrypt (无状态会话，安全)
- **部署**: Docker 容器化

## 数据库设计

### 表结构

#### users (用户表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID (PK) | 主键 |
| email | VARCHAR(255) | 邮箱，唯一 |
| password_hash | VARCHAR(255) | 密码哈希 |
| name | VARCHAR(100) | 用户名 |
| avatar | VARCHAR(255) | 头像URL |
| bio | TEXT | 个人简介 |
| is_guest | BOOLEAN | 是否为游客 |
| created_at | TIMESTAMP | 创建时间 |

#### tasks (任务表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID (PK) | 主键 |
| user_id | UUID (FK) | 外键，关联 users.id |
| title | VARCHAR(255) | 任务标题 |
| priority | ENUM('high','medium','low') | 优先级 |
| due_date | DATE | 截止日期 |
| tags | JSONB | 标签数组 |
| completed | BOOLEAN | 是否完成 |
| created_at | TIMESTAMP | 创建时间 |
| completed_at | TIMESTAMP | 完成时间 |

#### sessions (会话表，可选)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID (PK) | 主键 |
| user_id | UUID (FK) | 外键 |
| token | VARCHAR(255) | JWT Token |
| expires_at | TIMESTAMP | 过期时间 |

## API 设计

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/me` - 获取当前用户信息

### 任务管理
- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks` - 创建任务
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务
- `PATCH /api/tasks/:id/complete` - 标记完成

### 统计相关
- `GET /api/stats/today` - 今日统计
- `GET /api/stats/week` - 本周统计

## 数据迁移
1. 从 localStorage 读取现有数据
2. 调用后端 API 将数据一次性导入数据库
3. 前端切换为从数据库拉取数据

## 安全措施
- 密码 bcrypt 哈希存储
- JWT 设置合理过期时间
- 接口验证用户身份（JWT 校验）
- SQL 注入防护（Prisma 自动处理）
- 速率限制（防止暴力破解）
