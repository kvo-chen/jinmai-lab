import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { trackEvent, trackSocialNavigation, trackWorkView, trackUserFollow } from '@/lib/analytics';

interface FeedItem {
  id: string;
  type: 'new_work' | 'recommendation' | 'like' | 'comment' | 'follow';
  user?: {
    id: string;
    username: string;
    avatar: string;
  };
  work?: {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
  };
  title?: string;
  description?: string;
  works?: Array<{
    id: string;
    title: string;
    imageUrl: string;
    author: {
      id: string;
      username: string;
      avatar: string;
    };
  }>;
  createdAt: string;
}

export default function SocialFeed() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'following' | 'recommended'>('following');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('请先登录查看社交动态');
      navigate('/login');
      return;
    }

    // Track social feed page view
    trackEvent('social_feed_page_view', {
      tab: activeTab,
      timestamp: new Date().toISOString()
    });

    loadFeed();
  }, [isAuthenticated, activeTab]);

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getSocialFeed();
      setFeedItems(response.feed);
      
      // Track successful feed load
      trackEvent('social_feed_loaded', {
        tab: activeTab,
        itemCount: response.feed.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('加载社交动态失败:', error);
      toast.error('加载社交动态失败');
      
      // Track feed load error
      trackEvent('social_feed_load_error', {
        tab: activeTab,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      // 使用模拟数据
      setFeedItems([
        {
          id: '1',
          type: 'new_work',
          user: {
            id: 'user1',
            username: '设计师小明',
            avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20xiaoming&sign=cc76aace202a78fcb07391c53cf45642'
          },
          work: {
            id: 'work1',
            title: '国潮新风尚',
            imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Modern%20Chinese%20style%20fashion%20design&sign=b4fd3173ff1e94fc0f44e555fac99ac0',
            description: '融合传统中国元素与现代时尚设计'
          },
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          type: 'recommendation',
          title: '发现新作品',
          description: '基于您的兴趣推荐',
          works: [
            {
              id: 'rec1',
              title: '推荐作品1',
              imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Recommended%20artwork&sign=abc123',
              author: {
                id: 'artist1',
                username: '推荐艺术家',
                avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Artist%20avatar&sign=def456'
              }
            }
          ],
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkClick = (workId: string) => {
    navigate(`/works/${workId}`);
    
    // Track work click from social feed
    trackWorkView(workId, 'Social Feed Work');
    trackEvent('social_feed_work_click', {
      work_id: workId,
      source: 'social_feed',
      timestamp: new Date().toISOString()
    });
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    
    // Track user profile click from social feed
    trackEvent('social_feed_user_click', {
      user_id: userId,
      source: 'social_feed',
      timestamp: new Date().toISOString()
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '刚刚';
    if (diffInHours < 24) return `${diffInHours}小时前`;
    return `${Math.floor(diffInHours / 24)}天前`;
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {/* 标签页骨架 */}
            <div className="flex space-x-4 mb-6">
              <div className={`h-10 w-24 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
              <div className={`h-10 w-24 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
            </div>
            
            {/* 动态项目骨架 */}
            {[1, 2, 3].map((i) => (
              <div key={i} className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-400"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-400 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-400 rounded"></div>
                  </div>
                </div>
                <div className="h-32 bg-gray-400 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} pt-20`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-3">
          <span className="text-xl font-bold text-red-600 mr-2">AI</span>
          <span className="text-xl font-bold">共创</span>
          {typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development' && localStorage.getItem('analytics_dev_enable') !== 'true' && (
            <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>开发模式：埋点已关闭</span>
          )}
        </div>
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">社交动态</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            发现关注用户的最新创作和推荐内容
          </p>
        </div>

        {/* 标签页 */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => {
              setActiveTab('following');
              trackEvent('social_tab_switch', {
                from_tab: activeTab,
                to_tab: 'following',
                timestamp: new Date().toISOString()
              });
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'following'
                ? 'bg-red-600 text-white'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            关注动态
          </button>
          <button
            onClick={() => {
              setActiveTab('recommended');
              trackEvent('social_tab_switch', {
                from_tab: activeTab,
                to_tab: 'recommended',
                timestamp: new Date().toISOString()
              });
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'recommended'
                ? 'bg-red-600 text-white'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            推荐内容
          </button>
        </div>

        {/* 动态列表 */}
        <div className="space-y-6">
          {feedItems.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl`}>
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">暂无动态</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {activeTab === 'following' 
                  ? '您还没有关注任何用户，快去发现感兴趣的用户吧！'
                  : '系统正在为您准备个性化推荐内容...'
                }
              </p>
            </div>
          ) : (
            feedItems.map((item) => (
              <motion.div
                key={item.id}
                className={`rounded-2xl p-6 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* 动态头部 */}
                {item.user && (
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={item.user.avatar}
                      alt={item.user.username}
                      className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleUserClick(item.user!.id)}
                    />
                    <div className="flex-1">
                      <h4 
                        className="font-semibold cursor-pointer hover:text-red-600 transition-colors"
                        onClick={() => handleUserClick(item.user!.id)}
                      >
                        {item.user.username}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTimeAgo(item.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* 动态内容 */}
                {item.type === 'new_work' && item.work && (
                  <div 
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleWorkClick(item.work!.id)}
                  >
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={item.work.imageUrl}
                        alt={item.work.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent`}>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold">{item.work.title}</h3>
                          <p className="text-sm opacity-90">{item.work.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {item.type === 'recommendation' && item.works && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {item.works.map((work) => (
                        <div
                          key={work.id}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleWorkClick(work.id)}
                        >
                          <img
                            src={work.imageUrl}
                            alt={work.title}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <h4 className="font-medium text-sm">{work.title}</h4>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {work.author.username}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 动态底部操作 */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button className={`flex items-center space-x-1 text-sm ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}>
                      <i className="far fa-heart"></i>
                      <span>点赞</span>
                    </button>
                    <button className={`flex items-center space-x-1 text-sm ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'} transition-colors`}>
                      <i className="far fa-comment"></i>
                      <span>评论</span>
                    </button>
                    <button className={`flex items-center space-x-1 text-sm ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-500'} transition-colors`}>
                      <i className="far fa-share"></i>
                      <span>分享</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
