import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';

// 模拟作品数据
const mockWorks = [
  {
    id: 1,
    title: '国潮新风尚',
    creator: '设计师小明',
    creatorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20xiaoming&sign=cc76aace202a78fcb07391c53cf45642',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Modern%20Chinese%20style%20fashion%20design&sign=b4fd3173ff1e94fc0f44e555fac99ac0',
    likes: 245,
    comments: 32,
    views: 1240,
    category: '国潮设计',
    tags: ['国潮', '时尚', '现代'],
    featured: true,
  },
  {
    id: 2,
    title: '传统纹样创新',
    creator: '创意总监小李',
    creatorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20xiaoli&sign=0a161e92e8233ac1e907c1757a08b793',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Traditional%20Chinese%20patterns%20with%20modern%20twist&sign=13635a05be6c88568e935004f062f7e6',
    likes: 189,
    comments: 21,
    views: 980,
    category: '纹样设计',
    tags: ['传统', '纹样', '创新'],
    featured: false,
  },
  {
    id: 3,
    title: '老字号品牌焕新',
    creator: '品牌设计师老王',
    creatorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20laowang&sign=ad224bf888bce01af0b2109dca2059e7',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Traditional%20brand%20modernization%20design&sign=f434e47bf93a822b4ec905e069af059d',
    likes: 324,
    comments: 45,
    views: 1870,
    category: '品牌设计',
    tags: ['老字号', '品牌', '焕新'],
    featured: true,
  },
  {
    id: 4,
    title: 'AI助力非遗传承',
    creator: '数字艺术家小张',
    creatorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20xiaozhang&sign=24de79776063118a09f9d728513bcc6d',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=AI%20assisted%20intangible%20cultural%20heritage%20preservation&sign=87cf0a0f76b3d636703208c3b8ce2a4e',
    likes: 276,
    comments: 38,
    views: 1450,
    category: '非遗传承',
    tags: ['AI', '非遗', '传承'],
    featured: false,
  },
  {
    id: 5,
    title: '东方美学插画',
    creator: '插画师小陈',
    creatorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20xiaochen&sign=35e4cf6552a75145358bdcdd1fed4cf1',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Oriental%20aesthetics%20illustration&sign=9f8604c7417989c9514d33297d27bfef',
    likes: 412,
    comments: 56,
    views: 2100,
    category: '插画设计',
    tags: ['东方', '美学', '插画'],
    featured: true,
  },
  {
    id: 6,
    title: '传统工艺数字化',
    creator: '数字设计师小刘',
    creatorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20xiaoli&sign=0a161e92e8233ac1e907c1757a08b793u',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Digitalization%20of%20traditional%20craftsmanship&sign=b8139d665acedc18e4037a40fc47c297',
    likes: 198,
    comments: 24,
    views: 980,
    category: '工艺创新',
    tags: ['传统工艺', '数字化', '创新'],
    featured: false,
  },
];

// 分类数据
const categories = [
  '全部', '国潮设计', '纹样设计', '品牌设计', '非遗传承', '插画设计', '工艺创新'
];

export default function Explore() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWorks, setFilteredWorks] = useState(mockWorks);
  const [isLoading, setIsLoading] = useState(true);
  
  // 模拟加载数据
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  // 筛选作品
  useEffect(() => {
    let result = mockWorks;
    
    // 按分类筛选
    if (selectedCategory !== '全部') {
      result = result.filter(work => work.category === selectedCategory);
    }
    
    // 按搜索词筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(work => 
        work.title.toLowerCase().includes(term) || 
        work.creator.toLowerCase().includes(term) ||
        work.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredWorks(result);
  }, [selectedCategory, searchTerm]);
  
  const handleWorkClick = (workId: number) => {
    // 作品详情页面逻辑
    navigate(`/works/${workId}`);
  };
  
  const handleCreateClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      toast.info('请先登录后再创作');
    } else {
      navigate('/create');
    }
  };
  
  // 骨架屏加载状态
  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} text-white`}>
        {/* 导航栏 */}
        <nav className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}>
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <span className="text-xl font-bold text-red-600">AI</span>
              <span className="text-xl font-bold">共创</span>
            </div>
            <button 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
              onClick={handleCreateClick}
            >
              开始创作
            </button>
          </div>
        </nav>
        
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* 搜索框骨架屏 */}
            <div className={`h-16 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
            
            {/* 分类骨架屏 */}
            <div className="flex space-x-3 overflow-x-auto pb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`h-12 px-6 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}
                ></div>
              ))}
            </div>
            
            {/* 推荐作品骨架屏 */}
            <div className={`h-64 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
            
            {/* 作品网格骨架屏 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <div className={`h-56 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
                  <div className={`h-4 w-3/4 rounded ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
                  <div className={`h-3 w-1/2 rounded ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  // 精选作品
  const featuredWorks = mockWorks.filter(work => work.featured);
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 导航栏 */}
      <nav className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="text-xl font-bold text-red-600">AI</span>
            <span className="text-xl font-bold">共创</span>
          </div>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
            onClick={handleCreateClick}
          >
            开始创作
          </button>
        </div>
      </nav>
      
      {/* 主内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 搜索框 */}
        <motion.div 
          className={`mb-8 p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索作品、创作者或标签..."
              className={`w-full pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 border' 
                  : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 border'
              }`}
            />
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </motion.div>
        
        {/* 分类筛选 */}
        <motion.div 
          className="mb-8 overflow-x-auto pb-4 scrollbar-hide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex space-x-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category 
                    ? 'bg-red-600 text-white shadow-md' 
                    : isDark 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-white hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* 精选作品 */}
        {featuredWorks.length > 0 && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <i className="fas fa-star text-yellow-500 mr-2"></i>
              精选作品
            </h2>
            
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-6 pb-4 min-w-max">
                  {featuredWorks.map((work) => (
                    <motion.div
                      key={work.id}
                      className={`w-80 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-xl`}
                      whileHover={{ y: -5 }}
                      onClick={() => handleWorkClick(work.id)}
                    >
                      <div className="relative">
                        <img 
                          src={work.thumbnail} 
                          alt={work.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">精选</span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success('已添加到收藏');
                            }}
                            className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-colors"
                          >
                            <i className="far fa-heart"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold">{work.title}</h3>
                          <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {work.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center mb-4">
                          <img 
                            src={work.creatorAvatar} 
                            alt={work.creator} 
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm opacity-80">{work.creator}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center">
                            <i className="far fa-eye mr-1"></i>
                            <span>{work.views}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="far fa-thumbs-up mr-1"></i>
                            <span>{work.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="far fa-comment mr-1"></i>
                            <span>{work.comments}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* 左右滚动箭头 */}
              <button className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 hidden md:block bg-white text-black p-2 rounded-full shadow-md">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 hidden md:block bg-white text-black p-2 rounded-full shadow-md">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </motion.div>
        )}
        
        {/* 作品列表 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">探索作品</h2>
          
          {filteredWorks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => (
                <motion.div
                  key={work.id}
                  className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-xl`}
                  whileHover={{ y: -5 }}
                  onClick={() => handleWorkClick(work.id)}
                >
                  <div className="relative">
                    <img 
                      src={work.thumbnail} 
                      alt={work.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('已添加到收藏');
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          isDark ? 'bg-gray-900 bg-opacity-70 hover:bg-opacity-100' : 'bg-white bg-opacity-70 hover:bg-opacity-100'
                        }`}
                      >
                        <i className="far fa-heart"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold">{work.title}</h3>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        isDark ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {work.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <img 
                        src={work.creatorAvatar} 
                        alt={work.creator} 
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {work.creator}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {work.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDark ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <i className="far fa-eye mr-1"></i>
                        <span>{work.views}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="far fa-thumbs-up mr-1"></i>
                        <span>{work.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="far fa-comment mr-1"></i>
                        <span>{work.comments}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-4 text-5xl text-gray-400">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">未找到相关作品</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                请尝试其他关键词或分类
              </p>
            </div>
          )}
          
          {/* 加载更多 */}
          <div className="text-center mt-10">
            <button className={`px-6 py-3 rounded-full transition-colors ${
              isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow-md'
            }`}>
              加载更多
              <i className="fas fa-chevron-down ml-2"></i>
            </button>
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
