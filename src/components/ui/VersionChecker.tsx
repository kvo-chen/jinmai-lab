import React from 'react';
import { useState, useEffect } from 'react';
import { Badge } from './Badge';

interface VersionInfo {
  version: string;
  buildTime: string;
  commit?: string;
  nodeEnv?: string;
}

export const VersionChecker: React.FC = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 从meta标签获取版本信息
    const versionMeta = document.querySelector('meta[name="version"]');
    const buildTimeMeta = document.querySelector('meta[name="build-time"]');
    
    if (versionMeta) {
      const info: VersionInfo = {
        version: versionMeta.getAttribute('content') || '未知版本',
        buildTime: buildTimeMeta?.getAttribute('content') || '未知时间',
        nodeEnv: process.env.NODE_ENV,
      };
      setVersionInfo(info);
    }
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!versionInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleVisibility}
        className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
        title="版本信息"
      >
        <span className="text-sm font-bold">V</span>
      </button>
      
      {isVisible && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-[280px] border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">版本信息</h3>
            <button
              onClick={toggleVisibility}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">当前版本:</span>
              <Badge variant="primary" size="sm">
                {versionInfo.version}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">构建时间:</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">
                {versionInfo.buildTime}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">运行环境:</span>
              <Badge variant={versionInfo.nodeEnv === 'production' ? 'success' : 'warning'} size="sm">
                {versionInfo.nodeEnv || 'unknown'}
              </Badge>
            </div>
            
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-md transition-colors duration-200"
              >
                🔄 强制刷新页面
              </button>
            </div>
            
            <div className="pt-1">
              <button
                onClick={() => {
                  if (confirm('清除本地缓存并重新加载？')) {
                    // 清除localStorage和sessionStorage
                    localStorage.clear();
                    sessionStorage.clear();
                    // 尝试清除缓存
                    if ('caches' in window) {
                      caches.keys().then((names) => {
                        names.forEach((name) => {
                          caches.delete(name);
                        });
                      });
                    }
                    window.location.reload();
                  }
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 px-3 rounded-md transition-colors duration-200"
              >
                🗑️ 清除缓存重载
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionChecker;