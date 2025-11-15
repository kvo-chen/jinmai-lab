import { useState } from 'react'
import { ArrowRight, Github, ExternalLink, Zap, Shield, Globe } from 'lucide-react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDeploy = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.open('https://vercel.com/new', '_blank')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Jinmai Lab</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              现代化
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                React
              </span>
              项目
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              使用 React + TypeScript + Tailwind CSS + Vite 构建的高性能现代化应用
              <br />支持一键部署到 Vercel，配备完整的 GitHub Actions CI/CD
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={handleDeploy}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>部署中...</span>
                  </>
                ) : (
                  <>
                    <span>一键部署到 Vercel</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/30 border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Github className="w-5 h-5" />
                <span>创建 GitHub 仓库</span>
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">极速构建</h3>
                <p className="text-gray-400">基于 Vite 的闪电般快速开发体验，热更新即时响应</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">类型安全</h3>
                <p className="text-gray-400">完整的 TypeScript 支持，编译时错误检查，代码更可靠</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">一键部署</h3>
                <p className="text-gray-400">自动化部署流程，支持 Vercel、Netlify 等主流平台</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
