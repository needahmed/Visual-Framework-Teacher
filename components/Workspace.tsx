'use client';

import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { GuidePanel } from './GuidePanel';
import { lessons, getFirstLesson } from '@/data/lessons';
import { useLessonStore } from '@/store/lessonStore';
import { motion } from 'framer-motion';
import { Menu, Book, Code2, Terminal as TerminalIcon } from 'lucide-react';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import dynamic from 'next/dynamic';

const FlowCanvas = dynamic(() => import('./visualizer/FlowCanvas').then(mod => mod.FlowCanvas), { 
  ssr: false,
  loading: () => <div className="h-full bg-slate-900 animate-pulse rounded-lg" />
});

const CodeEditor = dynamic(() => import('./editor/CodeEditor').then(mod => mod.CodeEditor), { 
  ssr: false,
  loading: () => <div className="h-full bg-slate-900 animate-pulse rounded-lg" />
});

const Terminal = dynamic(() => import('./Terminal').then(mod => mod.Terminal), { 
  ssr: false,
  loading: () => <div className="h-full bg-slate-900 animate-pulse rounded-lg" />
});

export const Workspace: React.FC = () => {
  const [guideOpen, setGuideOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { setLesson } = useLessonStore();

  useEffect(() => {
    setMounted(true);
    const firstLesson = getFirstLesson();
    if (firstLesson) {
      setLesson(firstLesson);
    }
  }, [setLesson]);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-slate-950 overflow-hidden items-center justify-center">
        <div className="text-slate-400 animate-pulse font-medium">Loading Workspace...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setGuideOpen(!guideOpen)}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Book className="w-5 h-5 text-violet-500" />
              NestQuest
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              Interactive NestJS Learning Platform
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <GuidePanel isOpen={guideOpen} />

          <div className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full flex flex-col p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-violet-500" />
                    <h2 className="text-sm font-medium text-slate-200">Architecture Visualizer</h2>
                  </div>
                  <div className="flex-1 bg-slate-900 rounded-lg border border-slate-700">
                    <FlowCanvas />
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="w-1 bg-slate-700 hover:bg-violet-500 transition-colors mx-2" />

              <Panel defaultSize={50} minSize={30}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={60} minSize={25}>
                    <div className="h-full flex flex-col p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Code2 className="w-4 h-4 text-blue-500" />
                        <h2 className="text-sm font-medium text-slate-200">Code Editor</h2>
                      </div>
                      <CodeEditor className="flex-1" />
                    </div>
                  </Panel>

                  <PanelResizeHandle className="h-1 bg-slate-700 hover:bg-violet-500 transition-colors my-2" />

                  <Panel defaultSize={40} minSize={20}>
                    <div className="h-full flex flex-col p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TerminalIcon className="w-4 h-4 text-green-500" />
                        <h2 className="text-sm font-medium text-slate-200">Terminal</h2>
                      </div>
                      <Terminal className="flex-1" />
                    </div>
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </div>
    </div>
  );
};