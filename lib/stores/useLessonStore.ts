'use client';

import { create } from 'zustand';
import { lessons, type Lesson, type LessonSuccessCondition, type LessonVisualState, type VisualNodeStatus } from '@/lib/lessons.data';

function evaluateSuccessCondition(
  successCondition: LessonSuccessCondition,
  input: { code: string; terminalOutput: string },
): boolean {
  if (successCondition instanceof RegExp) return successCondition.test(input.code);
  return successCondition(input);
}

function withVisualStatus(
  visualState: LessonVisualState,
  status: VisualNodeStatus,
): LessonVisualState {
  return {
    ...visualState,
    nodes: visualState.nodes.map((n) => ({ ...n, status })),
    edges: visualState.edges.map((e) => ({ ...e, status })),
  };
}

export interface LessonStoreState {
  lessons: Lesson[];
  activeLessonIndex: number;
  code: string;
  terminalOutput: string;
  visualState: LessonVisualState;
  isStepValid: boolean;

  setCode: (code: string) => void;
  setTerminalOutput: (output: string) => void;
  appendTerminalOutput: (chunk: string) => void;

  setActiveLessonIndex: (index: number) => void;
  nextLesson: () => void;
  previousLesson: () => void;

  validateStep: () => boolean;
  resetLesson: () => void;
}

export const useLessonStore = create<LessonStoreState>((set, get) => ({
  lessons,
  activeLessonIndex: 0,
  code: lessons[0]?.initialCode ?? '',
  terminalOutput: '',
  visualState: lessons[0]?.visualState ?? { nodes: [], edges: [] },
  isStepValid: false,

  setCode: (code) => {
    set({ code });
    get().validateStep();
  },

  setTerminalOutput: (output) => {
    set({ terminalOutput: output });
    get().validateStep();
  },

  appendTerminalOutput: (chunk) => {
    set((state) => ({ terminalOutput: state.terminalOutput + chunk }));
    get().validateStep();
  },

  setActiveLessonIndex: (index) => {
    const nextIndex = Math.max(0, Math.min(index, get().lessons.length - 1));
    const lesson = get().lessons[nextIndex];

    set({
      activeLessonIndex: nextIndex,
      code: lesson.initialCode,
      terminalOutput: '',
      visualState: lesson.visualState,
      isStepValid: false,
    });
  },

  nextLesson: () => {
    get().setActiveLessonIndex(get().activeLessonIndex + 1);
  },

  previousLesson: () => {
    get().setActiveLessonIndex(get().activeLessonIndex - 1);
  },

  validateStep: () => {
    const { lessons, activeLessonIndex, code, terminalOutput, isStepValid } =
      get();

    const lesson = lessons[activeLessonIndex];
    if (!lesson) return false;

    const nextValid = evaluateSuccessCondition(lesson.successCondition, {
      code,
      terminalOutput,
    });

    if (nextValid === isStepValid) return nextValid;

    set({
      isStepValid: nextValid,
      visualState: nextValid
        ? withVisualStatus(lesson.visualState, 'success')
        : lesson.visualState,
    });

    return nextValid;
  },

  resetLesson: () => {
    const lesson = get().lessons[get().activeLessonIndex];

    set({
      code: lesson?.initialCode ?? '',
      terminalOutput: '',
      visualState: lesson?.visualState ?? { nodes: [], edges: [] },
      isStepValid: false,
    });
  },
}));
