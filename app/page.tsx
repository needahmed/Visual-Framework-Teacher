'use client';

import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Footer } from '@/components/landing/Footer';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="bg-[#020617] min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation Shorthand (Optional, can be expanded) */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-[#020617]/50 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-slate-950">NQ</div>
          <span className="text-white font-bold text-xl tracking-tight">NestQuest</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="/learn" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-700">Start Learning</a>
        </div>
      </nav>

      {/* Landing Content */}
      <Hero />
      <div id="features">
        <Features />
      </div>
      
      {/* Additional high-impact section */}
      <section id="about" className="py-24 bg-[#020617] relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-12 text-center border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Stop Reading. Start Architecting.</h2>
            <p className="text-slate-400 mb-10 text-lg relative z-10 max-w-2xl mx-auto">Join thousands of developers leveling up their NestJS skills through visual intuition and hands-on practice.</p>
            <a href="/learn" className="relative z-10 inline-block px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95">
              Launch NestQuest Workspace
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
