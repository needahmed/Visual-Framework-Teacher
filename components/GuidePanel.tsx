'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLessonStore } from '@/store/lessonStore';
import { Button } from './ui/button';
import { ChevronRight, CheckCircle, Circle, Play } from 'lucide-react';
import { lessons, getNextLesson, getPreviousLesson } from '@/data/lessons';

interface GuidePanelProps {
  isOpen: boolean;
}

export const GuidePanel: React.FC<GuidePanelProps> = ({ isOpen }) => {
  const { currentLesson, isSuccess, setLesson } = useLessonStore();

  const handleLessonChange = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setLesson(lesson);
    }
  };

  const handleNext = () => {
    const nextLesson = getNextLesson(currentLesson?.id || 1);
    if (nextLesson) {
      setLesson(nextLesson);
    }
  };

  const handlePrevious = () => {
    const prevLesson = getPreviousLesson(currentLesson?.id || 1);
    if (prevLesson) {
      setLesson(prevLesson);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-full bg-slate-900 border-r border-slate-700 overflow-y-auto"
        >
          <div className="w-96 max-w-full p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">NestQuest</h2>
              <p className="text-slate-400 text-sm">
                Learn NestJS by building and visualizing your architecture
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Lessons</h3>
              <div className="space-y-2">
                {lessons.map((lesson) => {
                  const isCurrent = currentLesson?.id === lesson.id;
                  const isCompleted = lesson.id < (currentLesson?.id || 1);
                  
                  return (
                    <Button
                      key={lesson.id}
                      variant={isCurrent ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => handleLessonChange(lesson.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : isCurrent ? (
                          <Play className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">
                            Lesson {lesson.id}: {lesson.title}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {currentLesson && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">Current Lesson</h3>
                  <div className="mt-2 space-y-3">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Title</div>
                      <div className="text-white font-medium">{currentLesson.title}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Description</div>
                      <div className="text-slate-300 text-sm">{currentLesson.description}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Goal</div>
                      <div className="text-violet-400 text-sm font-medium">{currentLesson.goal}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-sm">
                    {isSuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 font-medium">Lesson Completed!</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400">Complete the lesson to continue</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="sm"
                disabled={!getPreviousLesson(currentLesson?.id || 1)}
                className="flex-1"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                variant="default"
                size="sm"
                disabled={!isSuccess || !getNextLesson(currentLesson?.id || 1)}
                className="flex-1 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};