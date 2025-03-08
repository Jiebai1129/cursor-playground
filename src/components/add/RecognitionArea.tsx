'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface RecognitionAreaProps {
  imageUrl: string;
  recognizedText: string;
  isRecognizing: boolean;
  onRecognizeRequest: () => void;
}

export default function RecognitionArea({ 
  imageUrl, 
  recognizedText, 
  isRecognizing,
  onRecognizeRequest 
}: RecognitionAreaProps) {
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleRecognizeAgain = () => {
    // 触发父组件的识别请求
    onRecognizeRequest();
  };

  const handleStartSelection = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setStartPoint({ x, y });
    setIsSelecting(true);
    setSelectedArea(null);
  };

  const handleMoveSelection = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !startPoint || !imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;
    
    const width = Math.abs(currentX - startPoint.x);
    const height = Math.abs(currentY - startPoint.y);
    const x = Math.min(currentX, startPoint.x);
    const y = Math.min(currentY, startPoint.y);
    
    setSelectedArea({ x, y, width, height });
  };

  const handleEndSelection = () => {
    setIsSelecting(false);
    if (selectedArea && (selectedArea.width < 5 || selectedArea.height < 5)) {
      // 如果选择的区域太小，则取消选择
      setSelectedArea(null);
    }
  };

  const handleRecognizeSelectedArea = () => {
    // 如果有选定区域，则识别该区域
    // 否则识别整个图片
    onRecognizeRequest();
  };

  return (
    <div>
      <div className="mb-4">
        {isRecognizing ? (
          <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <ArrowPathIcon className="h-5 w-5 text-indigo-500 animate-spin mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">正在识别文本...</span>
          </div>
        ) : recognizedText ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">识别结果</h3>
              <button
                type="button"
                onClick={handleRecognizeAgain}
                className="inline-flex items-center text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                <ArrowPathIcon className="h-3 w-3 mr-1" />
                重新识别
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {recognizedText}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">点击图片区域进行识别</span>
          </div>
        )}
      </div>

      <div className="relative border rounded-lg overflow-hidden">
        <div 
          ref={imageContainerRef}
          className="aspect-w-16 aspect-h-9 cursor-crosshair"
          onMouseDown={handleStartSelection}
          onMouseMove={handleMoveSelection}
          onMouseUp={handleEndSelection}
          onMouseLeave={handleEndSelection}
        >
          <Image
            src={imageUrl}
            alt="Recognition area"
            width={800}
            height={450}
            className="object-contain"
          />
          
          {/* 选择区域覆盖层 */}
          {selectedArea && (
            <div
              className="absolute border-2 border-indigo-500 bg-indigo-500/20"
              style={{
                left: `${selectedArea.x}%`,
                top: `${selectedArea.y}%`,
                width: `${selectedArea.width}%`,
                height: `${selectedArea.height}%`,
              }}
            />
          )}
        </div>
        
        <div className="absolute bottom-2 right-2">
          <button
            type="button"
            onClick={handleRecognizeSelectedArea}
            className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            title="识别选中区域"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          提示: 在图片上拖动鼠标可以选择特定区域进行精确识别
        </p>
      </div>
    </div>
  );
} 