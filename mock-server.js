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

app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});