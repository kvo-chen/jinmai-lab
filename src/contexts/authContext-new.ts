import * as React from "react";
import { createContext, useState, ReactNode, useEffect } from "react";
import { apiClient, analytics, initAnalytics } from '@/lib/api';
import { toast } from 'sonner';

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  age?: number;
  interests?: string[];
}

// AuthContext 类型定义
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  loginWithWeChat: () => Promise<boolean>;
  requestPhoneCode: (phone: string) => Promise<string>;
  loginWithPhone: (phone: string, code: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// AuthProvider 组件属性类型
interface AuthProviderProps {
  children: ReactNode;
}

// 创建Context
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  loginWithWeChat: async () => false,
  requestPhoneCode: async () => '',
  loginWithPhone: async () => false,
  logout: () => {},
  refreshUser: async () => {},
});

// AuthProvider 组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化分析
  useEffect(() => {
    initAnalytics();
  }, []);

  // 检查登录状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // 验证token并获取用户信息
        const response = await apiClient.getCurrentUser();
        setUser(response.user);
        setIsAuthenticated(true);
        
        // 埋点：用户自动登录成功
        analytics.user('auto_login_success', {
          userId: response.user.id,
          username: response.user.username
        });
      } catch (error) {
        console.error('自动登录失败:', error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        
        // 埋点：用户自动登录失败
        analytics.user('auto_login_failed', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 登录方法
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 埋点：用户尝试登录
      analytics.user('login_attempt', { email });
      
      const response = await apiClient.login(email, password);
      
      // 保存token和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // 埋点：用户登录成功
      analytics.user('login_success', {
        userId: response.user.id,
        username: response.user.username
      });
      
      toast.success('登录成功！');
      return true;
    } catch (error) {
      console.error('登录失败:', error);
      
      // 埋点：用户登录失败
      analytics.user('login_failed', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error(error instanceof Error ? error.message : '登录失败');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册方法
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 埋点：用户尝试注册
      analytics.user('register_attempt', { email, username });
      
      const response = await apiClient.register(username, email, password);
      
      // 保存token和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // 埋点：用户注册成功
      analytics.user('register_success', {
        userId: response.user.id,
        username: response.user.username
      });
      
      toast.success('注册成功！');
      return true;
    } catch (error) {
      console.error('注册失败:', error);
      
      // 埋点：用户注册失败
      analytics.user('register_failed', {
        email,
        username,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error(error instanceof Error ? error.message : '注册失败');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      // 如果token失效，自动登出
      if (error instanceof Error && error.message.includes('令牌')) {
        logout();
      }
    }
  };

  // 登出方法
  const logout = () => {
    // 埋点：用户登出
    if (user) {
      analytics.user('logout', {
        userId: user.id,
        username: user.username
      });
    }
    
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    
    // 重置状态
    setIsAuthenticated(false);
    setUser(null);
    
    toast.success('已登出');
  };

  // 微信登录（模拟）
  const loginWithWeChat = async (): Promise<boolean> => {
    try {
      // 模拟微信登录
      toast.info('正在跳转到微信登录...');
      
      // 这里应该实现真实的微信登录流程
      setTimeout(() => {
        toast.info('微信登录功能开发中');
      }, 2000);
      
      return false;
    } catch (error) {
      console.error('微信登录失败:', error);
      toast.error('微信登录失败');
      return false;
    }
  };

  // 请求手机验证码（模拟）
  const requestPhoneCode = async (phone: string): Promise<string> => {
    try {
      toast.success(`验证码已发送到 ${phone}`);
      return '123456'; // 模拟验证码
    } catch (error) {
      console.error('发送验证码失败:', error);
      toast.error('发送验证码失败');
      return '';
    }
  };

  // 手机号登录（模拟）
  const loginWithPhone = async (phone: string, code: string): Promise<boolean> => {
    try {
      if (code === '123456') {
        toast.success('手机号登录成功！');
        return true;
      } else {
        toast.error('验证码错误');
        return false;
      }
    } catch (error) {
      console.error('手机号登录失败:', error);
      toast.error('手机号登录失败');
      return false;
    }
  };

  // 提供Context值
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    loginWithWeChat,
    requestPhoneCode,
    loginWithPhone,
    logout,
    refreshUser,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
};