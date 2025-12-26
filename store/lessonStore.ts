import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Lesson, lessons } from '@/data/lessons';

export interface CodeFile {
  content: string;
  path: string;
}

export interface VisualNode {
  id: string;
  type: 'module' | 'controller' | 'service' | 'entity' | 'middleware' | 'guard' | 'pipe' | 'interceptor' | 'microservice';
  position: { x: number; y: number };
  data: {
    label: string;
    files: string[];
    isActive?: boolean;
    attributes?: string[]; // For entities
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
  
  // Request Lifecycle Simulation State
  lifecycleActive: boolean;
  activeLifecycleStep: number;
  simulationResult: any;
  simulationPath: string[]; // Node IDs to hit
  
  setLifecycleActive: (active: boolean) => void;
  setActiveLifecycleStep: (step: number) => void;
  triggerRequestSimulation: () => Promise<void>;
  
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
  createNodeFromDrop: (type: 'controller' | 'service' | 'entity' | 'middleware' | 'guard' | 'pipe' | 'interceptor' | 'microservice', position: { x: number; y: number }, name?: string) => void;
  syncEntityRelationships: () => void;
  syncMicroserviceConnections: () => void;
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
  lifecycleActive: false,
  activeLifecycleStep: -1,
  simulationResult: null,
  simulationPath: [],
};

export const LIFECYCLE_STEPS = [
  { id: 0, name: 'Client Request', description: 'Incoming HTTP GET Request for /cats', nodeType: 'client' },
  { id: 1, name: 'Middleware', description: 'Handling global and route-level middleware', nodeType: 'lifecycle' },
  { id: 2, name: 'Guards', description: 'Checking authentication and authorization', nodeType: 'lifecycle' },
  { id: 3, name: 'Interceptors', description: 'Pre-processing the request', nodeType: 'lifecycle' },
  { id: 4, name: 'Pipes', description: 'Validating and transforming input data', nodeType: 'lifecycle' },
  { id: 5, name: 'Controller', description: 'Routing to the specific @Get() handler', nodeType: 'controller' },
  { id: 6, name: 'Service', description: 'Executing business logic and fetching data', nodeType: 'service' },
  { id: 7, name: 'Interceptors', description: 'Post-processing the response', nodeType: 'lifecycle' },
  { id: 8, name: 'Client Response', description: 'Final response sent back to client', nodeType: 'client' },
];

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
          
          // Sync with WebContainer if it's booted
          import('@/lib/webcontainer').then(({ writeFile }) => {
            writeFile(filePath, content).catch(console.error);
          });

          get().syncEntityRelationships();
          get().syncMicroserviceConnections();
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

        setLifecycleActive: (active: boolean) => set({ lifecycleActive: active }),
        setActiveLifecycleStep: (step: number) => set({ activeLifecycleStep: step }),

        triggerRequestSimulation: async () => {
          const { serverStarted, isRunning } = get();
          if (!serverStarted || !isRunning) return;

          set({ 
            lifecycleActive: true, 
            activeLifecycleStep: 0,
            simulationResult: null 
          });

          // Simulate each step
          for (let i = 0; i < LIFECYCLE_STEPS.length; i++) {
            set({ activeLifecycleStep: i });
            // Small delay for each step
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (i === 6) { // Service step
               set({ simulationResult: { status: 200, data: [{ id: 1, name: 'Tom' }, { id: 2, name: 'Luna' }] } });
            }
          }

          // Keep active for a bit at the end then hide
          await new Promise(resolve => setTimeout(resolve, 2000));
          set({ lifecycleActive: false, activeLifecycleStep: -1 });
        },

        createNodeFromDrop: (type: 'controller' | 'service' | 'entity' | 'middleware' | 'guard' | 'pipe' | 'interceptor' | 'microservice', position: { x: number; y: number }, name: string = 'new') => {
          const { codeFiles, visualNodes } = get();
          const className = name.charAt(0).toUpperCase() + name.slice(1);
          const fileName = name.toLowerCase();
          
          let filePath = '';
          switch(type) {
            case 'entity': filePath = `src/entities/${fileName}.entity.ts`; break;
            case 'middleware': filePath = `src/common/middleware/${fileName}.middleware.ts`; break;
            case 'guard': filePath = `src/common/guards/${fileName}.guard.ts`; break;
            case 'pipe': filePath = `src/common/pipes/${fileName}.pipe.ts`; break;
            case 'interceptor': filePath = `src/common/interceptors/${fileName}.interceptor.ts`; break;
            case 'microservice': filePath = `src/${fileName}-service/main.ts`; break;
            default: filePath = `src/${fileName}/${fileName}.${type}.ts`;
          }
          
          if (visualNodes.find(n => n.id === `${fileName}-${type}`)) {
            return;
          }

          let newCode = '';
          if (type === 'controller') {
            newCode = `import { Controller, Get } from '@nestjs/common';

@Controller('${fileName}')
export class ${className}Controller {
  @Get()
  findAll() {
    return 'This action returns all ${fileName}';
  }
}`;
          } else if (type === 'service') {
            newCode = `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${className}Service {
  findAll() {
    return [];
  }
}`;
          } else if (type === 'entity') {
            newCode = `import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ${className} {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}`;
          } else if (type === 'middleware') {
            newCode = `import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ${className}Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('${className} Middleware triggered...');
    next();
  }
}`;
          } else if (type === 'guard') {
            newCode = `import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ${className}Guard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}`;
          } else if (type === 'pipe') {
            newCode = `import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ${className}Pipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}`;
          } else if (type === 'interceptor') {
            newCode = `import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ${className}Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    return next.handle().pipe(tap(() => console.log('After...')));
  }
}`;
          } else if (type === 'microservice') {
            newCode = `import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222'],
    },
  });
  await app.listen();
}
bootstrap();`;
          }

          // 1. Create the new file
          get().updateCode(filePath, newCode);

          // 2. Update AppModule (only for controllers/services)
          if (type === 'controller' || type === 'service') {
            const appModulePath = 'src/app.module.ts';
            let appModuleCode = codeFiles[appModulePath] || '';
            
            const importPath = `./${fileName}/${fileName}.${type}`;
            const importStatement = `import { ${className}${type.charAt(0).toUpperCase() + type.slice(1)} } from '${importPath}';\n`;
            
            if (!appModuleCode.includes(importPath)) {
              appModuleCode = importStatement + appModuleCode;
            }

            const arrayName = type === 'controller' ? 'controllers' : 'providers';
            const updatedModuleCode = updateModuleCode(appModuleCode, arrayName, `${className}${type.charAt(0).toUpperCase() + type.slice(1)}`);
            
            get().updateCode(appModulePath, updatedModuleCode);
          }

          // 3. Add visual node
          const newNode: VisualNode = {
            id: `${fileName}-${type}`,
            type: type,
            position,
            data: {
              label: type === 'entity' ? className : `${className}${type.charAt(0).toUpperCase() + type.slice(1)}`,
              files: [filePath]
            }
          };

          get().addNode(newNode);
          get().setCurrentFile(filePath);
        },

        syncEntityRelationships: () => {
          const { codeFiles, visualNodes, visualEdges } = get();
          const entities = visualNodes.filter(n => n.type === 'entity');
          const newEdges: VisualEdge[] = [...visualEdges.filter(e => e.type !== 'relationship')];

          entities.forEach(entity => {
            const content = codeFiles[entity.data.files[0]] || '';
            
            // Regex to find relationships
            // Example: @ManyToOne(() => Owner, (owner) => owner.cats)
            const relRegex = /@(OneToMany|ManyToOne|OneToOne|ManyToMany)\(\s*\(\)\s*=>\s*(\w+)/g;
            let match;

            while ((match = relRegex.exec(content)) !== null) {
              const [_, type, targetClassName] = match;
              const targetEntity = entities.find(e => e.data.label === targetClassName);

              if (targetEntity) {
                const edgeId = `rel-${entity.id}-${targetEntity.id}`;
                if (!newEdges.find(e => e.id === edgeId)) {
                  let label = '';
                  switch(type) {
                    case 'OneToMany': label = '1:N'; break;
                    case 'ManyToOne': label = 'N:1'; break;
                    case 'OneToOne': label = '1:1'; break;
                    case 'ManyToMany': label = 'N:M'; break;
                  }

                  newEdges.push({
                    id: edgeId,
                    source: entity.id,
                    target: targetEntity.id,
                    type: 'relationship',
                    label
                  } as any);
                }
              }
            }
          });

          if (JSON.stringify(newEdges) !== JSON.stringify(visualEdges)) {
            set({ visualEdges: newEdges });
          }
        },

        syncMicroserviceConnections: () => {
          const { codeFiles, visualNodes, visualEdges } = get();
          const apps = visualNodes.filter(n => n.type === 'module');
          const services = visualNodes.filter(n => n.type === 'microservice');
          const newEdges: VisualEdge[] = [...visualEdges.filter(e => e.type !== 'transporter')];

          // Check for @MessagePattern in services and ClientProxy in apps
          services.forEach(service => {
            const serviceContent = Object.values(codeFiles).join('\n');
            const patternRegex = /@MessagePattern\(\s*['"](.+?)['"]\s*\)/g;
            let match;

            while ((match = patternRegex.exec(serviceContent)) !== null) {
              const pattern = match[1];
              
              // Find apps that send this pattern
              apps.forEach(app => {
                const appContent = Object.values(codeFiles).join('\n');
                if (appContent.includes(`.send('${pattern}'`) || appContent.includes(`.emit('${pattern}'`)) {
                  const edgeId = `trans-${app.id}-${service.id}`;
                  if (!newEdges.find(e => e.id === edgeId)) {
                    newEdges.push({
                      id: edgeId,
                      source: app.id,
                      target: service.id,
                      type: 'transporter',
                      label: 'NATS',
                      animated: true,
                    } as any);
                  }
                }
              });
            }
          });

          if (JSON.stringify(newEdges) !== JSON.stringify(visualEdges)) {
            set({ visualEdges: newEdges });
          }
        },

      }),


      {
        name: 'nestquest-lesson-store',
      }
    )
  )
);