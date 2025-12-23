'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { WebContainer } from '@webcontainer/api';
import { startServer, getWebContainer } from '@/lib/webcontainer';
import { useLessonStore } from '@/store/lessonStore';
import { Button } from './ui/button';
import { PlayCircle, Square } from 'lucide-react';

interface TerminalProps {
  className?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ className }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const processRef = useRef<any>(null);
  
  const { isRunning, setIsRunning, setServerStarted, currentLesson } = useLessonStore();

  useEffect(() => {
    if (!terminalRef.current) return;

    const terminal = new XTerm({
      theme: {
        background: '#0f172a',
        foreground: '#e2e8f0',
        cursor: '#e2e8f0',
        black: '#000000',
        red: '#e06c75',
        green: '#98c379',
        yellow: '#d19a66',
        blue: '#61afef',
        magenta: '#c678dd',
        cyan: '#56b6c2',
        white: '#abb2bf',
        brightBlack: '#5c6370',
        brightRed: '#e06c75',
        brightGreen: '#98c379',
        brightYellow: '#d19a66',
        brightBlue: '#61afef',
        brightMagenta: '#c678dd',
        brightCyan: '#56b6c2',
        brightWhite: '#ffffff',
      },
      fontSize: 13,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    terminal.writeln('🚀 NestQuest Terminal Ready');
    terminal.writeln('Click "Run Server" to start your NestJS application');
    terminal.writeln('');

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      terminal.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      fitAddonRef.current?.fit();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRunServer = async () => {
    if (!xtermRef.current) return;

    const terminal = xtermRef.current;
    
    if (isRunning) {
      if (processRef.current) {
        processRef.current.kill();
        processRef.current = null;
      }
      setIsRunning(false);
      setServerStarted(false);
      terminal.writeln('');
      terminal.writeln('Server stopped');
      terminal.writeln('');
      return;
    }

    terminal.writeln('');
    terminal.writeln('🔧 Installing dependencies...');
    terminal.writeln('');
    setIsRunning(true);

    try {
      const container = await getWebContainer();
      if (!container) {
        terminal.writeln('❌ Failed to initialize WebContainer');
        setIsRunning(false);
        return;
      }

      terminal.writeln('✅ WebContainer ready');
      terminal.writeln('');
      terminal.writeln('$ npm install');

      const installProcess = await container.spawn('npm', ['install']);
      
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );

      const exitCode = await installProcess.exit;
      if (exitCode !== 0) {
        terminal.writeln(`❌ Installation failed with exit code ${exitCode}`);
        setIsRunning(false);
        return;
      }

      terminal.writeln('');
      terminal.writeln('✅ Dependencies installed');
      terminal.writeln('');
      terminal.writeln('$ npm run start');
      terminal.writeln('');

      const serverProcess = await container.spawn('npm', ['run', 'start'], {
        cwd: '.',
      });

      processRef.current = serverProcess;

      serverProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.writeln(data);
            if (data.includes('Nest application successfully started')) {
              setServerStarted(true);
              useLessonStore.getState().checkValidation();
            }
          },
        })
      );

    } catch (error) {
      terminal.writeln('❌ Error running server');
      console.error('Failed to run server:', error);
      setIsRunning(false);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700 ${className || ''}`}>
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <Button
          onClick={handleRunServer}
          variant={isRunning ? "destructive" : "default"}
          size="sm"
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <Square className="w-4 h-4" />
              Stop Server
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4" />
              Run Server
            </>
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <div ref={terminalRef} className="h-full w-full" />
      </div>
    </div>
  );
};