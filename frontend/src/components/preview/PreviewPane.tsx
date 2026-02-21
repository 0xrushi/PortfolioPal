import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  FaUndo,
  FaDownload,
  FaDesktop,
  FaMobile,
  FaCode,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { LuExternalLink, LuRefreshCw } from "react-icons/lu";
import { AppState, Settings } from "../../types";
import CodeTab from "./CodeTab";
import { Button } from "../ui/button";
import { useAppStore } from "../../store/app-store";
import { useProjectStore } from "../../store/project-store";
import { extractHtml } from "./extractHtml";
import PreviewComponent from "./PreviewComponent";
import { downloadCode } from "./download";
import { Stack } from "../../lib/stacks";
import SaveThemeDialog from "../portfolio/SaveThemeDialog";
import useThrottle from "../../hooks/useThrottle";
import { injectHashNavFix } from "../../lib/injectHashNavFix";
import { HTTP_BACKEND_URL } from "../../config";


const EXTERNAL_LINKS_SCRIPT = `<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href]').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href && !href.startsWith('#')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
});
</script>`;

function injectExternalLinkTargets(code: string): string {
  if (code.includes('</body>')) {
    return code.replace('</body>', EXTERNAL_LINKS_SCRIPT + '</body>');
  }
  return code + EXTERNAL_LINKS_SCRIPT;
}

function openInNewTab(code: string) {
  const newWindow = window.open("", "_blank");
  if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(code);
    newWindow.document.close();
  }
}

interface Props {
  doUpdate: (instruction: string) => void;
  reset: () => void;
  settings: Settings;
}

function PreviewPane({ doUpdate, reset, settings }: Props) {
  const { appState } = useAppStore();
  const { inputMode, head, commits } = useProjectStore();
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentCommit = head && commits[head] ? commits[head] : "";
  const currentCode = currentCommit
    ? currentCommit.variants[currentCommit.selectedVariantIndex].code
    : "";

  const previewCode = injectExternalLinkTargets(
    inputMode === "video" && appState === AppState.CODING
      ? extractHtml(currentCode)
      : currentCode
  );

  const isAstroBlog = settings.generatedCodeConfig === Stack.ASTRO_BLOG;
  const isReady = appState === AppState.CODE_READY;

  const throttledCode = useThrottle(previewCode, 200);

  useEffect(() => {
    if (!isAstroBlog || !iframeRef.current) return;
    const fixedCode = injectHashNavFix(throttledCode);
    if (iframeRef.current.srcdoc !== fixedCode) {
      iframeRef.current.srcdoc = fixedCode;
    }
  }, [isAstroBlog, throttledCode]);

  // Auto-log every completed generation (no auth needed)
  const loggedCodeRef = useRef<string>("");
  useEffect(() => {
    if (!isReady || !previewCode || previewCode === loggedCodeRef.current) return;
    loggedCodeRef.current = previewCode;
    fetch(`${HTTP_BACKEND_URL}/api/themes/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: previewCode, theme_name: "untitled", saved: false }),
    }).catch(() => {});
  }, [isReady, previewCode]);

  const refreshPreview = () => {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      if (iframe.srcdoc) {
        const content = iframe.srcdoc;
        iframe.srcdoc = "";
        iframe.srcdoc = content;
      }
    });
  };

  if (isAstroBlog) {
    return (
      <div className="relative h-[calc(100vh-1rem)]">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          {/* Floating controls - always visible at top right */}
          <div className="absolute top-3 right-6 z-20 flex items-center gap-2">
            {isReady && (
              <SaveThemeDialog code={previewCode} />
            )}
            <Button
              onClick={() => setToolbarOpen(!toolbarOpen)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md border-gray-300 dark:border-gray-600"
            >
              {toolbarOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
              Tools
            </Button>
          </div>

          {/* Collapsible toolbar - slides down */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              toolbarOpen ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex justify-between px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-x-2">
                {isReady && (
                  <>
                    <Button
                      onClick={reset}
                      className="flex items-center gap-x-2 dark:text-white dark:bg-gray-700"
                      size="sm"
                    >
                      <FaUndo />
                      Reset
                    </Button>
                    <Button
                      onClick={() => downloadCode(previewCode)}
                      variant="secondary"
                      className="flex items-center gap-x-2 dark:text-white dark:bg-gray-700"
                      size="sm"
                    >
                      <FaDownload /> Download
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="preview" title="Preview">
                    <FaDesktop />
                  </TabsTrigger>
                  <TabsTrigger value="code" title="Code">
                    <FaCode />
                  </TabsTrigger>
                </TabsList>
                <Button
                  onClick={() => openInNewTab(previewCode)}
                  variant="ghost"
                  size="icon"
                  title="Open in New Tab"
                >
                  <LuExternalLink />
                </Button>
                <Button
                  onClick={refreshPreview}
                  variant="ghost"
                  size="icon"
                  title="Refresh Preview"
                >
                  <LuRefreshCw />
                </Button>
              </div>
            </div>
          </div>

          {/* Full-height preview iframe */}
          <TabsContent value="preview" className="mt-0 flex-1 min-h-0">
            <iframe
              ref={iframeRef}
              title="Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          </TabsContent>
          <TabsContent value="code" className="mt-0 flex-1 min-h-0 overflow-auto">
            <CodeTab
              code={previewCode}
              setCode={() => {}}
              settings={settings}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Non-astro stacks
  return (
    <div className="ml-4">
      <Tabs defaultValue="desktop">
        <div className="flex justify-between mr-8 mb-4">
          <div className="flex items-center gap-x-2">
            {isReady && (
              <>
                <Button
                  onClick={reset}
                  className="flex items-center ml-4 gap-x-2 dark:text-white dark:bg-gray-700"
                >
                  <FaUndo />
                  Reset
                </Button>
                <Button
                  onClick={() => downloadCode(previewCode)}
                  variant="secondary"
                  className="flex items-center gap-x-2 mr-4 dark:text-white dark:bg-gray-700 download-btn"
                  data-testid="download-code"
                >
                  <FaDownload /> Download Code
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isReady && (
              <SaveThemeDialog code={previewCode} />
            )}
            <TabsList>
              <TabsTrigger value="desktop" title="Desktop" data-testid="tab-desktop">
                <FaDesktop />
              </TabsTrigger>
              <TabsTrigger value="mobile" title="Mobile" data-testid="tab-mobile">
                <FaMobile />
              </TabsTrigger>
              <TabsTrigger value="code" title="Code" data-testid="tab-code">
                <FaCode />
              </TabsTrigger>
            </TabsList>
            <Button
              onClick={() => openInNewTab(previewCode)}
              variant="ghost"
              size="icon"
              title="Open in New Tab"
            >
              <LuExternalLink />
            </Button>
            <Button
              onClick={refreshPreview}
              variant="ghost"
              size="icon"
              title="Refresh Preview"
            >
              <LuRefreshCw />
            </Button>
          </div>
        </div>
        <TabsContent value="desktop">
          <PreviewComponent
            code={previewCode}
            device="desktop"
            doUpdate={doUpdate}
          />
        </TabsContent>
        <TabsContent value="mobile">
          <PreviewComponent
            code={previewCode}
            device="mobile"
            doUpdate={doUpdate}
          />
        </TabsContent>
        <TabsContent value="code">
          <CodeTab
            code={previewCode}
            setCode={() => {}}
            settings={settings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PreviewPane;
