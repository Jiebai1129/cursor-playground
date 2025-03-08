'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useMistakeStore, Mistake, Subject } from '@/store/mistakeStore';

interface RelatedMistakesProps {
  currentMistakeId: string;
  subject: Subject;
}

export default function RelatedMistakes({ currentMistakeId, subject }: RelatedMistakesProps) {
  const getMistakesBySubject = useMistakeStore((state) => state.getMistakesBySubject);
  const [relatedMistakes, setRelatedMistakes] = useState<Mistake[]>([]);

  useEffect(() => {
    // 获取同一学科的其他错题
    const subjectMistakes = getMistakesBySubject(subject);
    const filtered = subjectMistakes
      .filter((mistake) => mistake.id !== currentMistakeId)
      .slice(0, 3); // 最多显示3个相关错题
    
    setRelatedMistakes(filtered);
  }, [getMistakesBySubject, subject, currentMistakeId]);

  if (relatedMistakes.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          暂无相关错题
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {relatedMistakes.map((mistake) => (
        <Link
          key={mistake.id}
          href={`/detail/${mistake.id}`}
          className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {mistake.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {mistake.tags.join(', ')}
              </p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
      ))}
      
      <Link
        href={`/`}
        className="block text-center text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mt-2"
      >
        查看更多 {subject} 错题
      </Link>
    </div>
  );
} 