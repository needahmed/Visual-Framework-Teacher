'use client';

import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-[#020617] border-t border-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-slate-950">NQ</div>
            <span className="text-white font-bold text-xl tracking-tight">NestQuest</span>
          </div>
          
          <div className="flex gap-8 text-slate-500 text-sm">
            <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Interactive Demo</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Lessons</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-900 text-center text-slate-600 text-xs">
          © 2025 NestQuest. All rights reserved. Master the architecture of the modern web.
        </div>
      </div>
    </footer>
  );
};
