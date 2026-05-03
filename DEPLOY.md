# Vibe-Trading 后端部署指南

## 前提条件

- 一台云服务器（推荐 2核4G+，Ubuntu 22.04 / Debian 12）
- 已安装 Docker 和 Docker Compose
- 域名（可选，用于 HTTPS）

## 快速部署

### 1. 克隆仓库

```bash
git clone https://github.com/art13817979231-svg/Vibe-Trading.git
cd Vibe-Trading
```

### 2. 配置环境变量

```bash
cp agent/.env.example agent/.env
```

编辑 `agent/.env`，填写必要配置：

```env
# LLM API（必填，至少配置一个）
OPENROUTER_API_KEY=sk-or-v1-xxxxx
# OPENAI_API_KEY=sk-xxxxx

# 数据源（按需配置）
TUSHARE_TOKEN=xxxxx          # A股数据
OKX_API_KEY=xxxxx            # 加密货币
OKX_SECRET_KEY=xxxxx

# 应用配置
APP_ENV=production
PORT=8899
```

### 3. 启动服务

```bash
docker compose up -d --build
```

### 4. 验证

```bash
# 健康检查
curl http://localhost:8899/health

# 查看日志
docker compose logs -f
```

## HTTPS 配置（推荐）

使用 Caddy 反向代理自动获取 Let's Encrypt 证书：

```bash
# 安装 Caddy
sudo apt install caddy

# 编辑 Caddyfile
sudo nano /etc/caddy/Caddyfile
```

Caddyfile 内容：

```
your-domain.com {
    reverse_proxy localhost:8899
}
```

```bash
sudo systemctl restart caddy
```

## 环境变量说明

### 前端（Vercel 部署时设置）

| 变量 | 说明 | 示例 |
|------|------|------|
| `VITE_API_URL` | 后端 API 地址 | `https://api.your-domain.com` |

> ⚠️ `VITE_API_URL` 不带尾部斜杠！

### 后端 CORS

后端已自动允许所有来源的跨域请求。如需限制，修改 `agent/api_server.py` 中的 CORS 配置。

## 数据持久化

Docker Compose 配置了以下命名卷：

| 卷名 | 容器路径 | 说明 |
|------|---------|------|
| `vibe-runs` | `/app/agent/runs` | 回测结果 |
| `vibe-sessions` | `/app/agent/sessions` | 对话历史 |
| `vibe-uploads` | `/app/agent/uploads` | 上传文件 |
| `vibe-swarm` | `/app/agent/.swarm` | Swarm 运行数据 |

## 常用运维命令

```bash
# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看容器状态
docker compose ps

# 进入容器调试
docker compose exec vibe-trading bash

# 备份数据
docker run --rm -v vibe-runs:/data -v $(pwd):/backup alpine tar czf /backup/runs-backup.tar.gz -C /data .

# 更新代码后重新部署
git pull
docker compose up -d --build
```

## 故障排查

### 端口被占用
```bash
# 修改 docker-compose.yml 中的端口映射
ports:
  - "9099:8899"  # 改为其他端口
```

### 容器无法启动
```bash
# 查看详细日志
docker compose logs --tail=100
```

### API 连接超时
- 检查防火墙是否放行了 8899 端口
- 检查 `VITE_API_URL` 是否正确（前端环境变量）
- 确认后端 CORS 配置正确
