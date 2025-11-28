import { Routes, Route } from 'react-router-dom'
import { Layout, Header, Main, Footer } from './components/layout/Layout'
import { Button } from './components/ui/Button'
import { ThemeToggle } from './components/theme/ThemeProvider'
import { useToast } from './components/ui/Toast'
import UIShowcase from './components/showcase/UIShowcase'
import EnhancedUIShowcase from './components/showcase/EnhancedUIShowcase'
import VersionChecker from './components/ui/VersionChecker'

function App() {
  const { success } = useToast()

  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <Header variant="sticky" shadow>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-red-600 to-primary-gold-600 bg-clip-text text-transparent">
                津门老字号AI共创坊
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => success('欢迎使用AI共创平台！')}
              >
                开始使用
              </Button>
            </div>
          </div>
        </Header>
        
        <Main>
          <Routes>
            <Route path="/" element={<EnhancedUIShowcase />} />
            <Route path="/showcase" element={<EnhancedUIShowcase />} />
            <Route path="/basic" element={<UIShowcase />} />
          </Routes>
        </Main>
        
        <Footer>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-foreground-muted">
              © 2024 津门老字号AI共创坊. 保留所有权利.
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                隐私政策
              </Button>
              <Button variant="ghost" size="sm">
                服务条款
              </Button>
            </div>
          </div>
        </Footer>
      </Layout>
      <VersionChecker />
    </div>
  )
}

export default App