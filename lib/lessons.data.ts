export type VisualNodeKind = "module" | "controller" | "service";

export type VisualNodeStatus = "default" | "error" | "success";

export interface VisualNode {
  id: string;
  kind: VisualNodeKind;
  label: string;
  position: { x: number; y: number };
  parentId?: string;
  status?: VisualNodeStatus;
}

export interface VisualEdge {
  id: string;
  source: string;
  target: string;
  status?: VisualNodeStatus;
}

export interface LessonVisualState {
  nodes: VisualNode[];
  edges: VisualEdge[];
  viewport?: { x: number; y: number; zoom: number };
}

export type LessonSuccessCondition =
  | RegExp
  | ((input: { code: string; terminalOutput: string }) => boolean);

export interface Lesson {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  visualState: LessonVisualState;
  task: string;
  successCondition: LessonSuccessCondition;
}

export const lessons: Lesson[] = [
  {
    id: "basics-1-root-module",
    title: "Lesson 1: The Root Module",
    description: String.raw`
Every NestJS application starts with a **Root Module**. 

This module is the top-level container that wires everything together.

**Your job:** Hit **Run** and confirm the app boots successfully.
`,
    initialCode: String.raw`// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();

// src/app.module.ts
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
`,
    visualState: {
      nodes: [
        {
          id: "app-module",
          kind: "module",
          label: "AppModule",
          position: { x: 0, y: 0 },
          status: "default",
        },
      ],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    task: "Run the app and confirm the Nest server starts.",
    successCondition: ({ terminalOutput }) =>
      terminalOutput.includes("Nest application successfully started"),
  },
  {
    id: "basics-2-controller",
    title: "Lesson 2: The Controller",
    description: String.raw`
Controllers handle incoming HTTP requests and return responses.

A controller **must** be registered in a module's 
\`controllers: []\` array to be activated.

**Your job:** Register \`CatsController\` inside \`AppModule\`.
`,
    initialCode: String.raw`// src/app.module.ts
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}

// src/cats/cats.controller.ts
import { Controller } from '@nestjs/common';

@Controller('cats')
export class CatsController {}
`,
    visualState: {
      nodes: [
        {
          id: "app-module",
          kind: "module",
          label: "AppModule",
          position: { x: 0, y: 0 },
          status: "default",
        },
        {
          id: "cats-controller",
          kind: "controller",
          label: "CatsController",
          position: { x: 320, y: 40 },
          status: "error",
        },
      ],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    task: "Register the CatsController in AppModule (controllers: [CatsController]).",
    successCondition: /controllers\s*:\s*\[\s*CatsController\s*\]/m,
  },
  {
    id: "basics-3-route",
    title: "Lesson 3: The Route (GET)",
    description: String.raw`
Routes are defined by combining controller prefixes (\`@Controller()\`) with method decorators like \`@Get()\`.

**Your job:** Add a \`GET /cats\` endpoint that returns a string.
`,
    initialCode: String.raw`// src/app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [],
})
export class AppModule {}

// src/cats/cats.controller.ts
import { Controller } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  // TODO: add @Get() route here
}
`,
    visualState: {
      nodes: [
        {
          id: "app-module",
          kind: "module",
          label: "AppModule",
          position: { x: 0, y: 0 },
          status: "success",
        },
        {
          id: "cats-controller",
          kind: "controller",
          label: "CatsController",
          position: { x: 320, y: 40 },
          parentId: "app-module",
          status: "default",
        },
      ],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1.1 },
    },
    task: "Create GET /cats that returns 'This action returns all cats'.",
    successCondition: ({ code, terminalOutput }) => {
      const codeLooksRight =
        /@Controller\(\s*['"`]cats['"`]\s*\)[\s\S]*@Get\(\s*\)[\s\S]*findAll\s*\(\s*\)\s*:\s*string\s*\{[\s\S]*return\s+['"`]This action returns all cats['"`]/m.test(
          code,
        );

      const runtimeLooksRight = terminalOutput.includes(
        "This action returns all cats",
      );

      return codeLooksRight || runtimeLooksRight;
    },
  },
  {
    id: "basics-4-provider",
    title: "Lesson 4: The Provider (Service)",
    description: String.raw`
Providers (usually Services) contain business logic.

To participate in Nest's Dependency Injection system, a class should be decorated with \`@Injectable()\`.

**Your job:** Make \`CatsService\` injectable.
`,
    initialCode: String.raw`// src/cats/cats.service.ts
import { Injectable } from '@nestjs/common';

export class CatsService {
  findAll(): string {
    return 'This action returns all cats';
  }
}
`,
    visualState: {
      nodes: [
        {
          id: "cats-service",
          kind: "service",
          label: "CatsService",
          position: { x: 320, y: 160 },
          status: "error",
        },
      ],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1.2 },
    },
    task: "Add @Injectable() above export class CatsService.",
    successCondition: /@Injectable\(\s*\)\s*[\r\n]+\s*export\s+class\s+CatsService/m,
  },
  {
    id: "basics-5-di",
    title: "Lesson 5: Dependency Injection",
    description: String.raw`
NestJS uses **Dependency Injection** to wire classes together.

Instead of \`new CatsService()\`, we ask for it in the controller constructor.

**Your job:**
- Add \`CatsService\` to the module's \`providers\` array
- Inject it into \`CatsController\`
- Call \`this.catsService.findAll()\` inside the GET route
`,
    initialCode: String.raw`// src/app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [],
})
export class AppModule {}

// src/cats/cats.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  findAll(): string {
    return 'This action returns all cats';
  }
}

// src/cats/cats.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
`,
    visualState: {
      nodes: [
        {
          id: "cats-controller",
          kind: "controller",
          label: "CatsController",
          position: { x: 320, y: 40 },
          status: "default",
        },
        {
          id: "cats-service",
          kind: "service",
          label: "CatsService",
          position: { x: 320, y: 180 },
          status: "error",
        },
      ],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    task: "Inject CatsService into CatsController and register it as a provider.",
    successCondition: ({ code, terminalOutput }) => {
      const providersOk =
        /providers\s*:\s*\[\s*CatsService\s*\]/m.test(code) ||
        /providers\s*:\s*\[[^\]]*\bCatsService\b[^\]]*\]/m.test(code);

      const constructorOk =
        /constructor\s*\(\s*private\s+catsService\s*:\s*CatsService\s*\)/m.test(
          code,
        );

      const routeUsesService =
        /this\.catsService\.findAll\s*\(\s*\)/m.test(code) ||
        terminalOutput.includes("This action returns all cats");

      return providersOk && constructorOk && routeUsesService;
    },
  },
];
