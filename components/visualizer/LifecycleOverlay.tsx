'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLessonStore, LIFECYCLE_STEPS } from '@/store/lessonStore';
import { Info, Activity, Database, ShieldCheck, ArrowRight } from 'lucide-react';

export const LifecycleOverlay: React.FC = () => {
  const { lifecycleActive, activeLifecycleStep, simulationResult } = useLessonStore();

  if (!lifecycleActive || activeLifecycleStep === -1) return null;

  const currentStep = LIFECYCLE_STEPS[activeLifecycleStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: 20, x: '-50%' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-[400px]"
      >
        <div className="bg-slate-900/90 backdrop-blur-md border border-violet-500/50 rounded-xl p-5 shadow-2xl shadow-violet-500/10">
          <div className="flex items-start gap-4">
            <div className="bg-violet-500/20 rounded-lg p-2 mt-1">
              {currentStep.nodeType === 'client' && <Activity className="w-5 h-5 text-violet-400" />}
              {currentStep.nodeType === 'lifecycle' && <ShieldCheck className="w-5 h-5 text-amber-400" />}
              {currentStep.nodeType === 'controller' && <ArrowRight className="w-5 h-5 text-blue-400" />}
              {currentStep.nodeType === 'service' && <Database className="w-5 h-5 text-emerald-400" />}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white font-bold text-lg leading-none">
                  {currentStep.name}
                </h3>
                <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                  {activeLifecycleStep + 1} / {LIFECYCLE_STEPS.length}
                </span>
              </div>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {currentStep.description}
              </p>

              {simulationResult && activeLifecycleStep >= 6 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mt-2"
                >
                  <div className="text-[10px] text-emerald-500 uppercase font-bold mb-1">Response Data Fetched</div>
                  <pre className="text-xs text-emerald-300 font-mono">
                    {JSON.stringify(simulationResult.data, null, 2)}
                  </pre>
                </motion.div>
              )}

              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
                <motion.div 
                  className="bg-violet-500 h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((activeLifecycleStep + 1) / LIFECYCLE_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
