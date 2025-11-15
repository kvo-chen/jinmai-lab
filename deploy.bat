@echo off
chcp 65001 >nul

:: 金麦实验室一键部署脚本
:: Windows 版本

echo.
echo 🚀 金麦实验室一键部署脚本
echo ============================
echo.

:: 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    pause
    exit /b 1
)

:: 检查 npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm 未安装，请先安装 npm
    pause
    exit /b 1
)

echo ✅ 依赖环境检查通过
echo.

:menu
echo 📋 请选择部署方式：
echo.
echo 1️⃣  Vercel 一键部署（推荐）
echo 2️⃣  Netlify 拖拽部署
echo 3️⃣  GitHub Pages 设置
echo 4️⃣  本地预览
echo 5️⃣  构建项目
echo 6️⃣  全部尝试一遍
echo 0️⃣  退出
echo.
set /p choice=请输入选项编号 (0-6): 

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto deploy_netlify
if "%choice%"=="3" goto deploy_github_pages
if "%choice%"=="4" goto local_preview
if "%choice%"=="5" goto build_project
if "%choice%"=="6" goto deploy_all
if "%choice%"=="0" goto exit

echo ❌ 无效选项，请重新输入
echo.
goto menu

:build_project
echo 🔨 构建项目...

if exist "dist" (
    echo 🧹 清理旧的构建文件...
    rmdir /s /q dist
)

call npm run build
if %errorlevel% neq 0 (
    echo ❌ 项目构建失败！
    pause
    goto menu
)

echo ✅ 项目构建成功！
echo.
pause
goto menu

:deploy_vercel
echo ⚡ 准备 Vercel 部署...
echo 🌐 部署链接：https://vercel.com/new/clone?repository-url=https://github.com/kvo-chen/jinmai-lab
echo.
echo ✅ 正在打开 Vercel 部署页面...
start https://vercel.com/new/clone?repository-url=https://github.com/kvo-chen/jinmai-lab
echo.
echo 📋 步骤：登录 → 选择仓库 → 点击 Deploy
echo.
pause
goto menu

:deploy_netlify
echo 📁 准备 Netlify 部署...
echo 🌐 部署链接：https://app.netlify.com/drop
echo.
echo ✅ 正在打开 Netlify 部署页面...
start https://app.netlify.com/drop
echo.
echo 📋 步骤：拖拽 dist 文件夹到网页上
echo.
echo ⚠️  请先确保已经构建了项目（选项5）
echo.
pause
goto menu

:deploy_github_pages
echo 🐙 准备 GitHub Pages 部署...
echo 🌐 设置链接：https://github.com/kvo-chen/jinmai-lab/settings/pages
echo.
echo ✅ 正在打开 GitHub Pages 设置页面...
start https://github.com/kvo-chen/jinmai-lab/settings/pages
echo.
echo ⚠️  注意：GitHub Pages 对私有仓库需要付费计划
echo 📋 步骤：选择部署源 → 保存设置
echo.
pause
goto menu

:local_preview
echo 👀 启动本地预览服务器...
echo 🌐 预览地址：http://localhost:3000
echo.
echo ✅ 运行命令：npm run preview
echo ⚠️  按 Ctrl+C 停止服务器
echo.
call npm run preview
goto menu

:deploy_all
echo 🎯 执行全部部署方案...
echo.
echo 🔨 首先构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败，无法继续
    pause
    goto menu
)

echo ✅ 项目构建成功！
echo.
echo ⚡ 打开 Vercel 部署页面...
start https://vercel.com/new/clone?repository-url=https://github.com/kvo-chen/jinmai-lab
echo.
echo 📁 打开 Netlify 部署页面...
start https://app.netlify.com/drop
echo.
echo 🐙 打开 GitHub Pages 设置页面...
start https://github.com/kvo-chen/jinmai-lab/settings/pages
echo.
echo ✅ 所有部署页面已打开！请选择最适合的方案。
echo.
pause
goto menu

:exit
echo.
echo 👋 感谢使用金麦实验室部署脚本！
echo 🎉 祝你部署顺利！
echo.
pause
exit /b 0