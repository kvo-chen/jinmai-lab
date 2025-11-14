import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { trackEvent, trackUserFollow } from '@/lib/analytics';

interface User {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  isFollowing?: boolean;
}

export default function UserRelationships() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { type } = useParams<{ type: 'followers' | 'following' }>();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(type || 'following');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('请先登录查看用户关系');
      navigate('/login');
      return;
    }

    // Track user relationships page view
    trackEvent('user_relationships_page_view', {
      tab: activeTab,
      timestamp: new Date().toISOString()
    });

    loadUsers();
  }, [isAuthenticated, activeTab]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      let response;
      
      if (activeTab === 'following') {
        response = await apiClient.getFollowing();
        setUsers(response.following);
      } else {
        response = await apiClient.getFollowers();
        setUsers(response.followers);
      }
      
      // Track successful user relationships load
      trackEvent('user_relationships_loaded', {
        tab: activeTab,
        user_count: response.total || (response.following?.length || response.followers?.length || 0),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`加载${activeTab}列表失败:`, error);
      toast.error(`加载${activeTab}列表失败`);
      
      // Track load error
      trackEvent('user_relationships_load_error', {
        tab: activeTab,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      // 使用模拟数据
      setUsers([
        {
          id: 'user1',
          username: '设计师小明',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20xiaoming&sign=cc76aace202a78fcb07391c53cf45642',
          bio: 'AI创作爱好者，专注传统文化与现代设计融合',
          isFollowing: true
        },
        {
          id: 'user2',
          username: '文化探索者',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20culture%20explorer&sign=abc123',
          bio: '致力于传承和发扬中华传统文化',
          isFollowing: false
        },
        {
          id: 'user3',
          username: 'AI艺术家',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20AI%20artist&sign=def456',
          bio: '用AI技术创造独特的艺术作品',
          isFollowing: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string, isFollowing: boolean) => {
    try {
      const response = await apiClient.followUser(userId);
      
      // 更新本地状态
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: response.following }
          : user
      ));
      
      // Track follow/unfollow action
      const user = users.find(u => u.id === userId);
      if (user) {
        trackUserFollow(userId, user.username, response.following);
      }
      
      // Track follow action event
      trackEvent(response.following ? 'user_follow_action' : 'user_unfollow_action', {
        target_user_id: userId,
        source: 'user_relationships_page',
        timestamp: new Date().toISOString()
      });
      
      toast.success(response.following ? '关注成功' : '已取消关注');
    } catch (error) {
      console.error('关注操作失败:', error);
      toast.error('操作失败，请稍后重试');
      
      // Track follow error
      trackEvent('user_follow_error', {
        target_user_id: userId,
        action: isFollowing ? 'unfollow' : 'follow',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    
    // Track user profile click
    trackEvent('user_relationships_profile_click', {
      target_user_id: userId,
      source: 'user_relationships_page',
      timestamp: new Date().toISOString()
    });
  };

  const handleTabChange = (tab: 'followers' | 'following') => {
    // Track tab change
    trackEvent('user_relationships_tab_switch', {
      from_tab: activeTab,
      to_tab: tab,
      timestamp: new Date().toISOString()
    });
    
    setActiveTab(tab);
    navigate(`/user-relationships/${tab}`);
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
            
            {/* 用户列表骨架 */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-400"></div>
                    <div>
                      <div className="h-4 w-32 bg-gray-400 rounded mb-2"></div>
                      <div className="h-3 w-48 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                  <div className="h-10 w-24 bg-gray-400 rounded-lg"></div>
                </div>
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
          <h1 className="text-3xl font-bold mb-4">
            {activeTab === 'following' ? '我的关注' : '我的粉丝'}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {activeTab === 'following' 
              ? '管理您关注的用户，查看他们的最新动态'
              : '查看关注您的用户，发现更多有趣的人'
            }
          </p>
        </div>

        {/* 标签页 */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTabChange('following')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'following'
                ? 'bg-red-600 text-white'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            关注 ({users.filter(u => u.isFollowing).length})
          </button>
          <button
            onClick={() => handleTabChange('followers')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'followers'
                ? 'bg-red-600 text-white'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            粉丝 ({users.length})
          </button>
        </div>

        {/* 用户列表 */}
        {users.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl`}>
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === 'following' ? '暂无关注' : '暂无粉丝'}
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {activeTab === 'following' 
                ? '快去发现感兴趣的用户并关注他们吧！'
                : '多发布优质内容，吸引更多用户关注您！'
              }
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {activeTab === 'following' ? '发现用户' : '发布作品'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-16 h-16 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleUserClick(user.id)}
                    />
                    <div className="flex-1">
                      <h3 
                        className="font-semibold text-lg cursor-pointer hover:text-red-600 transition-colors"
                        onClick={() => handleUserClick(user.id)}
                      >
                        {user.username}
                      </h3>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        {user.bio}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFollow(user.id, user.isFollowing || false)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        user.isFollowing
                          ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {user.isFollowing ? '已关注' : '关注'}
                    </button>
                    <button
                      onClick={() => navigate(`/chat/${user.id}`)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        isDark
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      私信
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
