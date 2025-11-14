import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import CollaborationPanel from '@/components/CollaborationPanel';
import AID点评 from '@/components/AID点评';
// import useMobileGestures from '@/hooks/useMobileGestures';
import { chatLLM, generateImage, composeImages, klingGenerateImage } from '@/lib/llm';

// 模拟AI生成结果
const aiGeneratedResults = [
  {
    id: 1,
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20generated%20traditional%20Chinese%20design%201&sign=5d295efa4c1b91d0ed9d0424e1d5a77f',
    score: 85,
  },
  {
    id: 2,
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20generated%20traditional%20Chinese%20design%202&sign=971b08d52c4e72712a03066cb833a33d',
    score: 78,
  },
  {
    id: 3,
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20generated%20traditional%20Chinese%20design%203&sign=ac4d5111d8ff13d9443570e326e981d5',
    score: 92,
  },
  {
    id: 4,
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20generated%20traditional%20Chinese%20design%204&sign=bc148392ff4140acadf0a83f843900a5',
    score: 75,
  },
];

// 传统纹样素材
const traditionalPatterns = [
  {
    id: 1,
    name: '云纹',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20cloud%20pattern&sign=d755e544fc16eb71959c8595392c8203',
    description: '象征吉祥如意，常用于传统服饰和建筑',
  },
  {
    id: 2,
    name: '龙纹',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20dragon%20pattern&sign=5cd3b5dd36b10020c3b16e78e34d1401',
    description: '象征权力与尊贵，中国传统文化的重要象征',
  },
  {
    id: 3,
    name: '凤纹',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20phoenix%20pattern&sign=5a5227b9ca3462f9a6968460dffb3b51',
    description: '象征美好与幸福，常与龙纹配合使用',
  },
  {
    id: 4,
    name: '回纹',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20key%20pattern&sign=5de7bed9a5dc7ada21b39308a389568b',
    description: '寓意吉祥绵延，是传统装饰中常见的纹样',
  },
  {
    id: 5,
    name: '花卉纹',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20flower%20pattern&sign=2a4d62b26c213096a7c02cf6e06ddede',
    description: '象征自然与生机，常见牡丹、莲花等纹样',
  },
  {
    id: 6,
    name: '几何纹',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20geometric%20pattern&sign=edbb0ecd67ed828e84a49f142567163a',
    description: '简洁明快，富有节奏感和韵律感',
  },
];

// 创作工具类型
type ToolType = 'sketch' | 'pattern' | 'filter' | 'trace';

export default function Create() {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTool, setActiveTool] = useState<ToolType>('sketch');
  const [prompt, setPrompt] = useState('');
  const [generatedResults, setGeneratedResults] = useState(aiGeneratedResults);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [provider, setProvider] = useState<'deepseek' | 'doubao' | 'kimi' | 'jimeng' | 'kling' | 'zhipu' | 'gemini'>('kimi');
  const [showCulturalInfo, setShowCulturalInfo] = useState(false);
  const [customModel, setCustomModel] = useState('');
  const [refImagesInput, setRefImagesInput] = useState('');
  const [imageMode, setImageMode] = useState<'txt2img' | 'compose'>('txt2img');
  const [negativePromptInput, setNegativePromptInput] = useState('');
  const [qaActive, setQaActive] = useState(false);
  const [qaMessages, setQaMessages] = useState<{ role: 'system' | 'user' | 'assistant'; content: string }[]>([
    { role: 'system', content: '你是提示词采集助手，通过多轮问答澄清目标、风格、受众、文化元素、色彩与尺寸等，问题要简洁具体。用户每次回答后继续追问未明确的点。' }
  ]);
  const [qaInput, setQaInput] = useState('');
  const [qaSending, setQaSending] = useState(false);
  const [qaMode, setQaMode] = useState<'guided' | 'expert' | 'minimal'>('guided');
  const [qaDomain, setQaDomain] = useState<'电商海报' | 'LOGO' | '包装' | '插画' | 'App Banner' | '海报/KV' | '短视频封面'>('电商海报');
  const [qaIndex, setQaIndex] = useState(0);
  const [diversifiedPrompts, setDiversifiedPrompts] = useState<string[]>([]);
  const [diversifying, setDiversifying] = useState(false);
  const [brandPreset, setBrandPreset] = useState<'' | '泥人张' | '杨柳青年画' | '狗不理包子' | '桂发祥麻花' | '耳朵眼炸糕' | '果仁张' | '盛锡福' | '老美华' | '正兴德茶庄'>('');
  const [platform, setPlatform] = useState<'电商竖版' | '电商横版' | '小红书' | '抖音封面' | 'B站封面' | '淘宝主图' | 'LOGO' | '包装正面'>('电商竖版');
  const [size, setSize] = useState<'1080x1920' | '1920x1080' | '1080x1350' | '1920x1080-b' | '800x800' | '1024x1024' | '1200x1800-300DPI'>('1080x1920');
  const [forbidden, setForbidden] = useState('');
  const [needLegalDisclaimer, setNeedLegalDisclaimer] = useState(true);
  const [noMedicalClaims, setNoMedicalClaims] = useState(true);
  const [noIPInfringement, setNoIPInfringement] = useState(true);
  const [noNationalSymbolsMisuse, setNoNationalSymbolsMisuse] = useState(true);
  const brandPresets: Record<string, { voice: string; styleTags: string[]; paletteTags: string[]; cultureTags: string[]; samplePrompts: string[]; forbiddenPoints: string[]; platformSafeZones: Record<string, string> }> = {
    '泥人张': { voice: '非遗彩塑、人物传神、戏曲民俗、手作温度、京味津韵', styleTags: ['非遗彩塑', '手作刀痕', '文博展陈', '暖调灯光'], paletteTags: ['胭脂红', '黛青', '象牙白', '点金'], cultureTags: ['戏曲脸谱', '胡同巷景', '作坊案台'], samplePrompts: ['非遗彩塑肖像，泥人张风格，戏曲人物神态生动，手作质感，红黑金点缀，暖光', '市井童趣泥塑小景，老天津胡同与摊位，温润泥感，莫兰迪低饱和', '非遗主题展KV，泥塑与现代几何拼贴，中英标题，文博感'], forbiddenPoints: ['不得丑化或戏谑非遗形象', '不得误用宗教/戏曲符号', '不得低俗网红化', '不得虚假联名'], platformSafeZones: { '电商竖版': '顶部80px与底部120px避免重要信息，主体居中', '电商横版': '左右各120px裁切安全，文案中上部', '小红书': '顶部昵称区100px与底部互动区160px避让', '抖音封面': '右侧操作区120px与底部200px避让，主体偏左', 'B站封面': '左下角180x180避让，标题位于中上1/3', '淘宝主图': '四边60px安全区，主体占比≥70%', '包装正面': '四边出血3mm，Logo与卖点居中', 'LOGO': '四周安全边距x单位'} },
    '杨柳青年画': { voice: '吉祥民俗、年味喜庆、木刻套印、寓意象征', styleTags: ['套色版画', '题签留白', '传统纹样', '吉祥象征'], paletteTags: ['中国红', '石青', '石绿', '赭黄', '黑'], cultureTags: ['门神', '娃娃年画', '“福”字'], samplePrompts: ['杨柳青年画门神，套色版画肌理，红黑金强对比，福瑞主题，春节KV', '现代构成×年画拼贴，几何留白+书法题签，潮流国风', '亲子文创包装，年画娃娃主视觉，温暖米白纸感'], forbiddenPoints: ['不得恶搞门神形象', '不得滥用吉祥符号', '不得错误配色与肌理缺失', '不得误导地域来源'], platformSafeZones: { '电商竖版': '顶部80px与底部120px避免重要信息，主体居中', '电商横版': '左右各120px裁切安全，文案中上部', '小红书': '顶部昵称区100px与底部互动区160px避让', '抖音封面': '右侧操作区120px与底部200px避让，主体偏左', 'B站封面': '左下角180x180避让，标题位于中上1/3', '淘宝主图': '四边60px安全区，主体占比≥70%', '包装正面': '四边出血3mm，Logo与卖点居中', 'LOGO': '四周安全边距x单位'} },
    '狗不理包子': { voice: '匠心面点、鲜香多汁、城市名片、烟火日常', styleTags: ['蒸汽氛围', '褶皱光影', '极简摄影'], paletteTags: ['红金', '米白', '木色'], cultureTags: ['蒸笼竹屉', '老字号印章'], samplePrompts: ['蒸汽弥漫的鲜肉包特写，褶皱光影，红金品牌章，城市名片', '家庭团圆餐桌，竹屉蒸笼，软焦暖光，生活方式大片', '航站楼灯箱KV，极简白底+包子特写，红金品牌角标'], forbiddenPoints: ['不得虚假健康功效宣称', '不得不当卫生画面', '不得抄袭他牌形象', '不得误导产地'], platformSafeZones: { '电商竖版': '顶部80px与底部120px避免重要信息，主体居中', '电商横版': '左右各120px裁切安全，文案中上部', '小红书': '顶部昵称区100px与底部互动区160px避让', '抖音封面': '右侧操作区120px与底部200px避让，主体偏左', 'B站封面': '左下角180x180避让，标题位于中上1/3', '淘宝主图': '四边60px安全区，主体占比≥70%', '包装正面': '四边出血3mm，Logo与卖点居中', 'LOGO': '四周安全边距x单位'} },
    '桂发祥麻花': { voice: '层层酥脆、什锦夹馅、节庆馈赠、街巷记忆', styleTags: ['扭绞纹理', '礼盒结构', '复古年味'], paletteTags: ['喜庆红', '暖黄', '金'], cultureTags: ['十八街元素', '街牌符号'], samplePrompts: ['麻花质感微距，芝麻与酥层清晰，红金礼盒，年礼主题', '城市礼物KV，十八街路牌拼贴，现代无衬线中英组合', '复古年画风格×麻花构图，暖黄底色，手绘插画'], forbiddenPoints: ['不得虚假营养宣称', '不得误用“十八街”标识', '不得夸张金属感误导', '不得低俗表达'], platformSafeZones: { '电商竖版': '顶部80px与底部120px避免重要信息，主体居中', '电商横版': '左右各120px裁切安全，文案中上部', '小红书': '顶部昵称区100px与底部互动区160px避让', '抖音封面': '右侧操作区120px与底部200px避让，主体偏左', 'B站封面': '左下角180x180避让，标题位于中上1/3', '淘宝主图': '四边60px安全区，主体占比≥70%', '包装正面': '四边出血3mm，Logo与卖点居中', 'LOGO': '四周安全边距x单位'} },
    '耳朵眼炸糕': { voice: '金黄外酥、内馅软糯、庙会市井、步步高寓意', styleTags: ['油泡高光', '断面拉丝', '档口烟火'], paletteTags: ['金黄', '焦糖褐', '暖白', '墨绿'], cultureTags: ['胡同路牌', '庙会气氛'], samplePrompts: ['炸糕断面特写，金黄油亮，胡同路牌元素，市井烟火', '庙会主题海报，大字号“步步高”，复古招贴风', '外卖装视觉，极简白底+金黄食物主视觉，清洁感'], forbiddenPoints: ['不得医疗保健暗示', '不得过度油脂夸张', '不得低俗化市井形象', '不得误导原料'], platformSafeZones: { '电商竖版': '顶部80px与底部120px避免重要信息，主体居中', '电商横版': '左右各120px裁切安全，文案中上部', '小红书': '顶部昵称区100px与底部互动区160px避让', '抖音封面': '右侧操作区120px与底部200px避让，主体偏左', 'B站封面': '左下角180x180避让，标题位于中上1/3', '淘宝主图': '四边60px安全区，主体占比≥70%', '包装正面': '四边出血3mm，Logo与卖点居中', 'LOGO': '四周安全边距x单位'} },
    '果仁张': { voice: '焦香坚果、真材实料、老少皆宜、伴手礼', styleTags: ['铜锅炒制', '坚果散落', '票号纹理'], paletteTags: ['焦糖褐', '坚果米色', '墨绿', '铜金'], cultureTags: ['老票据', '市井小店'], samplePrompts: ['果仁糖近景，碎裂动态，铜版复古插画，礼盒陈列', '老票据纹理底图+坚果散落，怀旧文案题签', '亲子零食KV，健康轻负担调性，明快光线'], forbiddenPoints: ['不得虚假原料来源', '不得抄袭票据纹理版权', '不得夸大健康益处', '不得误导产地'], platformSafeZones: { '电商竖版': '顶部80px与底部120px避免重要信息，主体居中', '电商横版': '左右各120px裁切安全，文案中上部', '小红书': '顶部昵称区100px与底部互动区160px避让', '抖音封面': '右侧操作区120px与底部200px避让，主体偏左', 'B站封面': '左下角180x180避让，标题位于中上1/3', '淘宝主图': '四边60px安全区，主体占比≥70%', '包装正面': '四边出血3mm，Logo与卖点居中', 'LOGO': '四周安全边距x单位'} },
    '盛锡福': { voice: '匠心制帽、绅士格调、经典款式、国潮改良', styleTags: ['呢料纹理', '缝线细节', '礼帽徽章'], paletteTags: ['墨黑', '藏青', '驼', '金属扣件色'], cultureTags: ['帽模台', '复古陈列'], samplePrompts: ['经典礼帽静物，呢料质感微距，墨黑驼配色，金徽章', '国潮街拍，帽饰搭配，城市夜景霓虹，复古现代混搭', '礼盒开箱KV，磁吸结构+烫金标，简洁高端'], forbiddenPoints: ['不得伪装奢侈联名', '不得抄袭徽章/标识', '不得误导材质与工艺', '不得低俗噱头'], platformSafeZones: { '电商竖版': '顶部80px与底部120px避免重要信息，主体居中', '电商横版': '左右各120px裁切安全，文案中上部', '小红书': '顶部昵称区100px与底部互动区160px避让', '抖音封面': '右侧操作区120px与底部200px避让，主体偏左', 'B站封面': '左下角180x180避让，标题位于中上1/3', '淘宝主图': '四边60px安全区，主体占比≥70%', '包装正面': '四边出血3mm，Logo与卖点居中', 'LOGO': '四周安全边距x单位'} },
    '老美华': { voice: '舒适国货、手工针脚、文艺日常、非遗织造', styleTags: ['布纹织理', '刺绣花纹', '手工针脚'], paletteTags: ['靛蓝', '米白', '墨黑', '朱砂红'], cultureTags: ['竹编衬底', '宣纸肌理'], samplePrompts: ['传统布鞋与刺绣花纹，手工针脚可见，清新自然布景', '国风穿搭海报，留白+品牌章，文艺质朴', '老字号×高校IP联名概念图，校园元素融合'], forbiddenPoints: ['不得抄袭刺绣图案', '不得误导手工工艺', '不得虚假舒适性宣称', '不得低俗国风化'], platformSafeZones: { '电商竖版': '顶部80px与底部120px避免重要信息，主体居中', '电商横版': '左右各120px裁切安全，文案中上部', '小红书': '顶部昵称区100px与底部互动区160px避让', '抖音封面': '右侧操作区120px与底部200px避让，主体偏左', 'B站封面': '左下角180x180避让，标题位于中上1/3', '淘宝主图': '四边60px安全区，主体占比≥70%', '包装正面': '四边出血3mm，Logo与卖点居中', 'LOGO': '四周安全边距x单位'} },
    '正兴德茶庄': { voice: '老茶铺风骨、清幽雅致、礼赠社交、讲究水火', styleTags: ['紫砂壶', '盖碗茶席', '书法题签'], paletteTags: ['墨绿', '砂金', '宣纸白', '棕'], cultureTags: ['篆刻章', '宣纸肌理'], samplePrompts: ['茶席静物，紫砂壶与盖碗蒸腾，墨绿砂金，书法题签', '商务礼茶包装，抽屉盒+烫金篆章，礼序感', '茶会KV，国风留白构图，行书标题，沉静气质'], forbiddenPoints: ['不得虚假年份与产地', '不得保健功效宣称', '不得误导水温与冲泡方式', '不得伪造大师款'], platformSafeZones: { '电商竖版': '顶部80px与底部120px避免重要信息，主体居中', '电商横版': '左右各120px裁切安全，文案中上部', '小红书': '顶部昵称区100px与底部互动区160px避让', '抖音封面': '右侧操作区120px与底部200px避让，主体偏左', 'B站封面': '左下角180x180避让，标题位于中上1/3', '淘宝主图': '四边60px安全区，主体占比≥70%', '包装正面': '四边出血3mm，Logo与卖点居中', 'LOGO': '四周安全边距x单位'} }
  };
  // 去重修正：以上变量已在顶部定义
  const providerDefaultModel: Record<'deepseek' | 'doubao' | 'kimi' | 'jimeng' | 'kling' | 'zhipu' | 'gemini', string> = {
    deepseek: 'deepseek-chat',
    doubao: '093d64b7-5bcb-4f65-aab1-6782e71fd804',
    kimi: 'moonshot-v1-32k',
    jimeng: 'jimeng-pro-4.0',
    kling: 'kling-image-1.0',
    zhipu: 'glm-4-flash',
    gemini: 'gemini-1.5-pro'
  };
  useEffect(() => {
    setCustomModel(providerDefaultModel[provider]);
  }, [provider]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [showAID点评, setShowAID点评] = useState(false);
  const [isPrecheckEnabled, setIsPrecheckEnabled] = useState(true);
  const [precheckResult, setPrecheckResult] = useState<{
    status: 'pending' | 'passed' | 'warning' | 'failed';
    issues: { type: string; severity: 'warning' | 'error'; message: string }[];
  } | null>(null);
  
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

  // 自动保存草稿功能
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (prompt.trim()) {
        localStorage.setItem('create_draft_prompt', prompt);
        localStorage.setItem('create_draft_provider', provider);
        localStorage.setItem('create_draft_customModel', customModel);
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [prompt, provider, customModel]);

  // 恢复草稿
  useEffect(() => {
    const savedPrompt = localStorage.getItem('create_draft_prompt');
    const savedProvider = localStorage.getItem('create_draft_provider');
    const savedModel = localStorage.getItem('create_draft_customModel');
    
    if (savedPrompt && !prompt) {
      setPrompt(savedPrompt);
    }
    if (savedProvider && !provider) {
      setProvider(savedProvider as any);
    }
    if (savedModel && !customModel) {
      setCustomModel(savedModel);
    }
  }, []);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('请输入创作提示词');
      return;
    }
    try {
      setIsGenerating(true);
      const llmProvider = (provider === 'kling' ? 'zhipu' : provider) as 'deepseek' | 'doubao' | 'kimi' | 'jimeng' | 'zhipu' | 'gemini';
      const llmModel = customModel.trim() || (llmProvider === 'doubao' ? 'doubao-1.5-pro-32k-250115' : llmProvider === 'kimi' ? 'moonshot-v1-32k' : llmProvider === 'jimeng' ? 'jimeng-pro-4.0' : llmProvider === 'zhipu' ? 'glm-4-flash' : llmProvider === 'gemini' ? 'gemini-1.5-pro' : 'deepseek-chat');
      const content = await chatLLM({
        provider: llmProvider,
        model: llmModel,
        messages: [
          { role: 'system', content: `请严格遵循：平台=${platform}，尺寸=${size}；${needLegalDisclaimer ? '需附合规意识' : ''}${noMedicalClaims ? '；不得医疗/功效性暗示' : ''}${noIPInfringement ? '；不得未经授权的IP/商标元素' : ''}${noNationalSymbolsMisuse ? '；不得不当使用国旗国徽等' : ''}${forbidden ? '；禁止元素：' + forbidden : ''}${brandPreset ? '；品牌禁用：' + (brandPresets[brandPreset].forbiddenPoints || []).join('、') : ''}${brandPreset ? '；品牌语气：' + brandPresets[brandPreset].voice : ''}${brandPreset && brandPresets[brandPreset].platformSafeZones[platform] ? '；平台安全区：' + brandPresets[brandPreset].platformSafeZones[platform] : ''}` },
          { role: 'system', content: '你是资深视觉设计师，请基于提示词生成3个不同风格的创意方案，简短描述每个方案的主题与风格关键词，用中文分行返回。' },
          { role: 'user', content: prompt }
        ]
      });
      const lines = String(content || '').split(/\n|；|;|\r/).filter((s) => s.trim()).slice(0, 3);
      const refsRaw = refImagesInput.split(/\n|,|\s+/).map((s) => s.trim()).filter((s) => s);
      const refs = refsRaw
        .map((s) => {
          const m = s.match(/^(https?:\/\/\S+?)(?:@([0-9]*\.?[0-9]+))?$/);
          if (!m) return null;
          const url = m[1];
          const weight = m[2] ? parseFloat(m[2]) : undefined;
          return weight !== undefined ? { url, weight } : { url };
        })
        .filter(Boolean) as ({ url: string; weight?: number })[];
      let next = lines.map((_, idx) => ({ id: idx + 1, thumbnail: '', score: 80 + Math.floor(Math.random() * 15) }));
      if (provider === 'jimeng' && imageMode === 'compose' && refs.length > 0) {
        const images = await Promise.all(lines.map((t) => composeImages({ provider: 'jimeng', prompt: t, images: refs, model: 'jimeng-4.0', width: 1024, height: 1024, negative_prompt: negativePromptInput.trim() })));
        next = next.map((item, i) => ({
          ...item,
          thumbnail: images[i]?.[0] || `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=${encodeURIComponent(lines[i] || `AI design ${i+1}`)}&sign=5d295efa4c1b91d0ed9d0424e1d5a77f`
        }));
      } else if (provider === 'jimeng' && imageMode === 'txt2img') {
        const images = await Promise.all(lines.map((t) => generateImage({ provider: 'jimeng', prompt: t, model: 'jimeng-4.0', width: 1024, height: 1024 })));
        next = next.map((item, i) => ({
          ...item,
          thumbnail: images[i]?.[0] || `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=${encodeURIComponent(lines[i] || `AI design ${i+1}`)}&sign=5d295efa4c1b91d0ed9d0424e1d5a77f`
        }));
      } else if (provider === 'kling' && imageMode === 'txt2img') {
        const images = await Promise.all(lines.map((t) => klingGenerateImage({ model: 'kling-image-1.0', prompt: t, width: 1024, height: 1024 })));
        next = next.map((item, i) => ({
          ...item,
          thumbnail: images[i]?.[0] || `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=${encodeURIComponent(lines[i] || `AI design ${i+1}`)}&sign=5d295efa4c1b91d0ed9d0424e1d5a77f`
        }));
      } else {
        const makeThumb = (t: string, i: number) => `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=${encodeURIComponent(t || `AI design ${i+1}`)}&sign=5d295efa4c1b91d0ed9d0424e1d5a77f`;
        next = lines.map((t, idx) => ({ id: idx + 1, thumbnail: makeThumb(t, idx), score: 80 + Math.floor(Math.random() * 15) }));
      }
      setGeneratedResults(next.length ? next : aiGeneratedResults);
      setCurrentStep(2);
      toast.success('AI创作完成！请选择一个方案进行编辑');
    } catch (e) {
      toast.error('调用大模型失败，请配置密钥');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      toast.error('请输入创作提示词');
      return;
    }
    try {
      setIsOptimizing(true);
      const content = await chatLLM({
        provider: provider as 'deepseek' | 'doubao' | 'kimi' | 'jimeng' | 'zhipu' | 'gemini',
        model: customModel.trim() || (provider === 'doubao' ? 'doubao-1.5-pro-32k-250115' : provider === 'kimi' ? 'moonshot-v1-32k' : provider === 'gemini' ? 'gemini-1.5-pro' : 'deepseek-chat'),
        messages: [
          { role: 'system', content: '你是中文提示词优化助手，输出更清晰、具体的提示词' },
          { role: 'user', content: prompt }
        ]
      });
      setPrompt(content || prompt);
      toast.success('已优化提示词');
    } catch (e) {
      toast.error('调用大模型失败，请配置密钥');
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleSelectResult = (id: number) => {
    setSelectedResult(id);
    setCurrentStep(3);
  };
  
  const handleSaveDraft = () => {
    const draftData = {
      prompt,
      provider,
      customModel,
      refImagesInput,
      negativePromptInput,
      imageMode,
      selectedResult,
      currentStep,
      timestamp: new Date().toISOString()
    };
    
    const drafts = JSON.parse(localStorage.getItem('drafts') || '[]');
    drafts.unshift(draftData);
    
    // 限制保存最近10个草稿
    if (drafts.length > 10) {
      drafts.splice(10);
    }
    
    localStorage.setItem('drafts', JSON.stringify(drafts));
    
    // 清除当前草稿
    localStorage.removeItem('create_draft_prompt');
    localStorage.removeItem('create_draft_provider');
    localStorage.removeItem('create_draft_customModel');
    
    toast.success('草稿已保存到草稿箱');
  };
  
  const handlePublish = () => {
    // 执行AI预审
    if (isPrecheckEnabled) {
      performPrecheck();
    } else {
      // 跳过预审直接发布
      completePublish();
    }
  };
  
  const performPrecheck = () => {
    setPrecheckResult({
      status: 'pending',
      issues: []
    });
    
    // 模拟AI预审过程
    setTimeout(() => {
      setPrecheckResult({
        status: 'warning',
        issues: [
          { 
            type: 'content', 
            severity: 'warning', 
            message: '检测到部分文化元素使用可能存在歧义，建议进行调整' 
          },
          { 
            type: 'copyright', 
            severity: 'warning', 
            message: '建议添加版权存证，保护您的原创权益' 
          }
        ]
      });
    }, 1500);
  };
  
  const completePublish = () => {
    toast.success('作品发布成功！正在进行版权存证...');
    
    // 模拟版权存证过程
    setTimeout(() => {
      toast.success('版权存证完成！');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 1500);
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/dashboard');
    }
  };
  
  const handleConfirmPrecheck = () => {
    if (precheckResult?.status === 'warning') {
      // 如果有警告但用户确认继续发布
      completePublish();
    }
  };
  
  const toggleCulturalInfo = () => {
    setShowCulturalInfo(!showCulturalInfo);
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
          </div>
        </nav>
        
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* 面包屑骨架屏 */}
            <div className={`h-8 w-1/3 rounded ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
            
            {/* 步骤指示器骨架屏 */}
            <div className={`h-10 rounded ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
            
            {/* 主要内容骨架屏 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`col-span-1 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 animate-pulse`}>
                <div className="space-y-6">
                  <div className={`h-12 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'} animate-pulse`}></div>
                  <div className={`h-32 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'} animate-pulse`}></div>
                  <div className={`h-12 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'} animate-pulse`}></div>
                </div>
              </div>
              
              <div className={`col-span-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 animate-pulse`}>
                <div className="space-y-6">
                  <div className={`h-6 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'} animate-pulse w-1/4`}></div>
                  <div className={`h-40 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'} animate-pulse`}></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className={`h-12 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'} animate-pulse`}></div>
                    ))}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setQaActive(!qaActive)}
                    className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-sm`}
                  >
                    {qaActive ? '收起交互问答' : '开启交互问答'}
                  </button>
                </div>
                {qaActive && (
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-3 mt-3 space-y-3`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <select value={qaMode} onChange={(e) => { setQaMode(e.target.value as any); setQaIndex(0); }} className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-2 py-1 text-xs`}>
                        <option value="guided">引导模式</option>
                        <option value="expert">专家模式</option>
                        <option value="minimal">极简模式</option>
                      </select>
                      <select value={qaDomain} onChange={(e) => { setQaDomain(e.target.value as any); setQaIndex(0); }} className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-2 py-1 text-xs`}>
                        <option>电商海报</option>
                        <option>LOGO</option>
                        <option>包装</option>
                        <option>插画</option>
                        <option>App Banner</option>
                        <option>海报/KV</option>
                        <option>短视频封面</option>
                      </select>
                      <select value={brandPreset} onChange={(e) => { setBrandPreset(e.target.value as any); }} className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-2 py-1 text-xs`}>
                        <option value="">未选择品牌</option>
                        <option>泥人张</option>
                        <option>杨柳青年画</option>
                        <option>狗不理包子</option>
                        <option>桂发祥麻花</option>
                        <option>耳朵眼炸糕</option>
                        <option>果仁张</option>
                        <option>盛锡福</option>
                        <option>老美华</option>
                        <option>正兴德茶庄</option>
                      </select>
                      {(() => {
                        const key = `${qaMode}_${['电商海报','LOGO','包装','插画','App Banner','海报/KV','短视频封面'].includes(qaDomain) ? qaDomain : 'default'}`;
                        const bank: any = {
                          guided_电商海报: ['商品或主题是什么', '目标人群与场景是什么', '想要的气质与风格关键词', '主要视觉元素与文化元素', '画面构图比例与尺寸', '色彩倾向与品牌色', '文案口号与语气', '输出格式与分辨率'],
                          guided_LOGO: ['品牌名称和寓意', '行业与受众', '希望传达的性格', '偏好的形态与元素', '中式文化是否要体现', '颜色与单双色适配', '应用场景', '交付格式'],
                          guided_包装: ['产品品类与规格', '材质与工艺', '风格与文化元素', '正面主视觉要点', '配色与限制', '文案与合规', '展开尺寸与刀模'],
                          guided_插画: ['主题与情绪', '时代与文化氛围', '角色/场景要素', '视角构图与比例', '笔触质感与风格流派', '颜色氛围', '输出尺寸与用途'],
                          expert_default: ['有哪些不可出现的元素', '必须包含的文化符号', '品牌风格指南的关键点', '使用的具体色值', '目标平台的尺寸与安全区', '竞品差异化点'],
                          minimal_default: ['一句话描述目标', '三个风格词', '两个文化元素', '一个主色与一个辅色', '比例与尺寸']
                        };
                        const list: string[] = bank[key] || bank[`${qaMode}_default`] || [];
                        return list.length ? (
                          <div className="flex items-center gap-2 text-xs">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>推荐问题：</span>
                            <button onClick={() => { setQaInput(list[qaIndex % list.length]); }} className="px-2 py-1 rounded bg-red-600 text-white">{list[qaIndex % list.length]}</button>
                            <button onClick={() => setQaIndex((qaIndex + 1) % (list.length || 1))} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded`}>换一换</button>
                          </div>
                        ) : null;
                      })()}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['中式新潮','极简留白','赛博东方','复古做旧','手绘插画','拟物质感','霓虹夜色'].map((t) => (
                        <button key={t} onClick={() => setQaInput((v) => (v ? v + '；风格：' + t : '风格：' + t))} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded text-xs`}>{t}</button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['中国红/金','水墨青/灰','高级黑/银','莫兰迪','暖阳橙','薄荷绿'].map((t) => (
                        <button key={t} onClick={() => setQaInput((v) => (v ? v + '；配色：' + t : '配色：' + t))} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded text-xs`}>{t}</button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['云纹','回纹','龙纹','凤纹','青花瓷','剪纸','篆刻'].map((t) => (
                        <button key={t} onClick={() => setQaInput((v) => (v ? v + '；文化元素：' + t : '文化元素：' + t))} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded text-xs`}>{t}</button>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select value={platform} onChange={(e) => setPlatform(e.target.value as any)} className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-2 py-1 text-xs`}>
                        <option value="电商竖版">电商竖版</option>
                        <option value="电商横版">电商横版</option>
                        <option value="小红书">小红书</option>
                        <option value="抖音封面">抖音封面</option>
                        <option value="B站封面">B站封面</option>
                        <option value="淘宝主图">淘宝主图</option>
                        <option value="LOGO">LOGO</option>
                        <option value="包装正面">包装正面</option>
                      </select>
                      <select value={size} onChange={(e) => setSize(e.target.value as any)} className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-2 py-1 text-xs`}>
                        <option value="1080x1920">1080x1920</option>
                        <option value="1920x1080">1920x1080</option>
                        <option value="1080x1350">1080x1350</option>
                        <option value="1920x1080-b">1920x1080-横幅</option>
                        <option value="800x800">800x800</option>
                        <option value="1024x1024">1024x1024</option>
                        <option value="1200x1800-300DPI">1200x1800-300DPI</option>
                      </select>
                      <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={needLegalDisclaimer} onChange={(e) => setNeedLegalDisclaimer(e.target.checked)} /> 法律免责声明</label>
                      <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={noMedicalClaims} onChange={(e) => setNoMedicalClaims(e.target.checked)} /> 禁止医疗功效</label>
                      <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={noIPInfringement} onChange={(e) => setNoIPInfringement(e.target.checked)} /> 禁止IP侵权</label>
                      <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={noNationalSymbolsMisuse} onChange={(e) => setNoNationalSymbolsMisuse(e.target.checked)} /> 禁止不当国旗国徽使用</label>
                    </div>
                    <input value={forbidden} onChange={(e) => setForbidden(e.target.value)} placeholder="可选：禁止出现的元素/词汇，如涉黄暴、宗教极端、误用文化符号等" className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 text-xs w-full`} />
                    {brandPreset && (
                      <>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>品牌：</span>
                          <span className={`${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{brandPreset}</span>
                          <button onClick={() => setQaMessages([...qaMessages, { role: 'user', content: `品牌：${brandPreset}；语气：${brandPresets[brandPreset].voice}` }])} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded`}>应用品牌语气</button>
                          <button onClick={() => { setDiversifiedPrompts(brandPresets[brandPreset].samplePrompts || []); }} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded`}>载入品牌提示词</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(brandPresets[brandPreset].styleTags || []).map((t) => (
                            <button key={t} onClick={() => setQaInput((v) => (v ? v + '；风格：' + t : '风格：' + t))} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded text-xs`}>{t}</button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(brandPresets[brandPreset].paletteTags || []).map((t) => (
                            <button key={t} onClick={() => setQaInput((v) => (v ? v + '；配色：' + t : '配色：' + t))} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded text-xs`}>{t}</button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(brandPresets[brandPreset].cultureTags || []).map((t) => (
                            <button key={t} onClick={() => setQaInput((v) => (v ? v + '；文化元素：' + t : '文化元素：' + t))} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded text-xs`}>{t}</button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>安全区：</span>
                          <span className={`${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{brandPresets[brandPreset].platformSafeZones[platform] || '无特殊说明'}</span>
                          <button onClick={() => setForbidden((brandPresets[brandPreset].forbiddenPoints || []).join('、'))} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded`}>载入禁用点</button>
                        </div>
                      </>
                    )}
                    <div className="max-h-48 overflow-auto space-y-2">
                      {qaMessages.filter(m => m.role !== 'system').map((m, i) => (
                        <div key={i} className={`text-sm ${m.role === 'assistant' ? (isDark ? 'text-gray-200' : 'text-gray-700') : 'text-red-600'}`}>
                          <span className="font-medium mr-2">{m.role === 'assistant' ? 'AI' : '你'}</span>{m.content}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={qaInput}
                        onChange={(e) => setQaInput(e.target.value)}
                        placeholder="回答AI提出的问题，或主动补充需求"
                        className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 text-sm flex-1`}
                      />
                      <button
                        onClick={async () => {
                          if (!qaInput.trim()) return;
                          try {
                            setQaSending(true);
                            const msgs = [...qaMessages, { role: 'user' as const, content: qaInput.trim() }];
                            setQaMessages(msgs);
                            const content = await chatLLM({
                              provider: (provider === 'kling' ? 'zhipu' : provider) as 'deepseek' | 'doubao' | 'kimi' | 'jimeng' | 'zhipu' | 'gemini',
                              model: customModel.trim() || (provider === 'doubao' ? 'doubao-1.5-pro-32k-250115' : provider === 'kimi' ? 'moonshot-v1-32k' : provider === 'jimeng' ? 'jimeng-pro-4.0' : provider === 'zhipu' ? 'glm-4-flash' : provider === 'gemini' ? 'gemini-1.5-pro' : 'deepseek-chat'),
                              messages: msgs
                            });
                            setQaMessages([...msgs, { role: 'assistant' as const, content }]);
                            setQaInput('');
                          } catch {
                            toast.error('调用大模型失败，请配置密钥');
                          } finally {
                            setQaSending(false);
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                        disabled={qaSending}
                      >
                        {qaSending ? '发送中...' : '发送'}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          try {
                            const summary = await chatLLM({
                              provider: (provider === 'kling' ? 'zhipu' : provider) as 'deepseek' | 'doubao' | 'kimi' | 'jimeng' | 'zhipu' | 'gemini',
                              model: customModel.trim() || (provider === 'doubao' ? 'doubao-1.5-pro-32k-250115' : provider === 'kimi' ? 'moonshot-v1-32k' : provider === 'jimeng' ? 'jimeng-pro-4.0' : provider === 'zhipu' ? 'glm-4-flash' : provider === 'gemini' ? 'gemini-1.5-pro' : 'deepseek-chat'),
                              messages: [
                                { role: 'system', content: `请严格遵循：平台=${platform}，尺寸=${size}；${needLegalDisclaimer ? '需附合规意识' : ''}${noMedicalClaims ? '；不得医疗/功效性暗示' : ''}${noIPInfringement ? '；不得未经授权的IP/商标元素' : ''}${noNationalSymbolsMisuse ? '；不得不当使用国旗国徽等' : ''}${forbidden ? '；禁止元素：' + forbidden : ''}${brandPreset ? '；品牌禁用：' + (brandPresets[brandPreset].forbiddenPoints || []).join('、') : ''}${brandPreset && brandPresets[brandPreset].platformSafeZones[platform] ? '；平台安全区：' + brandPresets[brandPreset].platformSafeZones[platform] : ''}` },
                                { role: 'system', content: '你是提示词整合器，将对话内容浓缩为一段中文提示词，包含主题、风格、构图、文化元素、色彩、尺寸/比例、输出格式等要点，语言简洁可直接用于生成。' },
                                ...qaMessages.filter(m => m.role !== 'system')
                              ]
                            });
                            setPrompt(summary || prompt);
                            toast.success('已根据问答生成提示词');
                          } catch {
                            toast.error('调用大模型失败，请配置密钥');
                          }
                        }}
                        className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-sm`}
                      >
                        汇总成提示词
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            setDiversifying(true);
                            const res = await chatLLM({
                              provider: (provider === 'kling' ? 'zhipu' : provider) as 'deepseek' | 'doubao' | 'kimi' | 'jimeng' | 'zhipu' | 'gemini',
                              model: customModel.trim() || (provider === 'doubao' ? 'doubao-1.5-pro-32k-250115' : provider === 'kimi' ? 'moonshot-v1-32k' : provider === 'jimeng' ? 'jimeng-pro-4.0' : provider === 'zhipu' ? 'glm-4-flash' : provider === 'gemini' ? 'gemini-1.5-pro' : 'deepseek-chat'),
                              messages: [
                                { role: 'system', content: `请严格遵循：平台=${platform}，尺寸=${size}；${needLegalDisclaimer ? '需附合规意识' : ''}${noMedicalClaims ? '；不得医疗/功效性暗示' : ''}${noIPInfringement ? '；不得未经授权的IP/商标元素' : ''}${noNationalSymbolsMisuse ? '；不得不当使用国旗国徽等' : ''}${forbidden ? '；禁止元素：' + forbidden : ''}${brandPreset ? '；品牌禁用：' + (brandPresets[brandPreset].forbiddenPoints || []).join('、') : ''}${brandPreset && brandPresets[brandPreset].platformSafeZones[platform] ? '；平台安全区：' + brandPresets[brandPreset].platformSafeZones[platform] : ''}` },
                                { role: 'system', content: '根据用户对话与需求，生成6条风格各异、可直接用于图像生成的中文提示词，使用短句分行列出，不要编号。每条尽量覆盖主题、风格、文化元素、色彩与比例。' },
                                ...qaMessages.filter(m => m.role !== 'system')
                              ]
                            });
                            const list = String(res || '').split(/\n|；|;|\r/).map(s => s.trim()).filter(Boolean).slice(0, 6);
                            setDiversifiedPrompts(list);
                          } catch {
                            toast.error('调用大模型失败，请配置密钥');
                          } finally {
                            setDiversifying(false);
                          }
                        }}
                        className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-sm`}
                      >
                        {diversifying ? '多样化生成中...' : '生成多样化提示词'}
                      </button>
                      <button
                        onClick={() => setQaMessages([{ role: 'system', content: qaMessages[0].content }])}
                        className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-sm`}
                      >
                        重置问答
                      </button>
                    </div>
                    {diversifiedPrompts.length > 0 && (
                      <div className="space-y-2">
                        {diversifiedPrompts.map((p, i) => (
                          <div key={i} className={`${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-2 flex justify-between items-center text-sm`}>
                            <span className={`${isDark ? 'text-gray-200' : 'text-gray-700'} truncate mr-2`}>{p}</span>
                            <div className="flex gap-2">
                              <button onClick={() => setPrompt(p)} className="px-2 py-1 rounded bg-red-600 text-white text-xs">使用</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              </div>
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
            {typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development' && localStorage.getItem('analytics_dev_enable') !== 'true' && (
              <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>开发模式：埋点已关闭</span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowCollaborationPanel(true)}
              className={`px-4 py-2 rounded-full transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              协作
            </button>
            <button 
              onClick={() => setShowAID点评(true)}
              className={`px-4 py-2 rounded-full transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              AI点评
            </button>
            <button 
              onClick={handleSaveDraft}
              className={`px-4 py-2 rounded-full transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              保存草稿
            </button>
            <button 
              onClick={handlePublish}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
              disabled={currentStep < 3}
            >
              发布作品
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
            <a href="#" className="hover:text-red-600 transition-colors">创作中心</a>
            <i className="fas fa-chevron-right text-xs mx-2 opacity-50"></i>
            <span className="opacity-70">AI创作</span>
          </div>
        </div>
        
        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    step < currentStep 
                      ? 'bg-green-500 text-white' 
                      : step === currentStep 
                        ? 'bg-red-600 text-white scale-110 shadow-md' 
                        : isDark 
                          ? 'bg-gray-700 text-gray-400' 
                          : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    step
                  )}
                </div>
                <span 
                  className={`text-xs ${
                    step === currentStep 
                      ? 'font-medium' 
                      : isDark 
                        ? 'text-gray-400' 
                        : 'text-gray-500'
                  }`}
                >
                  {step === 1 && '输入提示词'}
                  {step === 2 && '选择方案'}
                  {step === 3 && '编辑优化'}
                </span>
              </div>
            ))}
          </div>
          
          {/* 进度条 */}
          <div className="relative h-1 mt-2">
            <div className={`absolute inset-0 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div 
              className="absolute left-0 top-0 h-full rounded-full bg-red-600 transition-all"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* 创作工具区 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-md`}>
            {/* 工具选择 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">创作工具</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'sketch', name: '一键设计', icon: 'magic' },
                  { id: 'pattern', name: '纹样嵌入', icon: 'th' },
                  { id: 'filter', name: 'AI滤镜', icon: 'filter' },
                  { id: 'trace', name: '文化溯源', icon: 'book-open' }
                ].map((tool) => (
                  <motion.button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id as ToolType)}
                    className={`p-3 rounded-xl flex flex-col items-center transition-all ${
                      activeTool === tool.id 
                        ? 'bg-red-50 text-red-600 border-red-200 border' 
                        : isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <i className={`fas fa-${tool.icon} text-xl mb-2`}></i>
                    <span className="text-sm font-medium">{tool.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* 提示词输入 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">创作提示</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述您想要创作的内容，例如：具有中国传统元素的现代包装设计..."
                className={`w-full p-3 rounded-xl h-32 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 border' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 border'
                }`}
              ></textarea>
              
              <div className="mt-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm opacity-70">模型提供方</span>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as 'deepseek' | 'doubao' | 'kimi' | 'jimeng' | 'kling' | 'zhipu' | 'gemini')}
                    className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 text-sm`}
                  >
                    <option value="deepseek">DeepSeek</option>
                    <option value="kimi">Kimi</option>
                    <option value="jimeng">即梦</option>
                    <option value="kling">可灵</option>
                    <option value="zhipu">智谱</option>
                    <option value="gemini">Gemini</option>
                  </select>
                </div>
                <div className="mb-3">
                  <input
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder={provider === 'doubao' ? '输入豆包接入点ID或bot/UUID' : provider === 'kimi' ? '输入Kimi模型名' : provider === 'jimeng' ? '输入即梦模型名' : provider === 'kling' ? '输入可灵模型名' : provider === 'zhipu' ? '输入智谱模型名' : '输入模型名'}
                    className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 text-sm w-full`}
                  />
                </div>
                {provider === 'jimeng' && (
                  <div className="mb-3">
                    <div className="flex gap-3 mb-2">
                      <label className="text-sm flex items-center gap-2">
                        <input type="radio" checked={imageMode === 'txt2img'} onChange={() => setImageMode('txt2img')} /> 文生图
                      </label>
                      <label className="text-sm flex items-center gap-2">
                        <input type="radio" checked={imageMode === 'compose'} onChange={() => setImageMode('compose')} /> 多图融合
                      </label>
                    </div>
                    {imageMode === 'compose' && (
                      <>
                        <textarea
                          value={refImagesInput}
                          onChange={(e) => setRefImagesInput(e.target.value)}
                          placeholder="粘贴参考图片URL，换行或逗号分隔；URL后可用@权重，如 https://xxx.jpg@0.8"
                          className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 text-sm w-full h-20`}
                        />
                        <textarea
                          value={negativePromptInput}
                          onChange={(e) => setNegativePromptInput(e.target.value)}
                          placeholder="负面提示（可选），用于排除不希望出现的元素"
                          className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 text-sm w-full h-16 mt-2`}
                        />
                        <p className="text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}">选择“多图融合”时将结合参考图与负面提示生成方案</p>
                      </>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || currentStep > 1}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        AI创作中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>
                        生成设计
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center`}
                  >
                    {isOptimizing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        提示词优化中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-wand-magic-sparkles mr-2"></i>
                        提示词优化
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* 历史记录 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">历史记录</h3>
                <button 
                  onClick={() => {
                    const drafts = JSON.parse(localStorage.getItem('drafts') || '[]');
                    if (drafts.length > 0) {
                      const latestDraft = drafts[0];
                      setPrompt(latestDraft.prompt);
                      setProvider(latestDraft.provider);
                      setCustomModel(latestDraft.customModel);
                      setRefImagesInput(latestDraft.refImagesInput || '');
                      setNegativePromptInput(latestDraft.negativePromptInput || '');
                      setImageMode(latestDraft.imageMode || 'txt2img');
                      setSelectedResult(latestDraft.selectedResult || null);
                      setCurrentStep(latestDraft.currentStep || 1);
                      toast.success('已恢复最新草稿');
                    } else {
                      toast.info('暂无保存的草稿');
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  恢复草稿
                </button>
              </div>
              <div className={`p-4 rounded-xl text-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="text-2xl mb-2">
                  <i className="far fa-clock"></i>
                </div>
                <p className="text-sm opacity-70">
                  {currentStep === 1 ? '暂无创作历史' : '当前正在创作中'}
                </p>
                <div className="mt-2 text-xs opacity-50">
                  自动保存: {localStorage.getItem('create_draft_prompt') ? '已启用' : '未启用'}
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧预览和编辑区 */}
          <div className={`lg:col-span-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-md`}>
            {/* 文化信息提示 */}
            {showCulturalInfo && (
              <motion.div 
                className={`mb-6 p-4 rounded-xl border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-yellow-50 border-yellow-200'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="fas fa-info"></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">文化元素：云纹</h4>
                      <p className="text-sm opacity-80">
                        云纹是中国传统装饰纹样中常见的一种，象征着吉祥如意、高升和祥瑞。
                        在传统建筑、服饰和工艺品中广泛应用，代表着中国传统文化的精髓。
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleCulturalInfo}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* 步骤1：输入提示词 */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="mb-6 text-6xl text-red-600">
                  <i className="fas fa-magic"></i>
                </div>
                <h2 className="text-2xl font-bold mb-4">开始您的AI创作之旅</h2>
                <p className="opacity-80 max-w-lg mx-auto mb-8">
                  在左侧输入创作提示，AI将根据您的描述生成独特的设计作品。
                  您可以添加传统元素、指定风格，让AI为您带来无限创意。
                </p>
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=AI%20design%20workflow%20illustration%2C%20creative%20process%20concept&sign=9bd352839edca3384d1a85b069ffb466" 
                  alt="AI创作流程" 
                  className="rounded-xl mx-auto max-w-full h-auto"
                />
              </motion.div>
            )}
            
            {/* 步骤2：选择方案 */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold mb-6">选择您喜欢的设计方案</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedResults.map((result) => (
                    <motion.div
                      key={result.id}
                      className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedResult === result.id 
                          ? 'border-red-500 shadow-lg' 
                          : isDark 
                            ? 'border-gray-700' 
                            : 'border-gray-200'
                      }`}
                      whileHover={{ y: -5 }}
                      onClick={() => handleSelectResult(result.id)}
                    >
                      <div className="relative">
                        <img 
                          src={result.thumbnail} 
                          alt={`AI生成方案 ${result.id}`} 
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                          匹配度 {result.score}%
                        </div>
                        {selectedResult === result.id && (
                          <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <i className="fas fa-check-circle mr-1"></i>
                            已选择
                          </div>
                        )}
                      </div>
                      
                      <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">AI生成方案 {result.id}</h3>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCulturalInfo();
                            }}
                            className="text-sm text-red-600 hover:underline"
                          >
                            查看文化元素
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={handleBack}
                    className={`px-5 py-2.5 rounded-full transition-colors ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    返回
                  </button>
                  
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        重新生成
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sync-alt mr-2"></i>
                        重新生成
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* 步骤3：编辑优化 */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold mb-6">编辑您的设计作品</h2>
                
                {/* 预览区 */}
                <div className="mb-6">
                  <div className={`aspect-w-4 aspect-h-3 rounded-xl overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                    {selectedResult && (
                      <img 
                        src={generatedResults.find(r => r.id === selectedResult)?.thumbnail} 
                        alt="选中的设计方案" 
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>
                </div>
                
                {/* 编辑工具 */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">调整工具</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: '调整大小', icon: 'arrows-alt', action: () => toast.info('调整大小功能开发中...') },
                      { name: '滤镜效果', icon: 'image', action: () => toast.info('滤镜效果功能开发中...') },
                      { name: '色彩调整', icon: 'palette', action: () => toast.info('色彩调整功能开发中...') },
                      { name: '添加文字', icon: 'font', action: () => toast.info('添加文字功能开发中...') },
                      { name: '图层管理', icon: 'layers', action: () => toast.info('图层管理功能开发中...') },
                      { name: '撤销/重做', icon: 'undo', action: () => toast.info('撤销/重做功能开发中...') }
                    ].map((tool, index) => (
                      <button
                        key={index}
                        onClick={tool.action}
                        className={`p-2 rounded-lg flex flex-col items-center ${
                          isDark 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        } transition-colors hover:scale-105 transform`}
                      >
                        <i className={`fas fa-${tool.icon} mb-1`}></i>
                        <span className="text-xs">{tool.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 素材库 */}
                <div>
                  <h3 className="font-medium mb-3">传统纹样素材</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {traditionalPatterns.map((pattern) => (
                      <motion.div
                        key={pattern.id}
                        className={`rounded-lg overflow-hidden border ${
                          isDark ? 'border-gray-700' : 'border-gray-200'
                        } cursor-pointer`}
                        whileHover={{ scale: 1.05 }}
                        onClick={toggleCulturalInfo}
                      >
                        <img 
                          src={pattern.thumbnail} 
                          alt={pattern.name} 
                          className="w-full h-16 object-cover"
                        />
                        <div className={`p-2 text-xs text-center ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          {pattern.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={handleBack}
                    className={`px-5 py-2.5 rounded-full transition-colors ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    返回
                  </button>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleSaveDraft}
                      className={`px-5 py-2.5 rounded-full transition-colors ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      保存草稿
                    </button>
                    
                    <button 
                      onClick={handlePublish}
                      className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                    >
                      发布作品
                    </button>
                  </div>
                </div>

                {/* 分享预览 */}
                <div className="mt-6 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                  <h4 className="font-medium mb-3">分享预览</h4>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={generatedResults.find(r => r.id === selectedResult)?.thumbnail} 
                      alt="分享预览"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium">{prompt || '我的AI创作作品'}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        基于传统纹样创作的现代设计作品
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: prompt || '我的AI创作作品',
                            text: prompt,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('链接已复制到剪贴板');
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                    >
                      分享
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
           </div>
         </main>
         
         {/* 协作面板 */}
         {showCollaborationPanel && (
           <CollaborationPanel 
             isOpen={showCollaborationPanel}
             onClose={() => setShowCollaborationPanel(false)}
           />
         )}
         
         {/* AI点评面板 */}
         {showAID点评 && (
           <AID点评 
             workId="123"
             onClose={() => setShowAID点评(false)}
           />
         )}
         
         {/* 内容预审弹窗 */}
         {precheckResult && precheckResult.status !== 'pending' && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? 'bg-gray-900 bg-opacity-80' : 'bg-gray-50 bg-opacity-80'} backdrop-blur-sm`}
           >
             <motion.div 
               className={`rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl max-w-2xl w-full mx-4`}
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
             >
               <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                 <h3 className="text-xl font-bold">AI内容预审</h3>
                 <button 
                   onClick={() => setPrecheckResult(null)}
                   className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                   aria-label="关闭"
                 >
                   <i className="fas fa-times"></i>
                 </button>
               </div>
               
               <div className="p-6">
                 <div className="flex items-center mb-6">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                     precheckResult.status === 'passed' ? 'bg-green-100 text-green-600' : 
                     precheckResult.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                     'bg-red-100 text-red-600'
                   }`}>
                     {precheckResult.status === 'passed' ? (
                       <i className="fas fa-check"></i>
                     ) : precheckResult.status === 'warning' ? (
                       <i className="fas fa-exclamation-triangle"></i>
                     ) : (
                       <i className="fas fa-times"></i>
                     )}
                   </div>
                   <div>
                     <h4 className="font-bold text-lg">
                       {precheckResult.status === 'passed' ? '预审通过' : 
                        precheckResult.status === 'warning' ? '预审有警告' : '预审未通过'}
                     </h4>
                     <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                       {precheckResult.status === 'passed' ? '您的作品符合平台规范，可以发布。' : 
                        precheckResult.status === 'warning' ? '您的作品存在一些潜在问题，建议进行调整。' : 
                        '您的作品存在不符合平台规范的内容，请修改后重新提交。'}
                     </p>
                   </div>
                 </div>
                 
                 <div className="mb-6">
                   <h5 className="font-medium mb-3">预审详情</h5>
                   <div className="space-y-3">
                     {precheckResult.issues.map((issue, index) => (
                       <div 
                         key={index} 
                         className={`p-3 rounded-lg ${
                           issue.severity === 'error' 
                             ? isDark ? 'bg-red-900 bg-opacity-30' : 'bg-red-50' 
                             : isDark ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50'
                         }`}
                       >
                         <div className="flex items-start">
                           <i className={`fas ${
                             issue.severity === 'error' ? 'fa-times-circle' : 'fa-exclamation-circle'
                           } mr-2 mt-0.5 text-${
                             issue.severity === 'error' ? 'red-500' : 'yellow-500'
                           }`}></i>
                           <div>
                             <p className="text-sm font-medium">{issue.type === 'content' ? '内容合规性' : '版权问题'}</p>
                             <p className="text-sm mt-1">{issue.message}</p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
                 
                 <div className="flex items-center mb-6">
                   <input
                     type="checkbox"
                     id="enable-precheck"
                     checked={isPrecheckEnabled}
                     onChange={(e) => setIsPrecheckEnabled(e.target.checked)}
                     className="mr-2 rounded text-red-600 focus:ring-red-500"
                   />
                   <label htmlFor="enable-precheck" className="text-sm">
                     启用AI内容预审（建议开启，帮助确保作品合规）
                   </label>
                 </div>
               </div>
               
               <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
                 {precheckResult.status === 'warning' && (
                   <>
                     <button 
                       onClick={() => setPrecheckResult(null)}
                       className={`px-4 py-2 rounded-lg ${
                         isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                       } transition-colors`}
                     >
                       返回修改
                     </button>
                     <button 
                       onClick={handleConfirmPrecheck}
                       className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                     >
                       确认发布
                     </button>
                   </>
                 )}
                 {precheckResult.status === 'passed' && (
                   <button 
                     onClick={completePublish}
                     className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                   >
                     继续发布
                   </button>
                 )}
                 {precheckResult.status === 'failed' && (
                   <button 
                     onClick={() => setPrecheckResult(null)}
                     className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                   >
                     返回修改
                   </button>
                 )}
               </div>
             </motion.div>
           </motion.div>
         )}
         
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
