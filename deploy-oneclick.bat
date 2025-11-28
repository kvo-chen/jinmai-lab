@echo off
echo ========================================
echo 津门老字号AI共创坊 - 一键部署工具
echo ========================================
echo.

:: 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: Node.js 未安装，请先安装Node.js
    pause
    exit /b 1
)

:: 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: npm 未安装
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.

:: 设置变量
set DOMAIN=jinmai-lab.tech
set VERSION=%date:~0,4%-%date:~5,2%-%date:~8,2%-%time:~0,2%%time:~3,2%%time:~6,2%

echo 📋 部署信息:
echo    域名: %DOMAIN%
echo    版本: %VERSION%
echo.

:: 清理旧的构建
echo 🧹 清理旧的构建...
if exist dist rd /s /q dist
if exist deploy rd /s /q deploy

:: 安装依赖
echo 📦 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

:: 构建项目
echo 🔨 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

echo ✅ 构建成功
echo.

:: 准备部署文件
echo 📁 准备部署文件...
mkdir deploy
copy dist\* deploy\ /y

:: 创建CNAME文件
echo %DOMAIN% > deploy\CNAME

:: 创建版本信息
echo 版本: %VERSION% > deploy\VERSION.txt
echo 构建时间: %date% %time% >> deploy\VERSION.txt
echo 域名: %DOMAIN% >> deploy\VERSION.txt

:: 增强index.html
echo 🔧 增强index.html...
powershell -Command "
$indexPath = 'deploy\index.html'
$content = Get-Content $indexPath -Raw

# 添加缓存清除
$cacheHeaders = '    <meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\" />'`n' +
                '    <meta http-equiv=\"Pragma\" content=\"no-cache\" />'`n' +
                '    <meta http-equiv=\"Expires\" content=\"0\" />'`n +
                '    <meta name=\"version\" content=\"' + '%VERSION%' + '\" />'`n +
                '    <meta name=\"build-time\" content=\"' + '%date% %time%' + '\" />'`n

$content = $content -replace '<meta name=\"viewport\" content=\"[^\"]*\" />', '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />'`n + $cacheHeaders

# 使用相对路径
$content = $content -replace 'https://[^/]*/assets/', './assets/'
$content = $content -replace 'href=\"/vite.svg\"', 'href=\"./vite.svg\"'

$content | Set-Content $indexPath -Encoding UTF8
"

:: 创建部署说明
echo # 津门老字号AI共创坊 - 部署包 > deploy\DEPLOYMENT_GUIDE.txt
echo. >> deploy\DEPLOYMENT_GUIDE.txt
echo 版本: %VERSION% >> deploy\DEPLOYMENT_GUIDE.txt
echo 构建时间: %date% %time% >> deploy\DEPLOYMENT_GUIDE.txt
echo. >> deploy\DEPLOYMENT_GUIDE.txt
echo ## 部署步骤: >> deploy\DEPLOYMENT_GUIDE.txt
echo 1. 上传deploy文件夹中的所有文件到服务器 >> deploy\DEPLOYMENT_GUIDE.txt
echo 2. 确保域名 %DOMAIN% 指向正确目录 >> deploy\DEPLOYMENT_GUIDE.txt
echo 3. 清除浏览器缓存后访问 https://%DOMAIN% >> deploy\DEPLOYMENT_GUIDE.txt
echo. >> deploy\DEPLOYMENT_GUIDE.txt
echo ## 验证方法: >> deploy\DEPLOYMENT_GUIDE.txt
echo - 查看页面源代码中的版本meta标签 >> deploy\DEPLOYMENT_GUIDE.txt
echo - 检查浏览器控制台是否还有错误 >> deploy\DEPLOYMENT_GUIDE.txt
echo - 确认加载的是最新的JS文件 >> deploy\DEPLOYMENT_GUIDE.txt

:: 显示文件列表
echo.
echo 📊 部署文件列表:
dir deploy\*.* /b

:: 统计文件数量
echo.
dir deploy\*.* /s /b | find /c ":\" > temp_count.txt
set /p FILE_COUNT=<temp_count.txt
del temp_count.txt

echo 总计文件数量: %FILE_COUNT%
echo.

echo ========================================
echo 🎉 部署包准备完成！
echo ========================================
echo.
echo 📁 部署文件位置: .\deploy\
echo 🌐 访问地址: https://%DOMAIN%
echo.
echo ⚠️  重要提醒:
echo    1. 完全删除服务器上的旧文件
echo    2. 上传deploy文件夹中的所有文件
echo    3. 使用Ctrl+F5强制刷新浏览器
echo    4. 建议使用无痕模式测试
echo.
echo 🔍 验证方法:
echo    - 查看页面源代码中的版本meta标签
echo    - 检查控制台是否还有TypeError错误
echo    - 确认加载的是index-4037e6e7.js文件
echo.
pause