// 部署验证脚本
const https = require('https');
const { execSync } = require('child_process');

console.log('🚀 Jinmai Lab 部署验证脚本');
console.log('==========================');

// 检查 GitHub 仓库状态
function checkGitHubRepo() {
  console.log('\n📋 检查 GitHub 仓库状态...');
  try {
    const result = execSync('git remote -v', { encoding: 'utf8', cwd: 'c:/Users/Chen sheng hui/Desktop/jinmai-new-project' });
    console.log('✅ GitHub 远程仓库配置:');
    console.log(result);
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
    const fs = require('fs');
    const vercelConfig = fs.readFileSync('c:/Users/Chen sheng hui/Desktop/jinmai-new-project/vercel.json', 'utf8');
    const config = JSON.parse(vercelConfig);
    console.log('✅ Vercel 配置文件存在');
    console.log('📄 配置内容:', JSON.stringify(config, null, 2));
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
    const result = execSync('pnpm run build', { 
      encoding: 'utf8', 
      cwd: 'c:/Users/Chen sheng hui/Desktop/jinmai-new-project',
      timeout: 60000
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
    const req = https.get('http://localhost:5173', (res) => {
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
      console.log('💡 提示：请确保开发服务器正在运行');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      req.abort();
      console.log('⚠️ 开发服务器连接超时');
      resolve(false);
    });
  });
}

// 检查部署准备状态
function checkDeploymentReadiness() {
  console.log('\n📦 检查部署准备状态...');
  
  const checks = [
    { name: 'GitHub 仓库', check: checkGitHubRepo },
    { name: 'Vercel 配置', check: checkVercelConfig },
    { name: '项目构建', check: checkBuild }
  ];
  
  let allPassed = true;
  
  checks.forEach(({ name, check }) => {
    const passed = check();
    if (!passed) allPassed = false;
  });
  
  return allPassed;
}

// 提供部署指导
function provideDeploymentGuide() {
  console.log('\n🎯 部署指导');
  console.log('=============');
  console.log('1. 访问: https://vercel.com');
  console.log('2. 点击 "New Project"');
  console.log('3. 导入 GitHub 仓库: kvo-chen/jinmai-lab');
  console.log('4. Vercel 会自动检测配置');
  console.log('5. 点击 "Deploy" 开始部署');
  console.log('');
  console.log('🌐 预期部署地址:');
  console.log('   https://jinmai-lab.vercel.app');
  console.log('   或 Vercel 分配的其他域名');
  console.log('');
  console.log('📱 一键部署按钮:');
  console.log('   在 http://localhost:5173 页面中点击 "一键部署到 Vercel"');
}

// 主函数
async function main() {
  console.log('开始验证部署准备状态...\n');
  
  const isReady = checkDeploymentReadiness();
  
  if (isReady) {
    console.log('\n🎉 项目已准备好部署！');
    console.log('所有检查项目均已通过。');
  } else {
    console.log('\n⚠️ 项目存在一些问题，建议先修复后再部署。');
  }
  
  // 检查开发服务器（异步）
  await checkDevServer();
  
  // 提供部署指导
  provideDeploymentGuide();
  
  console.log('\n✨ 验证完成！');
}

// 运行验证
main().catch(console.error);