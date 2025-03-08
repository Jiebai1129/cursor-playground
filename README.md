# 错题管理系统项目文档

## 项目概述

错题管理系统是一个基于Next.js框架开发的Web应用，旨在帮助学生高效管理和复习错题。系统提供了错题记录、分类管理、智能复习等功能，通过直观的用户界面和智能的复习算法，帮助学生提高学习效率。

## 技术栈

- **前端框架**：Next.js 15.2.1
- **UI组件库**：Tailwind CSS 4.0
- **状态管理**：Zustand
- **表单处理**：React Hook Form
- **动画效果**：Framer Motion
- **日期处理**：date-fns
- **图标库**：Heroicons

## 系统架构

系统采用组件化设计，主要分为以下几个模块：

1. **核心模块**：包括导航栏、布局组件等
2. **首页模块**：展示最近错题和学科分类
3. **添加模块**：提供错题添加功能
4. **详情模块**：展示错题详情和订正记录
5. **复习模块**：提供智能复习计划和错题重做功能

## 数据模型

### 错题模型 (Mistake)

```typescript
export interface Mistake {
  id: string;
  title: string;
  imageUrl: string;
  subject: Subject;
  tags: string[];
  createdAt: string;
  lastReviewedAt?: string;
  correctCount: number;
  wrongCount: number;
  notes: string;
  solution?: string;
  relatedMistakes?: string[];
  correctionHistory: {
    date: string;
    isCorrect: boolean;
    notes?: string;
  }[];
}
```

### 学科类型 (Subject)

```typescript
export type Subject = '数学' | '语文' | '英语' | '物理' | '化学' | '生物' | '历史' | '地理' | '政治';
```

## 功能模块详解

### 1. 首页/主界面

#### 快速添加入口 (QuickAddEntry)
- 提供拍照和上传图片两种添加错题的入口
- 使用动画效果增强用户体验

#### 最近错题卡片流 (RecentMistakesList)
- 展示最近添加的错题
- 显示错题的基本信息，包括标题、学科、创建时间等
- 支持点击进入详情页

#### 学科分类导航 (SubjectNavigation)
- 按学科分类展示错题
- 提供错题数量统计和可视化展示

### 2. 错题添加界面

#### 拍照/上传组件 (ImageUploader)
- 支持拖放上传图片
- 支持直接调用设备摄像头拍照（使用HTML5的capture属性）
- 提供图片预览和删除功能
- 针对移动设备优化的拍照体验

#### 智能识别区域 (RecognitionArea)
- 展示上传的错题图片
- 提供交互式区域选择功能，可框选特定区域进行精确识别
- 支持重新识别操作和一键识别功能
- 实时显示识别状态和结果

```typescript
interface RecognitionAreaProps {
  imageUrl: string;
  recognizedText: string;
  isRecognizing: boolean;
  onRecognizeRequest: () => void;
}
```

#### 标签批注工具 (AddMistakeForm)
- 提供错题信息录入表单
- 支持添加和删除标签
- 记录错题笔记和解题思路

### 3. 错题详情界面

#### 错题展示画布 (MistakeDisplay)
- 展示错题图片和详细信息
- 支持编辑错题笔记和解题思路
- 提供掌握情况统计

#### 订正记录时间轴 (CorrectionTimeline)
- 以时间轴形式展示订正历史
- 显示每次订正的结果和笔记

#### 关联题目推荐 (RelatedMistakes)
- 推荐同一学科的相关错题
- 提供快速导航到相关错题

### 4. 复习流程

#### 智能复习计划 (ReviewPlan)
- 基于错误率生成个性化复习计划
- 按日期组织复习内容
- 提供复习进度统计

```typescript
interface ReviewPlanProps {
  mistakes: Mistake[];
  isGenerating: boolean;
}

interface PlanDay {
  date: Date;
  mistakes: Mistake[];
}
```

#### 错题重做沙盒 (ReviewSandbox)
- 提供错题重做环境
- 支持标记掌握/未掌握
- 提供解题思路查看功能
- 记录复习进度和统计

```typescript
interface ReviewSandboxProps {
  mistakes: Mistake[];
  selectedSubject: Subject | 'all';
}

// 主要方法
handleMarkCorrect(): void  // 标记为已掌握
handleMarkIncorrect(): void  // 标记为未掌握
goToNextMistake(): void  // 进入下一题
handleRestart(): void  // 重新开始
toggleSolution(): void  // 切换显示/隐藏解答
```

## 状态管理

系统使用Zustand进行状态管理，主要包括以下功能：

```typescript
interface MistakeState {
  mistakes: Mistake[];
  addMistake: (mistake: Omit<Mistake, 'id' | 'createdAt' | 'correctCount' | 'wrongCount' | 'correctionHistory'>) => void;
  updateMistake: (id: string, mistake: Partial<Mistake>) => void;
  deleteMistake: (id: string) => void;
  getMistakeById: (id: string) => Mistake | undefined;
  getMistakesBySubject: (subject: Subject) => Mistake[];
  recordAttempt: (id: string, isCorrect: boolean, notes?: string) => void;
  getRecentMistakes: (limit?: number) => Mistake[];
}
```

## 路由结构

- `/` - 首页
- `/add` - 添加错题页面
- `/detail/[id]` - 错题详情页面
- `/review` - 复习计划页面

## 响应式设计

系统采用响应式设计，适配不同尺寸的设备：
- 移动端：单列布局，优化触摸操作
- 平板：双列布局，增强内容展示
- 桌面端：多列布局，充分利用屏幕空间

## 主题支持

系统支持亮色和暗色两种主题模式，自动适应用户系统设置。

## 数据持久化

使用Zustand的persist中间件实现数据持久化，将错题数据存储在浏览器的localStorage中。

## 未来扩展

1. **云同步功能**：实现多设备数据同步
2. **AI辅助分析**：分析错题模式，提供个性化学习建议
3. **社区分享**：允许用户分享和讨论错题
4. **导出功能**：支持导出错题为PDF或其他格式
5. **真实OCR集成**：集成真实的OCR服务，提高文本识别准确率

## 特别说明

### 拍照功能实现

系统使用HTML5的`capture`属性实现直接调用设备摄像头的功能：

```typescript
<input
  type="file"
  ref={cameraInputRef}
  onChange={handleFileChange}
  accept="image/*"
  capture="environment" // 使用后置摄像头，如果要使用前置摄像头，可以设置为"user"
  className="hidden"
/>
```

这种实现方式有以下优点：
1. 无需额外的权限请求（浏览器会自动处理）
2. 跨平台兼容性好（支持iOS和Android设备）
3. 直接集成到文件上传流程中

注意：此功能在移动设备上效果最佳，在桌面设备上可能会调用连接的摄像头或提示选择摄像头设备。

### OCR智能识别实现

系统目前使用模拟数据实现OCR功能，在实际应用中可以集成第三方OCR服务：

```typescript
// 模拟OCR服务的响应
const mockOcrTexts = [
  '求证：如果函数f(x)在区间[a,b]上连续，在(a,b)内可导，且f(a)=f(b)，则至少存在一点ξ∈(a,b)，使得f\'(ξ)=0。',
  '已知：直线l经过点A(1,2)，且与直线m：2x-y+3=0平行，求直线l的方程。',
  // 更多模拟文本...
];

const performOcrRecognition = () => {
  // 在实际应用中，这里会调用OCR API
  setIsRecognizing(true);
  
  // 模拟API调用延迟
  setTimeout(() => {
    const randomIndex = (ocrAttempts) % mockOcrTexts.length;
    setRecognizedText(mockOcrTexts[randomIndex]);
    setIsRecognizing(false);
  }, 1500);
};
```

OCR功能特点：
1. 支持整图识别和区域识别
2. 提供交互式区域选择功能
3. 实时显示识别状态和结果
4. 可以轻松集成第三方OCR服务（如百度OCR、腾讯OCR等）

## 安装与运行

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

## 项目结构

```
src/
├── app/                  # 页面组件
│   ├── add/              # 添加错题页面
│   ├── detail/           # 错题详情页面
│   ├── review/           # 复习计划页面
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 全局布局
│   └── page.tsx          # 首页
├── components/           # 可复用组件
│   ├── add/              # 添加相关组件
│   ├── detail/           # 详情相关组件
│   ├── home/             # 首页相关组件
│   ├── review/           # 复习相关组件
│   └── Navbar.tsx        # 导航栏组件
├── lib/                  # 工具函数
├── store/                # 状态管理
│   └── mistakeStore.ts   # 错题状态管理
└── types/                # 类型定义
```

## 总结

错题管理系统是一个功能完善、用户友好的Web应用，通过现代化的技术栈和精心设计的用户界面，为学生提供了高效管理和复习错题的解决方案。系统的模块化设计和良好的代码结构，也为未来的功能扩展和维护提供了便利。
