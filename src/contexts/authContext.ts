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
  updateUsername: (username: string) => Promise<boolean>;
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
export const AuthProvider = ({ children }: AuthProviderProps) => {
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

  const loginWithWeChat = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 埋点：用户尝试微信登录
      analytics.user('wechat_login_attempt', {});
      
      const response = await apiClient.loginWithWeChat();
      
      // 保存token和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // 埋点：用户微信登录成功
      analytics.user('wechat_login_success', {
        userId: response.user.id,
        username: response.user.username
      });
      
      toast.success('微信登录成功！');
      return true;
    } catch (error) {
      console.error('微信登录失败:', error);
      
      // 埋点：用户微信登录失败
      analytics.user('wechat_login_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error(error instanceof Error ? error.message : '微信登录失败');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPhoneCode = async (phone: string): Promise<string> => {
    try {
      // 埋点：用户请求手机验证码
      analytics.user('request_phone_code', { phone });
      
      const response = await apiClient.requestPhoneCode(phone);
      
      // 埋点：验证码发送成功
      analytics.user('phone_code_sent', { phone });
      
      toast.success('验证码已发送，请查收短信');
      return response.code;
    } catch (error) {
      console.error('发送验证码失败:', error);
      
      // 埋点：验证码发送失败
      analytics.user('phone_code_failed', {
        phone,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error(error instanceof Error ? error.message : '发送验证码失败');
      throw error;
    }
  };

  const loginWithPhone = async (phone: string, code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 埋点：用户尝试手机号登录
      analytics.user('phone_login_attempt', { phone });
      
      const response = await apiClient.loginWithPhone(phone, code);
      
      // 保存token和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // 埋点：用户手机号登录成功
      analytics.user('phone_login_success', {
        userId: response.user.id,
        username: response.user.username
      });
      
      toast.success('手机号登录成功！');
      return true;
    } catch (error) {
      console.error('手机号登录失败:', error);
      
      // 埋点：用户手机号登录失败
      analytics.user('phone_login_failed', {
        phone,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error(error instanceof Error ? error.message : '手机号登录失败');
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
      analytics.user('register_attempt', { username, email });
      
      const response = await apiClient.register(username, email, password);
      
      // 埋点：用户注册成功
      analytics.user('register_success', {
        userId: response.user.id,
        username: response.user.username
      });
      
      toast.success('注册成功！请登录');
      return true;
    } catch (error) {
      console.error('注册失败:', error);
      
      // 埋点：用户注册失败
      analytics.user('register_failed', {
        username,
        email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error(error instanceof Error ? error.message : '注册失败');
      return false;
    } finally {
      setIsLoading(false);
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
    
    // 重置状态
    setIsAuthenticated(false);
    setUser(null);
    
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    toast.success('已安全退出登录');
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await apiClient.getCurrentUser();
      setUser(response.user);
      setIsAuthenticated(true);
      
      // 埋点：用户信息刷新成功
      analytics.user('refresh_user_success', {
        userId: response.user.id,
        username: response.user.username
      });
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      
      // 埋点：用户信息刷新失败
      analytics.user('refresh_user_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // 如果token失效，清除登录状态
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  };

  // 更新用户名（用于手机号登录后的用户名设置）
  const updateUsername = async (newUsername: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      setIsLoading(true);
      
      // 埋点：用户尝试更新用户名
      analytics.user('update_username_attempt', {
        userId: user.id,
        oldUsername: user.username,
        newUsername
      });
      
      const response = await apiClient.updateProfile(newUsername, user.avatar || '');
      
      // 更新本地用户信息
      setUser({
        ...user,
        username: response.user.username
      });
      
      // 埋点：用户名更新成功
      analytics.user('update_username_success', {
        userId: user.id,
        username: response.user.username
      });
      
      toast.success('用户名更新成功！');
      return true;
    } catch (error) {
      console.error('更新用户名失败:', error);
      
      // 埋点：用户名更新失败
      analytics.user('update_username_failed', {
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error(error instanceof Error ? error.message : '用户名更新失败');
      return false;
    } finally {
      setIsLoading(false);
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
    refreshUser
  };

  // 返回Provider组件
  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
};
