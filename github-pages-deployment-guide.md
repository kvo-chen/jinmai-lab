# GitHub Pages 部署指南

## 当前状态
- ✅ GitHub Actions 工作流已配置
- ✅ 构建脚本已设置
- ✅ 代码已推送到 master 分支

## 需要手动配置的步骤

### 1. 启用 GitHub Pages
1. 访问仓库设置：https://github.com/kvo-chen/jinmai-lab/settings/pages
2. 在 "Source" 部分选择 **"GitHub Actions"**
3. 点击 "Save" 保存设置

### 2. 验证部署状态
1. 访问 Actions 页面：https://github.com/kvo-chen/jinmai-lab/actions
2. 查看最新的 "Deploy to GitHub Pages" 工作流运行状态
3. 如果失败，点击查看详细日志

### 3. 访问部署后的网站
部署成功后，网站将通过以下地址访问：
**https://kvo-chen.github.io/jinmai-lab/**

## 常见问题排查

### 问题1：部署失败，显示红色状态
**可能原因：**
- GitHub Pages 未在仓库设置中启用
- 构建输出路径配置错误
- 权限配置问题

**解决方案：**
1. 确认已在仓库设置中启用 GitHub Actions 作为部署源
2. 检查工作流文件中的上传路径是否正确 (`./dist`)
3. 确认权限配置包含 `pages: write`

### 问题2：页面空白或路由错误
**可能原因：**
- SPA 路由配置问题
- 基础路径设置不正确

**解决方案：**
1. 确认 vite.config.ts 中的 base 路径设置为 `/jinmai-lab/`
2. 检查 React Router 的 basename 设置

### 问题3：构建失败
**可能原因：**
- 依赖安装失败
- 构建脚本错误

**解决方案：**
1. 检查 Actions 日志中的具体错误信息
2. 确认 package.json 中的构建脚本正确

## 成功指标
- ✅ Actions 工作流显示绿色勾号
- ✅ Pages 设置显示绿色状态
- ✅ 能够通过 https://kvo-chen.github.io/jinmai-lab/ 访问网站

## 下一步操作
请按照上述步骤1和2检查并启用 GitHub Pages，然后告诉我部署状态！