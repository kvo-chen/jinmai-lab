import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

export const worksRouter = express.Router();

// 获取作品列表
worksRouter.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // 模拟作品数据
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
        page: Number(page),
        limit: Number(limit),
        total: 1,
        totalPages: 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch works' });
  }
});

// 获取单个作品详情
worksRouter.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const work = {
      id,
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
    };

    res.json({ work });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch work details' });
  }
});

// 创建新作品
worksRouter.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, imageUrl, category, tags } = req.body;
    
    const newWork = {
      id: `work-${Date.now()}`,
      title,
      description,
      imageUrl,
      category,
      status: 'draft',
      createdAt: new Date().toISOString(),
      author: {
        id: req.user.userId,
        username: req.user.username,
        avatar: req.user.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Default%20avatar&sign=default'
      },
      likes: 0,
      comments: 0,
      views: 0,
      tags: tags || []
    };

    res.json({ work: newWork });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create work' });
  }
});