import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Login() {
  const { toggleTheme, isDark } = useTheme();
  const { login, isAuthenticated, loginWithWeChat, requestPhoneCode, loginWithPhone, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isPhoneLogging, setIsPhoneLogging] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  
  // 如果已登录，直接跳转到仪表板
  if (isAuthenticated) {
    navigate(user?.isAdmin ? '/admin' : '/dashboard');
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!email || !password) {
      toast.error('请输入邮箱和密码');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('登录成功！');
        navigate(user?.isAdmin ? '/admin' : '/dashboard');
      } else {
        toast.error('邮箱或密码错误，请重试');
      }
    } catch (error) {
      toast.error('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestCode = async () => {
    if (!acceptedPrivacy) {
      setShowPrivacy(true);
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast.error('请输入有效的中国大陆手机号');
      return;
    }
    setIsSendingCode(true);
    try {
      const code = await requestPhoneCode(phone);
      toast.success(`验证码已发送：${code}`);
    } catch {
      toast.error('发送验证码失败');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!acceptedPrivacy) {
      setShowPrivacy(true);
      return;
    }
    if (!phone || !otp) {
      toast.error('请输入手机号和验证码');
      return;
    }
    setIsPhoneLogging(true);
    try {
      const ok = await loginWithPhone(phone, otp);
      if (ok) {
        toast.success('登录成功');
        navigate(user?.isAdmin ? '/admin' : '/dashboard');
      } else {
        toast.error('验证码错误');
      }
    } catch {
      toast.error('登录失败');
    } finally {
      setIsPhoneLogging(false);
    }
  };

  const handleWeChatLogin = async () => {
    if (!acceptedPrivacy) {
      setShowPrivacy(true);
      return;
    }
    setIsLoading(true);
    try {
      const ok = await loginWithWeChat();
      if (ok) {
        toast.success('微信登录成功');
        navigate(user?.isAdmin ? '/admin' : '/dashboard');
      } else {
        toast.error('微信登录失败');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-600 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div 
        className={`relative z-10 w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-1">
            <span className="text-xl font-bold text-red-600">AI</span>
            <span className="text-xl font-bold">共创</span>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'} transition-colors`}
            aria-label="切换主题"
          >
            {isDark ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
          </button>
        </div>
        
        <motion.h1 
          className="text-2xl font-bold mb-6"
          variants={itemVariants}
        >
          欢迎回来
        </motion.h1>
        
        <motion.p 
          className="mb-8 opacity-70"
          variants={itemVariants}
        >
          登录您的AI共创平台账号，继续您的创作之旅
        </motion.p>
        
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={itemVariants}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">邮箱</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "w-full px-4 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500",
                isDark 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 border" 
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 border"
              )}
              placeholder="请输入您的邮箱"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium">密码</label>
              <a href="#" className="text-sm text-red-600 hover:text-red-700 transition-colors">忘记密码？</a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full px-4 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500",
                isDark 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 border" 
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 border"
              )}
              placeholder="请输入您的密码"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                登录中...
              </>
            ) : (
              '登录'
            )}
          </motion.button>
        </motion.form>
        
        <motion.div 
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <p className="opacity-70">
            还没有账号？{' '}
            <Link to="/register" className="text-red-600 hover:text-red-700 font-medium transition-colors">
              立即注册
            </Link>
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-12"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center mb-6">
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <span className="px-4 text-sm opacity-60">或使用以下方式登录</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <motion.button
              className={`h-12 rounded-xl bg-green-500 flex items-center justify-center text-white transition-transform`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWeChatLogin}
            >
              <i className={`fab fa-weixin text-xl`}></i>
            </motion.button>
            <motion.button
              className={`h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white transition-transform`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={`fab fa-alipay text-xl`}></i>
            </motion.button>
            <motion.button
              className={`h-12 rounded-xl bg-blue-400 flex items-center justify-center text-white transition-transform`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={`fab fa-qq text-xl`}></i>
            </motion.button>
            <motion.button
              className={`h-12 rounded-xl bg-red-500 flex items-center justify-center text-white transition-transform`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={`fab fa-weibo text-xl`}></i>
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="mt-8"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center mb-6">
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <span className="px-4 text-sm opacity-60">手机号一键登录</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={cn(
                  "w-full px-4 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500",
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 border" 
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 border"
                )}
                placeholder="请输入手机号"
              />
              <button
                onClick={handleRequestCode}
                disabled={isSendingCode}
                className="whitespace-nowrap px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900"
              >
                {isSendingCode ? '发送中' : '获取验证码'}
              </button>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={cn(
                  "w-full px-4 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500",
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 border" 
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 border"
                )}
                placeholder="请输入验证码"
              />
              <button
                onClick={handlePhoneLogin}
                disabled={isPhoneLogging}
                className="whitespace-nowrap px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white"
              >
                {isPhoneLogging ? '登录中' : '一键登录'}
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm opacity-70">
              <input type="checkbox" checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} />
              我已阅读并同意隐私政策
            </label>
          </div>
        </motion.div>
        {showPrivacy && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className={`w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6`}>
              <h3 className="text-lg font-bold mb-4">隐私协议</h3>
              <p className="text-sm opacity-80 mb-6">为保护您的个人数据，我们遵循GDPR风格的隐私规范，授权后将用于账号识别与风控，您可随时撤回授权。</p>
              <div className="flex justify-end gap-3">
                <button className={`px-4 py-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} onClick={() => setShowPrivacy(false)}>取消</button>
                <button className="px-4 py-2 rounded-xl bg-red-600 text-white" onClick={() => { setAcceptedPrivacy(true); setShowPrivacy(false); }}>同意并继续</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
