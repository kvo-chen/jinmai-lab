import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

export const socialRouter = express.Router();

// 获取用户动态
socialRouter.get('/feed', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const activities = [
      {
        id: '1',
        type: 'work_published',
        content: '发布了新作品《传统山水画创作》',
        createdAt: new Date().toISOString(),
        user: {
          id: 'user1',
          username: '艺术家小王',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Artist%20avatar&sign=def456'
        },
        work: {
          id: 'work1',
          title: '传统山水画创作',
          imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Traditional%20Chinese%20landscape%20painting&sign=abc123'
        }
      }
    ];

    res.json({
      activities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: 1,
        totalPages: 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch social feed' });
  }
});

// 关注用户
socialRouter.post('/follow/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'follow' or 'unfollow'
    
    res.json({ 
      message: `User ${action}ed successfully`,
      followingCount: action === 'follow' ? 15 : 14
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// 获取用户关注列表
socialRouter.get('/following', authenticateToken, async (req, res) => {
  try {
    const following = [
      {
        id: 'user2',
        username: '书法爱好者',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Calligraphy%20enthusiast%20avatar&sign=jkl012',
        bio: '热爱传统书法艺术',
        isFollowing: true
      }
    ];

    res.json({ following });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch following list' });
  }
});

// 获取用户粉丝列表
socialRouter.get('/followers', authenticateToken, async (req, res) => {
  try {
    const followers = [
      {
        id: 'user3',
        username: '文化爱好者',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Culture%20enthusiast%20avatar&sign=mno345',
        bio: '传统文化传播者',
        isFollowing: false
      }
    ];

    res.json({ followers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch followers list' });
  }
});