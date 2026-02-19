import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result.startsWith("data:application/octet-stream") && file.type) {
        resolve(
          result.replace("data:application/octet-stream", `data:${file.type}`)
        );
      } else {
        resolve(result);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

interface Props {
  doCreate: (
    images: string[],
    inputMode: "image" | "video",
    textPrompt?: string
  ) => void;
  doCreateFromText: (text: string) => void;
}

function SidebarUpload({ doCreate, doCreateFromText }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [textPrompt, setTextPrompt] = useState("");
  const [mode, setMode] = useState<"image" | "text">("image");
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    try {
      const url = await fileToDataURL(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDataUrl(url);
      setMode("image");
    } catch {
      toast.error("Error reading file.");
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    maxFiles: 1,
    maxSize: 1024 * 1024 * 20,
    noClick: true,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    onDrop: handleDrop,
  });

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setDataUrl(null);
  };

  const handleGenerate = () => {
    if (mode === "text" && textPrompt.trim()) {
      doCreateFromText(textPrompt);
    } else if (dataUrl) {
      doCreate([dataUrl], "image", textPrompt);
    } else {
      toast.error("Upload a screenshot or enter a text description.");
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Theme Reference
      </h3>

      {/* Mode toggle */}
      <div className="flex gap-1 text-xs">
        <button
          onClick={() => setMode("image")}
          className={`px-2 py-1 rounded ${
            mode === "image"
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          Screenshot
        </button>
        <button
          onClick={() => setMode("text")}
          className={`px-2 py-1 rounded ${
            mode === "text"
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          Text
        </button>
      </div>

      {mode === "image" && (
        <>
          {!previewUrl ? (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              onClick={open}
            >
              <input {...getInputProps()} />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Drop a theme screenshot here or click to browse
              </p>
            </div>
          ) : (
            <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <img
                src={previewUrl}
                alt="Theme reference"
                className="w-full max-h-[200px] object-contain bg-gray-50 dark:bg-zinc-900"
              />
              <button
                onClick={handleClear}
                className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Remove screenshot"
              >
                <Cross2Icon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}

          <Textarea
            value={textPrompt}
            onChange={(e) => setTextPrompt(e.target.value)}
            placeholder="Additional style instructions (optional)..."
            className="text-xs min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
        </>
      )}

      {mode === "text" && (
        <Textarea
          ref={textRef}
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
          placeholder="Describe the theme you want (e.g., 'minimal dark portfolio with large typography')..."
          className="text-xs min-h-[100px] resize-y"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />
      )}

      <Button onClick={handleGenerate} className="w-full" size="sm">
        Generate Theme
      </Button>
    </div>
  );
}

export default SidebarUpload;
