import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, user } = useContext(AuthContext);
  
  if (!isAuthenticated || !user?.isAdmin) {
    // 未登录或非管理员，重定向到登录页面
    return <Navigate to="/login" replace />;
  }
  
  // 已登录且为管理员，渲染子组件
  return <>{children}</>;
}