# 智能协同云图库（yu-picture）

基于 Vue 3 + Spring Boot 的图片素材管理与协同项目：支持空间、权限、上传至对象存储、AI 能力等。

**在线仓库：** [github.com/chenruijieCSDN/yuntu](https://github.com/chenruijieCSDN/yuntu)

## 项目结构

| 目录 | 说明 |
|------|------|
| `yu-picture-backend` | 后端 API（Spring Boot） |
| `yu-picture-frontend` | 前端（Vue 3 + Vite） |

## 技术栈

**后端：** Java 8、Spring Boot 2.7、MyBatis-Plus、MySQL、Redis、Spring Session、ShardingSphere（分表）、腾讯云 COS、Knife4j 等。

**前端：** Vue 3、TypeScript、Vite、Vue Router、Pinia、Ant Design Vue、ECharts 等。

## 环境要求

- JDK 8+
- Maven 3.6+
- Node.js 18+（建议）
- MySQL 5.7+ / 8.x
- Redis

## 本地运行

### 1. 数据库与 Redis

创建数据库（如 `yu_picture`），导入项目所需表结构（以你本地 SQL 脚本为准）。启动 Redis。

### 2. 后端

1. 进入 `yu-picture-backend`。
2. 复制 `src/main/resources/application-local.yml.example` 为 **`application-local.yml`**（该文件已被 Git 忽略），填写腾讯云 COS、阿里云 AI 等密钥。
3. 在 IDE 运行配置中启用 **`spring.profiles.active=local`**，或等价 VM 参数：`-Dspring.profiles.active=local`。
4. 按需修改 `application.yml` 中的 MySQL 连接；生产环境请用环境变量 `MYSQL_PASSWORD`、`COS_SECRET_ID` 等，**勿将真实密钥提交到 Git**。
5. 执行：

   ```bash
   mvn spring-boot:run
   ```

   默认 API 端口见 `application.yml`（一般为 **8124**，context-path 为 `/api`）。

### 3. 前端

```bash
cd yu-picture-frontend
npm install
npm run dev
```

开发环境下请求会指向 `http://localhost:8124`（见 `src/request.ts`）。生产构建：

```bash
npm run build
```

产物在 `dist/`，由 Nginx 等静态服务器或与应用同域部署。

## 敏感配置说明

- 密钥、Token 放在 **`application-local.yml`** 或环境变量中。
- 勿提交 `.env`、`application-local.yml`、证书与内网部署笔记等；详见仓库根目录 `.gitignore`。

## 许可证

使用第三方依赖与云服务时请自行遵守其许可与服务条款。
