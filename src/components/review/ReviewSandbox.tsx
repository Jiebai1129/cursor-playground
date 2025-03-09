'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mistake, Subject } from '@/store/mistakeStore';

interface ReviewSandboxProps {
  mistakes: Mistake[];
  selectedSubject: Subject | 'all';
  onSubjectChange: (subject: Subject | 'all') => void;
}

export default function ReviewSandbox({ mistakes, selectedSubject, onSubjectChange }: ReviewSandboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const subjects: Subject[] = [
    '数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理', '政治'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">自由练习</h2>
        <div className="flex space-x-2">
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value as Subject | 'all')}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">所有科目</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mistakes.length > 0 ? (
        <div className="space-y-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {mistakes[currentIndex].subject}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentIndex + 1} / {mistakes.length}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {mistakes[currentIndex].title}
            </h3>
            
            {mistakes[currentIndex].imageUrl && (
              <div className="mb-4">
                <Image 
                  src={mistakes[currentIndex].imageUrl} 
                  alt={mistakes[currentIndex].title}
                  width={800}
                  height={450}
                  className="max-w-full h-auto rounded-lg"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            
            <div className="mt-6">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {showAnswer ? '隐藏答案' : '查看答案'}
              </button>
              
              {showAnswer && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">题目内容</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{mistakes[currentIndex].content}</p>
                  
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">错误原因</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{mistakes[currentIndex].notes}</p>
                  
                  {mistakes[currentIndex].solution && (
                    <>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">解题思路</h4>
                      <div 
                        className="text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: mistakes[currentIndex].solution }}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              上一题
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === mistakes.length - 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              下一题
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          没有找到符合条件的错题
        </div>
      )}
    </div>
  );
} 