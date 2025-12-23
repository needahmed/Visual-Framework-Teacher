'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { Box, Share2, Zap, Play } from 'lucide-react';
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