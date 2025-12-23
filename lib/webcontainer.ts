import { WebContainer } from '@webcontainer/api';
import type { WebContainerProcess, FileSystemTree } from '@webcontainer/api';

let webcontainerInstance: WebContainer | null = null;

export const getWebContainer = async (): Promise<WebContainer | null> => {
  if (typeof window === 'undefined') return null;

  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  try {
    webcontainerInstance = await WebContainer.boot();
    console.log('WebContainer booted successfully');
    return webcontainerInstance;
  } catch (error) {
    console.error('Failed to boot WebContainer:', error);
    return null;
  }
};

const createNestedStructure = (
  files: Record<string, string>
): FileSystemTree => {
  const result: FileSystemTree = {};

  for (const [filePath, content] of Object.entries(files)) {
    const pathParts = filePath.split('/').filter(Boolean);
    let current: FileSystemTree | any = result;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isFile = i === pathParts.length - 1;

      if (isFile) {
        current[part] = {
          file: {
            contents: content,
          },
        };
      } else {
        if (!current[part]) {
          current[part] = {
            directory: {},
          };
        }
        current = (current[part] as { directory: FileSystemTree }).directory;
      }
    }
  }

  return result;
};

export const mountFiles = async (
  files: Record<string, string>
): Promise<WebContainer | null> => {
  const container = await getWebContainer();
  if (!container) return null;

  try {
    const fileSystemTree = createNestedStructure(files);
    await container.mount(fileSystemTree);
    console.log('Files mounted successfully');
    return container;
  } catch (error) {
    console.error('Failed to mount files:', error);
    return null;
  }
};

export const installDependencies = async (
  cwd: string = '.'
): Promise<void> => {
  const container = await getWebContainer();
  if (!container) return;

  try {
    const installProcess = await container.spawn('npm', ['install'], {
      cwd,
    });
    
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log('npm install:', data);
        },
      })
    );

    const exitCode = await installProcess.exit;
    if (exitCode !== 0) {
      throw new Error(`Installation failed with exit code ${exitCode}`);
    }
    
    console.log('Dependencies installed successfully');
  } catch (error) {
    console.error('Failed to install dependencies:', error);
  }
};

export const startServer = async (
  terminal: any,
  cwd: string = '.'
): Promise<WebContainerProcess | null> => {
  const container = await getWebContainer();
  if (!container) return null;

  try {
    const serverProcess = await container.spawn('npm', ['run', 'start'], {
      cwd,
    });

    serverProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal?.writeln?.(data);
        },
      })
    );

    return serverProcess;
  } catch (error) {
    console.error('Failed to start server:', error);
    return null;
  }
};

export const executeCommand = async (
  command: string,
  args: string[] = [],
  cwd: string = '.'
): Promise<WebContainerProcess | null> => {
  const container = await getWebContainer();
  if (!container) return null;

  try {
    const process = await container.spawn(command, args, { cwd });
    return process;
  } catch (error) {
    console.error('Failed to execute command:', error);
    return null;
  }
};

export const readFile = async (path: string): Promise<string> => {
  const container = await getWebContainer();
  if (!container) return '';

  try {
    const content = await container.fs.readFile(path, 'utf-8');
    return content;
  } catch (error) {
    console.error('Failed to read file:', error);
    return '';
  }
};

export const writeFile = async (path: string, content: string): Promise<void> => {
  const container = await getWebContainer();
  if (!container) return;

  try {
    await container.fs.writeFile(path, content);
  } catch (error) {
    console.error('Failed to write file:', error);
  }
};