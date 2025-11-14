import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

export const analyticsRouter = express.Router();

// 埋点数据收集
analyticsRouter.post('/track', authenticateToken, async (req, res) => {
  try {
    const { event, properties } = req.body;
    const userId = req.user.userId;
    
    console.log(`Analytics event: ${event}`, {
      userId,
      properties,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track analytics' });
  }
});

// 获取用户分析数据
analyticsRouter.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeframe = '30d' } = req.query;
    
    const analytics = {
      userId,
      timeframe,
      stats: {
        totalWorks: 5,
        totalViews: 324,
        totalLikes: 89,
        totalComments: 23,
        averageEngagement: 0.27
      },
      trends: {
        views: [
          { date: '2024-01-01', count: 12 },
          { date: '2024-01-02', count: 18 },
          { date: '2024-01-03', count: 25 }
        ],
        likes: [
          { date: '2024-01-01', count: 3 },
          { date: '2024-01-02', count: 5 },
          { date: '2024-01-03', count: 7 }
        ]
      },
      topWorks: [
        {
          id: 'work1',
          title: '传统山水画创作',
          views: 156,
          likes: 42,
          engagement: 0.27
        }
      ]
    };

    res.json({ analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// 获取平台整体分析数据
analyticsRouter.get('/platform', authenticateToken, async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    const platformAnalytics = {
      timeframe,
      stats: {
        totalUsers: 1247,
        totalWorks: 3421,
        totalViews: 125432,
        totalLikes: 8934,
        totalComments: 2156,
        averageEngagement: 0.23
      },
      trends: {
        userGrowth: [
          { date: '2024-01-01', count: 1200 },
          { date: '2024-01-02', count: 1215 },
          { date: '2024-01-03', count: 1234 }
        ],
        workCreation: [
          { date: '2024-01-01', count: 45 },
          { date: '2024-01-02', count: 52 },
          { date: '2024-01-03', count: 38 }
        ]
      },
      popularCategories: [
        { category: 'traditional', count: 1245, percentage: 0.36 },
        { category: 'calligraphy', count: 892, percentage: 0.26 },
        { category: 'poetry', count: 654, percentage: 0.19 }
      ],
      topUsers: [
        {
          id: 'user1',
          username: '艺术家小王',
          worksCount: 15,
          totalViews: 1250,
          totalLikes: 342
        }
      ]
    };

    res.json({ analytics: platformAnalytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch platform analytics' });
  }
});

// 获取作品分析数据
analyticsRouter.get('/works/:workId', authenticateToken, async (req, res) => {
  try {
    const { workId } = req.params;
    const { timeframe = '30d' } = req.query;
    
    const workAnalytics = {
      workId,
      timeframe,
      stats: {
        totalViews: 156,
        totalLikes: 42,
        totalComments: 8,
        totalShares: 3,
        averageViewTime: 45,
        engagementRate: 0.27
      },
      trends: {
        views: [
          { date: '2024-01-01', count: 12 },
          { date: '2024-01-02', count: 18 },
          { date: '2024-01-03', count: 25 }
        ],
        likes: [
          { date: '2024-01-01', count: 3 },
          { date: '2024-01-02', count: 5 },
          { date: '2024-01-03', count: 7 }
        ]
      },
      demographics: {
        ageGroups: [
          { range: '18-25', percentage: 0.25 },
          { range: '26-35', percentage: 0.35 },
          { range: '36-45', percentage: 0.25 },
          { range: '46+', percentage: 0.15 }
        ],
        regions: [
          { region: '北京', percentage: 0.15 },
          { region: '上海', percentage: 0.12 },
          { region: '广州', percentage: 0.08 },
          { region: '其他', percentage: 0.65 }
        ]
      }
    };

    res.json({ analytics: workAnalytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch work analytics' });
  }
});