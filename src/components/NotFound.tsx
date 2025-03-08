'use client';

import { useRouter } from 'next/navigation';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface NotFoundProps {
  message?: string;
}

export default function NotFound({ message = '页面不存在' }: NotFoundProps) {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        404 - {message}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
        抱歉，您请求的内容不存在或已被移除。
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          返回上一页
        </button>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          返回首页
        </button>
      </div>
    </div>
  );
} 