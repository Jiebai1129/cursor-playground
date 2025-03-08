'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddMistakeForm from '@/components/add/AddMistakeForm';
import ImageUploader from '@/components/add/ImageUploader';
import RecognitionArea from '@/components/add/RecognitionArea';

// 模拟OCR服务的响应
const mockOcrTexts = [
  '求证：如果函数f(x)在区间[a,b]上连续，在(a,b)内可导，且f(a)=f(b)，则至少存在一点ξ∈(a,b)，使得f\'(ξ)=0。',
  '已知：直线l经过点A(1,2)，且与直线m：2x-y+3=0平行，求直线l的方程。',
  '计算：∫(0到π/2) sin²x dx',
  '若复数z满足|z-2|=|z-2i|，则|z|的最小值为________。',
  '已知函数f(x)=ln(x²+1)-ax在区间(0,+∞)上单调递减，求实数a的取值范围。'
];

export default function AddMistakePage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [ocrAttempts, setOcrAttempts] = useState<number>(0);

  const handleImageUpload = (imageUrl: string) => {
    if (!imageUrl) {
      setUploadedImage(null);
      setRecognizedText('');
      return;
    }
    
    setUploadedImage(imageUrl);
    performOcrRecognition();
  };

  const performOcrRecognition = () => {
    // 模拟OCR识别过程
    setIsRecognizing(true);
    
    // 增加识别尝试次数，用于随机选择不同的模拟文本
    const newAttemptCount = ocrAttempts + 1;
    setOcrAttempts(newAttemptCount);
    
    setTimeout(() => {
      // 从模拟文本中随机选择一个，以模拟不同的识别结果
      const randomIndex = (newAttemptCount - 1) % mockOcrTexts.length;
      setRecognizedText(mockOcrTexts[randomIndex]);
      setIsRecognizing(false);
    }, 1500);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          添加错题
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          上传错题图片，添加标签和笔记
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              上传错题图片
            </h2>
            <ImageUploader onImageUpload={handleImageUpload} currentImage={uploadedImage} />
          </div>

          {uploadedImage && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                智能识别区域
              </h2>
              <RecognitionArea 
                imageUrl={uploadedImage} 
                recognizedText={recognizedText}
                isRecognizing={isRecognizing}
                onRecognizeRequest={performOcrRecognition}
              />
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            错题信息
          </h2>
          <AddMistakeForm 
            recognizedText={recognizedText} 
            imageUrl={uploadedImage}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
} 