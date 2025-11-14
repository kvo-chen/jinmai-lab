import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { useContext } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const buildTime = (import.meta as any).env?.VITE_APP_BUILD_TIME || '';
  const commit = (import.meta as any).env?.VITE_APP_COMMIT || '';
  
  const [currentSection, setCurrentSection] = useState('attract');
  const tianjinBrands = ['泥人张','杨柳青年画','狗不理包子','桂发祥麻花','耳朵眼炸糕','果仁张','盛锡福','老美华','正兴德茶庄'];
  
  const handleLogin = () => {
    // 如果用户已经登录，直接跳转到dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }
    
    // 如果未登录，跳转到登录页面
    navigate('/login');
  };
  
  const handleRegister = () => {
    navigate('/register');
  };
  
  // const handleExplore = () => {
  //   navigate('/explore');
  // };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* 导航栏 */}
      <nav className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-red-600">津门老字号</span>
            <span className="text-xl font-bold">AI共创平台</span>
          </div>
          
           <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-red-600 transition-colors">首页</a>
            <a href="#" className="hover:text-red-600 transition-colors">探索作品</a>
            <a href="#" className="hover:text-red-600 transition-colors">创作工具</a>
            <a href="#" className="hover:text-red-600 transition-colors">关于我们</a>
            <a href="#" className="hover:text-red-600 transition-colors">文化知识库</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'} transition-colors`}
              aria-label="切换主题"
            >
              {isDark ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
            </button>
            
            {isAuthenticated ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
              >
                进入平台
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleLogin}
                  className={`px-4 py-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                >
                  登录
                </button>
                <button 
                  onClick={handleRegister}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
                >
                  注册
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* 英雄区域 */}
      <motion.section 
        className={`relative flex-1 flex flex-col justify-center items-center p-4 md:p-8 ${isDark ? 'bg-gray-800' : 'bg-gradient-to-b from-red-50 to-white'}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-600 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl"></div>
        </div>
        
        <motion.div 
          className="container mx-auto text-center relative z-10"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            用<span className="text-red-600">AI共创</span>唤醒
            <br />津门老字号文化新生
          </h1>
          
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-80">
            基于AICE互动-转化闭环框架，赋能传统文化创新，连接创意与品牌，让每一个想法都能成为可能
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <motion.button 
              onClick={() => navigate('/explore')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-all transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              探索精彩作品
            </motion.button>
            
            <motion.button 
              onClick={handleLogin}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all transform hover:scale-105 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50 shadow-lg'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              开始创作之旅
            </motion.button>
          </div>
        </motion.div>
        
        {/* 功能轮播 */}
        <motion.div 
          className="container mx-auto w-full relative z-10 mb-12"
          variants={itemVariants}
        >
          <div className="flex justify-center space-x-4 mb-8">
            {['attract', 'create', 'show', 'adopt'].map((section) => (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={`px-5 py-2 rounded-full transition-all ${
                  currentSection === section 
                    ? 'bg-red-600 text-white' 
                    : isDark 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {section === 'attract' && '吸引'}
                {section === 'create' && '共创'}
                {section === 'show' && '展示'}
                {section === 'adopt' && '采纳'}
              </button>
            ))}
          </div>
          
          <div className="bg-opacity-80 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-xl border border-opacity-20 border-gray-200">
            {currentSection === 'attract' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">用户吸引</h3>
                  <p className="mb-4 opacity-80">
                    通过AI驱动的个性化推荐和丰富的文化内容，吸引用户参与平台创作，
                    激发青年群体对传统文化的兴趣与热爱。
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      个性化内容推荐
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      传统文化故事化呈现
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      互动式文化体验
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-1/2">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Users%20gathering%20at%20cultural%20event%20with%20AI%20technology%2C%20vibrant%20colors%2C%20modern%20digital%20interface&sign=f850aaa822bf3757405d8734269334f0" 
                    alt="用户吸引" 
                    className="rounded-xl shadow-lg w-full h-64 object-cover"
                  />
                </div>
              </motion.div>
            )}
            
            {currentSection === 'create' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">AI共创</h3>
                  <p className="mb-4 opacity-80">
                    提供低门槛的AI创作工具，帮助用户轻松将传统文化元素融入现代设计，
                    实现文化与创意的完美结合。
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      一键国潮设计生成
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      老字号素材库
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      实时文化溯源提示
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-1/2">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Designer%20using%20AI%20creation%20tools%20to%20blend%20traditional%20Chinese%20cultural%20elements%20with%20modern%20design&sign=f3acdac943baa3b5e5d4a7d421dcdfda" 
                    alt="AI共创" 
                    className="rounded-xl shadow-lg w-full h-64 object-cover"
                  />
                </div>
              </motion.div>
            )}
            
            {currentSection === 'show' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">作品展示</h3>
                  <p className="mb-4 opacity-80">
                    搭建多元化的作品展示平台，让优秀创作得到更多曝光和反馈，
                    形成活跃的创作者社区生态。
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      作品展示与点赞评论
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      创作者排行榜
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      创作者交流社区
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-1/2">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Gallery%20showcase%20of%20creative%20works%20with%20digital%20displays%2C%20community%20engagement%2C%20modern%20exhibition%20space&sign=847d3f2f59df00fc3e72e5741cdee3f9" 
                    alt="作品展示" 
                    className="rounded-xl shadow-lg w-full h-64 object-cover"
                  />
                </div>
              </motion.div>
            )}
            
            {currentSection === 'adopt' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">战略采纳</h3>
                  <p className="mb-4 opacity-80">
                    建立完善的作品评选和商业化落地机制，
                    推动优秀创意转化为实际商业价值，实现品牌与创作者的共赢。
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      优秀作品评选流程
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      品牌商业化对接
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      青年创意官认证
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-1/2">
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Business%20meeting%20about%20adopting%20creative%20works%20for%20commercialization%2C%20successful%20collaboration%20between%20brands%20and%20creators&sign=a42fe290cbff9f0744d30d8fff2c3a56" 
                    alt="战略采纳" 
                    className="rounded-xl shadow-lg w-full h-64 object-cover"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* 合作品牌 */}
        <motion.div 
          className="container mx-auto w-full relative z-10 mb-12"
          variants={itemVariants}
        >
          <h3 className="text-center text-lg mb-6 opacity-70">合作津门老字号品牌</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {tianjinBrands.map((name) => (
              <div 
                key={name} 
                className={`w-24 h-12 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <span className="text-lg font-bold opacity-60">{name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>
      
      {/* 页脚 */}
      <footer className={`border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} py-12 px-4`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold text-red-600">津门老字号</span>
                <span className="text-xl font-bold">AI共创平台</span>
              </div>
              <p className="opacity-70 mb-4">赋能老字号品牌年轻化转型，连接传统与创新</p>
              <div className="flex space-x-4">
                {['weibo', 'wechat', 'instagram', 'twitter'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className={`text-lg opacity-70 hover:opacity-100 transition-opacity ${
                      social === 'weibo' ? 'text-red-500' : 
                      social === 'wechat' ? 'text-green-500' : 
                      social === 'instagram' ? 'text-pink-500' : 'text-blue-500'
                    }`}
                  >
                    <i className={`fab fa-${social}`}></i>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">平台功能</h4>
              <ul className="space-y-2 opacity-70">
                <li><a href="#" className="hover:text-red-600 transition-colors">AI创作工具</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">作品展示</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">创作者社区</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">品牌合作</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">资源中心</h4>
              <ul className="space-y-2 opacity-70">
                <li><a href="#" className="hover:text-red-600 transition-colors">创作教程</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">文化知识库</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">版权说明</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">常见问题</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">联系我们</h4>
              <ul className="space-y-2 opacity-70">
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2"></i>
                  <a href="mailto:contact@aicreate.com" className="hover:text-red-600 transition-colors">contact@aicreate.com</a>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone mr-2"></i>
                  <span>400-123-4567</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  <span>北京市海淀区中关村大街</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="opacity-60 mb-4 md:mb-0">© 2025 津门老字号AI共创平台. 保留所有权利</p>
            <div className="flex space-x-6 opacity-60">
              <a href="#" className="hover:opacity-100 transition-opacity">隐私政策</a>
              <a href="#" className="hover:opacity-100 transition-opacity">服务条款</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Cookie政策</a>
            </div>
            <div className="mt-4 md:mt-0 text-xs opacity-60">
              <span>版本标识 {commit ? String(commit).slice(0,7) : 'dev'} • {buildTime || '未设置'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
