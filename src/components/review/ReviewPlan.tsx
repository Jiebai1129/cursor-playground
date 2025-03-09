'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, addDays } from 'date-fns';
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Mistake } from '@/store/mistakeStore';

interface ReviewPlanProps {
  mistakes: Mistake[];
  isGenerating: boolean;
  onGeneratePlan: () => void;
}

interface PlanDay {
  date: Date;
  mistakes: Mistake[];
}

export default function ReviewPlan({ mistakes, isGenerating, onGeneratePlan }: ReviewPlanProps) {
  const [plan, setPlan] = useState<PlanDay[]>([]);

  useEffect(() => {
    if (mistakes.length === 0) {
      setPlan([]);
      return;
    }

    // 简单的复习计划生成算法
    // 实际应用中可以基于艾宾浩斯遗忘曲线等更复杂的算法
    const today = new Date();
    const newPlan: PlanDay[] = [];

    // 按照错误率排序错题
    const sortedMistakes = [...mistakes].sort((a, b) => {
      const aErrorRate = a.wrongCount / (a.correctCount + a.wrongCount || 1);
      const bErrorRate = b.wrongCount / (b.correctCount + b.wrongCount || 1);
      return bErrorRate - aErrorRate;
    });

    // 创建7天的复习计划
    for (let i = 0; i < 7; i++) {
      const planDate = addDays(today, i);
      const dayMistakes: Mistake[] = [];
      
      // 每天分配一些错题，优先分配错误率高的
      const startIndex = i * Math.ceil(sortedMistakes.length / 7);
      const endIndex = Math.min(startIndex + Math.ceil(sortedMistakes.length / 7), sortedMistakes.length);
      
      for (let j = startIndex; j < endIndex; j++) {
        if (sortedMistakes[j]) {
          dayMistakes.push(sortedMistakes[j]);
        }
      }
      
      newPlan.push({
        date: planDate,
        mistakes: dayMistakes,
      });
    }

    setPlan(newPlan);
  }, [mistakes, isGenerating]);

  if (mistakes.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">暂无错题</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          添加一些错题后再生成复习计划
        </p>
        <div className="mt-6">
          <button
            onClick={onGeneratePlan}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {isGenerating ? '生成中...' : '生成复习计划'}
          </button>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="py-12">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {plan.map((day, index) => (
        <div 
          key={index} 
          className={`border rounded-lg overflow-hidden ${
            index === 0 ? 'border-indigo-500 dark:border-indigo-400' : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className={`px-4 py-3 ${
            index === 0 ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-gray-50 dark:bg-gray-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CalendarIcon className={`h-5 w-5 mr-2 ${
                  index === 0 ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <h3 className={`text-sm font-medium ${
                  index === 0 ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {index === 0 ? '今天' : format(day.date, 'MM月dd日')} 
                  {index === 0 && <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-0.5 rounded-full">当前</span>}
                </h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {day.mistakes.length} 道错题
              </span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {day.mistakes.map((mistake) => (
              <Link
                key={mistake.id}
                href={`/detail/${mistake.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {mistake.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {mistake.subject} · 错误率: {mistake.wrongCount + mistake.correctCount > 0 
                        ? Math.round((mistake.wrongCount / (mistake.wrongCount + mistake.correctCount)) * 100) 
                        : 0}%
                    </p>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
          
          {day.mistakes.length === 0 && (
            <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
              这一天没有安排复习内容
            </div>
          )}
        </div>
      ))}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          复习计划基于你的错题情况自动生成，每天完成计划中的错题复习，提高学习效率
        </p>
      </div>
    </div>
  );
} 