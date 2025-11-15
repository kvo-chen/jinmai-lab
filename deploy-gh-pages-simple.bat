@echo off
echo 🚀 GitHub Pages 简易部署脚本
echo =========================
echo.
echo 📋 步骤说明：
echo 1. 构建项目
echo 2. 创建 gh-pages 分支
echo 3. 部署到 GitHub Pages
echo.

REM 步骤1：构建项目
echo 🔨 正在构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败！
    pause
    exit /b 1
)

REM 步骤2：备份构建文件
echo 📁 备份构建文件...
if exist dist-backup (
    rmdir /s /q dist-backup
)
move dist dist-backup

REM 步骤3：切换到 gh-pages 分支
echo 🔄 切换到 gh-pages 分支...
git checkout gh-pages 2>nul || git checkout -b gh-pages

REM 步骤4：清空当前分支文件（保留 .git）
echo 🧹 清理分支文件...
for /f %%i in ('git ls-files') do (
    if not "%%i"==".git" (
        git rm -f "%%i"
    )
)

REM 步骤5：复制构建文件
echo 📋 复制构建文件...
move dist-backup dist

REM 步骤6：添加文件到 Git
echo ➕ 添加文件到 Git...
git add .

REM 步骤7：提交更改
echo 💾 提交更改...
git commit -m "Deploy to GitHub Pages - %date% %time%"

REM 步骤8：推送分支
echo 📤 推送到 GitHub...
git push origin gh-pages

REM 步骤9：切换回原分支
echo 🔙 切换回原分支...
git checkout master

echo ✅ 部署完成！
echo 🌐 GitHub Pages 地址：https://kvo-chen.github.io/jinmai-lab/
echo.
pause