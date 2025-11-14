const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 登录
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });
  
  if (email === 'admin@example.com' && password === 'Admin123') {
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        username: '管理员',
        email: 'admin@example.com',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Admin%20avatar&sign=642683509e21425ee6e24388ff9dcff1',
        isAdmin: true
      }
    });
  } else if (email === 'user@example.com' && password === 'User123') {
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '2',
        username: '设计师小明',
        email: 'user@example.com',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20xiaoming&sign=cc76aace202a78fcb07391c53cf45642'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// 获取当前用户信息
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  if (token.includes('mock-jwt-token')) {
    res.json({
      user: {
        id: '1',
        username: '管理员',
        email: 'admin@example.com',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Admin%20avatar&sign=642683509e21425ee6e24388ff9dcff1',
        isAdmin: true
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// 注册
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (email === 'user@example.com') {
    return res.status(400).json({ error: 'Email already exists' });
  }

  res.json({
    user: {
      id: 'user-' + Date.now(),
      username,
      email,
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=New%20user%20avatar&sign=5f5176153a417f0bddbebba6c0c67102'
    }
  });
});

// 请求手机验证码
app.post('/api/auth/request-phone-code', (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // 模拟发送验证码
  const code = String(Math.floor(100000 + Math.random() * 900000));
  console.log(`SMS code for ${phone}: ${code}`);

  res.json({
    code, // 在真实环境中，这个不应该返回给客户端
    message: 'Verification code sent successfully'
  });
});

// 手机号登录
app.post('/api/auth/login-phone', (req, res) => {
  const { phone, code } = req.body;
  
  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and code are required' });
  }

  // 模拟验证码验证 - 任何6位数字都接受
  if (code.length === 6 && /^\d{6}$/.test(code)) {
    res.json({
      token: 'mock-jwt-token-phone-' + Date.now(),
      user: {
        id: 'phone-' + phone,
        username: '手机号用户',
        email: phone + '@local',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Phone%20user%20avatar&sign=1a3b7c1d9c1b4a6fa3f4c7b2c1d4e6f7'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid verification code' });
  }
});

// 微信登录
app.post('/api/auth/login-wechat', (req, res) => {
  // 模拟微信登录
  res.json({
    token: 'mock-jwt-token-wechat-' + Date.now(),
    user: {
      id: 'wechat-' + Date.now(),
      username: '微信用户',
      email: `wechat_${Date.now()}@local`,
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=WeChat%20user%20avatar&sign=7b4c71e8f7fb4a1ea9b8f6d2a4b5b4fd'
    }
  });
});

// 获取作品列表
app.get('/api/works', (req, res) => {
  const works = [
    {
      id: '1',
      title: '传统山水画创作',
      description: '融合现代AI技术的传统山水画作品',
      imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Traditional%20Chinese%20landscape%20painting&sign=abc123',
      category: 'traditional',
      status: 'completed',
      createdAt: new Date().toISOString(),
      author: {
        id: 'user1',
        username: '艺术家小王',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Artist%20avatar&sign=def456'
      },
      likes: 42,
      comments: 8,
      views: 156,
      tags: ['山水画', 'AI创作', '传统文化']
    }
  ];

  res.json({
    works,
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    }
  });
});

// 内存存储用于社交功能
const likes = new Map(); // workId -> Set(userId)
const comments = new Map(); // workId -> Array(comment objects)
const follows = new Map(); // userId -> Set(followedUserId)
const userLikes = new Map(); // userId -> Set(workId)

// 点赞作品
app.post('/api/works/:id/like', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const workId = req.params.id;
  const token = authHeader.split(' ')[1];
  const userId = token.includes('mock-jwt-token') ? '1' : 'unknown';

  if (!likes.has(workId)) {
    likes.set(workId, new Set());
  }
  
  const workLikes = likes.get(workId);
  
  if (workLikes.has(userId)) {
    // 取消点赞
    workLikes.delete(userId);
    if (!userLikes.has(userId)) {
      userLikes.set(userId, new Set());
    }
    userLikes.get(userId).delete(workId);
    
    res.json({ 
      success: true, 
      liked: false, 
      likesCount: workLikes.size 
    });
  } else {
    // 点赞
    workLikes.add(userId);
    if (!userLikes.has(userId)) {
      userLikes.set(userId, new Set());
    }
    userLikes.get(userId).add(workId);
    
    res.json({ 
      success: true, 
      liked: true, 
      likesCount: workLikes.size 
    });
  }
});

// 获取作品点赞状态
app.get('/api/works/:id/like-status', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const workId = req.params.id;
  const token = authHeader.split(' ')[1];
  const userId = token.includes('mock-jwt-token') ? '1' : 'unknown';

  const workLikes = likes.get(workId) || new Set();
  const liked = workLikes.has(userId);
  
  res.json({ 
    liked, 
    likesCount: workLikes.size 
  });
});

// 获取作品评论
app.get('/api/works/:id/comments', (req, res) => {
  const workId = req.params.id;
  const workComments = comments.get(workId) || [];
  
  res.json({
    comments: workComments,
    total: workComments.length
  });
});

// 添加评论
app.post('/api/works/:id/comments', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const workId = req.params.id;
  const { content } = req.body;
  const token = authHeader.split(' ')[1];
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  if (!comments.has(workId)) {
    comments.set(workId, []);
  }
  
  const workComments = comments.get(workId);
  const newComment = {
    id: 'comment-' + Date.now(),
    content: content.trim(),
    author: {
      id: token.includes('mock-jwt-token') ? '1' : 'unknown',
      username: token.includes('mock-jwt-token') ? '管理员' : '用户',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar&sign=abc123'
    },
    createdAt: new Date().toISOString(),
    likes: 0,
    liked: false
  };
  
  workComments.unshift(newComment);
  
  res.json({
    success: true,
    comment: newComment
  });
});

// 点赞评论
app.post('/api/comments/:id/like', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const commentId = req.params.id;
  
  // 找到评论并更新点赞数
  let commentFound = false;
  for (const [workId, workComments] of comments.entries()) {
    const comment = workComments.find(c => c.id === commentId);
    if (comment) {
      comment.likes += 1;
      comment.liked = true;
      commentFound = true;
      break;
    }
  }
  
  if (!commentFound) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  
  res.json({ success: true });
});

// 关注用户
app.post('/api/social/follow/:userId', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const targetUserId = req.params.userId;
  const token = authHeader.split(' ')[1];
  const currentUserId = token.includes('mock-jwt-token') ? '1' : 'unknown';

  if (currentUserId === targetUserId) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  if (!follows.has(currentUserId)) {
    follows.set(currentUserId, new Set());
  }
  
  const userFollows = follows.get(currentUserId);
  
  if (userFollows.has(targetUserId)) {
    // 取消关注
    userFollows.delete(targetUserId);
    res.json({ success: true, following: false });
  } else {
    // 关注
    userFollows.add(targetUserId);
    res.json({ success: true, following: true });
  }
});

// 获取关注列表
app.get('/api/social/following', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const currentUserId = token.includes('mock-jwt-token') ? '1' : 'unknown';
  
  const userFollows = follows.get(currentUserId) || new Set();
  const followingList = Array.from(userFollows).map(userId => ({
    id: userId,
    username: userId === '2' ? '设计师小明' : '用户' + userId,
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar&sign=abc123',
    bio: 'AI创作爱好者'
  }));
  
  res.json({
    following: followingList,
    total: followingList.length
  });
});

// 获取粉丝列表
app.get('/api/social/followers', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const currentUserId = token.includes('mock-jwt-token') ? '1' : 'unknown';
  
  const followers = [];
  for (const [userId, userFollows] of follows.entries()) {
    if (userFollows.has(currentUserId)) {
      followers.push({
        id: userId,
        username: userId === '2' ? '设计师小明' : '用户' + userId,
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar&sign=abc123',
        bio: 'AI创作爱好者'
      });
    }
  }
  
  res.json({
    followers,
    total: followers.length
  });
});

// 获取社交动态
app.get('/api/social/feed', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const currentUserId = token.includes('mock-jwt-token') ? '1' : 'unknown';
  
  const userFollows = follows.get(currentUserId) || new Set();
  
  // 模拟关注用户的动态
  const feedItems = [];
  
  // 添加关注用户的新作品
  for (const followedUserId of userFollows) {
    feedItems.push({
      id: 'feed-' + Date.now() + '-' + followedUserId,
      type: 'new_work',
      user: {
        id: followedUserId,
        username: followedUserId === '2' ? '设计师小明' : '用户' + followedUserId,
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar&sign=abc123'
      },
      work: {
        id: 'work-' + followedUserId + '-' + Date.now(),
        title: '新作品 - ' + new Date().toLocaleDateString(),
        imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=AI%20artwork&sign=def456',
        description: '这是关注用户的新创作'
      },
      createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
    });
  }
  
  // 添加一些系统推荐内容
  feedItems.push({
    id: 'feed-recommend-' + Date.now(),
    type: 'recommendation',
    title: '发现新作品',
    description: '基于您的兴趣推荐',
    works: [
      {
        id: 'recommend-1',
        title: '推荐作品1',
        imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Recommended%20artwork&sign=abc123',
        author: {
          id: 'artist-1',
          username: '推荐艺术家',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Artist%20avatar&sign=def456'
        }
      }
    ],
    createdAt: new Date().toISOString()
  });
  
  // 按时间排序
  feedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({
    feed: feedItems,
    total: feedItems.length
  });
});

// 更新用户资料
app.put('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const { username, bio, avatar } = req.body;
  const token = authHeader.split(' ')[1];
  
  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  if (username.trim().length < 2 || username.trim().length > 20) {
    return res.status(400).json({ error: 'Username must be between 2 and 20 characters' });
  }
  
  res.json({
    success: true,
    user: {
      id: token.includes('mock-jwt-token') ? '1' : 'unknown',
      username: username.trim(),
      email: token.includes('mock-jwt-token') ? 'admin@example.com' : 'user@local',
      avatar: avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar&sign=abc123',
      bio: bio || ''
    }
  });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});