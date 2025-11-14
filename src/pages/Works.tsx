import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';
import { apiClient } from '@/lib/api';

export default function Works() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [works, setWorks] = useState<Array<{ id: string; title: string; description: string; imageUrl: string; category: string; status: string; createdAt: string; author: { id: string; username: string; avatar: string }; likes: number; comments: number; views: number; tags: string[] }>>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const run = async () => {
      try {
        const data = await apiClient.get<{ works: any[]; pagination: any }>('/works');
        setWorks(Array.isArray(data?.works) ? data.works : []);
      } catch {}
      setLoading(false);
    };
    run();
  }, [isAuthenticated, navigate]);

  const toDetail = (id: string) => {
    navigate(`/works/${id}`);
  };

  const toCreate = () => {
    navigate('/create');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="text-xl font-bold text-red-600">AI</span>
            <span className="text-xl font-bold">共创</span>
            {typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development' && localStorage.getItem('analytics_dev_enable') !== 'true' && (
              <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>开发模式：埋点已关闭</span>
            )}
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors" onClick={toCreate}>新建作品</button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">作品管理</h1>
        {works.length === 0 ? (
          <div className={`p-8 rounded-2xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>暂无作品，点击右上角创建一个吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {works.map((w, i) => (
              <motion.div key={w.id} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-md`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                <img src={w.imageUrl} alt={w.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate">{w.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${w.status === 'completed' ? 'bg-green-100 text-green-600' : w.status === 'draft' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>{w.status}</span>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm line-clamp-2 mb-3`}>{w.description}</p>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center"><i className="far fa-eye mr-1"></i>{w.views}</span>
                      <span className="flex items-center"><i className="far fa-thumbs-up mr-1"></i>{w.likes}</span>
                      <span className="flex items-center"><i className="far fa-comment mr-1"></i>{w.comments}</span>
                    </div>
                    <span>{new Date(w.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-sm`} onClick={() => toDetail(w.id)}>查看</button>
                    <button className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-sm`} onClick={toCreate}>编辑</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
