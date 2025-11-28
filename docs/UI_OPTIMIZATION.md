# 津门老字号AI共创坊 - UI优化文档

## 概述

本文档详细说明了津门老字号AI共创坊平台的UI优化方案，包括设计系统、组件库、主题系统和响应式布局的实现。

## 设计系统

### 色彩系统

#### 品牌色彩
- **主色调**: 红金配色方案
  - 红色系: `#DC2626` → `#B91C1C` (主色到深色)
  - 金色系: `#D97706` → `#B45309` (主色到深色)
  - 完整的色彩阶梯 (50-900)

#### 中性色
- 灰色系: `#FAFAFA` → `#171717` (50-900)
- 适用于背景、文字、边框等

#### 状态色
- 成功: `#10B981`
- 警告: `#F59E0B`
- 错误: `#EF4444`

### 字体系统

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
```

### 间距系统
- 基于4px网格系统
- 标准间距: xs(4px), sm(8px), md(16px), lg(24px), xl(32px)

### 圆角系统
- sm: 6px, md: 8px, lg: 12px, xl: 16px, full: 50%

### 阴影系统
- sm, md, lg, xl, 2xl 五级阴影
- 支持暗色模式适配

## 组件库

### 1. 按钮组件 (Button)

#### 特性
- 6种变体: primary, secondary, outline, ghost, danger, success
- 4种尺寸: sm, md, lg, xl
- 支持加载状态、图标、渐变背景
- 完全响应式设计

#### 使用示例
```tsx
import { Button } from '@/components/ui/Button';

// 基础按钮
<Button variant="primary" size="md">
  主要按钮
</Button>

// 渐变按钮
<Button variant="primary" gradient>
  渐变按钮
</Button>

// 加载按钮
<Button isLoading loadingText="处理中...">
  提交
</Button>

// 图标按钮
<Button icon={<StarIcon />} iconPosition="left">
  收藏
</Button>
```

### 2. 卡片组件 (Card)

#### 特性
- 4种变体: default, outlined, elevated, gradient
- 模块化设计: Header, Content, Footer, Badge, Media
- 支持交互状态: hover, interactive
- 骨架屏加载状态

#### 使用示例
```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

<Card variant="elevated" hover>
  <CardHeader 
    title="卡片标题"
    subtitle="卡片副标题"
    action={<CardBadge>热门</CardBadge>}
  />
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter>
    <Button size="sm">查看详情</Button>
  </CardFooter>
</Card>
```

### 3. 布局组件 (Layout)

#### 特性
- 完整的布局系统: Layout, Header, Main, Footer, Sidebar
- 响应式网格: Grid组件支持1-12列
- 弹性布局: Flex组件支持各种对齐方式
- 容器组件: 支持多种最大宽度

#### 使用示例
```tsx
import { Layout, Header, Main, Footer, Grid } from '@/components/layout/Layout';

<Layout>
  <Header variant="sticky" shadow>
    {/* 头部内容 */}
  </Header>
  <Main>
    <Grid cols={3} gap="lg">
      {/* 网格内容 */}
    </Grid>
  </Main>
  <Footer>
    {/* 底部内容 */}
  </Footer>
</Layout>
```

### 4. 主题系统 (Theme)

#### 特性
- 支持亮色/暗色/系统三种主题
- 自动检测系统偏好
- 主题切换组件
- CSS变量驱动

#### 使用示例
```tsx
import { ThemeProvider, ThemeToggle, useTheme } from '@/components/theme/ThemeProvider';

// 应用根组件
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>

// 主题切换
<ThemeToggle variant="icon" />

// 主题选择器
<ThemeSelector />

// 使用主题
const { theme, setTheme, resolvedTheme } = useTheme();
```

### 5. 通知系统 (Toast)

#### 特性
- 统一的通知API
- 5种类型: success, error, warning, info, loading
- 支持承诺处理
- 丰富的预设模板

#### 使用示例
```tsx
import { ToastProvider, useToast, toastTemplates } from '@/components/ui/Toast';

// 应用根组件
<ToastProvider>
  <App />
</ToastProvider>

// 使用通知
const { success, error, promise } = useToast();

// 基础通知
success('操作成功！');
error('操作失败！');

// 承诺通知
promise(apiCall(), {
  loading: '处理中...',
  success: '操作成功！',
  error: '操作失败！'
});

// 使用模板
toastTemplates.saveSuccess();
toastTemplates.networkError();
```

### 6. 导航组件 (Navigation)

#### 特性
- 多种导航样式: horizontal, vertical, pills, tabs
- 面包屑导航
- 分页组件
- 步骤导航

#### 使用示例
```tsx
import { Navigation, Breadcrumb, Pagination } from '@/components/navigation/Navigation';

// 主导航
<Navigation 
  items={navItems} 
  variant="horizontal"
  onItemClick={(item) => handleNav(item)}
/>

// 面包屑
<Breadcrumb 
  items={breadcrumbItems}
  onItemClick={(item) => handleBreadcrumb(item)}
/>

// 分页
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

## 响应式设计

### 断点系统
- 移动设备: < 640px
- 平板设备: 640px - 1024px
- 桌面设备: > 1024px

### 响应式工具
- 隐藏工具类: hide-mobile, hide-tablet, hide-desktop
- 响应式间距和排版
- 弹性布局自动适配

## 暗色模式

### 实现方式
- CSS变量驱动
- 类名切换: `data-theme="dark"`
- 自动系统偏好检测

### 暗色模式特性
- 完整的暗色配色方案
- 自动调整对比度
- 平滑的主题切换动画

## 性能优化

### 组件优化
- 懒加载支持
- 虚拟滚动
- 骨架屏加载

### 样式优化
- CSS变量减少重复
- 按需加载样式
- 压缩和缓存

## 可访问性

### 键盘导航
- 完整的Tab键导航
- 焦点管理
- 键盘快捷键支持

### 屏幕阅读器
- ARIA标签
- 语义化HTML
- 替代文本

### 色彩对比
- WCAG 2.1 AA标准
- 高对比度模式支持
- 色盲友好配色

## 使用指南

### 快速开始

1. 安装依赖
```bash
npm install @tailwindcss/forms @tailwindcss/typography clsx tailwind-merge
```

2. 引入样式
```css
@import './src/styles/design-system.css';
```

3. 使用组件
```tsx
import { Button, Card, ThemeProvider } from '@/components';
```

### 最佳实践

1. **一致性**: 使用统一的组件和样式
2. **响应式**: 考虑不同设备的显示效果
3. **可访问性**: 确保所有用户都能使用
4. **性能**: 合理使用加载状态和缓存
5. **主题**: 支持亮色和暗色模式

## 更新日志

### v1.0.0 (2024-11-20)
- ✨ 初始版本发布
- 🎨 完整的设计系统
- 🧩 丰富的组件库
- 🌙 暗色模式支持
- 📱 响应式设计
- ♿ 可访问性优化

## 贡献指南

欢迎提交Issue和Pull Request来改进这个UI系统。请确保：

1. 遵循现有的代码风格
2. 添加适当的测试
3. 更新相关文档
4. 考虑可访问性
5. 保持向后兼容性

## 许可证

MIT License - 详见LICENSE文件