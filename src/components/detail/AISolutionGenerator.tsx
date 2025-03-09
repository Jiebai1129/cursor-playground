'use client';

import { useState } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { Mistake } from '@/store/mistakeStore';
import { generateSolutionForMistake } from '@/lib/llmService';

interface AISolutionGeneratorProps {
  mistake: Mistake;
  onSolutionGenerated: (solution: string) => void;
}

export default function AISolutionGenerator({ mistake, onSolutionGenerated }: AISolutionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);

  const handleGenerateSolution = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateSolutionForMistake(mistake);
      
      if (result.error) {
        setError(result.error);
      } else if (result.solution) {
        setSolution(result.solution);
        onSolutionGenerated(result.solution);
      } else {
        setError('生成解答失败，请稍后重试');
      }
    } catch (err) {
      setError('发生错误，请稍后重试');
      console.error('AI解题错误:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
          <h3 className="text-md font-medium text-gray-900 dark:text-white">
            AI智能解题
          </h3>
        </div>
        <button
          onClick={handleGenerateSolution}
          disabled={isGenerating}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">正在生成解答，请稍候...</p>
            </div>
          ) : solution ? (
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: solution }} />
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">点击&quot;生成解答&quot;获取 AI 解答</p>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-md p-4">
        <p className="text-sm text-indigo-700 dark:text-indigo-200">
          使用AI智能解题功能，获取详细的解题思路和步骤。点击&quot;生成解答&quot;按钮，系统将分析题目内容并提供专业解答。
        </p>
      </div>
    </div>
  );
} 