## 目标
- 将站点 `jinmai-lab.tech` 部署为最新代码版本。
- 修正部署配置（避免忽略源码导致旧版本构建）。
- 为页面加入可见的版本标识，便于线上与本地版本比对。
- 配置缓存策略，确保更新后用户能立即看到最新版。

## 原因定位
- 当前 `.vercelignore` 包含 `src/`，会导致 Vercel 上传时不包含源码，构建沿用旧产物。
- 之前存在 `api/server.{js,mjs,ts}` 多入口冲突，影响 Serverless Functions 部署。
- 线上 `Age` 和 `X-Vercel-Cache: HIT` 表明命中缓存，可能显示旧页面。

## 配置修复
1. `.vercelignore`
   - 移除 `src/` 忽略项，保留 `node_modules/`、日志、`.env` 等忽略。
   - 选择部署方案：
     - 静态前端：保留 `api/` 忽略（不上传后端）。
     - 全栈：仅保留 `api/server.js`，删除/改名其它冲突入口（`server.mjs/server.ts`）。
2. `vercel.json`
   - 保留：`/api/(.*)` → `/api/$1` 与 `/(.*)` → `/static/$1` 的重写。
   - 增加 headers：为根路径设置 `Cache-Control: no-cache`，避免首页缓存（示例）
     ```json
     "headers": [{
       "source": "/",
       "headers": [{"key": "Cache-Control", "value": "no-cache"}]
     }]
     ```
   - 如采用 Serverless：声明 `functions` 只指向 `api/server.js`，运行时 `nodejs18.x`。
3. Vercel Build & Output Settings
   - Build Command：`pnpm build`
   - Output Directory：`dist/static`
   - 勾选或选择 "Rebuild without cache" 强制重建。

## 版本标识实现
- 在前端加入版本信息（构建时间 + 提交哈希）：
  - 新增 `src/lib/version.ts`，使用 `import.meta.env` 注入 `VITE_APP_BUILD_TIME` 和（如有）`VITE_APP_COMMIT`。
  - 在页脚或设置页显示版本号，如：`v{commitShort} • {buildTime}`。
- 构建时注入环境变量：在 `package.json` 的 `build` 前加 `cross-env` 或在 Vercel 环境变量配置中设置。

## 部署执行
- 通过 Vercel 控制台点击 Deploys → Redeploy（选择不使用缓存）。
- 如 CLI 可用：`vercel --prod --archive=tgz`（减少上传文件数，规避速率限制）。

## 验证步骤
- 访问 `https://jinmai-lab.tech/?v=timestamp`（强制绕过浏览器缓存）。
- 检查：
  - 首页为最新版内容；管理员登录自动跳转到 `/admin`。
  - 后台四个功能页均正常显示。
  - 页脚/设置页显示的版本标识与最新构建时间一致。
  - 响应头 `X-Vercel-Cache` 为 `MISS`（首次），随后为 `HIT`。

## 回滚与安全
- 变更仅影响构建与静态缓存策略，代码不涉及敏感信息。
- 若出现异常，可快速恢复 `.vercelignore` 与 `vercel.json` 的当前版本并 Redeploy。

## 我将为你执行
1. 编辑 `.vercelignore`（移除 `src/`；根据你选择的方案保留或忽略 `api/`）。
2. 更新 `vercel.json`（缓存与 functions 配置）。
3. 加入版本标识文件与显示位置。
4. 触发重新部署，并完成上线验证。