import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Lesson, lessons } from '@/data/lessons';

export interface CodeFile {
  content: string;
  path: string;
}

export interface VisualNode {
  id: string;
  type: 'module' | 'controller' | 'service';
  position: { x: number; y: number };
  data: {
    label: string;
    files: string[];
  };
}

export interface VisualEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface LessonState {
  currentLesson: Lesson | null;
  codeFiles: Record<string, string>;
  visualNodes: VisualNode[];
  visualEdges: VisualEdge[];
  isRunning: boolean;
  serverStarted: boolean;
  isSuccess: boolean;
  currentFile: string;
  
  setLesson: (lesson: Lesson) => void;
  updateCode: (filePath: string, content: string) => void;
  addNode: (node: VisualNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<VisualNode>) => void;
  addEdge: (edge: VisualEdge) => void;
  removeEdge: (edgeId: string) => void;
  setIsRunning: (isRunning: boolean) => void;
  setServerStarted: (started: boolean) => void;
  setIsSuccess: (success: boolean) => void;
  setCurrentFile: (filePath: string) => void;
  onNodeDrop: (sourceNodeId: string, targetNodeId: string) => void;
  checkValidation: () => boolean;
  reset: () => void;
}

const initialState = {
  currentLesson: null,
  codeFiles: {},
  visualNodes: [],
  visualEdges: [],
  isRunning: false,
  serverStarted: false,
  isSuccess: false,
  currentFile: 'src/app.module.ts',
};

const parseModuleCode = (code: string): { imports: string[]; controllers: string[]; providers: string[] } => {
  const imports: string[] = [];
  const controllers: string[] = [];
  const providers: string[] = [];

  const importMatch = code.match(/@Module\(\s*\{[\s\S]*?imports:\s*\[([^\]]*)\]/);
  if (importMatch && importMatch[1]) {
    imports.push(...importMatch[1].split(',').map(i => i.trim()).filter(i => i));
  }

  const controllerMatch = code.match(/@Module\(\s*\{[\s\S]*?controllers:\s*\[([^\]]*)\]/);
  if (controllerMatch && controllerMatch[1]) {
    controllers.push(...controllerMatch[1].split(',').map(c => c.trim()).filter(c => c));
  }

  const providerMatch = code.match(/@Module\(\s*\{[\s\S]*?providers:\s*\[([^\]]*)\]/);
  if (providerMatch && providerMatch[1]) {
    providers.push(...providerMatch[1].split(',').map(p => p.trim()).filter(p => p));
  }

  return { imports, controllers, providers };
};

const updateModuleCode = (code: string, type: 'controllers' | 'providers', className: string, add: boolean = true): string => {
  const lines = code.split('\n');
  const moduleIndex = lines.findIndex(line => line.includes('@Module'));
  let targetIndex = -1;
  
  for (let i = moduleIndex; i < lines.length; i++) {
    if (lines[i].includes(`${type}:`)) {
      targetIndex = i + 1;
      break;
    }
  }

  if (targetIndex === -1) {
    return code;
  }

  if (add) {
    const targetLine = lines[targetIndex];
    if (targetLine.includes('[]')) {
      lines[targetIndex] = targetLine.replace('[]', `[${className}]`);
    } else if (targetLine.includes(']')) {
      lines[targetIndex] = targetLine.replace(']', `, ${className}]`);
    }
  } else {
    lines[targetIndex] = lines[targetIndex].replace(new RegExp(`\\s*${className},?`), '');
  }

  return lines.join('\n');
};

const updateControllerConstructor = (code: string, serviceName: string, add: boolean = true): string => {
  if (!code.includes(`export class`)) return code;

  const classMatch = code.match(/export class (\w+)/);
  if (!classMatch) return code;

  const className = classMatch[1];
  const constructorPattern = new RegExp(`constructor\\(private\\s+${serviceName}:\\s*${className}\\)\\s*\\{*\\}*`);
  
  if (add) {
    const lines = code.split('\n');
    const classIndex = lines.findIndex(line => line.includes(`export class ${className}`));
    
    if (classIndex !== -1) {
      let constructorIndex = -1;
      for (let i = classIndex + 1; i < lines.length; i++) {
        if (lines[i].includes('constructor(')) {
          constructorIndex = i;
          break;
        }
      }
      
      if (constructorIndex === -1) {
        const classEndIndex = lines.findIndex((line, i) => i > classIndex && line.includes('}'));
        if (classEndIndex !== -1) {
          lines.splice(classEndIndex, 0, `  constructor(private ${serviceName.toLowerCase()}: ${serviceName}) {}`);
        }
      }
    }
    
    if (code.includes(serviceName)) {
      return code;
    }
    
    const lastBraceIndex = code.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      const beforeBrace = code.slice(0, lastBraceIndex);
      const afterBrace = code.slice(lastBraceIndex);
      return `${beforeBrace.trim()}\n  constructor(private ${serviceName.toLowerCase()}: ${serviceName}) {}\n${afterBrace}`;
    }
  } else {
    return code.replace(constructorPattern, '').replace(/\s+constructor\s*\(\)\s*\{\s*\}\s*/, '');
  }
  
  return code;
};

export const useLessonStore = create<LessonState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setLesson: (lesson: Lesson) => {
          set({
            currentLesson: lesson,
            codeFiles: { ...lesson.initialCode },
            visualNodes: lesson.initialNodes || [],
            visualEdges: lesson.initialEdges || [],
            isSuccess: false,
            serverStarted: false,
            isRunning: false,
            currentFile: Object.keys(lesson.initialCode)[1] || 'src/app.module.ts',
          });
        },

        updateCode: (filePath: string, content: string) => {
          const { codeFiles } = get();
          const newCodeFiles = { ...codeFiles, [filePath]: content };
          set({ codeFiles: newCodeFiles });
          get().checkValidation();
        },

        addNode: (node: VisualNode) => {
          const { visualNodes } = get();
          if (!visualNodes.find(n => n.id === node.id)) {
            set({ visualNodes: [...visualNodes, node] });
          }
        },

        removeNode: (nodeId: string) => {
          const { visualNodes, visualEdges } = get();
          set({
            visualNodes: visualNodes.filter(n => n.id !== nodeId),
            visualEdges: visualEdges.filter(e => e.source !== nodeId && e.target !== nodeId),
          });
        },

        updateNode: (nodeId: string, updates: Partial<VisualNode>) => {
          const { visualNodes } = get();
          set({
            visualNodes: visualNodes.map(n => 
              n.id === nodeId ? { ...n, ...updates } : n
            ),
          });
        },

        addEdge: (edge: VisualEdge) => {
          const { visualEdges } = get();
          if (!visualEdges.find(e => e.id === edge.id)) {
            set({ visualEdges: [...visualEdges, edge] });
          }
        },

        removeEdge: (edgeId: string) => {
          const { visualEdges } = get();
          set({ visualEdges: visualEdges.filter(e => e.id !== edgeId) });
        },

        setIsRunning: (isRunning: boolean) => {
          set({ isRunning });
        },

        setServerStarted: (started: boolean) => {
          set({ serverStarted: started });
        },

        setIsSuccess: (success: boolean) => {
          set({ isSuccess: success });
        },

        setCurrentFile: (filePath: string) => {
          set({ currentFile: filePath });
        },

        onNodeDrop: (sourceNodeId: string, targetNodeId: string) => {
          const { visualNodes, codeFiles, currentLesson } = get();
          const sourceNode = visualNodes.find(n => n.id === sourceNodeId);
          const targetNode = visualNodes.find(n => n.id === targetNodeId);
          
          if (!sourceNode || !targetNode) return;

          const sourceType = sourceNode.type;
          const targetType = targetNode.type;

          if (sourceType === 'controller' && targetType === 'module') {
            const appModuleCode = codeFiles['src/app.module.ts'] || '';
            const updatedCode = updateModuleCode(appModuleCode, 'controllers', sourceNode.data.label);
            get().updateCode('src/app.module.ts', updatedCode);
            
            const newEdge: VisualEdge = {
              id: `edge-${Date.now()}`,
              source: sourceNodeId,
              target: targetNodeId,
              type: 'smoothstep',
            };
            get().addEdge(newEdge);
          } else if (sourceType === 'service' && targetType === 'controller') {
            const controllerCode = codeFiles[sourceNode.data.files[0]] || '';
            const serviceCode = codeFiles[targetNode.data.files[0]] || '';
            
            const updatedControllerCode = updateControllerConstructor(controllerCode, targetNode.data.label);
            get().updateCode(sourceNode.data.files[0], updatedControllerCode);
            
            const updatedServiceCode = updateControllerConstructor(controllerCode, targetNode.data.label, false);
            if (updatedServiceCode !== controllerCode) {
              get().updateCode(sourceNode.data.files[0], updatedServiceCode);
            }
            
            const appModuleCode = codeFiles['src/app.module.ts'] || '';
            const updatedModuleCode = updateModuleCode(appModuleCode, 'providers', targetNode.data.label);
            get().updateCode('src/app.module.ts', updatedModuleCode);
          }
        },

        checkValidation: () => {
          const { validationPatterns } = get().currentLesson || {};
          if (!validationPatterns) return false;

          const { codeFiles } = get();
          let allPassed = true;

          Object.entries(validationPatterns).forEach(([key, pattern]) => {
            if (key === 'terminal') {
              return;
            }
            
            const fileContent = codeFiles[key] || '';
            const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
            
            if (!regex.test(fileContent)) {
              allPassed = false;
            }
          });

          set({ isSuccess: allPassed });
          return allPassed;
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'nestquest-lesson-store',
      }
    )
  )
);