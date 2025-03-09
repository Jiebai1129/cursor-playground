'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { TagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMistakeStore, Subject } from '@/store/mistakeStore';

interface AddMistakeFormProps {
  onCancel: () => void;
}

interface FormData {
  title: string;
  subject: Subject;
  imageUrl: string;
  content: string;
  notes: string;
  solution?: string;
  tags: string[];
}

export default function AddMistakeForm({ onCancel }: AddMistakeFormProps) {
  const router = useRouter();
  const addMistake = useMistakeStore((state) => state.addMistake);
  const [tagInput, setTagInput] = useState('');
  
  // 从父组件获取状态
  const [imageUrl, setImageUrl] = useState<string>('');
  const [recognizedText, setRecognizedText] = useState<string>('');
  
  // 尝试从 localStorage 获取值
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedImage = localStorage.getItem('uploadedImage');
      const storedText = localStorage.getItem('recognizedText');
      
      if (storedImage) setImageUrl(storedImage);
      if (storedText) setRecognizedText(storedText);
    }
  }, []);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      title: '',
      subject: 'MATH' as Subject,
      imageUrl: imageUrl || '',
      content: '',
      notes: recognizedText || '',
      solution: undefined,
      tags: [],
    }
  });

  const tags = watch('tags');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setValue('tags', tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const newMistake = {
        ...data,
        content: data.content,
        imageUrl: imageUrl || data.imageUrl || '',
        solution: data.solution || '',
      };
      await addMistake(newMistake);
      router.push('/');
    } catch (error) {
      console.error('Failed to add mistake:', error);
    }
  };

  const subjects: Subject[] = [
    '数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理', '政治'
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          错题标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm ${
            errors.title ? 'border-red-500' : ''
          }`}
          placeholder="简短描述这道题目"
          {...register('title', { required: '请输入错题标题' })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          学科 <span className="text-red-500">*</span>
        </label>
        <select
          id="subject"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          {...register('subject', { required: '请选择学科' })}
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          标签
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              placeholder="添加标签"
            />
          </div>
          <button
            type="button"
            onClick={handleAddTag}
            className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            添加
          </button>
        </div>
        
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-indigo-100 py-0.5 pl-2.5 pr-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none dark:hover:bg-indigo-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          错题笔记 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="notes"
          rows={4}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm ${
            errors.notes ? 'border-red-500' : ''
          }`}
          placeholder="记录错误原因和思考过程"
          {...register('notes', { required: '请输入错题笔记' })}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="solution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          解题思路
        </label>
        <textarea
          id="solution"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          placeholder="记录正确的解题思路（可选）"
          {...register('solution')}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '保存中...' : '保存错题'}
        </button>
      </div>
    </form>
  );
} 