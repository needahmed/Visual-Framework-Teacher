export interface Lesson {
  id: number;
  title: string;
  description: string;
  goal: string;
  initialCode: Record<string, string>;
  validationPatterns?: {
    [key: string]: string | RegExp;
  };
  initialNodes?: any[];
  initialEdges?: any[];
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "The Root",
    description: "Learn the foundation: the AppModule. Start the NestJS server.",
    goal: "Start the server and see it running.",
    initialCode: {
      "src/main.ts": `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();`,
      "src/app.module.ts": `import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}`,
      "package.json": `{
  "name": "nestquest-lab",
  "version": "1.0.0",
  "scripts": {
    "start": "nest start",
    "build": "nest build"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0"
  }
}`,
    },
    validationPatterns: {
      terminal: "Nest application successfully started",
    },
    initialNodes: [
      {
        id: "app-module",
        type: "module",
        position: { x: 250, y: 100 },
        data: { label: "AppModule", files: ["src/app.module.ts"] },
      },
    ],
    initialEdges: [],
  },
  {
    id: 2,
    title: "The Controller",
    description: "Connect your first Controller to handle requests.",
    goal: "Add CatsController to AppModule.",
    initialCode: {
      "src/main.ts": `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();`,
      "src/app.module.ts": `import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}`,
      "src/cats/cats.controller.ts": `import { Controller } from '@nestjs/common';

@Controller('cats')
export class CatsController {
}`,
    },
    validationPatterns: {
      "src/app.module.ts": /controllers:\s*\[\s*CatsController\s*\]/,
    },
    initialNodes: [
      {
        id: "app-module",
        type: "module",
        position: { x: 250, y: 100 },
        data: { label: "AppModule", files: ["src/app.module.ts"] },
      },
      {
        id: "cats-controller",
        type: "controller",
        position: { x: 450, y: 100 },
        data: { label: "CatsController", files: ["src/cats/cats.controller.ts"] },
      },
    ],
    initialEdges: [],
  },
  {
    id: 3,
    title: "The Route",
    description: "Add your first API endpoint with a GET route.",
    goal: "Add a @Get() decorator with a findAll() method.",
    initialCode: {
      "src/main.ts": `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();`,
      "src/app.module.ts": `import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [],
})
export class AppModule {}`,
      "src/cats/cats.controller.ts": `import { Controller } from '@nestjs/common';

@Controller('cats')
export class CatsController {
}`,
    },
    validationPatterns: {
      "src/cats/cats.controller.ts": /@Get\(\)/,
    },
    initialNodes: [
      {
        id: "app-module",
        type: "module",
        position: { x: 250, y: 100 },
        data: { label: "AppModule", files: ["src/app.module.ts"] },
      },
      {
        id: "cats-controller",
        type: "controller",
        position: { x: 450, y: 100 },
        data: { label: "CatsController", files: ["src/cats/cats.controller.ts"] },
      },
    ],
    initialEdges: [
      {
        id: "e-cats-module",
        source: "cats-controller",
        target: "app-module",
        type: "smoothstep",
      },
    ],
  },
  {
    id: 4,
    title: "The Service",
    description: "Create business logic with an Injectable service.",
    goal: "Create a CatsService with @Injectable() decorator.",
    initialCode: {
      "src/main.ts": `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();`,
      "src/app.module.ts": `import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [],
})
export class AppModule {}`,
      "src/cats/cats.controller.ts": `import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return 'This action returns all cats';
  }
}`,
      "src/cats/cats.service.ts": `export class CatsService {
}`,
    },
    validationPatterns: {
      "src/cats/cats.service.ts": /@Injectable\(\)/,
    },
    initialNodes: [
      {
        id: "app-module",
        type: "module",
        position: { x: 250, y: 100 },
        data: { label: "AppModule", files: ["src/app.module.ts"] },
      },
      {
        id: "cats-controller",
        type: "controller",
        position: { x: 450, y: 100 },
        data: { label: "CatsController", files: ["src/cats/cats.controller.ts"] },
      },
      {
        id: "cats-service",
        type: "service",
        position: { x: 450, y: 250 },
        data: { label: "CatsService", files: ["src/cats/cats.service.ts"] },
      },
    ],
    initialEdges: [
      {
        id: "e-cats-module",
        source: "cats-controller",
        target: "app-module",
        type: "smoothstep",
      },
    ],
  },
  {
    id: 5,
    title: "Dependency Injection",
    description: "Wire up the service to the controller using NestJS DI.",
    goal: "Inject CatsService into CatsController.",
    initialCode: {
      "src/main.ts": `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();`,
      "src/app.module.ts": `import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}`,
      "src/cats/cats.controller.ts": `import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return 'This action returns all cats';
  }
}`,
      "src/cats/cats.service.ts": `import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
}`,
    },
    validationPatterns: {
      "src/cats/cats.controller.ts": /constructor\s*\(\s*private\s+(catsService|catsService:\s*CatsService)\s*\)/,
      "src/app.module.ts": /providers:\s*\[\s*CatsService\s*\]/,
    },
    initialNodes: [
      {
        id: "app-module",
        type: "module",
        position: { x: 250, y: 100 },
        data: { label: "AppModule", files: ["src/app.module.ts"] },
      },
      {
        id: "cats-controller",
        type: "controller",
        position: { x: 450, y: 100 },
        data: { label: "CatsController", files: ["src/cats/cats.controller.ts"] },
      },
      {
        id: "cats-service",
        type: "service",
        position: { x: 450, y: 250 },
        data: { label: "CatsService", files: ["src/cats/cats.service.ts"] },
      },
    ],
    initialEdges: [
      {
        id: "e-cats-module",
        source: "cats-controller",
        target: "app-module",
        type: "smoothstep",
      },
    ],
  },
];

export const getLesson = (id: number) => {
  return lessons.find((lesson) => lesson.id === id);
};

export const getFirstLesson = () => {
  return lessons[0];
};

export const getNextLesson = (currentId: number) => {
  const currentIndex = lessons.findIndex((l) => l.id === currentId);
  if (currentIndex === -1 || currentIndex >= lessons.length - 1) return null;
  return lessons[currentIndex + 1];
};

export const getPreviousLesson = (currentId: number) => {
  const currentIndex = lessons.findIndex((l) => l.id === currentId);
  if (currentIndex <= 0) return null;
  return lessons[currentIndex - 1];
};
