import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { analytics } from '@/lib/api';

// 模拟作品数据
const mockWorkDetail = {
  id: '1',
  title: '国潮新风尚',
  creator: '设计师小明',
  creatorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20xiaoming&sign=cc76aace202a78fcb07391c53cf45642',
  thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Modern%20Chinese%20style%20fashion%20design&sign=b4fd3173ff1e94fc0f44e555fac99ac0',
  likes: 245,
  comments: 32,
  views: 1240,
  category: '国潮设计',
  tags: ['国潮', '时尚', '现代'],
  culturalElements: ['中国结', '云纹', '回纹'],
  description: '融合传统中国元素与现代时尚设计理念，打造独具特色的国潮风格作品。采用传统的中国结、云纹等图案元素，结合现代简约的线条设计，展现出东方美学的时代魅力。',
  aiModels: ['DeepSeek', 'Midjourney', 'Stable Diffusion'],
  creationSteps: [
    { step: 1, title: '概念构思', description: '确定国潮主题与现代融合方向' },
    { step: 2, title: '元素收集', description: '收集传统文化图案素材' },
    { step: 3, title: 'AI生成', description: '使用AI工具生成初步设计方案' },
    { step: 4, title: '细节优化', description: '调整细节，完善整体设计' }
  ],
  createdAt: '2024-01-15',
  copyrightStatus: 'certified',
  commercialPotential: 'high'
};

export default function WorksDetail() {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [work, setWork] = useState(mockWorkDetail);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; user: { username: string; avatar: string }; content: string; likes: number; createdAt: string; isLiked: boolean }>>([
    {
      id: 'c1',
      user: { username: '文化爱好者', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20culture%20lover&sign=abc123' },
      content: '这个设计很有文化韵味，传统与现代结合得很和谐！',
      likes: 12,
      createdAt: '2025-11-11 14:30',
      isLiked: false
    },
    {
      id: 'c2',
      user: { username: '设计师小李', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20designer%20li&sign=def456' },
      content: 'AI辅助设计的效果很棒，云纹的运用特别巧妙，值得学习！',
      likes: 8,
      createdAt: '2025-11-11 10:15',
      isLiked: true
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showCreatorProfile, setShowCreatorProfile] = useState(false);

  useEffect(() => {
    analytics.track('page_view', { page: 'works_detail', workId: id });
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }, [id]);

  const handleAddComment = () => {
    if (!isAuthenticated) {
      toast.info('请先登录');
      navigate('/login');
      return;
    }
    if (!newComment.trim()) {
      toast.info('请输入评论内容');
      return;
    }
    const comment = {
      id: `c-${Date.now()}`,
      user: { username: user?.username || '匿名用户', avatar: user?.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar&sign=default' },
      content: newComment.trim(),
      likes: 0,
      createdAt: new Date().toLocaleString('zh-CN'),
      isLiked: false
    };
    setComments([comment, ...comments]);
    setNewComment('');
    analytics.track('add_comment', { workId: id });
    toast.success('评论发表成功');
  };

  const handleCollaborate = () => {
    if (!isAuthenticated) {
      toast.info('请先登录');
      navigate('/login');
      return;
    }
    analytics.track('collaboration_request', { workId: id });
    toast.info('协作功能开发中...');
  };

  const handleCopyright = () => {
    analytics.track('copyright_check', { workId: id });
    toast.info('版权认证功能开发中...');
  };

  const handleCommercial = () => {
    analytics.track('commercial_interest', { workId: id });
    toast.info('商业化申请功能开发中...');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-3">
          <span className="text-xl font-bold text-red-600 mr-2">AI</span>
          <span className="text-xl font-bold">共创</span>
          {typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development' && localStorage.getItem('analytics_dev_enable') !== 'true' && (
            <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>开发模式：埋点已关闭</span>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div className={`rounded-2xl overflow-hidden shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <img src={work.thumbnail} alt={work.title} className="w-full h-96 object-cover" />
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {work.tags.map((tag, index) => (
                    <span key={index} className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>#{tag}</span>
                  ))}
                </div>
                <h1 className="text-3xl font-bold mb-4">{work.title}</h1>
                <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{work.description}</p>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">文化元素</h3>
                  <div className="flex flex-wrap gap-2">
                    {work.culturalElements.map((element, index) => (
                      <span key={index} className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">{element}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className={`rounded-2xl p-6 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h3 className="text-xl font-bold mb-4">创作历程</h3>
              <div className="space-y-4">
                {work.creationSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{step.step}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className={`rounded-2xl p-6 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">评论 ({comments.length})</h3>
                <button onClick={() => setShowComments(!showComments)} className="text-red-600 hover:text-red-700 font-medium">{showComments ? '收起' : '展开'}</button>
              </div>
              {showComments && (
                <>
                  {isAuthenticated && (
                    <div className="mb-6">
                      <div className="flex space-x-4">
                        <img src={user?.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar&sign=default'} alt={user?.username || '用户头像'} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="发表您的评论..." className={`w-full p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 border' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 border'}`} rows={3} />
                          <div className="flex justify-end mt-2">
                            <button onClick={handleAddComment} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">发表</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <img src={comment.user.avatar} alt={comment.user.username} className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-sm">{comment.user.username}</span>
                              <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{comment.createdAt}</span>
                            </div>
                            <button
                              onClick={() => {
                                setComments(comments.map(c => c.id === comment.id ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c));
                                analytics.track('like_comment', { commentId: comment.id, liked: !comment.isLiked });
                              }}
                              className={`text-sm flex items-center space-x-1 ${comment.isLiked ? 'text-red-600' : isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}
                            >
                              <i className={`fas fa-heart ${comment.isLiked ? 'text-red-600' : ''}`}></i>
                              <span>{comment.likes}</span>
                            </button>
                          </div>
                          <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div className={`rounded-2xl p-6 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center space-x-4 mb-4">
                <img src={work.creatorAvatar} alt={work.creator} className="w-16 h-16 rounded-full" />
                <div>
                  <h3 className="font-bold text-lg">{work.creator}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>新锐创作者</p>
                </div>
              </div>
              <div className="flex space-x-2 mb-4">
                <button onClick={() => { if (!isAuthenticated) { toast.info('请先登录'); navigate('/login'); return; } setShowCreatorProfile(!showCreatorProfile); }} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>{showCreatorProfile ? '收起资料' : '查看资料'}</button>
                <button onClick={() => { if (!isAuthenticated) { toast.info('请先登录'); navigate('/login'); return; } setIsLiked(!isLiked); setWork(prev => ({ ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 })); analytics.track('like_work', { workId: id, liked: !isLiked }); }} className={`px-4 py-2 rounded-lg ${isLiked ? 'bg-gray-200 text-gray-700' : 'bg-red-600 text-white hover:bg-red-700'} transition-colors`}>{isLiked ? '已点赞' : '点赞'}</button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-bold">{work.views}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>浏览量</div>
                </div>
                <div>
                  <div className="font-bold">{work.likes}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>点赞数</div>
                </div>
                <div>
                  <div className="font-bold">{work.comments}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>评论数</div>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button onClick={() => { if (navigator.share) { navigator.share({ title: work.title, text: work.description, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); toast.success('链接已复制到剪贴板'); } analytics.track('share_work', { workId: id }); }} className={`px-4 py-2 rounded-lg border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>分享</button>
                <button onClick={handleCollaborate} className={`px-4 py-2 rounded-lg border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>申请协作</button>
                <button onClick={handleCommercial} className={`px-4 py-2 rounded-lg border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>商业化咨询</button>
              </div>
            </motion.div>

            <motion.div className={`rounded-2xl p-6 shadow-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="flex items-center mb-3">
                <i className="fas fa-shield-alt text-green-500 text-xl mr-2"></i>
                <h4 className="font-bold">版权状态：{work.copyrightStatus === 'certified' ? '已认证' : '未认证'}</h4>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>证书编号:</span>
                  <span>{work.id.toString().padStart(6, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>认证时间:</span>
                  <span>{work.createdAt}</span>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button onClick={handleCopyright} className="text-sm text-red-600 hover:text-red-700">发起认证</button>
              </div>
            </motion.div>

            <motion.div className={`rounded-2xl p-6 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <h4 className="font-bold mb-3">AI创作信息</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>使用模型:</span>
                  <span className="ml-2">{work.aiModels.join('，')}</span>
                </div>
                <div>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>提示词:</span>
                  <p className="mt-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-xs">
                    融合传统云纹、中国结等元素，突出东方审美与现代设计的统一
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
