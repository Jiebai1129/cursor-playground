'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import QuickAddEntry from '@/components/home/QuickAddEntry';
import RecentMistakesList from '@/components/home/RecentMistakesList';
import SubjectNavigation from '@/components/home/SubjectNavigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'recent' | 'subjects'>('recent');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          欢迎使用错题管理系统
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          记录、整理和复习你的错题，提高学习效率
        </p>
      </div>

      {/* 快速添加入口 */}
      <QuickAddEntry />

      {/* 标签切换 */}
      <div className="border-b border-gray-200 dark:border-gray-700 mt-12 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('recent')}
            className={`${
              activeTab === 'recent'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            最近错题
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`${
              activeTab === 'subjects'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            学科分类
          </button>
        </nav>
      </div>

      {/* 内容区域 */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'recent' ? (
          <RecentMistakesList />
        ) : (
          <SubjectNavigation />
        )}
      </motion.div>

      {/* 复习计划入口 */}
      <div className="mt-12 bg-indigo-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-300">
              开始智能复习
            </h3>
            <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-400">
              根据你的错题情况，生成个性化复习计划
            </p>
          </div>
          <Link
            href="/review"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            开始复习
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
