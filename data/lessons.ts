export interface Step {
  id: number;
  title: string;
  instruction: string;
  explanation: string;
  hint?: string;
  codeHighlight?: {
    file: string;
    startLine: number;
    endLine: number;
  };
  validation?: {
    type: 'code' | 'terminal' | 'visual';
    pattern?: string | RegExp;
    successMessage: string;
  };
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  goal: string;
  concepts: string[];
  prerequisites?: string[];
  estimatedTime?: string;
  steps: Step[];
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
    description: "Learn the foundation: the AppModule. Understand how NestJS bootstraps and start the server.",
    goal: "Understand main.ts, explore AppModule structure, and start the NestJS server.",
    concepts: [
      "NestJS Application Bootstrap",
      "The Root Module Pattern", 
      "@Module Decorator",
      "Module Arrays (imports, controllers, providers)"
    ],
    prerequisites: ["Basic TypeScript knowledge", "Node.js installed"],
    estimatedTime: "5-10 minutes",
    steps: [
      {
        id: 1,
        title: "The Entry Point",
        instruction: "Click on 'src/main.ts' in the code editor to open it. Read through the bootstrap function.",
        explanation: "Every NestJS application starts here in main.ts. The bootstrap() function is an async function that creates an application instance by passing your root module to NestFactory.create(). Think of it as turning the ignition key in a car - this is where everything begins!",
        hint: "Look for NestFactory.create(AppModule) - this single line initializes your entire application by reading the AppModule's configuration.",
        codeHighlight: {
          file: "src/main.ts",
          startLine: 4,
          endLine: 7
        }
      },
      {
        id: 2,
        title: "Meet the Root Module",
        instruction: "Now click on 'src/app.module.ts' to see the AppModule - the heart of your application.",
        explanation: "The @Module() decorator marks this class as a NestJS module. The root module (AppModule) is special - it's the entry point that Nest uses to build the application graph. Every NestJS app must have at least one module: the root module.",
        hint: "Notice the @Module({}) decorator above the class - that's what transforms a regular class into a NestJS module!",
        codeHighlight: {
          file: "src/app.module.ts",
          startLine: 1,
          endLine: 8
        }
      },
      {
        id: 3,
        title: "Module Anatomy",
        instruction: "Examine the three arrays inside @Module(): imports, controllers, and providers.",
        explanation: "These three arrays define your module's structure:\\n\\n• imports: Other modules this module depends on (like CatsModule, DatabaseModule)\\n• controllers: Classes that handle HTTP requests and routes\\n• providers: Services and other injectable classes that contain business logic\\n\\nRight now they're all empty - we'll fill them in the upcoming lessons!",
        hint: "Think of a module as a container that groups related functionality. Controllers handle requests, providers do the work, and imports bring in other modules.",
        codeHighlight: {
          file: "src/app.module.ts",
          startLine: 3,
          endLine: 6
        }
      },
      {
        id: 4,
        title: "Start the Server",
        instruction: "Click the 'Run' button in the terminal panel below to start the NestJS server.",
        explanation: "When you run 'npm start', NestJS will:\\n1. Compile your TypeScript code\\n2. Initialize the root AppModule\\n3. Set up the dependency injection container\\n4. Start an HTTP server listening on port 3000\\n\\nWatch the terminal for the startup sequence!",
        hint: "Keep your eyes on the terminal output. You should see several log messages from NestJS as it boots up.",
        validation: {
          type: "terminal" as const,
          pattern: "Nest application successfully started",
          successMessage: "🎉 Server started successfully!"
        }
      },
      {
        id: 5,
        title: "Victory!",
        instruction: "Wait for 'Nest application successfully started' message in the terminal.",
        explanation: "Congratulations! You've just started your first NestJS application! 🎉\\n\\nThe empty AppModule is now running and ready to handle HTTP requests on port 3000. Of course, it doesn't have any routes yet - that's what we'll add in the next lesson!\\n\\nKey takeaways:\\n• main.ts bootstraps the app with NestFactory\\n• AppModule is the root module that organizes everything\\n• Modules contain imports, controllers, and providers",
        hint: "If you see the success message, you're ready for Lesson 2 where we'll add a Controller to handle requests!",
        validation: {
          type: "terminal" as const,
          pattern: "Nest application successfully started",
          successMessage: "Lesson complete! Ready for the next challenge."
        }
      }
    ],
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
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/cli": "^10.0.0"
  }
}`,
      "tsconfig.json": `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
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
        data: { 
          label: "AppModule", 
          files: ["src/app.module.ts"],
          tooltip: "The root module - every NestJS app starts here. It organizes controllers and providers."
        },
      },
    ],
    initialEdges: [],
  },
  {
    id: 2,
    title: "The Controller",
    description: "Controllers handle incoming HTTP requests. Learn how to create and register your first controller.",
    goal: "Understand what controllers do and register CatsController in AppModule.",
    concepts: [
      "@Controller Decorator", 
      "Route Prefixes", 
      "Request Handling",
      "Module Registration"
    ],
    estimatedTime: "5-10 minutes",
    steps: [
      {
        id: 1,
        title: "What is a Controller?",
        instruction: "Before we code, let's understand: Controllers are responsible for handling incoming requests and returning responses to the client.",
        explanation: "In NestJS, controllers receive HTTP requests (GET, POST, PUT, DELETE, etc.) and return responses. They're the 'traffic cops' of your application - routing requests to the right places.\\n\\nThink of it like a restaurant:\\n• Controller = Waiter (takes orders, delivers food)\\n• Service = Kitchen (does the actual cooking)\\n• Module = Restaurant building (organizes everything)",
        hint: "Controllers don't contain business logic - they delegate that to services. Controllers just handle the HTTP layer."
      },
      {
        id: 2,
        title: "Explore CatsController",
        instruction: "Click on 'src/cats/cats.controller.ts' to open it and examine the @Controller decorator.",
        explanation: "Notice the @Controller('cats') decorator above the class. This tells NestJS:\\n\\n1. This class is a controller\\n2. All routes in this controller will be prefixed with '/cats'\\n\\nSo if you add a GET route here, it will be accessible at GET /cats",
        hint: "The string 'cats' in @Controller('cats') is the route prefix. If you used @Controller('dogs'), routes would be at /dogs instead.",
        codeHighlight: {
          file: "src/cats/cats.controller.ts",
          startLine: 1,
          endLine: 5
        }
      },
      {
        id: 3,
        title: "The Empty Controller",
        instruction: "Notice that CatsController is empty right now. That's okay - we'll add routes in the next lesson!",
        explanation: "Currently, CatsController has no methods (route handlers). It's just a decorated class. The @Controller decorator alone doesn't create any routes - you need to add methods with HTTP decorators like @Get(), @Post(), etc.\\n\\nBut first, we need to tell NestJS about this controller by registering it in a module.",
        hint: "Without any route handlers, the controller won't respond to any requests yet. We'll add a @Get() handler in Lesson 3."
      },
      {
        id: 4,
        title: "Register the Controller",
        instruction: "Open 'src/app.module.ts' and add CatsController to the controllers array. You'll also need to import it at the top.",
        explanation: "Controllers must be registered in a module for NestJS to recognize them. You need to:\\n\\n1. Import the controller class at the top of the file\\n2. Add it to the 'controllers' array in @Module()\\n\\nWithout registration, NestJS won't know your controller exists!",
        hint: "Add this import at the top:\\nimport { CatsController } from './cats/cats.controller';\\n\\nThen change controllers: [] to:\\ncontrollers: [CatsController]",
        codeHighlight: {
          file: "src/app.module.ts",
          startLine: 1,
          endLine: 8
        },
        validation: {
          type: "code" as const,
          pattern: "controllers:\\s*\\[\\s*CatsController\\s*\\]",
          successMessage: "✅ CatsController registered!"
        }
      },
      {
        id: 5,
        title: "Watch the Visualizer",
        instruction: "Look at the Architecture Visualizer on the left. Notice how AppModule and CatsController are now shown as separate boxes.",
        explanation: "The visualizer shows your NestJS architecture! You can see:\\n\\n• AppModule (purple) - Your root module\\n• CatsController (blue) - Your new controller\\n\\nIn more complex apps, you'll see services, multiple modules, and the connections between them. This helps you understand how your application is structured.\\n\\nKey Takeaways:\\n• Controllers handle HTTP requests\\n• @Controller('prefix') sets the route prefix\\n• Controllers must be registered in a module's controllers array",
        hint: "Try dragging CatsController onto AppModule in the visualizer to see them connect!"
      }
    ],
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
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/cli": "^10.0.0"
  }
}`,
      "tsconfig.json": `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
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
        data: { 
          label: "AppModule", 
          files: ["src/app.module.ts"],
          tooltip: "The root module - register your controller here!"
        },
      },
      {
        id: "cats-controller",
        type: "controller",
        position: { x: 500, y: 100 },
        data: { 
          label: "CatsController", 
          files: ["src/cats/cats.controller.ts"],
          tooltip: "Handles HTTP requests to /cats routes"
        },
      },
    ],
    initialEdges: [],
  },
  {
    id: 3,
    title: "The Route",
    description: "Routes are the URLs your API responds to. Add your first GET endpoint and make your controller actually do something!",
    goal: "Add a @Get() route handler that returns data when someone visits /cats",
    concepts: [
      "HTTP Methods (GET, POST, PUT, DELETE)",
      "@Get() Decorator",
      "Route Handler Methods",
      "Return Values & Responses"
    ],
    estimatedTime: "5-10 minutes",
    steps: [
      {
        id: 1,
        title: "Understanding Routes",
        instruction: "Before coding, let's understand: Routes define what URLs your API responds to and what HTTP methods they accept.",
        explanation: "HTTP has several methods for different actions:\\n\\n• GET - Retrieve data (e.g., get all cats)\\n• POST - Create new data (e.g., add a new cat)\\n• PUT/PATCH - Update existing data\\n• DELETE - Remove data\\n\\nIn NestJS, you use decorators like @Get(), @Post(), @Put(), @Delete() to define which method a route handles.",
        hint: "Think of routes as doors into your application. Each door (route) responds to specific actions (HTTP methods)."
      },
      {
        id: 2,
        title: "Open the Controller",
        instruction: "Click on 'src/cats/cats.controller.ts' to open it. We're going to add our first route inside.",
        explanation: "Currently, CatsController is empty - it has no route handlers. We need to add a method decorated with @Get() to handle GET requests to /cats.\\n\\nThe controller already has @Controller('cats'), so any routes we add will be prefixed with /cats.",
        hint: "The @Controller('cats') prefix + @Get() = GET /cats endpoint",
        codeHighlight: {
          file: "src/cats/cats.controller.ts",
          startLine: 1,
          endLine: 5
        }
      },
      {
        id: 3,
        title: "Import the Get Decorator",
        instruction: "Update the import statement to include 'Get' from '@nestjs/common'.",
        explanation: "Before using @Get(), you need to import it. Modify the import line:\\n\\nFrom: import { Controller } from '@nestjs/common';\\nTo: import { Controller, Get } from '@nestjs/common';\\n\\nNestJS provides many HTTP method decorators, all from the same '@nestjs/common' package.",
        hint: "Add 'Get' to the destructured import: import { Controller, Get } from '@nestjs/common';"
      },
      {
        id: 4,
        title: "Add the Route Handler",
        instruction: "Add a findAll() method decorated with @Get() inside the CatsController class.",
        explanation: "Add this code inside the CatsController class:\\n\\n@Get()\\nfindAll() {\\n  return 'This action returns all cats';\\n}\\n\\nHow it works:\\n• @Get() marks this method as a GET route handler\\n• The method name 'findAll' is just for readability (you can name it anything)\\n• The return value becomes the response body",
        hint: "Your controller should look like:\\n@Controller('cats')\\nexport class CatsController {\\n  @Get()\\n  findAll() {\\n    return 'This action returns all cats';\\n  }\\n}",
        codeHighlight: {
          file: "src/cats/cats.controller.ts",
          startLine: 1,
          endLine: 8
        },
        validation: {
          type: "code" as const,
          pattern: "@Get\\(\\)",
          successMessage: "✅ Route handler added!"
        }
      },
      {
        id: 5,
        title: "Your First API Endpoint!",
        instruction: "You've created your first NestJS API endpoint! When the server runs, visiting GET /cats will return your message.",
        explanation: "Congratulations! 🎉 You've built your first API endpoint!\\n\\nWhat you've learned:\\n• @Get() creates a route that responds to GET requests\\n• The route URL is @Controller prefix + @Get path (/cats + '' = /cats)\\n• Whatever you return from the method becomes the response\\n\\nIn a real app, you'd return actual data (like an array of cat objects) instead of a string. We'll learn to do that with Services in the next lessons!\\n\\nRoute Formula: @Controller('prefix') + @Get('path') = GET /prefix/path",
        hint: "Try adding @Get('breeds') - this would create a GET /cats/breeds endpoint!"
      }
    ],
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
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/cli": "^10.0.0"
  }
}`,
      "tsconfig.json": `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
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
        data: { 
          label: "AppModule", 
          files: ["src/app.module.ts"],
          tooltip: "Root module with CatsController registered"
        },
      },
      {
        id: "cats-controller",
        type: "controller",
        position: { x: 500, y: 100 },
        data: { 
          label: "CatsController", 
          files: ["src/cats/cats.controller.ts"],
          tooltip: "Add a @Get() route handler here!"
        },
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
    description: "Services are the 'kitchen' of your app where the real work happens. Learn about Providers and dependency injection!",
    goal: "Create a CatsService, make it @Injectable, and register it in AppModule.",
    concepts: [
      "Providers & Services",
      "@Injectable() Decorator",
      "Separation of Concerns",
      "Module Providers"
    ],
    estimatedTime: "5-10 minutes",
    steps: [
      {
        id: 1,
        title: "Why Use Services?",
        instruction: "Before coding, let's understand the 'Separation of Concerns' principle.",
        explanation: "Controllers should only handle HTTP requests and delegate the actual 'work' (business logic) to Services. \\n\\nWhy? \\n• Reusability: Multiple controllers can use the same service. \\n• Testability: It's easier to test logic when it's not tied to HTTP. \\n• Organization: Keeps your controllers slim and easy to read.",
        hint: "Think of it like a restaurant: The Waiter (Controller) takes your order, but the Chef (Service) does the actual cooking in the kitchen."
      },
      {
        id: 2,
        title: "Meet the CatsService",
        instruction: "Click on 'src/cats/cats.service.ts' to open it. It's just a plain class right now.",
        explanation: "In NestJS, a Service is just a class. However, to let NestJS manage this class and inject it into other classes, we need to mark it as a Provider.",
        hint: "A provider is anything that can be 'injected' as a dependency. Services are the most common type of providers.",
        codeHighlight: {
          file: "src/cats/cats.service.ts",
          startLine: 1,
          endLine: 2
        }
      },
      {
        id: 3,
        title: "The @Injectable Decorator",
        instruction: "Import 'Injectable' from '@nestjs/common' and add the @Injectable() decorator above the class.",
        explanation: "The @Injectable() decorator attaches metadata, which tells Nest that this class is a provider that can be managed by the Nest IoC (Inversion of Control) container.",
        hint: "Your code should look like this:\\nimport { Injectable } from '@nestjs/common';\\n\\n@Injectable()\\nexport class CatsService {}",
        codeHighlight: {
          file: "src/cats/cats.service.ts",
          startLine: 1,
          endLine: 5
        },
        validation: {
          type: "code" as const,
          pattern: "@Injectable\\(\\)",
          successMessage: "✅ Service is now Injectable!"
        }
      },
      {
        id: 4,
        title: "Add Service Logic",
        instruction: "Add a findAll() method to CatsService that returns an array of cats.",
        explanation: "Let's give our service some work to do. Add this method inside the class:\\n\\nfindAll() {\\n  return [{ id: 1, name: 'Tom' }, { id: 2, name: 'Luna' }];\\n}",
        hint: "In a real app, this is where you would call a database. For now, we're returning static data.",
        codeHighlight: {
          file: "src/cats/cats.service.ts",
          startLine: 4,
          endLine: 6
        }
      },
      {
        id: 5,
        title: "Register the Provider",
        instruction: "Open 'src/app.module.ts' and add CatsService to the 'providers' array.",
        explanation: "Just like controllers, providers must be registered in a module. This tells NestJS: 'If someone asks for CatsService, here is the class to use!'.\\n\\nYou need to:\\n1. Import CatsService at the top.\\n2. Add it to the providers: [] array.",
        hint: "Add this import:\\nimport { CatsService } from './cats/cats.service';\\n\\nThen update providers: [CatsService]",
        codeHighlight: {
          file: "src/app.module.ts",
          startLine: 1,
          endLine: 10
        },
        validation: {
          type: "code" as const,
          pattern: "providers:\\s*\\[\\s*CatsService\\s*\\]",
          successMessage: "✅ CatsService is registered as a provider!"
        }
      }
    ],
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
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/cli": "^10.0.0"
  }
}`,
      "tsconfig.json": `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}`,
    },
    validationPatterns: {
      "src/cats/cats.service.ts": /@Injectable\(\)/,
      "src/app.module.ts": /providers:\s*\[\s*CatsService\s*\]/,
    },
    initialNodes: [
      {
        id: "app-module",
        type: "module",
        position: { x: 250, y: 100 },
        data: { 
          label: "AppModule", 
          files: ["src/app.module.ts"],
          tooltip: "Register the service in the providers array here!"
        },
      },
      {
        id: "cats-controller",
        type: "controller",
        position: { x: 500, y: 100 },
        data: { 
          label: "CatsController", 
          files: ["src/cats/cats.controller.ts"],
          tooltip: "Currently returning data directly. We'll change this soon!"
        },
      },
      {
        id: "cats-service",
        type: "service",
        position: { x: 500, y: 250 },
        data: { 
          label: "CatsService", 
          files: ["src/cats/cats.service.ts"],
          tooltip: "Make me @Injectable!"
        },
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
    description: "The crown jewel of NestJS! Learn how to wire up your services and controllers automatically using Dependency Injection.",
    goal: "Inject CatsService into CatsController and use it to return data.",
    concepts: [
      "Dependency Injection (DI)",
      "Constructor-based Injection",
      "IoC (Inversion of Control) Container",
      "Singleton Scope"
    ],
    estimatedTime: "10 minutes",
    steps: [
      {
        id: 1,
        title: "The DI Analogy",
        instruction: "Before we code, let's understand the problem Dependency Injection solves.",
        explanation: "Without DI, your controller would have to manually create the service: `this.catsService = new CatsService()`. This makes your code hard to test and maintain.\\n\\nWith Dependency Injection, the Controller just says: 'I need a CatsService', and NestJS (the Boss) finds it and gives it to the Controller. \\n\\nAnalogy:\\nA Chef (Controller) doesn't build their own Stove (Service). The Restaurant Owner (NestJS) provides a working Stove when the Chef starts their shift.",
        hint: "DI is like hiring a contractor - you tell them what you need, and they bring the tools."
      },
      {
        id: 2,
        title: "Constructor Injection",
        instruction: "Open 'src/cats/cats.controller.ts' and add a constructor to inject the CatsService.",
        explanation: "In NestJS, we use the constructor to ask for dependencies. Add this constructor inside your class:\\n\\nconstructor(private catsService: CatsService) {}\\n\\nNotice the 'private' keyword - this is a TypeScript shorthand that automatically creates a property and assigns the value to it.",
        hint: "Don't forget to import CatsService!\\nimport { CatsService } from './cats/cats.service';",
        codeHighlight: {
          file: "src/cats/cats.controller.ts",
          startLine: 1,
          endLine: 6
        },
        validation: {
          type: "code" as const,
          pattern: "constructor\\s*\\(\\s*private\\s+catsService:\\s*CatsService\\s*\\)",
          successMessage: "✅ Service injected via constructor!"
        }
      },
      {
        id: 3,
        title: "Use the Service",
        instruction: "Update the findAll() method in your controller to use the injected service.",
        explanation: "Now that we have the service, let's use it! Change your findAll() method to call the service's method:\\n\\nfindAll() {\\n  return this.catsService.findAll();\\n}\\n\\nNow, when someone visits GET /cats, the controller asks the service for the data and returns it. Clean and organized!",
        hint: "Use 'this.catsService' to access the property we created in the constructor.",
        codeHighlight: {
          file: "src/cats/cats.controller.ts",
          startLine: 6,
          endLine: 10
        }
      },
      {
        id: 4,
        title: "Who creates the class?",
        instruction: "Wait... where did we call 'new CatsController()'? The answer is: nowhere!",
        explanation: "This is the 'Inversion of Control' (IoC). NestJS is responsible for creating instances of your classes. \\n\\nWhen Nest starts, it sees that CatsController needs CatsService. It automatically creates an instance of CatsService, then creates CatsController and passes the service instance into its constructor. You never have to use the 'new' keyword!",
        hint: "This is why we registered CatsService as a 'provider' in the previous lesson - so Nest knows how to create it."
      },
      {
        id: 5,
        title: "The Complete Flow",
        instruction: "Look at the Architecture Visualizer. Notice the connection between CatsController and CatsService.",
        explanation: "You've successfully built a complete NestJS feature! \\n\\nSummary of the flow:\\n1. Request hits the server at /cats\\n2. CatsController (Waiter) receives the request\\n3. CatsController calls CatsService (Chef)\\n4. CatsService returns the data\\n5. CatsController sends the data back to the user\\n\\nYou've mastered Modules, Controllers, Providers, and Dependency Injection! 🎉",
        hint: "Final boss move: Try adding another method to the service and calling it from a new route!"
      }
    ],
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
import { CatsService } from './cats.service';

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
  findAll() {
    return [{ id: 1, name: 'Tom' }, { id: 2, name: 'Luna' }];
  }
}`,
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
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/cli": "^10.0.0"
  }
}`,
      "tsconfig.json": `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
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
        data: { 
          label: "AppModule", 
          files: ["src/app.module.ts"],
          tooltip: "The root module connecting everything together."
        },
      },
      {
        id: "cats-controller",
        type: "controller",
        position: { x: 500, y: 100 },
        data: { 
          label: "CatsController", 
          files: ["src/cats/cats.controller.ts"],
          tooltip: "Inject the service here!"
        },
      },
      {
        id: "cats-service",
        type: "service",
        position: { x: 500, y: 250 },
        data: { 
          label: "CatsService", 
          files: ["src/cats/cats.service.ts"],
          tooltip: "Ready to be injected into the controller!"
        },
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
    id: 6,
    title: "Persistence: The Entity",
    description: "Map your TypeScript classes to database tables using TypeORM Entities.",
    goal: "Create a Cat entity with basic columns.",
    concepts: ["@Entity()", "@PrimaryGeneratedColumn()", "@Column()", "Data Persistence"],
    prerequisites: ["Lesson 5"],
    estimatedTime: "10m",
    initialCode: {
      'src/entities/cat.entity.ts': `import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}`,
      'src/app.module.ts': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Cat],
      synchronize: true,
    }),
  ],
})
export class AppModule {}`
    },
    validationPatterns: {
      'src/entities/cat.entity.ts': /@Column\(\)\s+breed:\s*string/
    },
    steps: [
      {
        id: 1,
        title: "Introduction to Entities",
        instruction: "Explore the `cat.entity.ts` file.",
        explanation: "In NestJS (with TypeORM), an Entity is simply a class that corresponds to a database table. The `@Entity()` decorator tells TypeORM to manage this class.",
        codeHighlight: {
          file: 'src/entities/cat.entity.ts',
          lines: [3, 4]
        }
      },
      {
        id: 2,
        title: "The Primary Key",
        instruction: "Look at the `@PrimaryGeneratedColumn()` decorator.",
        explanation: "Every table needs a primary key. This decorator handles the automatic generation of incrementing IDs for you.",
        codeHighlight: {
          file: 'src/entities/cat.entity.ts',
          lines: [5, 6]
        }
      },
      {
        id: 3,
        title: "Defining Database Columns",
        instruction: "Add an 'age' column to the Cat entity.",
        explanation: "The `@Column()` decorator maps class properties to table columns. You can specify types and constraints here.",
        hint: "Add `@Column() age: number;` below the name property.",
        validation: /@Column\(\)\s+age:\s*number/
      },
      {
        id: 4,
        title: "Nullable Constraints",
        instruction: "Add a 'breed' column that is nullable.",
        explanation: "Often, data is optional. You can pass options to `@Column()` like `{ nullable: true }`.",
        hint: "Add `@Column({ nullable: true }) breed: string;`",
        validation: /@Column\({ nullable: true }\)\s+breed:\s*string/
      },
      {
        id: 5,
        title: "Module Registration",
        instruction: "Open `app.module.ts` to see how entities are registered.",
        explanation: "For TypeORM to 'see' your entities, they must be listed in the `entities` array of the `TypeOrmModule` configuration.",
        codeHighlight: {
          file: 'src/app.module.ts',
          lines: [9, 10]
        }
      }
    ],
    initialNodes: [
      {
        id: 'cat-entity',
        type: 'entity',
        position: { x: 400, y: 150 },
        data: { 
          label: 'Cat', 
          files: ['src/entities/cat.entity.ts'],
          attributes: ['id: number', 'name: string']
        }
      }
    ],
    initialEdges: []
  },
  {
    id: 7,
    title: "Database Relationships",
    description: "Connect your data using 1:N and N:1 relationships.",
    goal: "Link Cats to Owners and watch the visualizer draw the connection.",
    concepts: ["@ManyToOne()", "@OneToMany()", "Foreign Keys", "Schema Mapping"],
    prerequisites: ["Lesson 6"],
    estimatedTime: "15m",
    initialCode: {
      'src/entities/cat.entity.ts': `import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Owner } from './owner.entity';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Owner, (owner) => owner.cats)
  owner: Owner;
}`,
      'src/entities/owner.entity.ts': `import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cat } from './cat.entity';

@Entity()
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Cat, (cat) => cat.owner)
  cats: Cat[];
}`
    },
    validationPatterns: {
      'src/entities/cat.entity.ts': /@ManyToOne\(/,
      'src/entities/owner.entity.ts': /@OneToMany\(/
    },
    steps: [
      {
        id: 1,
        title: "Introduction to Relationships",
        instruction: "Check both `cat.entity.ts` and `owner.entity.ts`.",
        explanation: "Rarely does data exist in isolation. Relationships allow us to connect different entities, like a Cat belonging to an Owner.",
      },
      {
        id: 2,
        title: "Defining the Many-to-One Side",
        instruction: "Examine the `@ManyToOne()` decorator in `cat.entity.ts`.",
        explanation: "This side of the relationship usually holds the 'Foreign Key' in the database. It says 'Many cats can have one Owner'.",
        codeHighlight: {
          file: 'src/entities/cat.entity.ts',
          lines: [12, 13]
        }
      },
      {
        id: 3,
        title: "The Inverse Side (One-to-Many)",
        instruction: "Check the `@OneToMany()` decorator in `owner.entity.ts`.",
        explanation: "This is the 'inverse' side. It doesn't create a column in the database but allows you to access related cats from the owner object.",
        codeHighlight: {
          file: 'src/entities/owner.entity.ts',
          lines: [12, 13]
        }
      },
      {
        id: 4,
        title: "Visual Relationship Detection",
        instruction: "Look at the Architecture Visualizer canvas.",
        explanation: "Our platform's visualizer scans your entity decorators. Notice the arrow connecting 'Cat' to 'Owner'—it represents the active relationship!",
      },
      {
        id: 5,
        title: "Hands-on: Adding a Column",
        instruction: "Add a 'phone' column to the Owner entity.",
        explanation: "Practice makes perfect. Add a standard column to the Owner to complete their profile.",
        hint: "Add `@Column() phone: string;` in `owner.entity.ts`.",
        validation: /@Column\(\)\s+phone:\s*string/
      }
    ],
    initialNodes: [
      {
        id: 'cat-entity',
        type: 'entity',
        position: { x: 200, y: 150 },
        data: { 
          label: 'Cat', 
          files: ['src/entities/cat.entity.ts'],
          attributes: ['id: number', 'name: string']
        }
      },
      {
        id: 'owner-entity',
        type: 'entity',
        position: { x: 600, y: 150 },
        data: { 
          label: 'Owner', 
          files: ['src/entities/owner.entity.ts'],
          attributes: ['id: number', 'name: string']
        }
      }
    ],
    initialEdges: []
  },
  {
    id: 8,
    title: "Request Lifecycle: Middleware",
    description: "Learn to intercept requests before they reach your route handlers.",
    goal: "Implement a logger middleware and register it globally.",
    concepts: ["NestMiddleware", "use() method", "next()", "Middleware Consumer"],
    prerequisites: ["Lesson 7"],
    estimatedTime: "12m",
    initialCode: {
      'src/common/middleware/logger.middleware.ts': `import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...', req.method, req.url);
    next();
  }
}`,
      'src/app.module.ts': `import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}`
    },
    validationPatterns: {
      'src/common/middleware/logger.middleware.ts': /next\(\)/
    },
    steps: [
      {
        id: 1,
        title: "The First Checkpoint",
        instruction: "Explore the `logger.middleware.ts` file.",
        explanation: "Middleware functions have access to the request and response objects, and the `next()` middleware function in the application’s request-response cycle.",
        codeHighlight: {
          file: 'src/common/middleware/logger.middleware.ts',
          lines: [4, 5, 6]
        }
      },
      {
        id: 2,
        title: "The Essential next()",
        instruction: "What happens if you remove `next()`?",
        explanation: "Crucially, if the current middleware function does not call `next()`, the request will be left hanging and the route handler will never be reached.",
        codeHighlight: {
          file: 'src/common/middleware/logger.middleware.ts',
          lines: [8]
        }
      },
      {
        id: 3,
        title: "Registration Strategy",
        instruction: "Look at how `AppModule` implements `NestModule`.",
        explanation: "Middleware is not registered in the `@Module()` decorator. Instead, we use the `configure()` method of the module class.",
        codeHighlight: {
          file: 'src/app.module.ts',
          lines: [5, 6]
        }
      },
      {
        id: 4,
        title: "Targeting Routes",
        instruction: "Change `.forRoutes('*')` to `.forRoutes('cats')`.",
        explanation: "You can restrict middleware to specific routes or even specific HTTP methods.",
        hint: "Modify line 9 in `app.module.ts`.",
        validation: /\.forRoutes\('cats'\)/
      },
      {
        id: 5,
        title: "Visualizing the Flow",
        instruction: "Trigger a 'Test Request' and watch the pulse hit the Middleware node first.",
        explanation: "In our architectural map, Middleware sits right at the edge, guarding the entrance to your application logic.",
      }
    ],
    initialNodes: [
      {
        id: 'logger-middleware',
        type: 'middleware',
        position: { x: 100, y: 300 },
        data: { 
          label: 'LoggerMiddleware', 
          files: ['src/common/middleware/logger.middleware.ts']
        }
      },
      {
        id: 'app-module',
        type: 'module',
        position: { x: 400, y: 300 },
        data: { 
          label: 'AppModule', 
          files: ['src/app.module.ts']
        }
      }
    ],
    initialEdges: [
      { id: 'e1', source: 'logger-middleware', target: 'app-module', animated: true }
    ]
  },
  {
    id: 9,
    title: "The Shield: Guards",
    description: "Protect your routes with custom authorization logic.",
    goal: "Create an AuthGuard that checks for a specific header.",
    concepts: ["CanActivate", "ExecutionContext", "Authorization", "Security"],
    prerequisites: ["Lesson 8"],
    estimatedTime: "15m",
    initialCode: {
      'src/common/guards/auth.guard.ts': `import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.headers.authorization === 'secret-token';
  }
}`,
      'src/cats/cats.controller.ts': `import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('cats')
@UseGuards(AuthGuard)
export class CatsController {
  @Get()
  findAll() {
    return 'Authenticated cats only!';
  }
}`
    },
    validationPatterns: {
      'src/common/guards/auth.guard.ts': /canActivate/
    },
    steps: [
      {
        id: 1,
        title: "Guards vs Middleware",
        instruction: "Examine `auth.guard.ts`.",
        explanation: "While middleware is great for logging, Guards have access to the `ExecutionContext`, knowing exactly which handler is about to be executed.",
        codeHighlight: {
          file: 'src/common/guards/auth.guard.ts',
          lines: [5, 6, 7]
        }
      },
      {
        id: 2,
        title: "The CanActivate Contract",
        instruction: "Note the return type of `canActivate`.",
        explanation: "If it returns `true`, the request proceeds. If `false`, NestJS automatically throws a `403 Forbidden` response.",
        codeHighlight: {
          file: 'src/common/guards/auth.guard.ts',
          lines: [10]
        }
      },
      {
        id: 3,
        title: "Applying the Shield",
        instruction: "Look at `@UseGuards(AuthGuard)` on the controller.",
        explanation: "Guards can be controller-scoped, method-scoped, or even global. Here, we're protecting every route in the CatsController.",
        codeHighlight: {
          file: 'src/cats/cats.controller.ts',
          lines: [5]
        }
      },
      {
        id: 4,
        title: "Dynamic Authorization",
        instruction: "Modify the guard to also accept 'admin-token'.",
        explanation: "Real-world guards often check roles, permissions, or JWT tokens.",
        hint: "Use `|| request.headers.authorization === 'admin-token'`",
        validation: /admin-token/
      },
      {
        id: 5,
        title: "Visualizing Security",
        instruction: "Trigger a request. Notice the Shield node (Guard) validating the packet.",
        explanation: "The Guard sits right before the Controller, acting as a final security check.",
      }
    ],
    initialNodes: [
      {
        id: 'auth-guard',
        type: 'guard',
        position: { x: 300, y: 150 },
        data: { 
          label: 'AuthGuard', 
          files: ['src/common/guards/auth.guard.ts']
        }
      },
      {
        id: 'cats-controller',
        type: 'controller',
        position: { x: 550, y: 150 },
        data: { 
          label: 'CatsController', 
          files: ['src/cats/cats.controller.ts']
        }
      }
    ],
    initialEdges: [
      { id: 'e1', source: 'auth-guard', target: 'cats-controller', animated: true, label: 'Secures' }
    ]
  },
  {
    id: 10,
    title: "Interceptors: The Transformer",
    description: "Learn to transform the response and measure performance.",
    goal: "Implement a timing interceptor using RxJS.",
    concepts: ["NestInterceptor", "CallHandler", "tap operator", "Response Mapping"],
    prerequisites: ["Lesson 9"],
    estimatedTime: "15m",
    initialCode: {
      'src/common/interceptors/logging.interceptor.ts': `import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(\`After... \${Date.now() - now}ms\`)),
      );
  }
}`
    },
    validationPatterns: {
      'src/common/interceptors/logging.interceptor.ts': /next\.handle\(\)/
    },
    steps: [
      {
        id: 1,
        title: "A Two-Way Street",
        instruction: "Study the `intercept` method.",
        explanation: "Interceptors are unique because they wrap both the request (before) and the response (after) using RxJS observables.",
        codeHighlight: {
          file: 'src/common/interceptors/logging.interceptor.ts',
          lines: [7, 10, 11]
        }
      },
      {
        id: 2,
        title: "The power of next.handle()",
        instruction: "Identify where the route handler is actually called.",
        explanation: "If you don't call `next.handle()`, the handler is never executed—allowing you to cache responses or short-circuit requests.",
        codeHighlight: {
          file: 'src/common/interceptors/logging.interceptor.ts',
          lines: [11]
        }
      },
      {
        id: 3,
        title: "The RxJS Pipe",
        instruction: "Notice the `.pipe(tap(...))` syntax.",
        explanation: "Interceptors leverage the full power of RxJS to manipulate the 'stream' of data coming back from your service.",
        codeHighlight: {
          file: 'src/common/interceptors/logging.interceptor.ts',
          lines: [13]
        }
      },
      {
        id: 4,
        title: "Measuring Time",
        instruction: "Add 'ms' to the console log if it's missing.",
        explanation: "Tracking performance is one of the most common use cases for Interceptors.",
        hint: "Check line 14 for the template string.",
        validation: /ms/
      },
      {
        id: 5,
        title: "Visualizing the Loop",
        instruction: "Watch the request pulse enter and then exit through the Interceptor node.",
        explanation: "The Interceptor (Rose/Refresh icon) acts like a wrapper around your business logic.",
      }
    ],
    initialNodes: [
      {
        id: 'logging-interceptor',
        type: 'interceptor',
        position: { x: 300, y: 300 },
        data: { 
          label: 'LoggingInterceptor', 
          files: ['src/common/interceptors/logging.interceptor.ts']
        }
      },
      {
        id: 'cats-controller',
        type: 'controller',
        position: { x: 550, y: 300 },
        data: { 
          label: 'CatsController', 
          files: ['src/cats/cats.controller.ts']
        }
      }
    ],
    initialEdges: [
      { id: 'e1', source: 'logging-interceptor', target: 'cats-controller', animated: true, label: 'Wraps' }
    ]
  },
  {
    id: 11,
    title: "Pipes: Data Validation",
    description: "Validate and transform incoming requests with ease.",
    goal: "Sanitize data using a custom validation pipe.",
    concepts: ["PipeTransform", "transform()", "DTOs", "class-validator"],
    prerequisites: ["Lesson 10"],
    estimatedTime: "12m",
    initialCode: {
      'src/common/pipes/parse-int.pipe.ts': `import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}`,
      'src/cats/cats.controller.ts': `import { Controller, Get, Param } from '@nestjs/common';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';

@Controller('cats')
export class CatsController {
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return \`This returns cat #\${id}\`;
  }
}`
    },
    validationPatterns: {
      'src/common/pipes/parse-int.pipe.ts': /PipeTransform/
    },
    steps: [
      {
        id: 1,
        title: "Transformation & Validation",
        instruction: "Inspect `parse-int.pipe.ts`.",
        explanation: "Pipes have two main use cases: **Transformation** (converting input to a desired type) and **Validation** (checking if input is valid).",
        codeHighlight: {
          file: 'src/common/pipes/parse-int.pipe.ts',
          lines: [4, 5]
        }
      },
      {
        id: 2,
        title: "The Transform Method",
        instruction: "Look at the parameters of `transform()`.",
        explanation: "It receives the `value` of the incoming argument and `metadata` which describes where the argument comes from (e.g., Body, Query, Param).",
        codeHighlight: {
          file: 'src/common/pipes/parse-int.pipe.ts',
          lines: [5]
        }
      },
      {
        id: 3,
        title: "Error Handling",
        instruction: "Note the use of `BadRequestException`.",
        explanation: "If a pipe throws an exception, NestJS catches it and returns a clean error response (e.g., 400 Bad Request) to the client.",
        codeHighlight: {
          file: 'src/common/pipes/parse-int.pipe.ts',
          lines: [8]
        }
      },
      {
        id: 4,
        title: "Inline Application",
        instruction: "See how the pipe is applied inside `@Param()`.",
        explanation: "Pipes can be bound at the parameter level, method level, controller level, or globally.",
        codeHighlight: {
          file: 'src/cats/cats.controller.ts',
          lines: [7]
        }
      },
      {
        id: 5,
        title: "Visualizing the Funnel",
        instruction: "Trigger a request and watch the packet pass through the Funnel node (Pipe).",
        explanation: "Pipes operate right before the route handler, ensuring your data is clean and correctly typed.",
      }
    ],
    initialNodes: [
      {
        id: 'parse-pipe',
        type: 'pipe',
        position: { x: 300, y: 450 },
        data: { 
          label: 'ParseIntPipe', 
          files: ['src/common/pipes/parse-int.pipe.ts']
        }
      },
      {
        id: 'cats-controller',
        type: 'controller',
        position: { x: 550, y: 450 },
        data: { 
          label: 'CatsController', 
          files: ['src/cats/cats.controller.ts']
        }
      }
    ],
    initialEdges: [
      { id: 'e1', source: 'parse-pipe', target: 'cats-controller', animated: true, label: 'Filters' }
    ]
  },
  {
    id: 12,
    title: "Distributed Architecture: Microservices",
    description: "Scale your application by moving to a distributed microservice architecture.",
    goal: "Connect a Monolith to a Microservice using NATS and Message Patterns.",
    concepts: ["Microservices", "Transporters (NATS/Redis)", "@MessagePattern", "ClientProxy", "Message-based Communication"],
    prerequisites: ["Lesson 11"],
    estimatedTime: "20m",
    initialCode: {
      'src/main.ts': `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();`,
      'src/math-service/main.ts': `import { NestFactory } from '@nestjs/core';
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
bootstrap();`,
      'src/math-service/math.controller.ts': `import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MathController {
  @MessagePattern('add')
  accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => a + b, 0);
  }
}`,
      'src/app.controller.ts': `import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}

  @Get()
  getSum() {
    return this.client.send('add', [1, 2, 3]);
  }
}`
    },
    validationPatterns: {
      'src/math-service/math.controller.ts': /@MessagePattern\('add'\)/,
      'src/app.controller.ts': /\.send\('add'/
    },
    steps: [
      {
        id: 1,
        title: "The Distributed Mindset",
        instruction: "Compare `src/main.ts` and `src/math-service/main.ts`.",
        explanation: "In a microservice architecture, we use `NestFactory.createMicroservice` instead of `create`. This allows the application to listen for messages via a transporter (like NATS or RabbitMQ) instead of standard HTTP.",
        codeHighlight: {
          file: 'src/math-service/main.ts',
          lines: [6, 7]
        }
      },
      {
        id: 2,
        title: "Listening for Messages",
        instruction: "Examine `@MessagePattern('add')` in `math.controller.ts`.",
        explanation: "Microservices don't use `@Get` or `@Post`. They use **Patterns**. This handler will trigger whenever a message with the pattern 'add' is received on the NATS bus.",
        codeHighlight: {
          file: 'src/math-service/math.controller.ts',
          lines: [5, 6]
        }
      },
      {
        id: 3,
        title: "The ClientProxy",
        instruction: "Look at the `AppController` constructor injection.",
        explanation: "To talk to a microservice from your main app, you use a `ClientProxy`. It handles the complexity of connecting to the transporter and sending packets.",
        codeHighlight: {
          file: 'src/app.controller.ts',
          lines: [6]
        }
      },
      {
        id: 4,
        title: "Request-Response Pattern",
        instruction: "Note how `this.client.send()` is used in the `getSum` method.",
        explanation: "`send()` starts a request-response cycle. The app sends data, waits for the microservice to calculate it, and receives the result back—all over the message bus.",
        codeHighlight: {
          file: 'src/app.controller.ts',
          lines: [10]
        }
      },
      {
        id: 5,
        title: "Architectural Visualization",
        instruction: "Observe the canvas. Notice the labeled connection between the App and the MathService.",
        explanation: "Our Architect Mode automatically detects message patterns. The indigo 'NATS' edge shows that these two independent services are now perfectly synced!",
      }
    ],
    initialNodes: [
      {
        id: 'main-app',
        type: 'module',
        position: { x: 150, y: 200 },
        data: { 
          label: 'Main App', 
          files: ['src/app.controller.ts', 'src/main.ts']
        }
      },
      {
        id: 'math-service',
        type: 'microservice',
        position: { x: 550, y: 200 },
        data: { 
          label: 'MathService', 
          files: ['src/math-service/math.controller.ts', 'src/math-service/main.ts']
        }
      }
    ],
    initialEdges: [
      { id: 'trans-1', source: 'main-app', target: 'math-service', type: 'transporter', animated: true, label: 'NATS' }
    ]
  }
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
