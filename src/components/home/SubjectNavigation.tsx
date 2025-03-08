'use client';

import { useRouter } from 'next/navigation';
import { useMistakeStore, Subject } from '@/store/mistakeStore';

const subjects: { name: Subject; icon: string; color: string }[] = [
  { name: '数学', icon: '➗', color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' },
  { name: '语文', icon: '📝', color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' },
  { name: '英语', icon: '🔤', color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' },
  { name: '物理', icon: '⚛️', color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' },
  { name: '化学', icon: '🧪', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' },
  { name: '生物', icon: '🧬', color: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200' },
  { name: '历史', icon: '📜', color: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' },
  { name: '地理', icon: '🌍', color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' },
  { name: '政治', icon: '⚖️', color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' },
];

export default function SubjectNavigation() {
  const router = useRouter();
  const getMistakesBySubject = useMistakeStore((state) => state.getMistakesBySubject);
  
  const handleSubjectClick = (subject: Subject) => {
    // 这里可以导航到特定学科的错题列表页面
    // 目前我们只是简单地打印数量
    const mistakes = getMistakesBySubject(subject);
    console.log(`${subject} 错题数量: ${mistakes.length}`);
    
    // 未来可以实现导航到学科特定页面
    // router.push(`/subjects/${subject}`);
  };

  return (
    <div className="py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {subjects.map((subject) => (
          <button
            key={subject.name}
            onClick={() => handleSubjectClick(subject.name)}
            className={`${subject.color} flex flex-col items-center justify-center p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <span className="text-3xl mb-2">{subject.icon}</span>
            <span className="font-medium">{subject.name}</span>
            <span className="text-xs mt-1">
              {getMistakesBySubject(subject.name).length} 道错题
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          学科错题统计
        </h3>
        <div className="space-y-2">
          {subjects.map((subject) => {
            const count = getMistakesBySubject(subject.name).length;
            const percentage = count > 0 ? Math.min(100, Math.max(5, count * 5)) : 0;
            
            return (
              <div key={subject.name} className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{subject.name}</span>
                <div className="flex-1 mx-2">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${subject.color.split(' ')[0]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 