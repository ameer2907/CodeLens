import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useEffect } from "react";

interface MonacoEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
  highlightedLines?: number[];
}

const LANG_MAP: Record<string, string> = {
  Python: "python",
  JavaScript: "javascript",
  Java: "java",
  "C++": "cpp",
  TypeScript: "typescript",
  Go: "go",
  Rust: "rust",
  Ruby: "ruby",
};

const MonacoEditor = ({ code, language, onChange, highlightedLines = [] }: MonacoEditorProps) => {
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<any[]>([]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme("codelens-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "60a5fa" },
        { token: "string", foreground: "34d399" },
        { token: "number", foreground: "f59e0b" },
        { token: "type", foreground: "a78bfa" },
      ],
      colors: {
        "editor.background": "#0c1222",
        "editor.foreground": "#e2e8f0",
        "editor.lineHighlightBackground": "#1e3a5f40",
        "editorLineNumber.foreground": "#475569",
        "editorLineNumber.activeForeground": "#60a5fa",
        "editor.selectionBackground": "#2563eb40",
        "editorCursor.foreground": "#60a5fa",
      },
    });
    monaco.editor.setTheme("codelens-dark");
  };

  useEffect(() => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    // Clear old decorations
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      highlightedLines.map((line) => ({
        range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1 },
        options: {
          isWholeLine: true,
          className: "highlighted-line",
          glyphMarginClassName: "highlighted-glyph",
        },
      }))
    );
  }, [highlightedLines]);

  return (
    <div className="rounded-xl overflow-hidden border border-border h-full">
      <Editor
        height="100%"
        language={LANG_MAP[language] || "python"}
        value={code}
        onChange={(v) => onChange(v || "")}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          lineNumbers: "on",
          renderLineHighlight: "all",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          automaticLayout: true,
          wordWrap: "on",
        }}
      />
    </div>
  );
};

export default MonacoEditor;
