# 云图库模块验收清单

本文用于快速核对“已实现 / 待验证 / 风险点”，并给出最短联调路径。

## 本轮已修复的 404

- 已统一关键页面外链为 hash 路由（`/#/...`）：
  - `SpaceDetailPage.vue`
  - `AddPicturePage.vue`
  - `SpaceAnalyzePage.vue`
  - `admin/SpaceManagePage.vue`
  - `admin/SpaceUserManagePage.vue`
- 结论：上述入口在静态部署环境下不再因 history 路径导致 404。

## 模块实现状态（基于代码扫描）

### 1) 用户模块

- 状态：已实现（注册、登录、鉴权、用户管理）。
- 证据：
  - `yu-picture-backend/src/main/java/com/yupi/yupicturebackend/controller/UserController.java`
  - 前端路由：`/user/login`、`/user/register`
- 待验证：
  - Redis Session 在多实例部署下是否共享（登录态跨实例）。

### 2) 图片模块

- 状态：核心能力已实现。
- 证据：
  - 上传/URL 上传/编辑/删除/搜索：`PictureController.java`
  - 前端页面：`AddPicturePage.vue`、`PictureDetailPage.vue`、`PictureManagePage.vue`
- 待验证：
  - 大文件上传超时和失败重试策略。
  - URL 抓图在目标站反爬场景的稳定性。

### 3) 空间模块

- 状态：已实现（私有/团队空间、空间成员管理、空间分析入口、权限控制）。
- 证据：
  - `SpaceController.java`、`SpaceUserController.java`、`SpaceUserAuthManager.java`
  - 前端：`MySpacePage.vue`、`SpaceDetailPage.vue`、`admin/SpaceUserManagePage.vue`
- 待验证：
  - 不同角色（管理员/成员）按钮与接口权限是否严格一致。

### 4) AI 模块

- 状态：已实现异步扩图 + 轮询。
- 证据：
  - 后端：`AliYunAiApi.java`、`PictureController.java`
  - 前端：`ImageOutPainting.vue`（`createTask` + `startPolling`）
- 待验证：
  - 任务失败分支是否给到明确错误提示。
  - 轮询超时上限和中断恢复。

### 5) 协作模块（WebSocket + Disruptor）

- 状态：代码已实现。
- 证据：
  - WebSocket：`WebSocketConfig.java`（`/ws/picture/edit`）
  - Disruptor：`PictureEditEventDisruptorConfig.java` 等
- 待验证：
  - 多人并发编辑同一图片的锁冲突处理和一致性。

### 6) 分析模块

- 状态：已实现（空间使用、分类、标签、大小、用户行为、排行）。
- 证据：
  - `SpaceAnalyzeController.java`
  - 前端分析页：`SpaceAnalyzePage.vue` + analyze 组件集
- 待验证：
  - 管理员与普通用户可见范围是否符合预期。

### 7) 分表模块（ShardingSphere）

- 状态：存在实现与配置，但有“是否启用”的风险点。
- 证据：
  - 配置：`application.yml` 中 `spring.shardingsphere`
  - 动态分表管理：`DynamicShardingManager.java`
- 风险：
  - `YuPictureBackendApplication.java` 里排除了 `ShardingSphereAutoConfiguration`；
  - `DynamicShardingManager.java` 中 `@Component` 当前被注释。
- 结论：需确认当前环境是否真的启用了分表，否则描述与运行态不一致。

### 8) 缓存模块（Redis + Caffeine）

- 状态：已实现多级缓存代码。
- 证据：
  - `PictureController.java` 中本地 Caffeine + Redis 相关逻辑
- 待验证：
  - 缓存命中率、失效策略、随机过期是否按预期生效。

## 建议的联调顺序（最短闭环）

1. 用户登录 -> 我的空间 -> 空间详情（验证基础路由与权限）。
2. 空间内上传图片 -> 编辑图片 -> 搜索图片（验证主流程）。
3. 团队空间成员管理 -> 不同角色操作（验证 RBAC）。
4. AI 扩图任务创建与轮询（验证异步链路）。
5. WebSocket 多人编辑（2 个浏览器会话并测）。
6. 分析页六类图表数据一致性。
7. 分表与缓存在压测下的性能收益确认。

## 建议补充的自动化检查

- 前端：加一条静态检查，禁止新写 `href="/xxx"`（必须 `/#/xxx` 或 `router.push`）。
- 后端：为空间权限、图片编辑权限、分析权限补充接口级用例。
- 集成：新增“从登录到空间协作”的冒烟脚本，避免回归出现 404/权限漂移。

