'use client';

import { useRouter } from 'next/navigation';
import { PlusCircleIcon, CameraIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function QuickAddEntry() {
  const router = useRouter();

  const handleAddClick = () => {
    router.push('/add');
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-8 sm:p-10 sm:pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">快速添加错题</h3>
            <p className="mt-2 text-indigo-100">
              拍照或上传图片，快速记录你的错题
            </p>
          </div>
          <div className="hidden sm:block">
            <PlusCircleIcon className="h-12 w-12 text-indigo-200" />
          </div>
        </div>
      </div>
      <div className="px-6 pt-6 pb-8 sm:px-10 sm:pt-6 sm:pb-8 bg-indigo-50 dark:bg-gray-800/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CameraIcon className="mr-2 h-5 w-5" />
            拍照添加
          </button>
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <DocumentTextIcon className="mr-2 h-5 w-5" />
            上传图片
          </button>
        </div>
      </div>
    </motion.div>
  );
} 