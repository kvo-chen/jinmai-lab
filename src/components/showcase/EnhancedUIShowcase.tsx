import React, { useState } from 'react';
import { Header, Main, Footer, Grid, Flex, Container } from '../layout/Layout';
import { Button, IconButton } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input, Textarea, Select } from '../ui/Input';
import { Badge, BadgeGroup, StatusBadge, CountBadge } from '../ui/Badge';
import { Modal, ConfirmModal, LoadingModal } from '../ui/Modal';
import { ThemeProvider, ThemeToggle, ThemeSelector } from '../theme/ThemeProvider';
import { ToastProvider, useToast } from '../ui/Toast';
import { Navigation, Breadcrumb } from '../navigation/Navigation';

// 图标组件
const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EnhancedUIShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    description: ''
  });

  const { success, error, info } = useToast();

  const navigationItems = [
    { id: 'home', label: '首页', href: '/', icon: '🏠' },
    { id: 'explore', label: '探索', href: '/explore', icon: '🔍' },
    { id: 'create', label: '创作', href: '/create', icon: '✨' },
    { id: 'works', label: '作品', href: '/works', icon: '🎨' },
  ];

  const breadcrumbItems = [
    { label: '创作中心', href: '/create' },
    { label: 'AI写作', href: '/create/writing' },
  ];

  const categoryOptions = [
    { value: 'food', label: '美食文化' },
    { value: 'craft', label: '传统手工艺' },
    { value: 'medicine', label: '中医药' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      error('请填写所有必填字段');
      return;
    }
    success('表单提交成功！');
    setModalOpen(false);
  };

  const handleConfirmAction = () => {
    setConfirmModalOpen(false);
    success('确认操作执行成功！');
  };

  return (
    <div className="min-h-screen bg-background">
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

      <Main>
        <Container size="2xl">
          <div className="mb-8">
            <Breadcrumb 
              items={breadcrumbItems} 
              onItemClick={(item) => info(`面包屑导航: ${item.label}`)}
            />
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              增强版平台UI展示
            </h1>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              展示全新的输入组件、徽章系统、模态框等增强UI组件的完整功能
            </p>
          </div>

          <Grid cols={2} gap="lg" className="mb-8">
            <Card>
              <CardHeader title="输入组件" subtitle="多种样式的输入控件" />
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <Input
                    label="项目名称"
                    placeholder="请输入项目名称"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  
                  <Input
                    label="邮箱地址"
                    type="email"
                    placeholder="请输入邮箱地址"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  
                  <Select
                    label="项目类别"
                    placeholder="请选择项目类别"
                    options={categoryOptions}
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                  />
                  
                  <Textarea
                    label="项目描述"
                    placeholder="请详细描述您的项目..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                  
                  <Button type="submit" fullWidth>
                    提交表单
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="徽章系统" subtitle="状态标识和计数显示" />
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-foreground-muted mb-3">基础徽章</h4>
                    <BadgeGroup spacing="sm">
                      <Badge variant="primary">主要</Badge>
                      <Badge variant="secondary">次要</Badge>
                      <Badge variant="success">成功</Badge>
                      <Badge variant="warning">警告</Badge>
                      <Badge variant="error">错误</Badge>
                      <Badge variant="info">信息</Badge>
                      <Badge variant="neutral">中性</Badge>
                    </BadgeGroup>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground-muted mb-3">状态徽章</h4>
                    <BadgeGroup spacing="sm">
                      <StatusBadge status="online" showText />
                      <StatusBadge status="offline" showText />
                      <StatusBadge status="busy" showText />
                      <StatusBadge status="away" showText />
                      <StatusBadge status="pending" showText />
                    </BadgeGroup>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground-muted mb-3">计数徽章</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span>消息</span>
                        <CountBadge count={5} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span>通知</span>
                        <CountBadge count={99} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span>更新</span>
                        <CountBadge count={150} max={99} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Card className="mb-8">
            <CardHeader title="模态框系统" subtitle="多种交互模态框" />
            <CardContent>
              <div className="space-y-4">
                <Flex gap="sm" wrap>
                  <Button onClick={() => setModalOpen(true)}>
                    打开基础模态框
                  </Button>
                  <Button onClick={() => setConfirmModalOpen(true)} variant="secondary">
                    打开确认模态框
                  </Button>
                  <Button onClick={() => setLoadingModalOpen(true)} variant="outline">
                    打开加载模态框
                  </Button>
                </Flex>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Main>

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
          </div>
        </Flex>
      </Footer>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="创建新项目"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handleFormSubmit}>
              创建项目
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="项目名称"
            placeholder="请输入项目名称"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <Select
            label="项目类别"
            placeholder="请选择项目类别"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            required
          />
          <Textarea
            label="项目描述"
            placeholder="请简要描述您的项目..."
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </form>
      </Modal>

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        message="确定要删除这个项目吗？"
        description="此操作无法撤销，请谨慎操作。"
        onConfirm={handleConfirmAction}
        variant="danger"
      />

      <LoadingModal
        isOpen={loadingModalOpen}
        onClose={() => setLoadingModalOpen(false)}
        message="正在处理您的请求..."
        progress={75}
        indeterminate={false}
      >
        <div className="text-center">
          <p className="text-sm text-foreground-muted mt-2">请稍候，系统正在处理您的请求...</p>
        </div>
      </LoadingModal>

      <IconButton 
        icon={<SettingsIcon />} 
        variant="primary" 
        className="fixed bottom-6 right-6"
        tooltip="设置"
        onClick={() => info('打开设置面板')}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ToastProvider>
        <EnhancedUIShowcase />
      </ToastProvider>
    </ThemeProvider>
  );
}