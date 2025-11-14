import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    // 重定向到登录页面
    return <Navigate to="/login" replace />;
  }
  
  // 已登录，渲染子组件
  return <>{children}</>;
}