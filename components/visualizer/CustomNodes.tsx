'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Share2, Zap, Play, Database, Shield, Filter, RefreshCw, Settings, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export const ModuleNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <motion.div
      className={`relative ${selected ? 'ring-2 ring-violet-500' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative bg-slate-800 border-2 border-violet-500 rounded-lg p-4 min-w-32">
        <div className="absolute -top-2 -left-2 bg-violet-500 rounded-full p-1">
          <Box className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">{data.label}</span>
        </div>
        <Handle type="target" position={Position.Top} className="!bg-violet-500 !w-2 !h-2" />
        <Handle type="source" position={Position.Bottom} className="!bg-violet-500 !w-2 !h-2" />
      </div>
    </motion.div>
  );
};

export const ControllerNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <motion.div
      className={`relative ${selected ? 'ring-2 ring-violet-500' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative bg-slate-800 border-2 border-blue-500 rounded-lg p-4 min-w-32">
        <div className="absolute -top-2 -left-2 bg-blue-500 rounded-full p-1">
          <Share2 className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">{data.label}</span>
        </div>
        <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-2 !h-2" />
        <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-2 !h-2" />
      </div>
    </motion.div>
  );
};

export const ServiceNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <motion.div
      className={`relative ${selected ? 'ring-2 ring-violet-500' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative bg-slate-800 border-2 border-violet-600 rounded-lg p-4 min-w-32">
        <div className="absolute -top-2 -right-2 bg-violet-600 rounded-full p-1">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">{data.label}</span>
        </div>
        <Handle type="target" position={Position.Top} className="!bg-violet-600 !w-2 !h-2" />
        <Handle type="source" position={Position.Bottom} className="!bg-violet-600 !w-2 !h-2" />
      </div>
    </motion.div>
  );
};

export const DroppedNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="bg-slate-700 border-2 border-dashed border-violet-400 rounded-lg p-3 min-w-24">
        <div className="flex items-center justify-center gap-1">
          <Play className="w-3 h-3 text-violet-400" />
          <span className="text-violet-400 text-xs font-medium">{data.label}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const LifecycleNode: React.FC<NodeProps> = ({ data, selected }) => {
  const { isActive } = data;
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`relative ${selected ? 'ring-2 ring-violet-500' : ''}`}
    >
      <div className={`relative bg-slate-800 border-2 ${isActive ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-slate-600'} rounded-lg p-3 min-w-28 transition-colors duration-300`}>
        <div className={`absolute -top-2 -left-2 ${isActive ? 'bg-amber-400' : 'bg-slate-600'} rounded-full p-1 transition-colors duration-300`}>
          <Play className="w-3 h-3 text-slate-900" />
        </div>
        <div className="flex flex-col items-center">
          <span className={`font-semibold text-xs ${isActive ? 'text-amber-400' : 'text-slate-400'} transition-colors duration-300`}>
            {data.label}
          </span>
        </div>
        <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-1.5 !h-1.5" />
        <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-1.5 !h-1.5" />
      </div>
    </motion.div>
  );
};

export const EntityNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <motion.div
      className={`relative ${selected ? 'ring-2 ring-emerald-500' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative bg-teal-950 border-2 border-emerald-500 rounded-lg p-4 min-w-32">
        <div className="absolute -top-2 -left-2 bg-emerald-500 rounded-full p-1">
          <Database className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white font-semibold text-sm">{data.label}</span>
          {data.attributes && data.attributes.map((attr: string, i: number) => (
            <span key={i} className="text-[10px] text-emerald-400/70 py-0.5 border-t border-emerald-500/20">
              {attr}
            </span>
          ))}
        </div>
        
        {/* Handles for relationships on multiple sides for cleaner wiring */}
        <Handle type="target" position={Position.Top} className="!bg-emerald-500 !w-2 !h-2" />
        <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-2 !h-2" />
        <Handle type="target" position={Position.Left} className="!bg-emerald-500 !w-2 !h-2" />
        <Handle type="source" position={Position.Right} className="!bg-emerald-500 !w-2 !h-2" />
      </div>
    </motion.div>
  );
};

export const GuardNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <motion.div
      className={`relative ${selected ? 'ring-2 ring-amber-500' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="relative bg-amber-950 border-2 border-amber-500 rounded-lg p-4 min-w-32">
        <div className="absolute -top-2 -left-2 bg-amber-500 rounded-full p-1">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-semibold text-sm">{data.label}</span>
        <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-2 !h-2" />
        <Handle type="source" position={Position.Bottom} className="!bg-amber-500 !w-2 !h-2" />
      </div>
    </motion.div>
  );
};

export const PipeNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <motion.div
      className={`relative ${selected ? 'ring-2 ring-cyan-500' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="relative bg-cyan-950 border-2 border-cyan-500 rounded-lg p-4 min-w-32">
        <div className="absolute -top-2 -left-2 bg-cyan-500 rounded-full p-1">
          <Filter className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-semibold text-sm">{data.label}</span>
        <Handle type="target" position={Position.Top} className="!bg-cyan-500 !w-2 !h-2" />
        <Handle type="source" position={Position.Bottom} className="!bg-cyan-500 !w-2 !h-2" />
      </div>
    </motion.div>
  );
};

export const InterceptorNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <motion.div
      className={`relative ${selected ? 'ring-2 ring-rose-500' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="relative bg-rose-950 border-2 border-rose-500 rounded-lg p-4 min-w-32">
        <div className="absolute -top-2 -left-2 bg-rose-500 rounded-full p-1">
          <RefreshCw className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-semibold text-sm">{data.label}</span>
        <Handle type="target" position={Position.Top} className="!bg-rose-500 !w-2 !h-2" />
        <Handle type="source" position={Position.Bottom} className="!bg-rose-500 !w-2 !h-2" />
      </div>
    </motion.div>
  );
};

export const MiddlewareNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <motion.div
      className={`relative ${selected ? 'ring-2 ring-slate-400' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="relative bg-slate-800 border-2 border-slate-400 rounded-lg p-4 min-w-32">
        <div className="absolute -top-2 -left-2 bg-slate-400 rounded-full p-1">
          <Settings className="w-4 h-4 text-slate-900" />
        </div>
        <span className="text-white font-semibold text-sm">{data.label}</span>
        <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-2 !h-2" />
        <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-2 !h-2" />
      </div>
    </motion.div>
  );
};

export const MicroserviceNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <motion.div
      className={`relative ${selected ? 'ring-2 ring-indigo-500' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="relative bg-indigo-950 border-2 border-indigo-500 rounded-lg p-4 min-w-32">
        <div className="absolute -top-2 -left-2 bg-indigo-500 rounded-full p-1 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
          <Server className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white font-semibold text-sm">{data.label}</span>
          <span className="text-[10px] text-indigo-400 opacity-70">Microservice</span>
        </div>
        <Handle type="target" position={Position.Left} className="!bg-indigo-500 !w-2 !h-2" />
        <Handle type="source" position={Position.Right} className="!bg-indigo-500 !w-2 !h-2" />
      </div>
    </motion.div>
  );
};