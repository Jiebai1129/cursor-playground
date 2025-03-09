'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { PencilIcon, CheckCircleIcon, XCircleIcon, XMarkIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useMistakeStore, Mistake } from '@/store/mistakeStore';
import AISolutionGenerator from './AISolutionGenerator';

interface MistakeDisplayProps {
  mistake: Mistake;
}

export default function MistakeDisplay({ mistake }: MistakeDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(mistake.content || '');
  const [notes, setNotes] = useState(mistake.notes);
  const [solution, setSolution] = useState(mistake.solution || '');
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [generatedSolution, setGeneratedSolution] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const updateMistake = useMistakeStore((state) => state.updateMistake);
  const recordAttempt = useMistakeStore((state) => state.recordAttempt);

  // 当 mistake 属性更新时，同步更新本地状态
  useEffect(() => {
    setContent(mistake.content || '');
    setNotes(mistake.notes);
    setSolution(mistake.solution || '');
  }, [mistake]);

  const handleSaveEdit = () => {
    const updatedData = {
      content: content.trim(),
      notes: notes.trim(),
      solution: solution.trim() || undefined,
    };
    
    updateMistake(mistake.id, updatedData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setContent(mistake.content || '');
    setNotes(mistake.notes);
    setSolution(mistake.solution || '');
    setIsEditing(false);
  };

  const handleRecordAttempt = (isCorrect: boolean) => {
    recordAttempt(mistake.id, isCorrect);
  };

  const handleSolutionGenerated = (generatedSolution: string) => {
    setGeneratedSolution(generatedSolution);
    setShowSolutionModal(true);
    setIsRegenerating(false);
  };

  const handleAcceptSolution = () => {
    const updatedSolution = generatedSolution.trim();
    setSolution(updatedSolution);
    updateMistake(mistake.id, {
      solution: updatedSolution,
    });
    setShowSolutionModal(false);
  };

  const handleRejectSolution = () => {
    setShowSolutionModal(false);
    setIsRegenerating(false);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
  };

  return (
    <div>
      {/* AI解答结果弹窗 */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  onClick={handleRejectSolution}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    AI生成的解答
                  </h3>
                  <div className="mt-2">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {generatedSolution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAcceptSolution}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  采用此解答
                </button>
                <button
                  type="button"
                  onClick={handleRejectSolution}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                题目内容
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
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    题目内容
                  </label>
                  <textarea
                    id="content"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    placeholder="输入完整的题目内容"
                  />
                </div>

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
                    placeholder="记录错误原因和思考过程"
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
                    placeholder="记录正确的解题思路"
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
                    {mistake.content}
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    错题笔记
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {mistake.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                解题思路
              </h3>
              {!isEditing && mistake.solution && (
                <button
                  onClick={handleRegenerate}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  <LightBulbIcon className="h-4 w-4 mr-1" />
                  重新生成
                </button>
              )}
            </div>
            {!isEditing && (
              <>
                {mistake.solution && !isRegenerating && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {mistake.solution}
                    </p>
                  </div>
                )}
                {(!mistake.solution || isRegenerating) && (
                  <AISolutionGenerator 
                    mistake={mistake} 
                    onSolutionGenerated={handleSolutionGenerated} 
                  />
                )}
              </>
            )}
          </div>
        </div>
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