import { useMemo, useState } from "react";
import { FaCopy, FaFile } from "react-icons/fa";
import { Settings } from "../../types";
import CodeMirror from "./CodeMirror";
import { Button } from "../ui/button";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";

interface AstroFile {
  path: string;
  content: string;
}

function parseAstroFiles(code: string): AstroFile[] {
  const pattern = /---\s*FILE:\s*(.+?)\s*---/;
  const parts = code.split(pattern);

  if (parts.length < 3) {
    return [{ path: "output.astro", content: code.trim() }];
  }

  const files: AstroFile[] = [];
  for (let i = 1; i < parts.length; i += 2) {
    const path = parts[i].trim();
    const content = parts[i + 1]?.trim() || "";
    files.push({ path, content });
  }
  return files;
}

interface Props {
  code: string;
  settings: Settings;
}

function AstroFileViewer({ code, settings }: Props) {
  const files = useMemo(() => parseAstroFiles(code), [code]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedFile = files[selectedIndex] || files[0];

  const copyAll = () => {
    copy(code);
    toast.success("All files copied to clipboard");
  };

  const copyCurrentFile = () => {
    if (selectedFile) {
      copy(selectedFile.content);
      toast.success(`${selectedFile.path} copied to clipboard`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 mb-2">
        <Button
          onClick={copyCurrentFile}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <FaCopy /> Copy File
        </Button>
        <Button
          onClick={copyAll}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <FaCopy /> Copy All
        </Button>
        <span className="text-xs text-gray-500 ml-auto">
          {files.length} file{files.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* File tree */}
        <div className="w-56 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-zinc-900">
          <div className="p-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            Files
          </div>
          {files.map((file, index) => (
            <button
              key={file.path}
              onClick={() => setSelectedIndex(index)}
              className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 ${
                index === selectedIndex
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <FaFile className="flex-shrink-0 text-[10px]" />
              <span className="truncate">{file.path}</span>
            </button>
          ))}
        </div>

        {/* Code viewer */}
        <div className="flex-1 min-w-0">
          {selectedFile && (
            <div className="h-full">
              <div className="px-3 py-1.5 text-xs text-gray-500 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-700">
                {selectedFile.path}
              </div>
              <CodeMirror
                code={selectedFile.content}
                editorTheme={settings.editorTheme}
                onCodeChange={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AstroFileViewer;
