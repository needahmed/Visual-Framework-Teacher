'use client';

import React from 'react';
import { Share2, Zap, LayoutGrid, Database, Shield, Filter, RefreshCw, Settings, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export const NodeSidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const nodeTemplates = [
    {
      type: 'controller',
      label: 'Controller',
      icon: <Share2 className="w-4 h-4 text-blue-400" />,
      color: 'blue',
      description: 'Handles incoming HTTP requests.'
    },
    {
      type: 'service',
      label: 'Service',
      icon: <Zap className="w-4 h-4 text-violet-400" />,
      color: 'violet',
      description: 'Contains business logic and data access.'
    },
    {
      type: 'entity',
      label: 'Entity',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      color: 'emerald',
      description: 'Represents a database table/schema.'
    },
    {
      type: 'middleware',
      label: 'Middleware',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      color: 'slate',
      description: 'Functions that run before the route handler.'
    },
    {
      type: 'guard',
      label: 'Guard',
      icon: <Shield className="w-4 h-4 text-amber-400" />,
      color: 'amber',
      description: 'Determines if a request should be handled.'
    },
    {
      type: 'pipe',
      label: 'Pipe',
      icon: <Filter className="w-4 h-4 text-cyan-400" />,
      color: 'cyan',
      description: 'Transforms or validates input data.'
    },
    {
      type: 'interceptor',
      label: 'Interceptor',
      icon: <RefreshCw className="w-4 h-4 text-rose-400" />,
      color: 'rose',
      description: 'Binds extra logic before/after method execution.'
    },
    {
      type: 'microservice',
      label: 'Microservice',
      icon: <Server className="w-4 h-4 text-indigo-400" />,
      color: 'indigo',
      description: 'A distributed service that communicates via messages.'
    }
  ];


  return (
    <div className="w-48 h-full bg-slate-800/50 flex flex-col overflow-hidden border-r border-slate-700">
      <div className="flex flex-col h-full max-h-screen">
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center gap-2 mb-6 px-1">
            <LayoutGrid className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Components</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 custom-scrollbar">
          {nodeTemplates.map((node) => (
            <div
              key={node.type}
              className={`group relative bg-slate-900 border border-slate-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-${node.color}-500/50 transition-all duration-200 flex-shrink-0`}
              onDragStart={(event) => onDragStart(event, node.type)}
              draggable
            >
              <div className={`absolute inset-0 bg-${node.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg`} />
              
              <div className="flex items-center gap-3 mb-1.5 relative z-10">
                <div className={`p-1.5 rounded-md bg-slate-800 border border-slate-700 group-hover:border-${node.color}-500/30 transition-colors`}>
                  {node.icon}
                </div>
                <span className="text-sm font-semibold text-slate-200">{node.label}</span>
              </div>
              
              <p className="text-[10px] text-slate-500 leading-tight relative z-10">
                {node.description}
              </p>

              <div className={`absolute right-2 bottom-2 w-1.5 h-1.5 rounded-full bg-${node.color}-500 opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100`} />
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-700/50 flex-shrink-0">
          <p className="text-[10px] text-slate-500 italic">
            Tip: Drag a component onto the canvas to generate code!
          </p>
        </div>
      </div>
    </div>
  );
};
