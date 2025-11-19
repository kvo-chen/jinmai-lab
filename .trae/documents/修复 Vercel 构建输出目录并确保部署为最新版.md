## 问题定位
- Vercel 提示“构建完成后未找到名为 `dist` 的输出目录”，而当前项目的实际产物为 `dist/static`（`package.json:scripts` 指定）。
- 日志中出现 Next.js 相关 ESLint 提示，说明 Vercel 可能将项目当作 Next.js 或其他预设，未正确识别 Vite 配置，导致输出目录期望错误。

## 修复思路
- 在 `vercel.json` 明确设置构建命令与输出目录：
  - `buildCommand`: `pnpm build`
  - `outputDirectory`: `dist/static`
- 保留现有 `rewrites` 与首页 `Cache-Control: no-cache`，以便消除 CDN/browser 缓存影响。
- 如短期内只部署静态前端，去除 `.vercelignore` 中的 `!api/server.js`，完全忽略 `api/`，避免 Vercel 将项目识别为需要 Serverless/Next。

## 具体修改（最小必要变更）
1. 更新 `vercel.json`：
   - 添加：
     ```json
     {
       "buildCommand": "pnpm build",
       "outputDirectory": "dist/static"
     }
     ```
   - 保留：
     - `rewrites`: `/api/(.*)` → `/api/$1`；`/(.*)` → `/static/$1`
     - `headers`：`/` 设置 `Cache-Control: no-cache`
2. （可选）更新 `.vercelignore`：
   - 仅静态：删除 `!api/server.js`，确保 `api/` 整体被忽略
   - 需要 Serverless：保留 `!api/server.js`，且确保没有 `server.mjs/server.ts` 冲突文件

## 部署与验证
- 在 Vercel 控制台 → 项目 → Deploys → 选择最近一次 → 点击 `Redeploy`，选择 `Rebuild without cache`。
- 验证：
  - 访问 `https://jinmai-lab.tech/?v=<timestamp>`，确认首页加载最新内容
  - 管理员登录自动跳转 `/admin`
  - 后台四个功能页均正常展示
  - 响应头首次 `X-Vercel-Cache: MISS`，随后 `HIT`

## 结果与回滚
- 变更仅影响构建配置与缓存，不会影响业务逻辑；若出现异常，可移除新增字段并再次 `Redeploy`。

## 我将为你执行
1. 修改 `vercel.json`（添加 `buildCommand` 与 `outputDirectory`）。
2. （按你的需求）更新 `.vercelignore` 是否完全忽略 `api/`。
3. 触发 `Rebuild without cache` 并完成上线验证。