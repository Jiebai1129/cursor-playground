'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useMistakeStore, Mistake } from '@/store/mistakeStore';
import MistakeDisplay from '@/components/detail/MistakeDisplay';
import CorrectionTimeline from '@/components/detail/CorrectionTimeline';
import RelatedMistakes from '@/components/detail/RelatedMistakes';
import NotFound from '@/components/NotFound';

export default function MistakeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const getMistakeById = useMistakeStore((state) => state.getMistakeById);
  const [mistake, setMistake] = useState<Mistake | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    // 在客户端加载数据
    const mistakeData = getMistakeById(resolvedParams.id);
    setMistake(mistakeData || null);
    setIsLoading(false);
  }, [getMistakeById, resolvedParams.id]);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        </div>
      </div>
    );
  }

  if (!mistake) {
    return <NotFound message="找不到该错题" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={handleGoBack}
        className="inline-flex items-center mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        返回
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mistake.title}
        </h1>
        <div className="mt-2 flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 mr-2">
            {mistake.subject}
          </span>
          {mistake.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <MistakeDisplay mistake={mistake} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              订正记录
            </h2>
            <CorrectionTimeline mistake={mistake} />
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              相关错题
            </h2>
            <RelatedMistakes currentMistakeId={mistake.id} subject={mistake.subject} />
          </div>
        </div>
      </div>
    </div>
  );
} 