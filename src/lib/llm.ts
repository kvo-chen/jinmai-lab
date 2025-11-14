export async function chatLLM(params: {
  provider?: 'deepseek' | 'doubao' | 'kimi' | 'jimeng' | 'zhipu' | 'gemini';
  model?: string;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  apiKey?: string;
}) {
  const base = (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) || (import.meta as any).env?.PROD ? '/api/llm' : 'http://localhost:8787/api/llm';
  const key = params.apiKey ?? (typeof window !== 'undefined' ? (localStorage.getItem('llm_api_key_' + (params.provider || 'deepseek')) || '') : '');
  const r = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: params.provider || 'deepseek', model: params.model || (params.provider === 'doubao' ? 'doubao-1.5-pro-32k-250115' : params.provider === 'kimi' ? 'moonshot-v1-32k' : params.provider === 'jimeng' ? 'jimeng-pro-4.0' : params.provider === 'zhipu' ? 'glm-4-flash' : params.provider === 'gemini' ? 'gemini-1.5-pro' : 'deepseek-chat'), messages: params.messages, apiKey: key })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'LLM request failed');
  return String(j?.content || '');
}

export async function generateImage(params: {
  provider?: 'jimeng';
  model?: string;
  prompt: string;
  width?: number;
  height?: number;
  sample_strength?: number;
  response_format?: 'url' | 'b64_json';
  apiKey?: string;
}) {
  const base = (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) || (import.meta as any).env?.PROD ? '/api/image' : 'http://localhost:8787/api/image';
  const r = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: params.provider || 'jimeng',
      model: params.model || 'jimeng-4.0',
      prompt: params.prompt,
      width: params.width ?? 1024,
      height: params.height ?? 1024,
      sample_strength: params.sample_strength ?? 0.5,
      response_format: params.response_format || 'url',
      apiKey: params.apiKey
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'Image request failed');
  const data = Array.isArray(j?.data) ? j.data : [];
  return data.map((x: any) => (x?.url || x?.b64_json || '')).filter((s: string) => s);
}

export async function composeImages(params: {
  provider?: 'jimeng';
  model?: string;
  prompt?: string;
  images: (string | { url: string; weight?: number })[];
  negative_prompt?: string;
  width?: number;
  height?: number;
  sample_strength?: number;
  response_format?: 'url' | 'b64_json';
  apiKey?: string;
}) {
  const base = (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) || (import.meta as any).env?.PROD ? '/api/image/compositions' : 'http://localhost:8787/api/image/compositions';
  const r = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: params.provider || 'jimeng',
      model: params.model || 'jimeng-4.0',
      prompt: params.prompt || '',
      images: params.images || [],
      negative_prompt: params.negative_prompt || '',
      width: params.width ?? 1024,
      height: params.height ?? 1024,
      sample_strength: params.sample_strength ?? 0.5,
      response_format: params.response_format || 'url',
      apiKey: params.apiKey
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'Image composition failed');
  const data = Array.isArray(j?.data) ? j.data : [];
  return data.map((x: any) => (x?.url || x?.b64_json || '')).filter((s: string) => s);
}

export async function klingGenerateImage(params: {
  accessKey?: string;
  secretKey?: string;
  model?: string;
  prompt: string;
  width?: number;
  height?: number;
  response_format?: 'url' | 'b64_json';
}) {
  const base = (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) || (import.meta as any).env?.PROD ? '/api/kling/image' : 'http://localhost:8787/api/kling/image';
  const r = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accessKey: params.accessKey,
      secretKey: params.secretKey,
      model: params.model || 'kling-image-1.0',
      prompt: params.prompt,
      width: params.width ?? 1024,
      height: params.height ?? 1024,
      response_format: params.response_format || 'url'
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'Kling image request failed');
  const data = Array.isArray(j?.data) ? j.data : [];
  return data.map((x: any) => (x?.url || x?.b64_json || '')).filter((s: string) => s);
}

export async function klingGenerateVideo(params: {
  accessKey?: string;
  secretKey?: string;
  model?: string;
  prompt?: string;
  image?: string;
  duration?: number;
  aspect_ratio?: string;
}) {
  const base = (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) || (import.meta as any).env?.PROD ? '/api/kling/video' : 'http://localhost:8787/api/kling/video';
  const r = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accessKey: params.accessKey,
      secretKey: params.secretKey,
      model: params.model || 'kling-video-2.1',
      prompt: params.prompt || '',
      image: params.image || '',
      duration: params.duration ?? 5,
      aspect_ratio: params.aspect_ratio || '16:9'
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'Kling video request failed');
  return { created: j?.created || Date.now() / 1000, taskId: j?.task_id || j?.id || '', data: j?.data || [] };
}
