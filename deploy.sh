#!/bin/bash

# 金麦实验室一键部署脚本
# 支持多种部署方式

set -e

echo "🚀 金麦实验室一键部署脚本"
echo "==========================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数定义
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 检查依赖
check_dependencies() {
    print_info "检查依赖环境..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装，请先安装 npm"
        exit 1
    fi
    
    print_success "依赖环境检查通过"
}

# 构建项目
build_project() {
    print_info "构建项目..."
    
    if [ -d "dist" ]; then
        print_info "清理旧的构建文件..."
        rm -rf dist
    fi
    
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "项目构建成功！"
    else
        print_error "项目构建失败！"
        exit 1
    fi
}

# Vercel 部署
deploy_vercel() {
    print_info "准备 Vercel 部署..."
    print_info "部署链接：https://vercel.com/new/clone?repository-url=https://github.com/kvo-chen/jinmai-lab"
    
    if command -v open &> /dev/null; then
        open "https://vercel.com/new/clone?repository-url=https://github.com/kvo-chen/jinmai-lab"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://vercel.com/new/clone?repository-url=https://github.com/kvo-chen/jinmai-lab"
    else
        print_info "请手动访问：https://vercel.com/new/clone?repository-url=https://github.com/kvo-chen/jinmai-lab"
    fi
    
    print_success "Vercel 部署页面已打开！"
}

# Netlify 部署
deploy_netlify() {
    print_info "准备 Netlify 部署..."
    print_info "部署链接：https://app.netlify.com/drop"
    
    if command -v open &> /dev/null; then
        open "https://app.netlify.com/drop"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://app.netlify.com/drop"
    else
        print_info "请手动访问：https://app.netlify.com/drop"
    fi
    
    print_info "请拖拽 dist 文件夹到网页上进行部署"
    print_success "Netlify 部署页面已打开！"
}

# GitHub Pages 部署
deploy_github_pages() {
    print_info "准备 GitHub Pages 部署..."
    print_info "部署链接：https://github.com/kvo-chen/jinmai-lab/settings/pages"
    
    if command -v open &> /dev/null; then
        open "https://github.com/kvo-chen/jinmai-lab/settings/pages"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://github.com/kvo-chen/jinmai-lab/settings/pages"
    else
        print_info "请手动访问：https://github.com/kvo-chen/jinmai-lab/settings/pages"
    fi
    
    print_warning "GitHub Pages 对私有仓库需要付费计划"
    print_success "GitHub Pages 设置页面已打开！"
}

# 本地预览
local_preview() {
    print_info "启动本地预览服务器..."
    
    if command -v npm &> /dev/null; then
        print_info "运行命令：npm run preview"
        print_success "本地预览地址：http://localhost:3000"
        print_info "按 Ctrl+C 停止服务器"
        npm run preview
    else
        print_error "npm 未找到，无法启动本地预览"
        exit 1
    fi
}

# 显示菜单
show_menu() {
    echo ""
    echo "📋 请选择部署方式："
    echo ""
    echo "1️⃣  Vercel 一键部署（推荐）"
    echo "2️⃣  Netlify 拖拽部署"
    echo "3️⃣  GitHub Pages 设置"
    echo "4️⃣  本地预览"
    echo "5️⃣  构建项目"
    echo "6️⃣  全部尝试一遍"
    echo "0️⃣  退出"
    echo ""
    read -p "请输入选项编号 (0-6): " choice
    
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_github_pages
            ;;
        4)
            local_preview
            ;;
        5)
            build_project
            ;;
        6)
            print_info "执行全部部署方案..."
            build_project
            deploy_vercel
            print_info "等待30秒后打开 Netlify..."
            sleep 30
            deploy_netlify
            ;;
        0)
            print_info "感谢使用金麦实验室部署脚本！"
            exit 0
            ;;
        *)
            print_error "无效选项，请重新输入"
            show_menu
            ;;
    esac
}

# 主函数
main() {
    print_success "🎉 欢迎使用金麦实验室一键部署脚本！"
    echo ""
    print_info "这个脚本将帮助你轻松部署项目到各种平台"
    print_info "所有部署方式都是完全免费的！"
    echo ""
    
    # 检查依赖
    check_dependencies
    
    # 显示菜单
    show_menu
}

# 如果直接运行脚本
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi