@echo off
echo 🚀 GitHub Pages 手动部署脚本
echo =========================
echo.

REM 检查是否有 dist 目录
if not exist "dist" (
    echo ❌ 未找到 dist 目录，请先运行 npm run build
    pause
    exit /b 1
)

echo 📁 找到 dist 目录，开始部署...

REM 创建临时目录
echo 🔧 创建临时目录...
if exist "temp-gh-pages" (
    rmdir /s /q temp-gh-pages
)
mkdir temp-gh-pages

REM 复制 dist 文件到临时目录
echo 📋 复制构建文件...
xcopy /s /e /y dist\* temp-gh-pages\

REM 创建 .nojekyll 文件（防止 GitHub 使用 Jekyll 处理）
echo 📝 创建 .nojekyll 文件...
echo. > temp-gh-pages\.nojekyll

REM 切换到 gh-pages 分支
echo 🔄 切换到 gh-pages 分支...
git checkout gh-pages 2>nul || git checkout -b gh-pages

REM 清空当前分支文件（保留 .git）
echo 🧹 清理分支文件...
for /f "delims=" %%i in ('git ls-files') do (
    git rm -f "%%i"
)

REM 复制临时目录文件到当前目录
echo 📤 复制文件到 gh-pages 分支...
xcopy /s /e /y temp-gh-pages\* .
copy temp-gh-pages\.nojekyll .

REM 添加文件到 Git
echo ➕ 添加文件到 Git...
git add .

REM 提交更改
echo 💾 提交更改...
git commit -m "Deploy to GitHub Pages - %date% %time%"

REM 推送分支
echo 📤 推送到 GitHub...
git push origin gh-pages

REM 切换回原分支
echo 🔙 切换回原分支...
git checkout master

REM 清理临时目录
echo 🧹 清理临时目录...
rmdir /s /q temp-gh-pages

echo ✅ 部署完成！
echo 🌐 GitHub Pages 地址：https://kvo-chen.github.io/jinmai-lab/
echo.
echo 💡 提示：你需要在 GitHub 仓库设置中启用 GitHub Pages 功能
echo    设置路径：Settings 〉 Pages 〉 Source 〉 Deploy from a branch 〉 gh-pages
echo.
pause