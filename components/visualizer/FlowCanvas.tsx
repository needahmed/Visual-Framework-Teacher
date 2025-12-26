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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ModuleNode, ControllerNode, ServiceNode, DroppedNode, LifecycleNode, EntityNode, MiddlewareNode, GuardNode, PipeNode, InterceptorNode, MicroserviceNode } from './CustomNodes';
import { useLessonStore, LIFECYCLE_STEPS } from '@/store/lessonStore';
import { motion, AnimatePresence } from 'framer-motion';
import { LifecycleOverlay } from './LifecycleOverlay';
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { NodeSidebar } from './NodeSidebar';
import { NodeNamingModal } from './NodeNamingModal';

const nodeTypes = {
  module: ModuleNode,
  controller: ControllerNode,
  service: ServiceNode,
  entity: EntityNode,
  middleware: MiddlewareNode,
  guard: GuardNode,
  pipe: PipeNode,
  interceptor: InterceptorNode,
  microservice: MicroserviceNode,
  dropped: DroppedNode,
  lifecycle: LifecycleNode,
};


const RequestPacket: React.FC<{ activeStep: number; nodes: Node[] }> = ({ activeStep, nodes }) => {
  const currentStep = LIFECYCLE_STEPS[activeStep];
  if (!currentStep) return null;

  // Find the target node for the packet
  let targetNodeId = '';
  if (currentStep.nodeType === 'controller') {
    targetNodeId = 'cats-controller';
  } else if (currentStep.nodeType === 'service') {
    targetNodeId = 'cats-service';
  } else {
    targetNodeId = `lifecycle-${currentStep.id}`;
  }

  const targetNode = nodes.find(n => n.id === targetNodeId);
  if (!targetNode) return null;

  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      initial={false}
      animate={{
        x: targetNode.position.x + 60,
        y: targetNode.position.y + 30,
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="w-5 h-5 bg-amber-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)] flex items-center justify-center">
        <motion.div 
          className="w-8 h-8 bg-amber-400/30 rounded-full absolute"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <Zap className="w-3 h-3 text-slate-900 fill-current" />
      </div>
    </motion.div>
  );
};

const FlowCanvasContent: React.FC = () => {
  const { 
    visualNodes, 
    visualEdges, 
    onNodeDrop, 
    currentLesson,
    lifecycleActive,
    activeLifecycleStep,
    createNodeFromDrop
  } = useLessonStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(visualNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(visualEdges);
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  const [draggedNode, setDraggedNode] = useState<Node | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [namingModal, setNamingModal] = useState<{ isOpen: boolean; type: string; position: { x: number; y: number } }>({
    isOpen: false,
    type: '',
    position: { x: 0, y: 0 }
  });

  useEffect(() => {
    let activeNodes = [...visualNodes];

    if (lifecycleActive) {
      const lifecycleNodes: Node[] = LIFECYCLE_STEPS
        .filter(step => step.nodeType === 'lifecycle' || step.nodeType === 'client')
        .map((step, index) => {
          let x = 100;
          let y = 100 + (index * 120);

          if (step.id >= 7) { 
             x = 700;
             y = 100 + ((8 - index) * 120);
          }

          return {
            id: `lifecycle-${step.id}`,
            type: 'lifecycle',
            position: { x, y },
            data: { 
              label: step.name, 
              isActive: activeLifecycleStep === step.id 
            },
            draggable: false,
          };
        });
      
      activeNodes = [...activeNodes, ...lifecycleNodes];
    }

    setNodes(activeNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isActive: node.id.startsWith('lifecycle-') 
          ? activeLifecycleStep === parseInt(node.id.split('-')[1])
          : (node.id === 'cats-controller' && activeLifecycleStep === 5) || 
            (node.id === 'cats-service' && activeLifecycleStep === 6)
      }
    })));
  }, [visualNodes, setNodes, lifecycleActive, activeLifecycleStep]);

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
      if (node.type === 'controller') {
        useLessonStore.getState().setCurrentFile(node.data.files[0]);
      }
    },
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as any;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      setNamingModal({
        isOpen: true,
        type,
        position
      });
    },
    [project]
  );

  const handleNamingConfirm = (name: string) => {
    createNodeFromDrop(namingModal.type as any, namingModal.position, name);
    setNamingModal({ ...namingModal, isOpen: false });
  };

  const connectionLineStyle = {
    stroke: '#8b5cf6',
    strokeWidth: 2,
    strokeDasharray: '5,5',
  };

  return (
    <div className="w-full h-full flex overflow-hidden relative">
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full max-h-screen border-r border-slate-700 overflow-hidden flex flex-col"
          >
            <NodeSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-[100] bg-slate-800 border border-slate-700 p-1 rounded-r-md text-slate-400 hover:text-white hover:bg-slate-700 transition-all ${sidebarOpen ? 'translate-x-[0]' : 'translate-x-0 shadow-lg shadow-black/50'}`}
          title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

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
          onDragOver={onDragOver}
          onDrop={onDrop}
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
          <Background color="#374151" gap={16} className="bg-slate-900" />
          <Controls className="bg-slate-800 border border-slate-600" showInteractive={false} />
          
          {lifecycleActive && (
            <RequestPacket activeStep={activeLifecycleStep} nodes={nodes} />
          )}
        </ReactFlow>

        <LifecycleOverlay />

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
              <div className="w-3 h-3 bg-violet-500 rounded" />
              <span className="text-slate-300">Module</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-slate-300">Controller</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-violet-600 rounded" />
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
      
      <NodeNamingModal
        isOpen={namingModal.isOpen}
        type={namingModal.type}
        onClose={() => setNamingModal({ ...namingModal, isOpen: false })}
        onConfirm={handleNamingConfirm}
      />
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