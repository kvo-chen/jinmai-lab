import React, { useState } from 'react';
import { Header, Main, Footer, Grid, Flex, Container } from '../layout/Layout';
import { Button, IconButton, ButtonGroup, Fab } from '../ui/Button';
import { Card, CardHeader, CardContent, CardFooter, CardBadge, CardSkeleton } from '../ui/Card';
import { ThemeProvider, ThemeToggle, ThemeSelector } from '../theme/ThemeProvider';
import { ToastProvider, useToast } from '../ui/Toast';
import { Navigation, Breadcrumb, Pagination, StepNavigation } from '../navigation/Navigation';

// 图标组件
const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

/**
 * UI优化展示组件
 * UI Optimization Showcase Component
 */
const UIShowcase: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { success, error, warning, info, loading, promise, dismiss } = useToast();

  // 导航数据
  const navigationItems = [
    { id: 'home', label: '首页', href: '/', icon: '🏠' },
    { id: 'explore', label: '探索', href: '/explore', icon: '🔍' },
    { 
      id: 'create', 
      label: '创作', 
      href: '/create', 
      icon: '✨',
      children: [
        { id: 'ai-writing', label: 'AI写作', href: '/create/writing' },
        { id: 'ai-image', label: 'AI绘画', href: '/create/image' },
        { id: 'ai-video', label: 'AI视频', href: '/create/video' },
      ]
    },
    { id: 'works', label: '作品', href: '/works', icon: '🎨', badge: 12 },
    { id: 'community', label: '社区', href: '/community', icon: '👥' },
    { id: 'knowledge', label: '知识库', href: '/knowledge', icon: '📚' },
  ];

  const breadcrumbItems = [
    { label: '创作中心', href: '/create' },
    { label: 'AI写作', href: '/create/writing' },
    { label: '文章详情', href: '/create/writing/123' },
  ];

  const steps = [
    { id: '1', label: '选择模板', description: '选择合适的创作模板' },
    { id: '2', label: '输入内容', description: '输入您的创作需求' },
    { id: '3', label: 'AI生成', description: 'AI为您生成内容' },
    { id: '4', label: '编辑优化', description: '编辑和优化内容' },
    { id: '5', label: '发布分享', description: '发布并分享作品' },
  ];

  // 演示函数
  const handleSuccess = () => {
    success('操作成功完成！', {
      duration: 3000,
      icon: '✅',
    });
  };

  const handleError = () => {
    error('操作失败，请重试！', {
      duration: 5000,
      icon: '❌',
    });
  };

  const handleWarning = () => {
    warning('请注意检查输入内容！', {
      duration: 4000,
      icon: '⚠️',
    });
  };

  const handleInfo = () => {
    info('这是一条提示信息', {
      duration: 3000,
      icon: 'ℹ️',
    });
  };

  const handleLoading = () => {
    const toastId = loading('正在处理中...');
    setTimeout(() => {
      dismiss(toastId);
      success('处理完成！');
    }, 3000);
  };

  const handlePromise = () => {
    const mockPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('成功') : reject('失败');
      }, 2000);
    });

    promise(mockPromise, {
      loading: '正在执行操作...',
      success: '操作成功完成！',
      error: '操作失败，请重试！',
    });
  };

  const handleLoadingButton = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      success('操作完成！');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 头部导航 */}
      <Header variant="sticky" shadow>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary-red-600 to-primary-gold-600 bg-clip-text text-transparent">
            津门老字号AI共创坊
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Navigation 
            items={navigationItems} 
            variant="horizontal" 
            size="md"
            onItemClick={(item) => info(`导航到: ${item.label}`)}
          />
          
          <div className="flex items-center gap-2">
            <ThemeToggle variant="icon" size="md" />
            <ThemeSelector size="md" />
          </div>
        </div>
      </Header>

      {/* 主要内容 */}
      <Main>
        <Container size="2xl">
          {/* 面包屑导航 */}
          <div className="mb-8">
            <Breadcrumb 
              items={breadcrumbItems} 
              onItemClick={(item) => info(`面包屑导航: ${item.label}`)}
            />
          </div>

          {/* 标题区域 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              平台UI优化展示
            </h1>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              展示统一设计系统下的按钮、卡片、布局、主题和通知组件的优化效果
            </p>
          </div>

          {/* 步骤导航 */}
          <Card className="mb-8">
            <CardHeader title="创作流程" subtitle="AI辅助创作完整流程" />
            <CardContent>
              <StepNavigation
                steps={steps}
                currentStep={currentStep}
                onStepClick={(step) => setCurrentStep(step)}
              />
            </CardContent>
            <CardFooter>
              <ButtonGroup>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  上一步
                </Button>
                <Button 
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                >
                  下一步
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>

          {/* 按钮展示 */}
          <Grid cols={2} gap="lg" className="mb-8">
            <Card>
              <CardHeader title="按钮组件" subtitle="多种样式和状态的按钮" />
              <CardContent>
                <div className="space-y-6">
                  {/* 主要按钮样式 */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground-muted mb-3">主要按钮</h4>
                    <Flex gap="sm" wrap>
                      <Button variant="primary">主要按钮</Button>
                      <Button variant="secondary">次要按钮</Button>
                      <Button variant="outline">轮廓按钮</Button>
                      <Button variant="ghost">幽灵按钮</Button>
                      <Button variant="danger">危险按钮</Button>
                      <Button variant="success">成功按钮</Button>
                    </Flex>
                  </div>

                  {/* 渐变按钮 */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground-muted mb-3">渐变按钮</h4>
                    <Flex gap="sm" wrap>
                      <Button variant="primary" gradient>渐变主要</Button>
                      <Button variant="secondary" gradient>渐变次要</Button>
                    </Flex>
                  </div>

                  {/* 按钮尺寸 */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground-muted mb-3">按钮尺寸</h4>
                    <Flex gap="sm" align="center" wrap>
                      <Button size="sm">小尺寸</Button>
                      <Button size="md">中等尺寸</Button>
                      <Button size="lg">大尺寸</Button>
                      <Button size="xl">超大尺寸</Button>
                    </Flex>
                  </div>

                  {/* 加载状态 */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground-muted mb-3">加载状态</h4>
                    <Flex gap="sm" wrap>
                      <Button isLoading loadingText="加载中...">
                        加载按钮
                      </Button>
                      <Button isLoading={isLoading} onClick={handleLoadingButton}>
                        点击加载
                      </Button>
                    </Flex>
                  </div>

                  {/* 图标按钮 */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground-muted mb-3">图标按钮</h4>
                    <Flex gap="sm" align="center" wrap>
                      <IconButton icon={<StarIcon />} tooltip="收藏" />
                      <IconButton icon={<HeartIcon />} variant="secondary" tooltip="喜欢" />
                      <IconButton icon={<SettingsIcon />} variant="outline" tooltip="设置" />
                      <Button icon={<StarIcon />} iconPosition="left">
                        图标左
                      </Button>
                      <Button icon={<HeartIcon />} iconPosition="right">
                        图标右
                      </Button>
                    </Flex>
                  </div>

                  {/* 按钮组 */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground-muted mb-3">按钮组</h4>
                    <div className="space-y-3">
                      <ButtonGroup>
                        <Button variant="outline">选项1</Button>
                        <Button variant="outline">选项2</Button>
                        <Button variant="outline">选项3</Button>
                      </ButtonGroup>
                      <ButtonGroup variant="vertical">
                        <Button variant="outline">选项1</Button>
                        <Button variant="outline">选项2</Button>
                        <Button variant="outline">选项3</Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="通知系统" subtitle="统一的通知和反馈系统" />
              <CardContent>
                <div className="space-y-4">
                  <Flex gap="sm" wrap>
                    <Button onClick={handleSuccess} variant="success">
                      成功通知
                    </Button>
                    <Button onClick={handleError} variant="danger">
                      错误通知
                    </Button>
                    <Button onClick={handleWarning} variant="secondary">
                      警告通知
                    </Button>
                    <Button onClick={handleInfo} variant="outline">
                      信息通知
                    </Button>
                  </Flex>
                  
                  <Flex gap="sm" wrap>
                    <Button onClick={handleLoading}>
                      加载通知
                    </Button>
                    <Button onClick={handlePromise}>
                      承诺通知
                    </Button>
                  </Flex>

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground-muted mb-3">常用模板</h4>
                    <Flex gap="sm" wrap>
                      <Button 
                        onClick={() => success('保存成功！')}
                        size="sm"
                      >
                        保存成功
                      </Button>
                      <Button 
                        onClick={() => success('删除成功！')}
                        size="sm"
                      >
                        删除成功
                      </Button>
                      <Button 
                        onClick={() => error('网络连接失败，请检查网络设置')}
                        size="sm"
                      >
                        网络错误
                      </Button>
                      <Button 
                        onClick={() => info('欢迎用户！')}
                        size="sm"
                      >
                        欢迎回来
                      </Button>
                    </Flex>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* 卡片展示 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">卡片组件</h2>
            <Grid cols={3} gap="lg">
              {/* 基础卡片 */}
              <Card>
                <CardHeader 
                  title="基础卡片"
                  subtitle="标准卡片布局"
                  action={<CardBadge>热门</CardBadge>}
                />
                <CardContent>
                  <p className="text-foreground-muted">
                    这是一个基础的卡片组件，包含标题、内容和操作按钮。适用于展示各种信息和功能。
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">查看详情</Button>
                </CardFooter>
              </Card>

              {/* 渐变卡片 */}
              <Card gradient="primary">
                <CardHeader 
                  title="渐变卡片"
                  subtitle="带有渐变背景的卡片"
                  action={<IconButton icon={<StarIcon />} variant="ghost" />}
                />
                <CardContent>
                  <p className="text-white/90">
                    这是一个带有渐变背景的卡片，使用红金配色方案，适合突出重要内容。
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" size="sm">了解更多</Button>
                </CardFooter>
              </Card>

              {/* 轮廓卡片 */}
              <Card variant="outlined" borderColor="primary">
                <CardHeader 
                  title="轮廓卡片"
                  subtitle="带边框的卡片样式"
                />
                <CardContent>
                  <p className="text-foreground-muted">
                    这是一个带边框的卡片，使用主题色彩作为边框颜色，提供清晰的视觉边界。
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">编辑内容</Button>
                </CardFooter>
              </Card>

              {/* 交互式卡片 */}
              <Card interactive hover>
                <CardHeader 
                  title="交互式卡片"
                  subtitle="支持悬停效果"
                  avatar={<div className="w-12 h-12 bg-gradient-to-br from-primary-red-500 to-primary-gold-500 rounded-full flex items-center justify-center text-white font-bold">AI</div>}
                />
                <CardContent>
                  <p className="text-foreground-muted">
                    这是一个交互式卡片，支持悬停效果，鼠标悬停时会有缩放和阴影变化。
                  </p>
                </CardContent>
                <CardFooter justify="between">
                  <CardBadge variant="success">已完成</CardBadge>
                  <Button size="sm">立即体验</Button>
                </CardFooter>
              </Card>

              {/* 媒体卡片 */}
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary-red-100 to-primary-gold-100 flex items-center justify-center">
                    <div className="text-6xl">🎨</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">媒体卡片</h3>
                    <p className="text-foreground-muted mb-4">
                      这是一个包含媒体内容的卡片，适合展示图片、视频等多媒体内容。
                    </p>
                    <Button size="sm" fullWidth>查看作品</Button>
                  </div>
                </CardContent>
              </Card>

              {/* 状态卡片 */}
              <Card variant="elevated">
                <CardHeader title="项目状态" subtitle="实时进度跟踪" />
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted">完成度</span>
                      <span className="font-semibold text-foreground">75%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary-red-500 to-primary-gold-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex gap-2">
                      <CardBadge variant="primary">进行中</CardBadge>
                      <CardBadge variant="warning">需要审核</CardBadge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="secondary">查看进度</Button>
                </CardFooter>
              </Card>
            </Grid>
          </div>

          {/* 骨架屏展示 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">加载状态</h2>
            <Grid cols={3} gap="lg">
              <CardSkeleton />
              <CardSkeleton hasImage={true} />
              <CardSkeleton hasHeader={false} hasActions={true} />
            </Grid>
          </div>

          {/* 分页展示 */}
          <Card className="mb-8">
            <CardHeader title="分页组件" subtitle="数据分页导航" />
            <CardContent>
              <div className="space-y-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={20}
                  onPageChange={setCurrentPage}
                  size="md"
                />
                
                <div className="text-center text-foreground-muted">
                  当前第 {currentPage} 页，共 20 页
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 布局展示 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">响应式布局</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader title="网格布局" subtitle="自适应网格系统" />
                <CardContent>
                  <Grid cols={4} gap="md" className="mb-4">
                    <div className="bg-primary-red-100 dark:bg-primary-red-900 p-4 rounded-lg text-center">1</div>
                    <div className="bg-primary-gold-100 dark:bg-primary-gold-900 p-4 rounded-lg text-center">2</div>
                    <div className="bg-primary-red-100 dark:bg-primary-red-900 p-4 rounded-lg text-center">3</div>
                    <div className="bg-primary-gold-100 dark:bg-primary-gold-900 p-4 rounded-lg text-center">4</div>
                  </Grid>
                  
                  <Grid cols={3} gap="md" className="mb-4">
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-center">A</div>
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-center">B</div>
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-center">C</div>
                  </Grid>
                  
                  <Grid cols={2} gap="md">
                    <div className="bg-gradient-to-r from-primary-red-100 to-primary-gold-100 dark:from-primary-red-900 dark:to-primary-gold-900 p-4 rounded-lg text-center">响应式</div>
                    <div className="bg-gradient-to-r from-primary-gold-100 to-primary-red-100 dark:from-primary-gold-900 dark:to-primary-red-900 p-4 rounded-lg text-center">布局</div>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="弹性布局" subtitle="灵活的弹性盒子布局" />
                <CardContent>
                  <div className="space-y-4">
                    <Flex justify="between" align="center" className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                      <span>左侧内容</span>
                      <span>中间内容</span>
                      <span>右侧内容</span>
                    </Flex>
                    
                    <Flex justify="center" align="center" gap="lg" className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                      <div className="w-12 h-12 bg-primary-red-500 rounded-full"></div>
                      <div className="w-12 h-12 bg-primary-gold-500 rounded-full"></div>
                      <div className="w-12 h-12 bg-primary-red-500 rounded-full"></div>
                    </Flex>
                    
                    <Flex direction="column" gap="md" className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                      <div className="p-2 bg-primary-red-100 dark:bg-primary-red-900 rounded">垂直布局 1</div>
                      <div className="p-2 bg-primary-gold-100 dark:bg-primary-gold-900 rounded">垂直布局 2</div>
                      <div className="p-2 bg-primary-red-100 dark:bg-primary-red-900 rounded">垂直布局 3</div>
                    </Flex>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Main>

      {/* 底部 */}
      <Footer>
        <Flex justify="between" align="center" className="w-full">
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
            <Button variant="ghost" size="sm">
              联系我们
            </Button>
          </div>
        </Flex>
      </Footer>

      {/* 浮动操作按钮 */}
      <Fab 
        icon={<SettingsIcon />} 
        variant="primary" 
        tooltip="设置"
        onClick={() => info('打开设置面板')}
      />
    </div>
  );
};

/**
 * 主要的UI优化展示页面
 * Main UI Optimization Showcase Page
 */
const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system">
      <ToastProvider>
        <UIShowcase />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;