import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// 模拟用户数据库
const users = new Map();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 中间件：验证JWT
export const authenticateToken = (req: any, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效' });
    }
    req.user = user;
    next();
  });
};

// CORS配置
router.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://traecxzvmsf9.vercel.app', 'https://jinmai-lab.tech', 'https://www.jinmai-lab.tech'],
  credentials: true
}));

// 注册接口
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: '缺少必要字段' });
    }

    if (users.has(email)) {
      return res.status(409).json({ error: '用户已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      avatar: `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User%20avatar%20${username}&sign=${Date.now()}`,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.set(email, user);

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '缺少邮箱或密码' });
    }

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '密码错误' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取用户信息
router.get('/me', authenticateToken, (req: any, res) => {
  try {
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 更新用户信息
router.put('/profile', authenticateToken, async (req: any, res) => {
  try {
    const { username, avatar } = req.body;
    const user = users.get(req.user.email);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

    users.set(req.user.email, user);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 检查邮箱是否存在
router.post('/check-email', (req, res) => {
  try {
    const { email } = req.body;
    const exists = users.has(email);
    res.json({ exists });
  } catch (error) {
    console.error('检查邮箱错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
