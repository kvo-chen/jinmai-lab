import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate, useParams } from 'react-router-dom';
// import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { chatLLM } from '@/lib/llm';

// 模拟文化知识数据
const brandOptions = ['泥人张','杨柳青年画','狗不理包子','桂发祥麻花','耳朵眼炸糕','果仁张','盛锡福','老美华','正兴德茶庄'];
const historicalStories = [
  {
    id: 1,
    title: '北京同仁堂：350年的中药传奇',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Beijing%20Tongrentang%20traditional%20Chinese%20medicine%20store%20historical%20photo&sign=3cdb780a7edd815fc0758382a78d0550',
    excerpt: '创立于1669年的同仁堂，历经八代皇帝，见证了中国中医药文化的传承与发展...',
    content: `北京同仁堂是中国最负盛名的中药老字号，创建于清康熙八年（1669年），
    创始人乐显扬。三百多年来，同仁堂始终坚守"炮制虽繁必不敢省人工，品味虽贵必不敢减物力"的古训，
    其产品以"配方独特、选料上乘、工艺精湛、疗效显著"而享誉海内外。
    
    同仁堂的发展史与中国近现代史紧密相连，从清朝宫廷御药房到现代上市公司，
    同仁堂不仅是一家企业，更是中国中医药文化的重要象征和传承者。
    
    如今，同仁堂已发展成为拥有药品、保健品、食品等多个产业的现代化中医药集团，
    产品远销世界多个国家和地区，为弘扬中华优秀传统文化做出了重要贡献。`,
    tags: ['中药', '清朝', '老字号', '文化传承']
  },
  {
    id: 2,
    title: '景德镇瓷器：白如玉、明如镜、薄如纸、声如磬',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Jingdezhen%20porcelain%20traditional%20workshop%20and%20artworks&sign=1037623feb9361b1a153cc833bc2c29c',
    excerpt: '景德镇制瓷历史可追溯至汉代，宋元时期逐渐发展，明清时期达到鼎盛...',
    content: `景德镇被誉为"世界瓷都"，制瓷历史悠久，技艺精湛。早在汉代，
    这里就开始了陶瓷生产；唐代，景德镇白瓷已享有盛名；宋代，景德镇陶瓷进入快速发展期，
    以青白瓷（影青瓷）著称于世；元代，景德镇成功烧制出青花、釉里红等新品种；
    明代，景德镇成为全国制瓷中心，设立了御窑厂；清代，景德镇制瓷工艺达到历史高峰，
    创烧了粉彩、珐琅彩等名贵品种。
    
    景德镇瓷器以"白如玉、明如镜、薄如纸、声如磬"的独特品质闻名天下，
    其制瓷技艺包括拉坯、利坯、施釉、彩绘、烧制等72道工序，
    每一件精品都凝聚着匠人的心血和智慧。
    
    2006年，景德镇陶瓷烧制技艺被列入第一批国家级非物质文化遗产名录，
    成为中华民族优秀传统文化的重要组成部分。`,
    tags: ['陶瓷', '手工艺', '非遗', '艺术']
  },
  {
    id: 3,
    title: '茅台酒：中国白酒的典范',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Moutai%20liquor%20traditional%20brewing%20process&sign=9349527ba320066006010c371041b5e5',
    excerpt: '茅台酒以其独特的酱香风格和卓越的品质，被誉为"国酒"，其酿造技艺堪称中华酿酒文化的瑰宝...',
    content: `茅台酒产于贵州省仁怀市茅台镇，是中国酱香型白酒的代表。
    茅台镇独特的地理环境、气候条件和水质，为茅台酒的酿造提供了得天独厚的自然条件。
    茅台酒的酿造工艺复杂，需要经过制曲、制酒、陈酿、勾兑、包装等多个环节，
    整个生产周期长达一年，还要经过五年以上的陈酿才能出厂。
    
    茅台酒以"酱香突出、幽雅细腻、酒体醇厚、回味悠长、空杯留香持久"的特点著称，
    其独特的风味和品质使其成为中国白酒的典范，被誉为"国酒"。
    
    茅台酒的酿造技艺不仅是一门技术，更是一种文化传承。
    2006年，茅台酒酿制技艺被列入第一批国家级非物质文化遗产名录，
    成为中华民族优秀传统文化的重要组成部分。`,
    tags: ['白酒', '酿造', '非遗', '饮食文化']
  }
];

const tutorialVideos = [
  {
    id: 1,
    title: '苏绣基本针法教学',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Suzhou%20embroidery%20master%20teaching%20basic%20stitches&sign=5957ca546cd494ddc00d3c4f19ee3832',
    duration: '12:30',
    level: '入门',
    views: '12,458',
    description: '学习苏绣的基本针法，包括平针、齐针、套针等，掌握传统刺绣的基础技巧。'
  },
  {
    id: 2,
    title: '宣纸制作工艺详解',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Xuan%20paper%20traditional%20making%20process&sign=84829aa1fd72dc23271eae51f62ccf58',
    duration: '18:45',
    level: '进阶',
    views: '8,723',
    description: '详细了解中国传统宣纸的制作工艺，从原料采集到成品包装的全过程。'
  },
  {
    id: 3,
    title: '景泰蓝掐丝技巧高级班',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Master%20teaching%20cloisonne%20wire%20inlay%20techniques&sign=e32a1eb5c9ac8ceea07104d284730eb2',
    duration: '25:15',
    level: '高级',
    views: '6,342',
    description: '学习景泰蓝的高级掐丝技巧，掌握复杂图案的设计与制作方法。'
  }
];

const culturalElements = [
  {
    id: 1,
    name: '龙纹',
    category: '纹样',
    description: '中国传统文化中最具代表性的纹样之一，象征权力、尊贵与吉祥。',
    history: '龙纹的出现可追溯至新石器时代，经过历代演变，成为中国传统文化的重要象征。',
    usage: '常用于皇家服饰、建筑装饰、工艺品等，代表至高无上的权力和地位。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20dragon%20pattern&sign=5cd3b5dd36b10020c3b16e78e34d1401'
  },
  {
    id: 2,
    name: '青花瓷',
    category: '陶瓷',
    description: '中国传统陶瓷工艺的珍品，以白地青花为主要特征。',
    history: '青花瓷始于唐代，成熟于元代，明清时期达到鼎盛，是中国陶瓷的重要品种。',
    usage: '主要用于日用器皿、陈设艺术品等，是中国陶瓷文化的重要代表。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Blue%20and%20white%20porcelain%20vase&sign=4144ec4f7134ee5872378528ed920e4f'
  },
  {
    id: 3,
    name: '中国红',
    category: '色彩',
    description: '中国传统文化中最具代表性的色彩，象征喜庆、吉祥与热情。',
    history: '红色在中国传统文化中有着特殊的意义，早在原始社会就被视为生命的象征。',
    usage: '常用于节日庆典、婚礼、传统服饰等场合，是中国文化的重要符号。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20red%20color%20elements%20collage&sign=2485f28a0cc9bc233970345ce120e9e5'
  }
];

type TabType = 'stories' | 'tutorials' | 'elements';

export default function CulturalKnowledge() {
  const { isDark } = useTheme();
  // const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id, type } = useParams();
  
  const [activeTab, setActiveTab] = useState<TabType>('stories');
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [chatProvider, setChatProvider] = useState<'deepseek' | 'kimi'>('kimi');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'system' | 'user' | 'assistant'; content: string }[]>([]);
  const [chatSending, setChatSending] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  
  // 模拟加载数据
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  // 根据URL参数设置选中项
  useEffect(() => {
    if (id && type) {
      setShowDetail(true);
      const numericId = parseInt(id);
      
      if (type === 'stories') {
        const story = historicalStories.find(s => s.id === numericId);
        if (story) {
          setSelectedStory(story);
          setActiveTab('stories');
        }
      } else if (type === 'tutorials') {
        const video = tutorialVideos.find(v => v.id === numericId);
        if (video) {
          setSelectedVideo(video);
          setActiveTab('tutorials');
        }
      } else if (type === 'elements') {
        const element = culturalElements.find(e => e.id === numericId);
        if (element) {
          setSelectedElement(element);
          setActiveTab('elements');
        }
      }
    }
  }, [id, type]);

  const buildContext = (q: string) => {
    const t = (selectedBrand ? `${q} ${selectedBrand}` : q).toLowerCase();
    const s = historicalStories.filter(x => x.title.toLowerCase().includes(t) || x.tags.some((y:any)=>String(y).toLowerCase().includes(t))).slice(0, 2);
    const v = tutorialVideos.filter(x => x.title.toLowerCase().includes(t)).slice(0, 1);
    const e = culturalElements.filter(x => x.name.toLowerCase().includes(t) || x.category.toLowerCase().includes(t)).slice(0, 2);
    const parts: string[] = [];
    for (const i of s) parts.push(`【老字号故事】${i.title}：${i.excerpt}`);
    for (const i of v) parts.push(`【非遗教程】${i.title}：${i.description}`);
    for (const i of e) parts.push(`【文化元素】${i.name}（${i.category}）：${i.description}`);
    if (!parts.length) parts.push('如无法匹配知识库，请基于通用常识回答并标注可能不准确');
    const brandHint = selectedBrand ? `优先围绕品牌「${selectedBrand}」进行回答。` : '';
    return `${brandHint}\n${parts.join('\n')}`;
  };

  const sendChat = async () => {
    const q = chatInput.trim();
    if (!q) {
      toast.error('请输入问题');
      return;
    }
    try {
      setChatSending(true);
      const ctx = buildContext(q);
      const next: { role: 'system' | 'user' | 'assistant'; content: string }[] = [...chatMessages, { role: 'user' as const, content: q }];
      setChatMessages(next);
      const content = await chatLLM({
        provider: chatProvider,
        model: chatProvider === 'kimi' ? 'moonshot-v1-32k' : 'deepseek-chat',
        messages: [
          { role: 'system', content: `你是文化知识问答助手，依据给定知识库作答，优先引用津门老字号相关内容，回答简洁准确并分点列出。知识库：\n${ctx}` },
          { role: 'user', content: q }
        ]
      });
      setChatMessages([...next, { role: 'assistant' as const, content }]);
      setChatInput('');
    } catch (e) {
      toast.error('调用大模型失败，请配置密钥');
    } finally {
      setChatSending(false);
    }
  };
  
  const handleStoryClick = (story: any) => {
    setSelectedStory(story);
    setSelectedVideo(null);
    setSelectedElement(null);
    setShowDetail(true);
  };
  
  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setSelectedStory(null);
    setSelectedElement(null);
    setShowDetail(true);
  };
  
  const handleElementClick = (element: any) => {
    setSelectedElement(element);
    setSelectedStory(null);
    setSelectedVideo(null);
    setShowDetail(true);
  };
  
  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedStory(null);
    setSelectedVideo(null);
    setSelectedElement(null);
    navigate('/knowledge');
  };
  
  // 骨架屏加载状态
  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} text-white`}>
        <nav className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}>
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <span className="text-xl font-bold text-red-600">AI</span>
              <span className="text-xl font-bold">共创</span>
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className={`h-8 w-1/3 rounded ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
            
            <div className="flex space-x-3 overflow-x-auto pb-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`h-12 px-6 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}
                ></div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <div className={`h-48 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
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
  
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="text-xl font-bold text-red-600">AI</span>
            <span className="text-xl font-bold">共创</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              返回控制台
            </button>
          </div>
        </div>
      </header>
      
      {/* 主内容 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <div className="mb-6">
          <div className="flex items-center text-sm">
            <a href="/dashboard" className="hover:text-red-600 transition-colors">首页</a>
            <i className="fas fa-chevron-right text-xs mx-2 opacity-50"></i>
            <span className="opacity-70">文化知识库</span>
          </div>
        </div>
        
        {/* 标题 */}
        <motion.h1 
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          文化知识库
        </motion.h1>

        <motion.div 
          className={`mb-8 p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <div className="flex items-center mb-3">
                <select value={chatProvider} onChange={(e)=>setChatProvider(e.target.value as any)} className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200'} border rounded-lg px-3 py-2 text-sm mr-3`}>
                  <option value="deepseek">DeepSeek</option>
                  <option value="kimi">Kimi</option>
                </select>
                <select value={selectedBrand} onChange={(e)=>setSelectedBrand(e.target.value)} className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200'} border rounded-lg px-3 py-2 text-sm mr-3`}>
                  <option value="">选择津门老字号品牌</option>
                  {brandOptions.map((b)=> (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <input value={chatInput} onChange={(e)=>setChatInput(e.target.value)} placeholder="就津门老字号、非遗技艺提问..." className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200'} border rounded-lg px-3 py-2 text-sm w-full`} />
                <button onClick={sendChat} disabled={chatSending} className="ml-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">{chatSending ? '发送中...' : '发送'}</button>
              </div>
              <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-3 max-h-64 overflow-auto`}>
                {chatMessages.length === 0 ? (
                  <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>开始提问，答案将结合知识库</div>
                ) : (
                  chatMessages.map((m, i) => (
                    <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block px-3 py-2 rounded-xl text-sm ${m.role === 'user' ? 'bg-red-600 text-white' : isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>{m.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-3 text-sm`}>
              <div className="font-medium mb-2">知识源</div>
              <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>老字号故事、非遗教程与文化元素数据，支持关键词检索。</div>
            </div>
          </div>
        </motion.div>
        
        {/* 搜索框 */}
        <motion.div 
          className={`mb-8 p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索文化知识、历史故事、非遗技艺..."
              className={`w-full pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 border' 
                  : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 border'
              }`}
            />
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </motion.div>
        
        {/* 内容展示区域 */}
        {!showDetail ? (
          <>
            {/* 标签页切换 */}
            <motion.div 
              className="mb-8 overflow-x-auto pb-4 scrollbar-hide"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex space-x-3 min-w-max">
                {[
                  { id: 'stories', name: '老字号故事' },
                  { id: 'tutorials', name: '非遗教程' },
                  { id: 'elements', name: '文化元素' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-red-600 text-white shadow-md' 
                        : isDark 
                          ? 'bg-gray-800 hover:bg-gray-700' 
                          : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </motion.div>
            
            {/* 内容列表 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* 老字号故事 */}
              {activeTab === 'stories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {historicalStories.map((story) => (
                    <motion.div
                      key={story.id}
                      className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-xl`}
                      whileHover={{ y: -5 }}
                      onClick={() => handleStoryClick(story)}
                    >
                      <img 
                        src={story.thumbnail} 
                        alt={story.title} 
                        className="w-full h-48 object-cover"
                      />
                      
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-3">{story.title}</h3>
                        <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {story.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {story.tags.map((tag, index) => (
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
                        
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors flex items-center">
                          阅读更多
                          <i className="fas fa-arrow-right ml-1 text-xs"></i>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* 非遗教程 */}
              {activeTab === 'tutorials' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutorialVideos.map((video) => (
                    <motion.div
                      key={video.id}
                      className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-xl`}
                      whileHover={{ y: -5 }}
                      onClick={() => handleVideoClick(video)}
                    >
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-red-600 bg-opacity-80 flex items-center justify-center">
                            <i className="fas fa-play text-white text-xl"></i>
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                          {video.duration}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg">{video.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            video.level === '入门' 
                              ? 'bg-green-100 text-green-600' 
                              : video.level === '进阶'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-purple-100 text-purple-600'
                          }`}>
                            {video.level}
                          </span>
                        </div>
                        
                        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {video.description}
                        </p>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center`}>
                            <i className="far fa-eye mr-1"></i>
                            {video.views} 次观看
                          </span>
                          
                          <button className="text-red-600 hover:text-red-700 font-medium transition-colors flex items-center">
                            观看教程
                            <i className="fas fa-arrow-right ml-1 text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* 文化元素 */}
              {activeTab === 'elements' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {culturalElements.map((element) => (
                    <motion.div
                      key={element.id}
                      className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-xl`}
                      whileHover={{ y: -5 }}
                      onClick={() => handleElementClick(element)}
                    >
                      <img 
                        src={element.image} 
                        alt={element.name} 
                        className="w-full h-48 object-cover"
                      />
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg">{element.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isDark ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            {element.category}
                          </span>
                        </div>
                        
                        <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {element.description}
                        </p>
                        
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors flex items-center">
                          了解详情
                          <i className="fas fa-arrow-right ml-1 text-xs"></i>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-md`}
          >
            {/* 返回按钮 */}
            <button 
              onClick={handleBackToList}
              className={`mb-6 flex items-center text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              返回列表
            </button>
            
            {/* 老字号故事详情 */}
            {selectedStory && (
              <div>
                <img 
                  src={selectedStory.thumbnail} 
                  alt={selectedStory.title} 
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                
                <h2 className="text-2xl font-bold mb-6">{selectedStory.title}</h2>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedStory.tags.map((tag: string, index: number) => (
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
                
                <div className={`prose max-w-none mb-8 ${isDark ? 'prose-invert' : ''}`}>
                  <p className="text-lg leading-relaxed whitespace-pre-line">{selectedStory.content}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button className={`p-2 rounded-full ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors flex items-center`}>
                      <i className="far fa-bookmark mr-2"></i>
                      <span className="text-sm">收藏</span>
                    </button>
                    
                    <button className={`p-2 rounded-full ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors flex items-center`}>
                      <i className="far fa-share-square mr-2"></i>
                      <span className="text-sm">分享</span>
                    </button>
                  </div>
                  
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors flex items-center">
                    <i className="fas fa-magic mr-2"></i>
                    应用到创作
                  </button>
                </div>
              </div>
            )}
            
            {/* 非遗教程详情 */}
            {selectedVideo && (
              <div>
                <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6 bg-black">
                  {/* 视频播放区域 */}
                  <img 
                    src={selectedVideo.thumbnail} 
                    alt={selectedVideo.title} 
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-600 bg-opacity-80 flex items-center justify-center">
                      <i className="fas fa-play text-white text-2xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    selectedVideo.level === '入门' 
                      ? 'bg-green-100 text-green-600' 
                      : selectedVideo.level === '进阶'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-purple-100 text-purple-600'
                  }`}>
                    {selectedVideo.level}
                  </span>
                </div>
                
                <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                  {selectedVideo.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-sm font-medium mb-2">视频时长</h3>
                    <p className="text-xl font-bold">{selectedVideo.duration}</p>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-sm font-medium mb-2">难度级别</h3>
                    <p className="text-xl font-bold">{selectedVideo.level}</p>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-sm font-medium mb-2">观看次数</h3>
                    <p className="text-xl font-bold">{selectedVideo.views}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button className={`p-2 rounded-full ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors flex items-center`}>
                      <i className="far fa-bookmark mr-2"></i>
                      <span className="text-sm">收藏</span>
                    </button>
                    
                    <button className={`p-2 rounded-full ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors flex items-center`}>
                      <i className="far fa-share-square mr-2"></i>
                      <span className="text-sm">分享</span>
                    </button>
                  </div>
                  
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors flex items-center">
                    <i className="fas fa-play mr-2"></i>
                    开始学习
                  </button>
                </div>
              </div>
            )}
            
            {/* 文化元素详情 */}
            {selectedElement && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <img 
                    src={selectedElement.image} 
                    alt={selectedElement.name} 
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-2xl font-bold">{selectedElement.name}</h2>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDark ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {selectedElement.category}
                      </span>
                    </div>
                    
                    <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                      {selectedElement.description}
                    </p>
                    
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors flex items-center mb-6">
                      <i className="fas fa-magic mr-2"></i>
                      应用到创作
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-xl font-bold mb-4">历史渊源</h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                      {selectedElement.history}
                    </p>
                  </div>
                  
                  <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-xl font-bold mb-4">应用场景</h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                      {selectedElement.usage}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
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
