import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

export const culturalRouter = express.Router();

// 获取文化元素列表
culturalRouter.get('/elements', authenticateToken, async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    const elements = [
      {
        id: '1',
        name: '山水画',
        category: 'painting',
        description: '中国传统绘画的重要流派，以自然山水为题材',
        imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20landscape%20painting&sign=element1',
        culturalSignificance: '体现了中国人对自然的崇敬和哲学思考',
        historicalBackground: '起源于魏晋南北朝时期，成熟于唐宋',
        usageGuidelines: '可用于AI创作中的传统风格参考',
        examples: [
          {
            title: '千里江山图',
            description: '北宋王希孟的代表作品',
            imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Thousand%20Li%20of%20Rivers%20and%20Mountains%20painting&sign=example1'
          }
        ]
      },
      {
        id: '2',
        name: '书法',
        category: 'calligraphy',
        description: '中国传统的文字艺术表现形式',
        imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese%20calligraphy&sign=element2',
        culturalSignificance: '被视为中国文化的核心艺术形式之一',
        historicalBackground: '从甲骨文发展而来，有3000多年历史',
        usageGuidelines: '可用于AI文字生成和艺术创作',
        examples: [
          {
            title: '兰亭序',
            description: '王羲之的行书代表作',
            imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Orchid%20Pavilion%20Preface%20calligraphy&sign=example2'
          }
        ]
      }
    ];

    res.json({
      elements,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: 2,
        totalPages: 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cultural elements' });
  }
});

// 获取文化元素详情
culturalRouter.get('/elements/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const element = {
      id,
      name: '山水画',
      category: 'painting',
      description: '中国传统绘画的重要流派，以自然山水为题材',
      imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20landscape%20painting&sign=element1',
      culturalSignificance: '体现了中国人对自然的崇敬和哲学思考',
      historicalBackground: '起源于魏晋南北朝时期，成熟于唐宋',
      usageGuidelines: '可用于AI创作中的传统风格参考',
      relatedElements: ['2', '3'],
      examples: [
        {
          id: 'example1',
          title: '千里江山图',
          description: '北宋王希孟的代表作品',
          imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Thousand%20Li%20of%20Rivers%20and%20Mountains%20painting&sign=example1'
        }
      ]
    };

    res.json({ element });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cultural element details' });
  }
});

// 搜索文化元素
culturalRouter.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, category, page = 1, limit = 10 } = req.query;
    
    const results = [
      {
        id: '1',
        name: '山水画',
        category: 'painting',
        description: '中国传统绘画的重要流派，以自然山水为题材',
        imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Traditional%20Chinese%20landscape%20painting&sign=element1',
        relevanceScore: 0.95
      }
    ];

    res.json({
      results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: 1,
        totalPages: 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search cultural elements' });
  }
});