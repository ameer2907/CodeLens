import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";

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
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<any[]>([]);
  const { theme } = useTheme();

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

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

    monaco.editor.defineTheme("codelens-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "2563eb" },
        { token: "string", foreground: "059669" },
        { token: "number", foreground: "d97706" },
        { token: "type", foreground: "7c3aed" },
      ],
      colors: {
        "editor.background": "#f8fafc",
        "editor.foreground": "#1e293b",
        "editor.lineHighlightBackground": "#e0e7ff60",
        "editorLineNumber.foreground": "#94a3b8",
        "editorLineNumber.activeForeground": "#2563eb",
        "editor.selectionBackground": "#bfdbfe60",
        "editorCursor.foreground": "#2563eb",
      },
    });

    monaco.editor.setTheme(theme === "dark" ? "codelens-dark" : "codelens-light");
  };

  // Switch theme when context changes
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(theme === "dark" ? "codelens-dark" : "codelens-light");
    }
  }, [theme]);

  useEffect(() => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      highlightedLines.map((line) => ({
        range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1 },
        options: {
          isWholeLine: true,
          className: "highlighted-line line-glow",
          glyphMarginClassName: "highlighted-glyph",
        },
      }))
    );
  }, [highlightedLines]);

  return (
    <div className="overflow-hidden border-0 h-full">
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
