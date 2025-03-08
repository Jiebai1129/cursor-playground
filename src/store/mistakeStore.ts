import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Subject = '数学' | '语文' | '英语' | '物理' | '化学' | '生物' | '历史' | '地理' | '政治';

export interface Mistake {
  id: string;
  title: string;
  imageUrl: string;
  subject: Subject;
  tags: string[];
  createdAt: string;
  lastReviewedAt?: string;
  correctCount: number;
  wrongCount: number;
  notes: string;
  solution?: string;
  relatedMistakes?: string[];
  correctionHistory: {
    date: string;
    isCorrect: boolean;
    notes?: string;
  }[];
}

interface MistakeState {
  mistakes: Mistake[];
  addMistake: (mistake: Omit<Mistake, 'id' | 'createdAt' | 'correctCount' | 'wrongCount' | 'correctionHistory'>) => void;
  updateMistake: (id: string, mistake: Partial<Mistake>) => void;
  deleteMistake: (id: string) => void;
  getMistakeById: (id: string) => Mistake | undefined;
  getMistakesBySubject: (subject: Subject) => Mistake[];
  recordAttempt: (id: string, isCorrect: boolean, notes?: string) => void;
  getRecentMistakes: (limit?: number) => Mistake[];
}

export const useMistakeStore = create<MistakeState>()(
  persist(
    (set, get) => ({
      mistakes: [],
      
      addMistake: (mistakeData) => {
        const newMistake: Mistake = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          correctCount: 0,
          wrongCount: 0,
          correctionHistory: [],
          ...mistakeData,
        };
        
        set((state) => ({
          mistakes: [newMistake, ...state.mistakes],
        }));
      },
      
      updateMistake: (id, updatedData) => {
        set((state) => ({
          mistakes: state.mistakes.map((mistake) => 
            mistake.id === id ? { ...mistake, ...updatedData } : mistake
          ),
        }));
      },
      
      deleteMistake: (id) => {
        set((state) => ({
          mistakes: state.mistakes.filter((mistake) => mistake.id !== id),
        }));
      },
      
      getMistakeById: (id) => {
        return get().mistakes.find((mistake) => mistake.id === id);
      },
      
      getMistakesBySubject: (subject) => {
        return get().mistakes.filter((mistake) => mistake.subject === subject);
      },
      
      recordAttempt: (id, isCorrect, notes) => {
        const attempt = {
          date: new Date().toISOString(),
          isCorrect,
          notes,
        };
        
        set((state) => ({
          mistakes: state.mistakes.map((mistake) => {
            if (mistake.id === id) {
              return {
                ...mistake,
                lastReviewedAt: attempt.date,
                correctCount: isCorrect ? mistake.correctCount + 1 : mistake.correctCount,
                wrongCount: isCorrect ? mistake.wrongCount : mistake.wrongCount + 1,
                correctionHistory: [...mistake.correctionHistory, attempt],
              };
            }
            return mistake;
          }),
        }));
      },
      
      getRecentMistakes: (limit = 10) => {
        return [...get().mistakes]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'mistake-storage',
    }
  )
); 