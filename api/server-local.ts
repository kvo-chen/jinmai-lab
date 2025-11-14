import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { authRouter } from './auth.js';
import { worksRouter } from './works.js';
import { socialRouter } from './social.js';
import { culturalRouter } from './cultural.js';
import { analyticsRouter } from './analytics.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://traecxzvmsf9.vercel.app', 'https://jinmai-lab.tech', 'https://www.jinmai-lab.tech'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API路由
app.use('/api/auth', authRouter);
app.use('/api/works', worksRouter);
app.use('/api/social', socialRouter);
app.use('/api/cultural', culturalRouter);
app.use('/api/analytics', analyticsRouter);

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
