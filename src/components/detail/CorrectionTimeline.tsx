'use client';

import { format } from 'date-fns';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Mistake } from '@/store/mistakeStore';

interface CorrectionTimelineProps {
  mistake: Mistake;
}

export default function CorrectionTimeline({ mistake }: CorrectionTimelineProps) {
  if (mistake.correctionHistory.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          暂无订正记录，开始复习并记录你的进度吧
        </p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {mistake.correctionHistory.map((correction, index) => {
          const isLast = index === mistake.correctionHistory.length - 1;
          
          return (
            <li key={correction.date}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                        correction.isCorrect
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {correction.isCorrect ? (
                        <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {correction.isCorrect ? '已掌握' : '未掌握'}
                        {correction.notes && (
                          <span className="font-medium text-gray-500 dark:text-gray-400">
                            {' - '}{correction.notes}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {format(new Date(correction.date), 'yyyy-MM-dd HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 