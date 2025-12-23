'use client';

import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useLessonStore } from '@/store/lessonStore';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CodeEditorProps {
  className?: string;
}

const fileLanguageMap: Record<string, string> = {
  '.ts': 'typescript',
  '.js': 'javascript',
  '.json': 'json',
  '.md': 'markdown',
  '.html': 'html',
  '.css': 'css',
};

const getLanguageFromFilePath = (filePath: string): string => {
  const extension = filePath.substring(filePath.lastIndexOf('.'));
  return fileLanguageMap[extension] || 'typescript';
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ className }) => {
  const { codeFiles, currentFile, updateCode } = useLessonStore();
  const [copied, setCopied] = React.useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    monaco.editor.defineTheme('cyberpunk', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6d7a8d' },
        { token: 'keyword', foreground: 'c792ea', fontStyle: 'bold' },
        { token: 'string', foreground: 'c3e88d' },
        { token: 'number', foreground: 'f78c6c' },
        { token: 'type', foreground: 'ffcb6b' },
        { token: 'function', foreground: '82aaff' },
        { token: 'variable', foreground: 'f07178' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#1e293b',
        'editorLineNumber.foreground': '#64748b',
        'editor.selectionBackground': '#7c3aed40',
        'editor.inactiveSelectionBackground': '#7c3aed20',
        'editorCursor.foreground': '#c792ea',
        'editorWhitespace.foreground': '#334155',
        'editorIndentGuide.background': '#374151',
        'editorIndentGuide.activeBackground': '#9ca3af',
      },
    });
    
    monaco.editor.setTheme('cyberpunk');
  };

  const handleCopy = async () => {
    if (currentFile && codeFiles[currentFile]) {
      await navigator.clipboard.writeText(codeFiles[currentFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (newFile: string) => {
    useLessonStore.getState().setCurrentFile(newFile);
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined && currentFile) {
      updateCode(currentFile, value);
    }
  };

  const fileOptions = Object.keys(codeFiles);

  return (
    <div className={`flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700 ${className || ''}`}>
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <select
            value={currentFile}
            onChange={(e) => handleFileChange(e.target.value)}
            className="bg-slate-800 text-slate-200 text-sm rounded-md px-2 py-1 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {fileOptions.map((file) => (
              <option key={file} value={file} className="bg-slate-800">
                {file}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-200"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getLanguageFromFilePath(currentFile)}
          value={codeFiles[currentFile] || ''}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme="cyberpunk"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            folding: true,
            lineDecorationsWidth: 0,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
          }}
        />
      </div>
    </div>
  );
};