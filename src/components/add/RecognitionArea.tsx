'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface RecognitionAreaProps {
  imageUrl: string | null;
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
  if (!imageUrl) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          识别结果
        </h3>
        <button
          type="button"
          onClick={onRecognizeRequest}
          disabled={isRecognizing}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRecognizing ? (
            <>
              <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
              识别中...
            </>
          ) : (
            <>
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              重新识别
            </>
          )}
        </button>
      </div>

      {isRecognizing ? (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            正在识别图片内容...
          </p>
        </div>
      ) : recognizedText ? (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {recognizedText}
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            点击&quot;重新识别&quot;按钮识别图片内容
          </p>
        </div>
      )}
    </div>
  );
} 