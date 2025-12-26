'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLessonStore } from '@/store/lessonStore';
import { Button } from './ui/button';
import { 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Play, 
  Clock, 
  Lightbulb, 
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Sparkles
} from 'lucide-react';
import { lessons, getNextLesson, getPreviousLesson, Step } from '@/data/lessons';

interface GuidePanelProps {
  isOpen: boolean;
}

export const GuidePanel: React.FC<GuidePanelProps> = ({ isOpen }) => {
  const { currentLesson, isSuccess, setLesson, setCurrentFile } = useLessonStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([0]);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [showLessonList, setShowLessonList] = useState(false);

  const handleLessonChange = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setLesson(lesson);
      setCurrentStep(0);
      setExpandedSteps([0]);
      setShowHint(null);
    }
  };

  const handleNext = () => {
    const nextLesson = getNextLesson(currentLesson?.id || 1);
    if (nextLesson) {
      setLesson(nextLesson);
      setCurrentStep(0);
      setExpandedSteps([0]);
      setShowHint(null);
    }
  };

  const handlePrevious = () => {
    const prevLesson = getPreviousLesson(currentLesson?.id || 1);
    if (prevLesson) {
      setLesson(prevLesson);
      setCurrentStep(0);
      setExpandedSteps([0]);
      setShowHint(null);
    }
  };

  const toggleStep = (stepIndex: number) => {
    if (expandedSteps.includes(stepIndex)) {
      setExpandedSteps(expandedSteps.filter(i => i !== stepIndex));
    } else {
      setExpandedSteps([...expandedSteps, stepIndex]);
    }
    setCurrentStep(stepIndex);
  };

  const handleStepFileClick = (step: Step) => {
    if (step.codeHighlight) {
      setCurrentFile(step.codeHighlight.file);
    }
  };

  const toggleHint = (stepId: number) => {
    setShowHint(showHint === stepId ? null : stepId);
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
          <div className="w-[420px] max-w-full p-6 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-violet-500" />
                NestQuest
              </h2>
              <p className="text-slate-400 text-sm">
                Learn NestJS by building and visualizing your architecture
              </p>
            </div>

            {/* Lesson Selector */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLessonList(!showLessonList)}
                className="w-full justify-between text-left h-auto py-2 px-3 bg-slate-800 hover:bg-slate-750"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-500" />
                  <span className="text-slate-200 font-medium">
                    Lesson {currentLesson?.id}: {currentLesson?.title}
                  </span>
                </div>
                {showLessonList ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </Button>

              <AnimatePresence>
                {showLessonList && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1 overflow-hidden"
                  >
                    {lessons.map((lesson) => {
                      const isCurrent = currentLesson?.id === lesson.id;
                      const isCompleted = lesson.id < (currentLesson?.id || 1);
                      
                      return (
                        <Button
                          key={lesson.id}
                          variant={isCurrent ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-left h-auto py-2 px-3"
                          onClick={() => {
                            handleLessonChange(lesson.id);
                            setShowLessonList(false);
                          }}
                        >
                          <div className="flex items-center gap-2 w-full">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : isCurrent ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-500" />
                            )}
                            <span className="text-sm">
                              Lesson {lesson.id}: {lesson.title}
                            </span>
                          </div>
                        </Button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Current Lesson Content */}
            {currentLesson && (
              <div className="space-y-5">
                {/* Lesson Header */}
                <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-lg p-4 border border-violet-500/30">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{currentLesson.title}</h3>
                    {currentLesson.estimatedTime && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {currentLesson.estimatedTime}
                      </div>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{currentLesson.description}</p>
                  
                  {/* Goal */}
                  <div className="flex items-start gap-2 bg-slate-800/50 rounded-md p-2">
                    <Target className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Goal</div>
                      <div className="text-sm text-violet-300">{currentLesson.goal}</div>
                    </div>
                  </div>
                </div>

                {/* Concepts */}
                {currentLesson.concepts && currentLesson.concepts.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-2">What you'll learn:</div>
                    <div className="flex flex-wrap gap-2">
                      {currentLesson.concepts.map((concept, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-slate-800 text-slate-300 rounded-md text-xs border border-slate-700"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Steps */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center text-xs text-white">
                      {currentLesson.steps?.length || 0}
                    </div>
                    Steps to Complete
                  </div>
                  
                  <div className="space-y-2">
                    {currentLesson.steps?.map((step, index) => {
                      const isExpanded = expandedSteps.includes(index);
                      const isCurrentStep = currentStep === index;
                      const isHintVisible = showHint === step.id;

                      return (
                        <motion.div
                          key={step.id}
                          className={`rounded-lg border transition-all ${
                            isCurrentStep 
                              ? 'border-violet-500 bg-violet-500/10' 
                              : 'border-slate-700 bg-slate-800/50'
                          }`}
                          layout
                        >
                          {/* Step Header */}
                          <button
                            onClick={() => toggleStep(index)}
                            className="w-full flex items-center gap-3 p-3 text-left"
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              isCurrentStep 
                                ? 'bg-violet-600 text-white' 
                                : 'bg-slate-700 text-slate-300'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className={`font-medium text-sm ${
                                isCurrentStep ? 'text-white' : 'text-slate-300'
                              }`}>
                                {step.title}
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          {/* Step Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 space-y-3">
                                  {/* Instruction */}
                                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3">
                                    <div className="text-xs text-blue-400 font-medium mb-1">📋 What to do:</div>
                                    <div className="text-sm text-slate-200">{step.instruction}</div>
                                    
                                    {step.codeHighlight && (
                                      <button
                                        onClick={() => handleStepFileClick(step)}
                                        className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                                      >
                                        → Open {step.codeHighlight.file}
                                      </button>
                                    )}
                                  </div>

                                  {/* Explanation */}
                                  <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                                    {step.explanation}
                                  </div>

                                  {/* Hint Toggle */}
                                  {step.hint && (
                                    <div>
                                      <button
                                        onClick={() => toggleHint(step.id)}
                                        className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                                      >
                                        <Lightbulb className="w-3 h-3" />
                                        {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                                      </button>
                                      
                                      <AnimatePresence>
                                        {isHintVisible && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded-md p-2"
                                          >
                                            <div className="text-sm text-amber-200">
                                              💡 {step.hint}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Status */}
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-sm">
                    {isSuccess ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-500 font-medium">🎉 Lesson Completed!</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-400">Follow the steps above to complete</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-2 pt-2">
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