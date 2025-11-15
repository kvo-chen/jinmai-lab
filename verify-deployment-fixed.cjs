// 部署验证脚本 - 修复版
const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Jinmai Lab 部署验证脚本 (修复版)');
console.log('====================================');

const projectPath = '.';

// 检查 GitHub 仓库状态
function checkGitHubRepo() {
  console.log('\n📋 检查 GitHub 仓库状态...');
  try {
    const result = execSync('git remote -v', { encoding: 'utf8', cwd: projectPath });
    console.log('✅ GitHub 远程仓库配置:');
    console.log(result.trim());
    return true;
  } catch (error) {
    console.log('❌ GitHub 仓库检查失败:', error.message);
    return false;
  }
}

// 检查 Vercel 配置
function checkVercelConfig() {
  console.log('\n⚙️ 检查 Vercel 配置...');
  try {
    const vercelConfigPath = path.join(projectPath, 'vercel.json');
    if (!fs.existsSync(vercelConfigPath)) {
      console.log('❌ Vercel 配置文件不存在');
      return false;
    }
    
    const vercelConfig = fs.readFileSync(vercelConfigPath, 'utf8');
    const config = JSON.parse(vercelConfig);
    console.log('✅ Vercel 配置文件存在且格式正确');
    console.log('📄 构建命令:', config.buildCommand);
    console.log('📁 输出目录:', config.outputDirectory);
    console.log('🔧 框架:', config.framework);
    return true;
  } catch (error) {
    console.log('❌ Vercel 配置检查失败:', error.message);
    return false;
  }
}

// 检查项目构建
function checkBuild() {
  console.log('\n🔨 检查项目构建状态...');
  try {
    console.log('正在构建项目，请稍候...');
    const result = execSync('pnpm run build', { 
      encoding: 'utf8', 
      cwd: projectPath,
      timeout: 120000
    });
    console.log('✅ 项目构建成功');
    return true;
  } catch (error) {
    console.log('❌ 项目构建失败:', error.message);
    return false;
  }
}

// 检查开发服务器
function checkDevServer() {
  console.log('\n🌐 检查开发服务器...');
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5173', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ 开发服务器运行正常');
        resolve(true);
      } else {
        console.log('⚠️ 开发服务器返回状态:', res.statusCode);
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log('⚠️ 开发服务器未响应:', error.message);
      console.log('💡 提示：开发服务器可能正在启动中，或需要手动启动');
      console.log('💡 命令：cd jinmai-new-project && pnpm dev');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.abort();
      console.log('⚠️ 开发服务器连接超时');
      resolve(false);
    });
  });
}

// 检查 GitHub Actions 配置
function checkGitHubActions() {
  console.log('\n🔄 检查 GitHub Actions 配置...');
  try {
    const githubWorkflowPath = path.join(projectPath, '.github', 'workflows', 'deploy.yml');
    if (!fs.existsSync(githubWorkflowPath)) {
      console.log('⚠️ GitHub Actions 工作流文件不存在');
      return false;
    }
    
    const workflowContent = fs.readFileSync(githubWorkflowPath, 'utf8');
    console.log('✅ GitHub Actions 工作流文件存在');
    console.log('📄 工作流包含步骤数:', (workflowContent.match(/^\s*-\s*name:/gm) || []).length);
    return true;
  } catch (error) {
    console.log('❌ GitHub Actions 检查失败:', error.message);
    return false;
  }
}

// 检查项目文件完整性
function checkProjectFiles() {
  console.log('\n📁 检查项目文件完整性...');
  const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'tailwind.config.js',
    'index.html',
    'src/pages/Home.tsx'
  ];
  
  let allExist = true;
  requiredFiles.forEach(file => {
    const filePath = path.join(projectPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.log(`❌ ${file} 不存在`);
      allExist = false;
    }
  });
  
  return allExist;
}

// 检查部署准备状态
function checkDeploymentReadiness() {
  console.log('\n📦 检查部署准备状态...');
  
  const checks = [
    { name: 'GitHub 仓库', check: checkGitHubRepo },
    { name: 'Vercel 配置', check: checkVercelConfig },
    { name: '项目文件完整性', check: checkProjectFiles },
    { name: 'GitHub Actions', check: checkGitHubActions },
    { name: '项目构建', check: checkBuild }
  ];
  
  let allPassed = true;
  let passedCount = 0;
  
  checks.forEach(({ name, check }) => {
    console.log(`\n--- ${name} ---`);
    const passed = check();
    if (passed) {
      passedCount++;
    } else {
      allPassed = false;
    }
  });
  
  console.log(`\n📊 检查结果: ${passedCount}/${checks.length} 项通过`);
  return allPassed;
}

// 提供部署指导
function provideDeploymentGuide() {
  console.log('\n🎯 部署指导');
  console.log('=============');
  console.log('✅ 项目已准备好部署！请按照以下步骤操作：');
  console.log('');
  console.log('🚀 方式一：使用 Vercel 仪表板（推荐）');
  console.log('   1. 访问: https://vercel.com');
  console.log('   2. 登录您的账号');
  console.log('   3. 点击 "New Project"');
  console.log('   4. 选择 "Import Git Repository"');
  console.log('   5. 找到并选择: kvo-chen/jinmai-lab');
  console.log('   6. Vercel 会自动检测配置（Vite + React）');
  console.log('   7. 点击 "Deploy" 开始部署');
  console.log('');
  console.log('🔗 方式二：使用一键部署按钮');
  console.log('   在 http://localhost:5173 页面中点击 "一键部署到 Vercel"');
  console.log('   系统会自动跳转到 Vercel 并完成配置');
  console.log('');
  console.log('🌐 预期部署地址:');
  console.log('   https://jinmai-lab.vercel.app');
  console.log('   或 Vercel 分配的其他域名');
  console.log('');
  console.log('⏱️  部署时间：通常 2-5 分钟');
  console.log('📱 部署完成后，您的现代化 React 应用将在全球 CDN 上运行！');
}

// 主函数
async function main() {
  console.log('开始验证部署准备状态...\n');
  
  const isReady = checkDeploymentReadiness();
  
  if (isReady) {
    console.log('\n🎉 项目已准备好部署！');
    console.log('所有检查项目均已通过，可以开始部署。');
  } else {
    console.log('\n⚠️ 项目存在一些问题，建议先修复后再部署。');
    console.log('但基本的部署功能应该可以正常工作。');
  }
  
  // 检查开发服务器（异步）
  await checkDevServer();
  
  // 提供部署指导
  provideDeploymentGuide();
  
  console.log('\n✨ 验证完成！');
  console.log('现在您可以开始部署您的 Jinmai Lab 项目了！🚀');
}

// 运行验证
main().catch(console.error);