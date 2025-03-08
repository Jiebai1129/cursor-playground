'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ChevronRightIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useMistakeStore, Mistake } from '@/store/mistakeStore';

export default function RecentMistakesList() {
  const getRecentMistakes = useMistakeStore((state) => state.getRecentMistakes);
  const [recentMistakes, setRecentMistakes] = useState<Mistake[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 在客户端加载数据
    setRecentMistakes(getRecentMistakes(8));
    setIsLoading(false);
  }, [getRecentMistakes]);

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (recentMistakes.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">暂无错题</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          开始添加你的第一个错题吧
        </p>
        <div className="mt-6">
          <Link
            href="/add"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            添加错题
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {recentMistakes.map((mistake) => (
        <Link
          key={mistake.id}
          href={`/detail/${mistake.id}`}
          className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="aspect-w-3 aspect-h-2 bg-gray-200 dark:bg-gray-700">
            {mistake.imageUrl ? (
              <Image
                src={mistake.imageUrl}
                alt={mistake.title}
                width={300}
                height={200}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 dark:text-gray-500">无图片</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {mistake.subject}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                {format(new Date(mistake.createdAt), 'MM-dd')}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
              {mistake.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="inline-flex items-center text-xs text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  {mistake.correctCount}
                </span>
                <span className="inline-flex items-center text-xs text-red-600 dark:text-red-400">
                  <XCircleIcon className="h-3 w-3 mr-1" />
                  {mistake.wrongCount}
                </span>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 