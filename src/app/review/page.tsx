'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useMistakeStore, Mistake, Subject } from '@/store/mistakeStore';
import ReviewPlan from '@/components/review/ReviewPlan';
import ReviewSandbox from '@/components/review/ReviewSandbox';

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<'plan' | 'sandbox'>('plan');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [reviewMistakes, setReviewMistakes] = useState<Mistake[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const getMistakesBySubject = useMistakeStore((state) => state.getMistakesBySubject);
  const mistakes = useMistakeStore((state) => state.mistakes);

  const subjects: Subject[] = [
    '数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理', '政治'
  ];

  useEffect(() => {
    // 根据选择的学科筛选错题
    if (selectedSubject === 'all') {
      setReviewMistakes(mistakes);
    } else {
      setReviewMistakes(getMistakesBySubject(selectedSubject));
    }
  }, [selectedSubject, mistakes, getMistakesBySubject]);

  const handleGeneratePlan = () => {
    // 模拟生成复习计划
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          复习计划
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          智能生成复习计划，提高学习效率
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                学科筛选
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                选择需要复习的学科
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  selectedSubject === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                全部
              </button>
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    selectedSubject === subject
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('plan')}
              className={`${
                activeTab === 'plan'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              <CalendarIcon className="h-5 w-5 inline-block mr-2" />
              智能复习计划
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`${
                activeTab === 'sandbox'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              <CheckCircleIcon className="h-5 w-5 inline-block mr-2" />
              错题重做沙盒
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'plan' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedSubject === 'all' ? '全部学科' : selectedSubject} 复习计划
                </h3>
                <button
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      重新生成
                    </>
                  )}
                </button>
              </div>
              
              <ReviewPlan 
                mistakes={reviewMistakes} 
                isGenerating={isGenerating} 
                onGeneratePlan={handleGeneratePlan}
              />
            </div>
          ) : (
            <ReviewSandbox 
              mistakes={reviewMistakes} 
              selectedSubject={selectedSubject} 
              onSubjectChange={setSelectedSubject}
            />
          )}
        </div>
      </div>
    </div>
  );
} 