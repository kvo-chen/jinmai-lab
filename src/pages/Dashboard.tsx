import { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
// import { cn } from '@/lib/utils';
import CreatorProfile from '../components/CreatorProfile';
import AchievementBadge from '../components/AchievementBadge';

// 模拟数据
const performanceData = [
  { name: '1月', views: 4000, likes: 2400, comments: 240 },
  { name: '2月', views: 3000, likes: 1398, comments: 221 },
  { name: '3月', views: 2000, likes: 9800, comments: 229 },
  { name: '4月', views: 2780, likes: 3908, comments: 200 },
  { name: '5月', views: 1890, likes: 4800, comments: 218 },
  { name: '6月', views: 2390, likes: 3800, comments: 250 },
];

const recentWorks = [
  {
    id: 1,
    title: '国潮插画设计',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese%20traditional%20cultural%20illustration%20design&sign=ef81eab81afa3537e2d4f14a16c69a4a',
    status: '已发布',
    views: 1245,
    likes: 324,
    date: '2025-11-10',
    copyrightCertified: true
  },
  {
    id: 2,
    title: '老字号包装设计',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20brand%20packaging%20design&sign=dca6965552da643d65881fd89450c173',
    status: '审核中',
    views: 0,
    likes: 0,
    date: '2025-11-09',
    copyrightCertified: false
  },
  {
    id: 3,
    title: '传统纹样AI创作',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20generated%20traditional%20Chinese%20patterns&sign=fce8e5a1e3cd0f91df54d42962b85a16',
    status: '草稿',
    views: 0,
    likes: 0,
    date: '2025-11-08',
    copyrightCertified: false
  },
];

// 创作者等级和成就数据
const creatorData = {
  level: '新锐创作者',
  levelProgress: 65,
  points: 1250,
  achievements: [
    { id: 1, name: '首篇创作', description: '完成第一篇作品', icon: 'star' },
    { id: 2, name: '活跃创作者', description: '连续7天登录平台', icon: 'fire' },
    { id: 3, name: '人气王', description: '获得100个点赞', icon: 'thumbs-up' },
    { id: 4, name: '文化传播者', description: '使用5种不同文化元素', icon: 'book' },
  ],
  availableRewards: [
    { id: 1, name: '高级素材包', description: '解锁20个高级文化素材', requirement: '完成5篇作品' },
    { id: 2, name: '优先审核权', description: '作品审核时间缩短50%', requirement: '完成10篇作品' },
    { id: 3, name: '专属AI模型', description: '获得专属AI训练模型', requirement: '完成20篇作品' },
  ],
  tasks: [
    { id: 1, title: '完成新手引导', status: 'completed' as const, reward: '50积分' },
    { id: 2, title: '发布第一篇作品', status: 'completed' as const, reward: '100积分 + 素材包' },
    { id: 3, title: '邀请一位好友', status: 'pending' as const, reward: '150积分' },
    { id: 4, title: '参与一次主题活动', status: 'pending' as const, reward: '200积分' },
  ],
  commercialApplications: [
    { id: 1, title: '国潮插画设计', brand: '老字号品牌A', status: '洽谈中', date: '2025-11-11' },
    { id: 2, title: '传统纹样创新', brand: '老字号品牌B', status: '已采纳', date: '2025-11-05', revenue: '¥1,200' },
  ]
};

export default function Dashboard() {
  const { isDark } = useTheme();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatorProfile, setShowCreatorProfile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 检查是否已登录
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    } else {
      // 模拟加载数据
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  }, [isAuthenticated, user, navigate]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleLogout = () => {
    logout();
    toast.success('已成功登出');
    navigate('/login');
  };
  
  const handleCreateNew = () => {
    navigate('/create');
  };

  const handleViewWork = (workId: number) => {
    navigate(`/works/${workId}`);
  };

  const handleSocialNavigation = (section: string) => {
    trackEvent('social_navigation', {
      section: section,
      user_id: user?.id,
      timestamp: new Date().toISOString()
    });
  };

  const handleCommentClick = (workId: number) => {
    trackEvent('comment_button_click', {
      work_id: workId,
      user_id: user?.id,
      location: 'dashboard_recent_works',
      timestamp: new Date().toISOString()
    });
    navigate(`/works/${workId}#comments`);
  };
  
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>加载中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="text-xl font-bold text-red-600">AI</span>
            <span className="text-xl font-bold">共创</span>
            {typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development' && localStorage.getItem('analytics_dev_enable') !== 'true' && (
              <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>开发模式：埋点已关闭</span>
            )}
          </div>
          
           <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-red-600 font-medium">控制台</Link>
            <Link to="/create" className="hover:text-red-600 transition-colors">创作工具</Link>
            <Link to="/works" className="hover:text-red-600 transition-colors">作品管理</Link>
            <Link 
              to="/social" 
              onClick={() => handleSocialNavigation('nav_social_feed')}
              className="hover:text-red-600 transition-colors"
            >
              社交动态
            </Link>
            <Link 
              to="/user-relationships/following" 
              onClick={() => handleSocialNavigation('nav_user_relationships')}
              className="hover:text-red-600 transition-colors"
            >
              关注管理
            </Link>
            <Link to="/social" className="hover:text-red-600 transition-colors">社区</Link>
            <Link to="/knowledge" className="hover:text-red-600 transition-colors">帮助</Link>
            <Link to="/knowledge" className="hover:text-red-600 transition-colors">文化知识库</Link>
            {isAuthenticated && user?.isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
              >
                后台管理
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className={`p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors relative`}
              aria-label="通知"
            >
              <i className="far fa-bell"></i>
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative group" ref={dropdownRef}>
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={toggleDropdown}
              >
                <img 
                  src={user?.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar&sign=f1f81b57b203e2aa336aa3ec3f6e3f7f'} 
                  alt={user?.username || '用户头像'} 
                  className="h-8 w-8 rounded-full object-cover border border-gray-300"
                />
                <span className="hidden md:inline font-medium">{user?.username}</span>
                <AchievementBadge level={creatorData.level} />
                <i className={`fas fa-chevron-down text-xs opacity-70 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </div>
              
              <div className={`absolute right-0 mt-2 w-48 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg py-2 z-50 transition-all duration-200 ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <Link 
                  to="/social" 
                  onClick={() => {
                    handleSocialNavigation('dropdown_social_feed');
                    setIsDropdownOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
                >
                  <i className="fas fa-stream mr-2"></i>社交动态
                </Link>
                <Link 
                  to="/user-relationships/following" 
                  onClick={() => {
                    handleSocialNavigation('dropdown_user_relationships');
                    setIsDropdownOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
                >
                  <i className="fas fa-users mr-2"></i>关注管理
                </Link>
                <a href="#" className={`block px-4 py-2 text-sm hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}>
                  <i className="far fa-user mr-2"></i>个人资料
                </a>
                <a href="#" className={`block px-4 py-2 text-sm hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}>
                  <i className="fas fa-trophy mr-2"></i>我的成就
                </a>
                <a href="#" className={`block px-4 py-2 text-sm hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}>
                  <i className="fas fa-cog mr-2"></i>设置
                </a>
                <div className={`my-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} h-px`}></div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm text-red-600 hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* 主内容 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 欢迎区域 */}
        <motion.div 
          className={`mb-8 p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">欢迎回来，{user?.username}！</h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                今天是个创作的好日子，您有 <span className="text-red-600 font-medium">3</span> 个作品待完成
              </p>
              <div className="flex space-x-3 mt-3">
                <Link 
                  to="/social" 
                  onClick={() => handleSocialNavigation('social_feed')}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                >
                  <i className="fas fa-stream mr-1"></i>
                  查看社交动态
                </Link>
                <Link 
                  to="/user-relationships/following" 
                  onClick={() => handleSocialNavigation('user_relationships')}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                >
                  <i className="fas fa-users mr-1"></i>
                  管理关注
                </Link>
              </div>
            </div>
            
            <motion.button
              onClick={handleCreateNew}
              className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <i className="fas fa-plus mr-2"></i>
              开始创作
            </motion.button>
          </div>
        </motion.div>
        
        {/* 创作者信息卡片 */}
        <motion.div 
          className={`mb-8 p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <img 
                src={user?.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar&sign=f1f81b57b203e2aa336aa3ec3f6e3f7f'} 
                alt={user?.username || '用户头像'} 
                className="w-24 h-24 rounded-full object-cover border-4 border-red-600"
              />
              <div className="absolute -bottom-2 -right-2 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
                {creatorData.levelProgress}%
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold mb-1">{user?.username}</h2>
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full mr-2">
                      {creatorData.level}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {creatorData.points} 积分
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowCreatorProfile(!showCreatorProfile)}
                  className={`mt-3 md:mt-0 px-4 py-2 rounded-lg ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors text-sm`}
                >
                  {showCreatorProfile ? '收起详情' : '查看创作者详情'}
                </button>
              </div>
              
              {/* 等级进度条 */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>新锐创作者</span>
                  <span>资深创作者 (1500积分)</span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-red-600"
                    style={{ width: `${creatorData.levelProgress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* 成就徽章 */}
              <div className="flex flex-wrap gap-3">
                {creatorData.achievements.slice(0, 4).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <i className={`fas fa-${achievement.icon} mr-1.5 text-yellow-500`}></i>
                    <span>{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 创作者详情展开区域 */}
          {showCreatorProfile && (
            <CreatorProfile 
              creatorData={creatorData}
              isDark={isDark}
            />
          )}
        </motion.div>
        
        {/* 数据概览 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[
            { title: '总浏览量', value: '12,458', icon: 'eye', color: 'blue' },
            { title: '获赞总数', value: '3,245', icon: 'thumbs-up', color: 'red' },
            { title: '作品总数', value: '28', icon: 'image', color: 'green' },
            { title: '关注数', value: '156', icon: 'user-plus', color: 'purple' },
            { title: '粉丝数', value: '89', icon: 'users', color: 'orange' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
                  <i className={`far fa-${stat.icon} text-xl`}></i>
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-green-500 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>12.5%
                </span>
                <span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>较上月</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* 图表和最近作品 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 数据图表 */}
          <motion.div 
            className={`lg:col-span-2 p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">作品表现趋势</h2>
              <div className="flex space-x-2">
                {['周', '月', '年'].map((period) => (
                  <button 
                    key={period}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      period === '月' 
                        ? 'bg-red-600 text-white' 
                        : isDark 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: isDark ? '#9ca3af' : '#4b5563' }}
                    axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: isDark ? '#9ca3af' : '#4b5563' }}
                    axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      borderColor: isDark ? '#374151' : '#e5e7eb',
                      borderRadius: '0.5rem',
                      color: isDark ? '#ffffff' : '#000000'
                    }} 
                  />
                  <Bar dataKey="views" name="浏览量" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="likes" name="点赞数" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="comments" name="评论数" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* 最近作品 */}
          <motion.div 
            className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">最近作品</h2>
              <Link to="#" className="text-red-600 hover:text-red-700 text-sm transition-colors">查看全部</Link>
            </div>
            
            <div className="space-y-4">
              {recentWorks.map((work) => (
                <div 
                  key={work.id} 
                  className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-transform hover:scale-[1.02] cursor-pointer`}
                  onClick={() => handleViewWork(work.id)}
                >
                  <div className="flex items-start">
                    <div className="relative">
                      <img 
                        src={work.thumbnail} 
                        alt={work.title} 
                        className="w-16 h-16 rounded-lg object-cover mr-4"
                      />
                      {work.copyrightCertified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          <i className="fas fa-shield-alt"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{work.title}</h3>
                      <div className="flex items-center text-xs mb-2">
                        <span className={`px-2 py-0.5 rounded-full mr-2 ${
                          work.status === '已发布' 
                            ? 'bg-green-100 text-green-600' 
                            : work.status === '审核中'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {work.status}
                        </span>
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {work.date}
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className="flex items-center mr-3">
                          <i className="far fa-eye mr-1"></i>
                          {work.views}
                        </span>
                        <span className="flex items-center mr-3">
                          <i className="far fa-thumbs-up mr-1"></i>{work.likes}
                        </span>
                        <button 
                          onClick={() => handleCommentClick(work.id)}
                          className="flex items-center text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <i className="far fa-comment mr-1"></i>评论
                        </button>
                      </div>
                    </div>
                    <button className="ml-2 text-gray-400 hover:text-gray-600">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* 创作工具推荐 */}
        <motion.div 
          className={`mt-8 p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-6">推荐创作工具</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: '一键国潮设计', 
                description: 'AI自动生成符合国潮风格的设计作品',
                icon: 'palette',
                color: 'purple'
              },
              { 
                title: '文化资产嵌入', 
                description: '智能嵌入传统文化元素和纹样',
                icon: 'gem',
                color: 'yellow'
              },
              { 
                title: 'AI滤镜', 
                description: '应用独特的AI滤镜，增强作品表现力',
                icon: 'filter',
                color: 'blue'
              },
              { 
                title: '文化溯源', 
                description: '了解并展示设计中文化元素的来源',
                icon: 'book',
                color: 'green'
              },
            ].map((tool, index) => (
              <motion.div 
                key={index}
                className={`p-5 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'} border border-gray-200 transition-all hover:shadow-lg`}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 rounded-full bg-${tool.color}-100 text-${tool.color}-600 flex items-center justify-center mb-4`}>
                  <i className={`fas fa-${tool.icon} text-xl`}></i>
                </div>
                <h3 className="font-bold mb-2">{tool.title}</h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tool.description}</p>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors">
                  立即使用
                  <i className="fas fa-arrow-right ml-1 text-xs"></i>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      {/* 页脚 */}
      <footer className={`border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} py-6 px-4`}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 AI共创平台. 保留所有权利
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className={`text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>隐私政策</a>
            <a href="#" className={`text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>服务条款</a>
            <a href="#" className={`text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>帮助中心</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
