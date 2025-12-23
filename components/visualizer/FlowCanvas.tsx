'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
} from 'react-flow-renderer';
import { ModuleNode, ControllerNode, ServiceNode, DroppedNode } from './CustomNodes';
import { useLessonStore } from '@/store/lessonStore';
import { motion, AnimatePresence } from 'framer-motion';

const nodeTypes = {
  module: ModuleNode,
  controller: ControllerNode,
  service: ServiceNode,
  dropped: DroppedNode,
};

const FlowCanvasContent: React.FC = () => {
  const { visualNodes, visualEdges, onNodeDrop, currentLesson } = useLessonStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(visualNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(visualEdges);
  const { project } = useReactFlow();
  const [draggedNode, setDraggedNode] = useState<Node | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  useEffect(() => {
    setNodes(visualNodes);
  }, [visualNodes, setNodes]);

  useEffect(() => {
    setEdges(visualEdges);
  }, [visualEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const newEdge = {
          ...params,
          id: `edge-${params.source}-${params.target}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
        };
        
        setEdges((eds) => addEdge(newEdge, eds));
        onNodeDrop(params.source, params.target);
      }
    },
    [setEdges, onNodeDrop]
  );

  const onNodeDrag = useCallback(
    (event: any, node: Node) => {
      setDraggedNode(node);
      
      const elements = document.elementsFromPoint(event.clientX, event.clientY);
      const targetEl = elements.find((el) =>
        el.classList.contains('react-flow__node-module')
      );

      if (targetEl) {
        const targetId = targetEl.getAttribute('data-id');
        setDropTarget(targetId);
      } else {
        setDropTarget(null);
      }
    },
    []
  );

  const onNodeDragStop = useCallback(
    (event: any, node: Node) => {
      const elements = document.elementsFromPoint(event.clientX, event.clientY);
      const targetEl = elements.find((el) =>
        el.classList.contains('react-flow__node-module')
      );

      if (targetEl) {
        const targetId = targetEl.getAttribute('data-id');
        if (targetId && targetId !== node.id) {
          onNodeDrop(node.id, targetId);
          
          const newEdge: Edge = {
            id: `edge-${node.id}-${targetId}`,
            source: node.id,
            target: targetId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
          };
          setEdges((eds) => [...eds, newEdge]);
        }
      }

      setDropTarget(null);
    },
    [onNodeDrop, setEdges]
  );

  const onNodeClick = useCallback(
    (event: any, node: Node) => {
      console.log('Node clicked:', node);
      if (node.type === 'controller') {
        useLessonStore.getState().setCurrentFile(node.data.files[0]);
      }
    },
    []
  );

  const connectionLineStyle = {
    stroke: '#8b5cf6',
    strokeWidth: 2,
    strokeDasharray: '5,5',
  };

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          className: `${node.id === dropTarget ? 'ring-2 ring-violet-400 ring-opacity-50' : ''} ${
            node.type === 'module' ? 'react-flow__node-module' : ''
          }`,
          data: {
            ...node.data,
            onClick: () => onNodeClick(null as any, node),
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
        }}
        minZoom={0.5}
        maxZoom={2}
        fitView
      >
        <Background
          color="#374151"
          gap={16}
          className="bg-slate-900"
        />
        <Controls
          className="bg-slate-800 border border-slate-600"
          showInteractive={false}
        />
      </ReactFlow>
      
      <AnimatePresence>
        {dropTarget && (
          <motion.div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-violet-500 bg-opacity-20 border-2 border-dashed border-violet-500 rounded-lg p-4">
              <div className="text-violet-400 font-medium">Drop here to connect</div>
              <div className="text-violet-300 text-sm mt-1">Drop the component into the module</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute top-4 left-4 bg-slate-800 border border-slate-600 rounded-lg p-3">
        <div className="text-slate-200 text-sm font-medium mb-2">Legend</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-violet-500 rounded"></div>
            <span className="text-slate-300">Module</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-slate-300">Controller</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-violet-600 rounded"></div>
            <span className="text-slate-300">Service</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-600">
          <div className="text-slate-400 text-xs">
            {currentLesson ? `Lesson ${currentLesson.id}: ${currentLesson.title}` : 'Select a lesson'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FlowCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowCanvasContent />
    </ReactFlowProvider>
  );
};