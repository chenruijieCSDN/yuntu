# 云图库服务器部署说明

## 1. 后端启动前准备

- JDK 8+
- MySQL 8+
- Redis 6+
- 已执行数据库建表脚本
- 已在云厂商控制台重新生成并替换 COS / AI 密钥

## 2. 生产环境变量

在服务器设置以下环境变量（示例为 Linux）：

```bash
export SPRING_PROFILES_ACTIVE=prod
export MYSQL_HOST=127.0.0.1
export MYSQL_PORT=3306
export MYSQL_USERNAME=root
export MYSQL_PASSWORD=your_mysql_password
export REDIS_HOST=127.0.0.1
export REDIS_PORT=6379
export REDIS_DATABASE=0
export COS_HOST=https://your-bucket.cos.ap-guangzhou.myqcloud.com
export COS_SECRET_ID=your_cos_secret_id
export COS_SECRET_KEY=your_cos_secret_key
export COS_REGION=ap-guangzhou
export COS_BUCKET=your_bucket_name
export ALIYUN_AI_API_KEY=your_aliyun_api_key
```

## 3. 后端启动命令

先将 `application-prod.yml.example` 复制为 `application-prod.yml` 并按需调整。

```bash
cd /opt/yu-picture/yu-picture-backend
java -Dspring.profiles.active=prod -jar target/yu-picture-backend-*.jar
```

## 4. 前端打包与部署

```bash
cd /opt/yu-picture/yu-picture-frontend
npm install
npm run build
```

将 `dist` 目录部署到 Nginx 静态目录（如 `/var/www/yu-picture`）。

## 5. Nginx 配置（含 /api + WebSocket）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/yu-picture;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8124/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ws/ {
        proxy_pass http://127.0.0.1:8124/api/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 600s;
    }
}
```

## 6. 上线后验证

- 普通登录、注册、退出是否正常
- 团队空间中 `editor` 是否可以编辑并保存图片
- `viewer` 是否无法编辑
- WebSocket 多人编辑是否能实时收到消息
- 图片上传后 COS 地址是否可访问

