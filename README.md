# TaskFlow 🍅

一款极简风格的任务管理与番茄钟 Web 应用，帮助你高效管理日常任务并培养专注习惯。

![Vue 3](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Pinia](https://img.shields.io/badge/Pinia-2.1-FFD859?logo=pinia)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## ✨ 特性

- 📝 **任务管理** - 创建、编辑、删除任务，支持优先级和截止日期
- 🍅 **番茄钟** - 25分钟专注计时，自定义时长，音效提醒
- 📊 **数据统计** - 本周任务趋势图表，今日完成情况
- 👁️ **趣味登录** - 眼球跟随鼠标动画，密码输入时"闭眼"
- 🔐 **用户系统** - 支持注册/登录/游客模式
- 💾 **本地存储** - 数据保存在浏览器，保护隐私
- 📱 **响应式设计** - 完美适配桌面和移动设备

## 🚀 在线预览

👉 [https://weihongfan12.github.io/taskflow](https://weihongfan12.github.io/taskflow)

## 📦 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **状态管理**: Pinia
- **图表库**: ECharts
- **样式**: CSS Variables + Scoped CSS

## 🛠️ 本地开发

```bash
# 克隆项目
git clone https://github.com/weihongfan12/taskflow.git

# 进入目录
cd taskflow

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📂 项目结构

```
taskflow/
├── src/
│   ├── assets/           # 静态资源
│   ├── components/       # 组件
│   │   ├── auth/        # 认证相关组件
│   │   │   ├── EyeBall.vue    # 眼球动画
│   │   │   └── Pupil.vue      # 瞳孔组件
│   │   ├── PomodoroTimer.vue  # 番茄钟
│   │   ├── TaskForm.vue       # 任务表单
│   │   ├── TaskItem.vue       # 任务项
│   │   ├── StatsChart.vue     # 统计图表
│   │   └── UserSettings.vue   # 用户设置
│   ├── stores/          # Pinia 状态管理
│   │   └── taskStore.js
│   ├── views/           # 页面
│   │   ├── AuthView.vue       # 登录注册页
│   │   └── HomeView.vue       # 主页
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 功能详解

### 任务管理
- ✅ 创建任务（标题、优先级、截止日期、标签）
- ✅ 编辑和删除任务
- ✅ 标记完成/取消完成
- ✅ 按优先级/截止日期/创建时间排序
- ✅ 一键清空已完成任务

### 番茄钟
- ⏱️ 默认 25 分钟工作 + 5 分钟休息
- ⏸️ 暂停/继续功能
- 🔊 计时结束音效提醒
- 📈 记录每日番茄数

### 用户系统
- 🔑 用户注册/登录
- 👤 游客模式
- 🖼️ 头像上传
- 🚪 安全退出

### 数据统计
- 📊 本周任务完成趋势图
- 📈 今日任务/番茄统计
- 🏆 累计数据展示

## 🌟 亮点设计

### 趣味登录界面
登录页面采用左右分栏设计，左侧有两个可爱的眼球：
- 👀 **跟随效果** - 眼球会跟随鼠标移动
- 😉 **眨眼动画** - 定时自动眨眼
- 🙈 **密码保护** - 输入密码时眼球会"害羞"闭眼

### 精美 UI
- 🎨 渐变色主题（紫蓝渐变）
- 💫 流畅的过渡动画
- 📱 移动端适配
- ♿ 无障碍支持

## 🔒 隐私说明

所有数据均存储在浏览器本地（localStorage），不会上传到任何服务器，充分保护你的隐私。

## 📝 更新日志

### v1.0.0 (2026-04-20)
- ✨ 新增登录注册功能
- ✨ 新增眼球动画效果
- ✨ 新增用户系统
- 🎨 优化界面设计
- 🐛 修复已知问题

### v0.9.0 (2026-03-25)
- ✨ 初始版本发布
- ✨ 任务管理功能
- ✨ 番茄钟功能
- ✨ 数据统计功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

---

Made with ❤️ by [weihongfan12](https://github.com/weihongfan12)
