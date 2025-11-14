// API客户端封装
const API_BASE_URL = ((import.meta as any).env?.PROD)
  ? '/api'
  : 'http://localhost:3000/api';

class ApiClient {
  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    let data: any = null;
    const ct = response.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }
    }
    if (!response.ok) {
      throw new Error((data && data.error) || `请求失败(${response.status})`);
    }
    return data as T;
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });
    
    return this.handleResponse<T>(response);
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });
    
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    return this.handleResponse<T>(response);
  }

  // 认证相关API
  async login(email: string, password: string) {
    return this.post<{
      success: boolean;
      token: string;
      user: {
        id: string;
        username: string;
        email: string;
        avatar: string;
        isAdmin: boolean;
      };
    }>('/auth/login', { email, password });
  }

  async register(username: string, email: string, password: string) {
    return this.post<{
      success: boolean;
      token: string;
      user: {
        id: string;
        username: string;
        email: string;
        avatar: string;
        isAdmin: boolean;
      };
    }>('/auth/register', { username, email, password });
  }

  async getCurrentUser() {
    return this.get<{
      success: boolean;
      user: {
        id: string;
        username: string;
        email: string;
        avatar: string;
        isAdmin: boolean;
      };
    }>('/auth/me');
  }

  async updateProfile(username: string, avatar: string) {
    return this.put<{
      success: boolean;
      user: {
        id: string;
        username: string;
        email: string;
        avatar: string;
        isAdmin: boolean;
      };
    }>('/auth/profile', { username, avatar });
  }

  async checkEmail(email: string) {
    return this.post<{ exists: boolean }>('/auth/check-email', { email });
  }

  async requestPhoneCode(phone: string) {
    return this.post<{ code: string; message: string }>('/auth/request-phone-code', { phone });
  }

  async loginWithPhone(phone: string, code: string) {
    return this.post<{
      success: boolean;
      token: string;
      user: {
        id: string;
        username: string;
        email: string;
        avatar: string;
        isAdmin: boolean;
      };
    }>('/auth/login-phone', { phone, code });
  }

  async loginWithWeChat() {
    return this.post<{
      success: boolean;
      token: string;
      user: {
        id: string;
        username: string;
        email: string;
        avatar: string;
        isAdmin: boolean;
      };
    }>('/auth/login-wechat');
  }

  // 社交功能API
  async likeWork(workId: string) {
    return this.post<{
      success: boolean;
      liked: boolean;
      likesCount: number;
    }>(`/works/${workId}/like`);
  }

  async getWorkLikeStatus(workId: string) {
    return this.get<{
      liked: boolean;
      likesCount: number;
    }>(`/works/${workId}/like-status`);
  }

  async getWorkComments(workId: string) {
    return this.get<{
      comments: Array<{
        id: string;
        content: string;
        author: {
          id: string;
          username: string;
          avatar: string;
        };
        createdAt: string;
        likes: number;
        liked: boolean;
      }>;
      total: number;
    }>(`/works/${workId}/comments`);
  }

  async addComment(workId: string, content: string) {
    return this.post<{
      success: boolean;
      comment: {
        id: string;
        content: string;
        author: {
          id: string;
          username: string;
          avatar: string;
        };
        createdAt: string;
        likes: number;
        liked: boolean;
      };
    }>(`/works/${workId}/comments`, { content });
  }

  async likeComment(commentId: string) {
    return this.post<{
      success: boolean;
    }>(`/comments/${commentId}/like`);
  }

  async followUser(userId: string) {
    return this.post<{
      success: boolean;
      following: boolean;
    }>(`/social/follow/${userId}`);
  }

  async getFollowing() {
    return this.get<{
      following: Array<{
        id: string;
        username: string;
        avatar: string;
        bio: string;
      }>;
      total: number;
    }>('/social/following');
  }

  async getFollowers() {
    return this.get<{
      followers: Array<{
        id: string;
        username: string;
        avatar: string;
        bio: string;
      }>;
      total: number;
    }>('/social/followers');
  }

  async getSocialFeed() {
    return this.get<{
      feed: Array<{
        id: string;
        type: string;
        user?: {
          id: string;
          username: string;
          avatar: string;
        };
        work?: {
          id: string;
          title: string;
          imageUrl: string;
          description: string;
        };
        title?: string;
        description?: string;
        works?: Array<{
          id: string;
          title: string;
          imageUrl: string;
          author: {
            id: string;
            username: string;
            avatar: string;
          };
        }>;
        createdAt: string;
      }>;
      total: number;
    }>('/social/feed');
  }
}

export const apiClient = new ApiClient();

// 埋点工具
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    try {
      const dev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development';
      const devEnable = localStorage.getItem('analytics_dev_enable');
      if (dev && devEnable !== 'true') {
        return;
      }
      console.log('[Analytics]', event, properties);
      fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          event,
          properties,
          timestamp: Date.now(),
          userId: localStorage.getItem('userId'),
          sessionId: localStorage.getItem('sessionId')
        })
      }).catch(console.error);
    } catch (error) {
      console.error('埋点错误:', error);
    }
  },

  // 页面浏览埋点
  page: (pageName: string, properties?: Record<string, any>) => {
    analytics.track('page_view', { page: pageName, ...properties });
  },

  // 用户行为埋点
  user: (action: string, properties?: Record<string, any>) => {
    analytics.track(`user_${action}`, properties);
  }
};

// 初始化会话
export const initAnalytics = () => {
  if (!localStorage.getItem('sessionId')) {
    localStorage.setItem('sessionId', Date.now().toString());
  }
};
