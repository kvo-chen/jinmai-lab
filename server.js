import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({ origin: true, methods: ['POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '1mb' }));

app.post('/api/llm', async (req, res) => {
  try {
    const { provider = 'deepseek', model = 'deepseek-chat', messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages' });
    }
    if (provider === 'deepseek') {
      const headerToken = req.headers?.authorization ? String(req.headers.authorization).replace(/^Bearer\s+/i, '') : '';
      const bodyToken = typeof req.body?.apiKey === 'string' ? req.body.apiKey : '';
      const apiKey = process.env.DEEPSEEK_API_KEY || headerToken || bodyToken;
      if (!apiKey) {
        return res.status(500).json({ error: 'Missing DEEPSEEK_API_KEY' });
      }
      const r = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages })
      });
      const data = await r.json();
      if (!r.ok) {
        return res.status(r.status).json(data);
      }
      const content = data?.choices?.[0]?.message?.content || '';
      return res.json({ content });
    } else if (provider === 'doubao') {
      const headerToken = req.headers?.authorization ? String(req.headers.authorization).replace(/^Bearer\s+/i, '') : '';
      const bodyToken = typeof req.body?.apiKey === 'string' ? req.body.apiKey : '';
      const apiKey = process.env.ARK_API_KEY || process.env.VOLCENGINE_API_KEY || headerToken || bodyToken;
      if (!apiKey) {
        return res.status(500).json({ error: 'Missing ARK_API_KEY/VOLCENGINE_API_KEY' });
      }
      const base = process.env.VOLCENGINE_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
      const m = String(model || '');
      const isEp = /^ep-[A-Za-z0-9-]+$/.test(m);
      const isBot = /^bot-[A-Za-z0-9-]+$/.test(m);
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(m);
      const path = isBot || isUUID ? 'bots/chat/completions' : 'chat/completions';
      const finalModel = isUUID ? `bot-${m}` : m;
      const extraKeys = [
        'max_completion_tokens',
        'reasoning_effort',
        'temperature',
        'top_p',
        'stop',
        'presence_penalty',
        'frequency_penalty',
        'response_format',
        'tools',
        'tool_choice',
        'stream',
        'metadata'
      ];
      const payload = { model: finalModel, messages };
      for (const k of extraKeys) {
        if (req.body && Object.prototype.hasOwnProperty.call(req.body, k)) {
          payload[k] = req.body[k];
        }
      }
      const r = await fetch(`${base}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(payload)
      });
      const data = await r.json(); 
      if (!r.ok) {
        return res.status(r.status).json(data);
      }
      const content = data?.choices?.[0]?.message?.content || '';
      return res.json({ content });
    } else if (provider === 'kimi') {
      const headerToken = req.headers?.authorization ? String(req.headers.authorization).replace(/^Bearer\s+/i, '') : '';
      const bodyToken = typeof req.body?.apiKey === 'string' ? req.body.apiKey : '';
      const apiKey = process.env.KIMI_API_KEY || process.env.MOONSHOT_API_KEY || headerToken || bodyToken;
      if (!apiKey) {
        return res.status(500).json({ error: 'Missing KIMI_API_KEY/MOONSHOT_API_KEY' });
      }
      const base = process.env.KIMI_BASE_URL || 'https://api.moonshot.cn/v1';
      const r = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages })
      });
      const data = await r.json();
      if (!r.ok) {
        return res.status(r.status).json(data);
      }
      const content = data?.choices?.[0]?.message?.content || '';
      return res.json({ content });
  } else if (provider === 'jimeng') {
      const headerToken = req.headers?.authorization ? String(req.headers.authorization).replace(/^Bearer\s+/i, '') : '';
      const bodyToken = typeof req.body?.apiKey === 'string' ? req.body.apiKey : '';
      const apiKey = process.env.JIMENG_API_KEY || headerToken || bodyToken;
      if (!apiKey) {
        return res.status(500).json({ error: 'Missing JIMENG_API_KEY' });
      }
      const base = process.env.JIMENG_BASE_URL || 'https://api.jimengai.com/v1';
      const r = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages })
      });
      const data = await r.json();
      if (!r.ok) {
        return res.status(r.status).json(data);
      }
      const content = data?.choices?.[0]?.message?.content || '';
      return res.json({ content });
    } else if (provider === 'zhipu') {
      const headerToken = req.headers?.authorization ? String(req.headers.authorization).replace(/^Bearer\s+/i, '') : '';
      const bodyToken = typeof req.body?.apiKey === 'string' ? req.body.apiKey : '';
      const apiKey = process.env.ZHIPU_API_KEY || headerToken || bodyToken;
      if (!apiKey) {
        return res.status(500).json({ error: 'Missing ZHIPU_API_KEY' });
      }
      const base = process.env.ZHIPU_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';
      const r = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages })
      });
      const data = await r.json();
      if (!r.ok) {
        return res.status(r.status).json(data);
      }
      const content = data?.choices?.[0]?.message?.content || '';
      return res.json({ content });
    }
    return res.status(400).json({ error: 'Unsupported provider' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/llm/debug', (req, res) => {
  const headerToken = req.headers?.authorization ? String(req.headers.authorization).replace(/^Bearer\s+/i, '') : '';
  const bodyToken = typeof req.body?.apiKey === 'string' ? req.body.apiKey : '';
  res.json({
    provider: req.body?.provider || null,
    headerTokenPresent: !!headerToken,
    bodyTokenPresent: !!bodyToken,
    deepseekEnvPresent: !!process.env.DEEPSEEK_API_KEY,
    doubaoEnvPresent: !!(process.env.ARK_API_KEY || process.env.VOLCENGINE_API_KEY),
    kimiEnvPresent: !!(process.env.KIMI_API_KEY || process.env.MOONSHOT_API_KEY),
    jimengEnvPresent: !!process.env.JIMENG_API_KEY,
    zhipuEnvPresent: !!process.env.ZHIPU_API_KEY
  });
});

app.post('/api/image', async (req, res) => {
  try {
    const { provider = 'jimeng', model = 'jimeng-4.0', prompt, width = 1024, height = 1024, sample_strength = 0.5, response_format = 'url' } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }
    if (provider !== 'jimeng') {
      return res.status(400).json({ error: 'Unsupported provider for image' });
    }
    const headerToken = req.headers?.authorization ? String(req.headers.authorization).replace(/^Bearer\s+/i, '') : '';
    const bodyToken = typeof req.body?.apiKey === 'string' ? req.body.apiKey : '';
    const apiKey = process.env.JIMENG_API_KEY || headerToken || bodyToken;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing JIMENG_API_KEY' });
    }
    const base = process.env.JIMENG_BASE_URL || 'https://api.jimengai.com/v1';
    const payload = { model, prompt, width, height, sample_strength, response_format };
    const r = await fetch(`${base}/images/generations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json(data);
    }
    return res.json({ created: data?.created || Date.now() / 1000, data: data?.data || [] });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// KLING debug: check AK/SK presence from env/body
app.post('/api/kling/debug', (req, res) => {
  const accessKey = req.body?.accessKey || process.env.KLING_ACCESS_KEY || '';
  const secretKey = req.body?.secretKey || process.env.KLING_SECRET_KEY || '';
  res.json({
    accessKeyPresent: !!accessKey,
    secretKeyPresent: !!secretKey,
    basePresent: !!process.env.KLING_BASE_URL
  });
});

// KLING image generation proxy (experimental)
app.post('/api/kling/image', async (req, res) => {
  try {
    const { model = 'kling-image-1.0', prompt, width = 1024, height = 1024, response_format = 'url', accessKey, secretKey } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }
    const ak = accessKey || process.env.KLING_ACCESS_KEY;
    const sk = secretKey || process.env.KLING_SECRET_KEY;
    if (!ak || !sk) {
      return res.status(500).json({ error: 'Missing KLING_ACCESS_KEY/KLING_SECRET_KEY' });
    }
    const base = process.env.KLING_BASE_URL || 'https://api.klingai.com/v1';
    const payload = { model, prompt, width, height, response_format };
    const r = await fetch(`${base}/images/generations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Access-Key': ak, 'X-Secret-Key': sk },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    return res.json({ created: data?.created || Date.now() / 1000, data: data?.data || [] });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// KLING video generation proxy (experimental)
app.post('/api/kling/video', async (req, res) => {
  try {
    const { model = 'kling-video-2.1', prompt, image, duration = 5, aspect_ratio = '16:9', accessKey, secretKey } = req.body || {};
    if ((!prompt || typeof prompt !== 'string') && !image) {
      return res.status(400).json({ error: 'Invalid prompt/image' });
    }
    const ak = accessKey || process.env.KLING_ACCESS_KEY;
    const sk = secretKey || process.env.KLING_SECRET_KEY;
    if (!ak || !sk) {
      return res.status(500).json({ error: 'Missing KLING_ACCESS_KEY/KLING_SECRET_KEY' });
    }
    const base = process.env.KLING_BASE_URL || 'https://api.klingai.com/v1';
    const payload = { model, prompt, image, duration, aspect_ratio };
    const r = await fetch(`${base}/videos/generations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Access-Key': ak, 'X-Secret-Key': sk },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    return res.json({ created: data?.created || Date.now() / 1000, data: data?.data || [], task_id: data?.id || data?.task_id });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/image/compositions', async (req, res) => {
  try {
    const { provider = 'jimeng', model = 'jimeng-4.0', prompt = '', images = [], negative_prompt = '', width = 1024, height = 1024, sample_strength = 0.5, response_format = 'url' } = req.body || {};
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Invalid images' });
    }
    if (provider !== 'jimeng') {
      return res.status(400).json({ error: 'Unsupported provider for image' });
    }
    const headerToken = req.headers?.authorization ? String(req.headers.authorization).replace(/^Bearer\s+/i, '') : '';
    const bodyToken = typeof req.body?.apiKey === 'string' ? req.body.apiKey : '';
    const apiKey = process.env.JIMENG_API_KEY || headerToken || bodyToken;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing JIMENG_API_KEY' });
    }
    const base = process.env.JIMENG_BASE_URL || 'https://api.jimengai.com/v1';
    const payload = { model, prompt, images, negative_prompt, width, height, sample_strength, response_format };
    const r = await fetch(`${base}/images/compositions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json(data);
    }
    return res.json({ created: data?.created || Date.now() / 1000, data: data?.data || [] });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log('LLM proxy listening on', port);
});
