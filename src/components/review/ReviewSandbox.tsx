'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useMistakeStore, Mistake, Subject } from '@/store/mistakeStore';

interface ReviewSandboxProps {
  mistakes: Mistake[];
  selectedSubject: Subject | 'all';
}

export default function ReviewSandbox({ mistakes, selectedSubject }: ReviewSandboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [reviewHistory, setReviewHistory] = useState<{ id: string; isCorrect: boolean }[]>([]);
  const recordAttempt = useMistakeStore((state) => state.recordAttempt);

  // 当错题列表或学科变化时，重置状态
  useEffect(() => {
    setCurrentIndex(0);
    setShowSolution(false);
    setReviewHistory([]);
  }, [mistakes, selectedSubject]);

  if (mistakes.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">暂无错题</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {selectedSubject === 'all' ? '添加一些错题后再开始复习' : `${selectedSubject} 学科暂无错题`}
        </p>
      </div>
    );
  }

  const currentMistake = mistakes[currentIndex];
  const isLastMistake = currentIndex === mistakes.length - 1;

  const handleMarkCorrect = () => {
    recordAttempt(currentMistake.id, true);
    setReviewHistory([...reviewHistory, { id: currentMistake.id, isCorrect: true }]);
    goToNextMistake();
  };

  const handleMarkIncorrect = () => {
    recordAttempt(currentMistake.id, false);
    setReviewHistory([...reviewHistory, { id: currentMistake.id, isCorrect: false }]);
    goToNextMistake();
  };

  const goToNextMistake = () => {
    if (!isLastMistake) {
      setCurrentIndex(currentIndex + 1);
      setShowSolution(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowSolution(false);
    setReviewHistory([]);
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  // 计算复习统计
  const correctCount = reviewHistory.filter(item => item.isCorrect).length;
  const incorrectCount = reviewHistory.filter(item => !item.isCorrect).length;
  const progress = Math.round((reviewHistory.length / mistakes.length) * 100);

  return (
    <div>
      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            复习进度: {reviewHistory.length}/{mistakes.length} 题
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {progress}%
          </span>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {reviewHistory.length > 0 && (
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
              <span>正确: {correctCount}</span>
            </div>
            <div className="flex items-center">
              <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
              <span>错误: {incorrectCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* 复习完成状态 */}
      {isLastMistake && reviewHistory.length === mistakes.length ? (
        <div className="py-12 text-center">
          <div className="mx-auto h-24 w-24 text-green-500">
            <CheckCircleIcon />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-200">复习完成！</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            你已完成所有错题的复习
          </p>
          <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">复习统计</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-500">{correctCount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">正确</div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-500">{incorrectCount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">错误</div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                正确率: {Math.round((correctCount / mistakes.length) * 100)}%
              </p>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleRestart}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              重新开始
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* 当前错题 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {currentMistake.title}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {currentMistake.subject}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                创建于 {format(new Date(currentMistake.createdAt), 'yyyy-MM-dd')}
              </p>
            </div>
            
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
              {currentMistake.imageUrl ? (
                <Image
                  src={currentMistake.imageUrl}
                  alt={currentMistake.title}
                  width={800}
                  height={450}
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400 dark:text-gray-500">无图片</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  解题思路
                </h4>
                <button
                  onClick={toggleSolution}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  {showSolution ? (
                    <>
                      <EyeSlashIcon className="h-4 w-4 mr-1" />
                      隐藏解答
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-4 w-4 mr-1" />
                      查看解答
                    </>
                  )}
                </button>
              </div>
              
              {showSolution ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {currentMistake.solution || currentMistake.notes || '暂无解题思路'}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    尝试解答后再查看解题思路
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-4">
            <button
              onClick={handleMarkCorrect}
              className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              已掌握
            </button>
            <button
              onClick={handleMarkIncorrect}
              className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <XCircleIcon className="h-5 w-5 mr-2" />
              未掌握
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 