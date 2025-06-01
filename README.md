# 🧠 ThinkFlow

一个模仿 ChatGPT 的 AI 聊天平台，用户可注册账号、与 AI 进行自然语言对话，支持 Markdown 格式、代码高亮与流式响应。项目采用前后端分离架构，部署于云平台，个人全栈新手项目。

---

## 🔗 在线体验

- 🌐 项目地址：[https://www.chat-thinkflow.com](https://www.chat-thinkflow.com)
- 📦 后端仓库地址：[GitHub Repository](https://github.com/Louis-ZLH/ThinkFlow)

---

## 🚀 项目特性

- ✅ 用户注册、登录、邮箱验证码验证、密码找回
- 🧠 接入 AI 模型（如 OpenAI、DeepSeek）进行对话
- 💬 支持聊天记录保存，多会话切换管理
- 📜 Markdown 格式解析 + 代码块高亮显示
- 🔄 实现流式响应，模拟真实 AI 对话体验
- 🔐 JWT 身份验证机制，前后端分离，保证安全性
- ☁️ 前端部署于 Vercel，后端部署于 Railway，使用远程 PostgreSQL 数据库

---

## 🛠️ 技术栈

### 前端（Frontend）

- React + React Router
- TailwindCSS + MUI
- Axios + React Markdown + Rehype Highlight

### 后端（Backend）

- Node.js + Express
- PostgreSQL
- JWT（Token 身份认证）
- Nodemailer（邮箱验证码功能）
- OpenAI / DeepSeek 接口集成（流式对话）

---

## 📂 项目结构（后端示意）

```
server
├── controllers/         # 路由逻辑（如登录、消息处理）
├── routes/              # 接口定义
├── middleWare/          # JWT 验证与错误处理
├── db.js                  # 数据库连接与操作封装
├── utils/               # 工具函数（如验证码生成）
├── index.js            # 后端主入口文件
```

---

## 🧪 快速启动（本地开发）

### 环境要求

- Node.js ≥ 18
- PostgreSQL ≥ 13
- 推荐使用 VSCode + REST Client 插件测试接口

### 前端运行

```bash
cd client
npm install
npm start
```

### 后端运行

```bash
cd server
npm install
node index.js
```

### 配置 `.env` 文件如下：

```env
PG_USER=
PG_HOST=
PG_DATABASE=
PG_PASSWORD=
PG_PORT=
JWT_SECRET=
API_POST_KEY=
RESEND_API_KEY=
DEEPSEEK_KEY= 
```

---

## 📸 项目截图

![image](https://github.com/user-attachments/assets/f6f5d55c-dcca-4354-aba5-6ada77991ce9)
![image](https://github.com/user-attachments/assets/f178241a-98f1-454b-9074-82a0ad604383)

---

## 📌 TODO / 后续计划

- [x] 支持多轮对话与历史记录保存
- [x] Markdown + 代码块美化渲染
- [ ] 聊天记录导出功能（PDF / Markdown）
- [ ] 多语言支持（中文/英文切换）
- [ ] 移动端适配优化

---

## 🙋‍♂️ 项目作者

**(Luhao Zeng)**  
- Vanderbilt University 计算机科学硕士在读
- Sun Yat-Sen University 智能科学与技术本科
- 📧 Email: zenglh29@outlook.com  
- 📍 中国 / 美国纳什维尔

---

## 📄 License

MIT License
