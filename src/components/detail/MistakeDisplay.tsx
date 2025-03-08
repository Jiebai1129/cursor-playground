'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { PencilIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useMistakeStore, Mistake } from '@/store/mistakeStore';

interface MistakeDisplayProps {
  mistake: Mistake;
}

export default function MistakeDisplay({ mistake }: MistakeDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(mistake.notes);
  const [solution, setSolution] = useState(mistake.solution || '');
  const updateMistake = useMistakeStore((state) => state.updateMistake);
  const recordAttempt = useMistakeStore((state) => state.recordAttempt);

  const handleSaveEdit = () => {
    updateMistake(mistake.id, {
      notes,
      solution: solution || undefined,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setNotes(mistake.notes);
    setSolution(mistake.solution || '');
    setIsEditing(false);
  };

  const handleRecordAttempt = (isCorrect: boolean) => {
    recordAttempt(mistake.id, isCorrect);
  };

  return (
    <div>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              错题详情
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              创建于 {format(new Date(mistake.createdAt), 'yyyy-MM-dd')}
              {mistake.lastReviewedAt && (
                <> · 最近复习于 {format(new Date(mistake.lastReviewedAt), 'yyyy-MM-dd')}</>
              )}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleRecordAttempt(true)}
              className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              title="标记为已掌握"
            >
              <CheckCircleIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleRecordAttempt(false)}
              className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              title="标记为未掌握"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
          {mistake.imageUrl ? (
            <Image
              src={mistake.imageUrl}
              alt={mistake.title}
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

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-medium text-gray-900 dark:text-white">
            错题笔记
          </h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              编辑
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                错题笔记
              </label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                解题思路
              </label>
              <textarea
                id="solution"
                rows={4}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {mistake.notes}
              </p>
            </div>
            
            {mistake.solution && (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                  解题思路
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {mistake.solution}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-medium text-gray-900 dark:text-white">
            掌握情况
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                正确: {mistake.correctCount}
              </span>
            </div>
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                错误: {mistake.wrongCount}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 mb-1">
          <div 
            className="bg-green-500 h-2.5 rounded-full" 
            style={{ 
              width: `${mistake.correctCount + mistake.wrongCount > 0 
                ? (mistake.correctCount / (mistake.correctCount + mistake.wrongCount)) * 100 
                : 0}%` 
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          掌握率: {mistake.correctCount + mistake.wrongCount > 0 
            ? Math.round((mistake.correctCount / (mistake.correctCount + mistake.wrongCount)) * 100) 
            : 0}%
        </p>
      </div>
    </div>
  );
} 