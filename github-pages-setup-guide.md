# GitHub Pages 设置指南

## 🔍 当前状态分析

从 GitHub 仓库页面可以看到 "状态: 隐藏 GitHub Pages 部署"，这表明：

1. **GitHub Pages 功能未启用** - 需要在仓库设置中手动启用
2. **分支配置不正确** - 需要正确设置发布源
3. **工作流可能需要手动触发**

## 🛠️ 解决方案

### 方法 1：启用 GitHub Pages 功能

1. **访问仓库设置**
   - 打开：https://github.com/kvo-chen/jinmai-lab/settings
   - 或者点击仓库页面的 "设置" 标签

2. **找到 GitHub Pages 设置**
   - 在左侧菜单中找到 "Pages" 选项
   - 点击进入 GitHub Pages 设置页面

3. **配置发布源**
   - 在 "Source" 部分选择 "Deploy from a branch"
   - 选择 "gh-pages" 分支（如果存在）
   - 或者选择 "GitHub Actions"（推荐）

4. **保存设置**
   - 点击 "Save" 按钮

### 方法 2：手动部署（推荐）

如果 GitHub Actions 仍然失败，可以使用手动部署：

1. **构建项目**
   ```bash
   npm run build
   ```

2. **运行手动部署脚本**
   ```bash
   # Windows
   deploy-gh-pages-manual.bat
   
   # Linux/Mac
   bash deploy-gh-pages-manual.sh
   ```

3. **在 GitHub 设置中启用**
   - 前往 Settings > Pages
   - 选择 "Deploy from a branch"
   - 选择 "gh-pages" 分支
   - 点击 Save

### 方法 3：检查工作流权限

确保工作流有足够的权限：

1. **检查仓库设置**
   - Settings > Actions > General
   - 确保 "Workflow permissions" 设置为 "Read and write permissions"

2. **检查分支保护**
   - Settings > Branches
   - 确保没有阻止 GitHub Actions 推送的保护规则

## 📋 验证步骤

完成设置后，验证部署是否成功：

1. **检查 Actions 状态**
   - 访问：https://github.com/kvo-chen/jinmai-lab/actions
   - 查看最新的工作流运行状态

2. **检查 Pages 设置**
   - 访问：https://github.com/kvo-chen/jinmai-lab/settings/pages
   - 查看部署状态

3. **访问站点**
   - 最终地址：https://kvo-chen.github.io/jinmai-lab/

## 🚨 常见问题

### 问题 1：404 错误
- **原因**：GitHub Pages 需要几分钟时间来部署
- **解决**：等待 5-10 分钟后刷新

### 问题 2：空白页面
- **原因**：基础路径配置错误
- **解决**：检查 `vite.config.ts` 中的 `base: '/jinmai-lab/'`

### 问题 3：资源加载失败
- **原因**：构建输出路径不正确
- **解决**：确保构建输出到 `dist` 目录

## 🎯 下一步操作

1. **立即尝试**：运行手动部署脚本
2. **检查设置**：确认 GitHub Pages 已启用
3. **验证结果**：访问部署地址

如果仍然有问题，请告诉我具体的错误信息，我会继续帮你解决！