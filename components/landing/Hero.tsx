'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Cpu, Zap, Share2, Shield } from 'lucide-react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8"
        >
          <Zap className="w-4 h-4" />
          <span>The Future of NestJS Learning</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold text-white tracking-tight mb-8"
        >
          Architect <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Excellence.</span><br />
          Master NestJS.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Stop reading docs, start building systems. The first interactive visual workspace designed to teach you NestJS through real-time architectural mapping and live code generation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/learn">
            <button className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center gap-2">
              Start Learning
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl transition-all">
            See the Visualizer
          </button>
        </motion.div>

        {/* Visualizer Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-amber-500/30" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
              </div>
              <div className="mx-auto text-xs text-slate-500 font-mono tracking-widest uppercase">nestquest.arch</div>
            </div>
            <div className="aspect-[16/9] flex items-center justify-center bg-[#020617] p-8">
              <div className="flex gap-8">
                <div className="w-32 h-40 border-2 border-cyan-500/50 rounded-lg bg-cyan-500/5 flex flex-col items-center justify-center text-cyan-400 p-4">
                  <Share2 className="w-8 h-8 mb-4 opacity-50" />
                  <div className="w-full h-1 bg-cyan-500/20 rounded mb-2" />
                  <div className="w-2/3 h-1 bg-cyan-500/20 rounded" />
                </div>
                <div className="flex items-center">
                  <motion.div 
                    animate={{ x: [0, 40, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                  />
                </div>
                <div className="w-32 h-40 border-2 border-blue-500/50 rounded-lg bg-blue-500/5 flex flex-col items-center justify-center text-blue-400 p-4">
                  <Cpu className="w-8 h-8 mb-4 opacity-50" />
                  <div className="w-full h-1 bg-blue-500/20 rounded mb-2" />
                  <div className="w-2/3 h-1 bg-blue-500/20 rounded" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
