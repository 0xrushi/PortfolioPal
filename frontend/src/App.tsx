import { useEffect, useMemo, useRef, useState } from "react";
import { generateCode } from "./generateCode";
import SettingsDialog from "./components/settings/SettingsDialog";
import { AppState, CodeGenerationParams, EditorTheme, Settings } from "./types";
import { API_KEY_DAILY_GENERATION_LIMIT, IS_RUNNING_ON_CLOUD } from "./config";
import { PicoBadge } from "./components/messages/PicoBadge";
import { OnboardingNote } from "./components/messages/OnboardingNote";
import { usePersistedState } from "./hooks/usePersistedState";
import TermsOfServiceDialog from "./components/TermsOfServiceDialog";
import { USER_CLOSE_WEB_SOCKET_CODE } from "./constants";
import { extractHistory } from "./components/history/utils";
import toast from "react-hot-toast";
import { Stack } from "./lib/stacks";
import { CodeGenerationModel } from "./lib/models";
import useBrowserTabIndicator from "./hooks/useBrowserTabIndicator";
// import TipLink from "./components/messages/TipLink";
import { useAppStore } from "./store/app-store";
import { useProjectStore } from "./store/project-store";
import Sidebar from "./components/sidebar/Sidebar";
import CollapsibleSidebar from "./components/sidebar/CollapsibleSidebar";
import PreviewPane from "./components/preview/PreviewPane";
import { Commit } from "./components/commits/types";
import { createCommit } from "./components/commits/utils";
import PortfolioEditor from "./components/portfolio/PortfolioEditor";
import SidebarUpload from "./components/portfolio/SidebarUpload";
import ThemeHistoryPage from "./components/portfolio/ThemeHistoryPage";
import { buildDefaultPortfolioHtml } from "./components/preview/defaultPortfolioHtml";
import { HTTP_BACKEND_URL } from "./config";
import ClippyAssistant from "./components/portfolio/ClippyAssistant";
import { FaCompress, FaExpand } from "react-icons/fa";
import { tryConsumeApiKeyGeneration } from "./lib/apiKeyDailyGenerationCounter";
import { injectHashNavFix } from "./lib/injectHashNavFix";


function App() {
  const {
    // Inputs
    inputMode,
    setInputMode,
    isImportedFromCode,
    setIsImportedFromCode,
    referenceImages,
    setReferenceImages,
    initialPrompt,
    setInitialPrompt,

    head,
    commits,
    addCommit,
    removeCommit,
    setHead,
    appendCommitCode,
    appendVariantThinking,
    setCommitCode,
    resetCommits,
    resetHead,
    updateVariantStatus,
    resizeVariants,

    // Outputs
    appendExecutionConsole,
    resetExecutionConsoles,
  } = useProjectStore();

  const {
    disableInSelectAndEditMode,
    setUpdateInstruction,
    updateImages,
    setUpdateImages,
    appState,
    setAppState,
  } = useAppStore();

  // Settings
  const [settings, setSettings] = usePersistedState<Settings>(
    {
      openAiApiKey: null,
      openAiBaseURL: null,
      anthropicApiKey: null,
      screenshotOneApiKey: null,
      isImageGenerationEnabled: true,
      editorTheme: EditorTheme.COBALT,
      generatedCodeConfig: Stack.ASTRO_BLOG,
      codeGenerationModel: CodeGenerationModel.CLAUDE_4_5_SONNET_2025_09_29,
      // Only relevant for hosted version
      isTermOfServiceAccepted: false,
    },
    "setting"
  );

  const wsRef = useRef<WebSocket>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPortfolioHtml, setCurrentPortfolioHtml] = useState("");
  const [isPortfolioFullscreen, setIsPortfolioFullscreen] = useState(true);
  const [showClippyAssistant, setShowClippyAssistant] = useState(true);

  const isAstroBlog = settings.generatedCodeConfig === Stack.ASTRO_BLOG;

  const portfolioHtmlWithHashFix = useMemo(
    () => injectHashNavFix(currentPortfolioHtml),
    [currentPortfolioHtml]
  );

  // Fetch the saved portfolio HTML on mount, falling back to a default
  // page built from portfolio.json data.
  useEffect(() => {
    fetch(`${HTTP_BACKEND_URL}/api/themes/current`)
      .then((r) => r.json())
      .then((data) => {
        if (data.html) {
          setCurrentPortfolioHtml(data.html);
          return;
        }
        // No saved theme — build default from portfolio data
        return fetch(`${HTTP_BACKEND_URL}/api/portfolio`)
          .then((r) => r.json())
          .then((portfolio) => setCurrentPortfolioHtml(buildDefaultPortfolioHtml(portfolio)));
      })
      .catch(() => {
        // Backend unreachable — try portfolio data alone
        fetch(`${HTTP_BACKEND_URL}/api/portfolio`)
          .then((r) => r.json())
          .then((portfolio) => setCurrentPortfolioHtml(buildDefaultPortfolioHtml(portfolio)))
          .catch(() => {});
      });
  }, []);

  // Indicate coding state using the browser tab's favicon and title
  useBrowserTabIndicator(appState === AppState.CODING);

  // When the user already has the settings in local storage, newly added keys
  // do not get added to the settings so if it's falsy, we populate it with the default
  // value
  useEffect(() => {
    if (!settings.generatedCodeConfig) {
      setSettings((prev) => ({
        ...prev,
        generatedCodeConfig: Stack.ASTRO_BLOG,
      }));
    }
  }, [settings.generatedCodeConfig, setSettings]);

  useEffect(() => {
    if (settings.generatedCodeConfig !== Stack.ASTRO_BLOG) {
      setSettings((prev) => ({
        ...prev,
        generatedCodeConfig: Stack.ASTRO_BLOG,
      }));
    }
  }, [settings.generatedCodeConfig, setSettings]);

  // Functions
  const reset = () => {
    setAppState(AppState.INITIAL);
    setIsPortfolioFullscreen(true);
    setShowClippyAssistant(true);
    setUpdateInstruction("");
    setUpdateImages([]);
    disableInSelectAndEditMode();
    resetExecutionConsoles();

    resetCommits();
    resetHead();

    // Inputs
    setInputMode("image");
    setReferenceImages([]);
    setIsImportedFromCode(false);
  };

  const regenerate = () => {
    if (head === null) {
      toast.error(
        "No current version set. Please contact support via chat or Github."
      );
      throw new Error("Regenerate called with no head");
    }

    // Retrieve the previous command
    const currentCommit = commits[head];
    if (currentCommit.type !== "ai_create") {
      toast.error("Only the first version can be regenerated.");
      return;
    }

    // Re-run the create
    if (inputMode === "image" || inputMode === "video") {
      doCreate(referenceImages, inputMode);
    } else {
      // TODO: Fix this
      doCreateFromText(initialPrompt);
    }
  };

  // Used when the user cancels the code generation
  const cancelCodeGeneration = () => {
    wsRef.current?.close?.(USER_CLOSE_WEB_SOCKET_CODE);
  };

  // Used for code generation failure as well
  const cancelCodeGenerationAndReset = (commit: Commit) => {
    // When the current commit is the first version, reset the entire app state
    if (commit.type === "ai_create") {
      reset();
    } else {
      // Otherwise, remove current commit from commits
      removeCommit(commit.hash);

      // Revert to parent commit
      const parentCommitHash = commit.parentHash;
      if (parentCommitHash) {
        setHead(parentCommitHash);
      } else {
        throw new Error("Parent commit not found");
      }

      setAppState(AppState.CODE_READY);
    }
  };

  function doGenerateCode(params: CodeGenerationParams) {
    if (IS_RUNNING_ON_CLOUD && settings.openAiApiKey) {
      const canGenerate = tryConsumeApiKeyGeneration();
      if (!canGenerate) {
        toast.error(
          `Daily API key limit reached. You can only run ${API_KEY_DAILY_GENERATION_LIMIT} generations per day with your API key.`
        );
        return;
      }
    }

    // Reset the execution console
    resetExecutionConsoles();

    // Set the app state to coding during generation
    setAppState(AppState.CODING);

    // Merge settings with params
    const updatedParams = { ...params, ...settings };

    // Create variants dynamically - start with 4 to handle most cases
    // Backend will use however many it needs (typically 3)
    const baseCommitObject = {
      variants: Array(4)
        .fill(null)
        .map(() => ({ code: "" })),
    };

    const commitInputObject =
      params.generationType === "create"
        ? {
            ...baseCommitObject,
            type: "ai_create" as const,
            parentHash: null,
            inputs: params.prompt,
          }
        : {
            ...baseCommitObject,
            type: "ai_edit" as const,
            parentHash: head,
            inputs: params.history
              ? params.history[params.history.length - 1]
              : { text: "", images: [] },
          };

    // Create a new commit and set it as the head
    const commit = createCommit(commitInputObject);
    addCommit(commit);
    setHead(commit.hash);

    generateCode(wsRef, updatedParams, {
      onChange: (token, variantIndex) => {
        appendCommitCode(commit.hash, variantIndex, token);
      },
      onSetCode: (code, variantIndex) => {
        setCommitCode(commit.hash, variantIndex, code);
      },
      onStatusUpdate: (line, variantIndex) =>
        appendExecutionConsole(variantIndex, line),
      onVariantComplete: (variantIndex) => {
        console.log(`Variant ${variantIndex} complete event received`);
        updateVariantStatus(commit.hash, variantIndex, "complete");
      },
      onVariantError: (variantIndex, error) => {
        console.error(`Error in variant ${variantIndex}:`, error);
        updateVariantStatus(commit.hash, variantIndex, "error", error);
      },
      onVariantCount: (count) => {
        console.log(`Backend is using ${count} variants`);
        resizeVariants(commit.hash, count);
      },
      onThinking: (content, variantIndex) => {
        appendVariantThinking(commit.hash, variantIndex, content);
      },
      onCancel: () => {
        cancelCodeGenerationAndReset(commit);
      },
      onComplete: () => {
        setAppState(AppState.CODE_READY);
      },
    });
  }

  // Initial version creation
  function doCreate(
    referenceImages: string[],
    inputMode: "image" | "video",
    textPrompt: string = ""
  ) {
    // Reset any existing state
    reset();

    // Set the input states
    setReferenceImages(referenceImages);
    setInputMode(inputMode);

    // Kick off the code generation
    if (referenceImages.length > 0) {
      const images =
        inputMode === "video" ? [referenceImages[0]] : referenceImages;
      doGenerateCode({
        generationType: "create",
        inputMode,
        prompt: { text: textPrompt, images },
      });
    }
  }

  function doCreateFromText(text: string) {
    // Reset any existing state
    reset();

    setInputMode("text");
    setInitialPrompt(text);
    doGenerateCode({
      generationType: "create",
      inputMode: "text",
      prompt: { text, images: [] },
    });
  }

  // Subsequent updates
  async function doUpdate(
    updateInstruction: string,
    selectedElement?: HTMLElement
  ) {
    if (updateInstruction.trim() === "") {
      toast.error("Please include some instructions for AI on what to update.");
      return;
    }

    if (head === null) {
      toast.error(
        "No current version set. Contact support or open a Github issue."
      );
      throw new Error("Update called with no head");
    }

    let historyTree;
    try {
      historyTree = extractHistory(head, commits);
    } catch {
      toast.error(
        "Version history is invalid. This shouldn't happen. Please contact support or open a Github issue."
      );
      throw new Error("Invalid version history");
    }

    let modifiedUpdateInstruction = updateInstruction;

    // Send in a reference to the selected element if it exists
    if (selectedElement) {
      modifiedUpdateInstruction =
        updateInstruction +
        " referring to this element specifically: " +
        selectedElement.outerHTML;
    }

    const updatedHistory = [
      ...historyTree,
      { text: modifiedUpdateInstruction, images: updateImages },
    ];

    doGenerateCode({
      generationType: "update",
      inputMode,
      prompt:
        inputMode === "text"
          ? { text: initialPrompt, images: [] }
          : { text: "", images: [referenceImages[0]] },
      history: updatedHistory,
      isImportedFromCode,
    });

    setUpdateInstruction("");
    setUpdateImages([]);
  }

  const handleTermDialogOpenChange = (open: boolean) => {
    setSettings((s) => ({
      ...s,
      isTermOfServiceAccepted: !open,
    }));
  };

  const isAstroInitialView = isAstroBlog && appState === AppState.INITIAL;
  const showFullscreenPortfolio = isAstroInitialView && isPortfolioFullscreen;

  return (
    <div className="mt-2 dark:bg-black dark:text-white">
      {IS_RUNNING_ON_CLOUD && <PicoBadge />}
      {IS_RUNNING_ON_CLOUD && (
        <TermsOfServiceDialog
          open={!settings.isTermOfServiceAccepted}
          onOpenChange={handleTermDialogOpenChange}
        />
      )}
      {!showFullscreenPortfolio && (
        <CollapsibleSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <div className="flex items-center justify-between mt-10 mb-2">
            <h1 className="text-2xl ">PortfolioPal</h1>
            <SettingsDialog settings={settings} setSettings={setSettings} />
          </div>

          {IS_RUNNING_ON_CLOUD && !settings.openAiApiKey && <OnboardingNote />}

          <>
            <SidebarUpload
              doCreate={doCreate}
              doCreateFromText={doCreateFromText}
              openAiApiKey={settings.openAiApiKey}
            />
            <PortfolioEditor />
          </>

          {(appState === AppState.CODING || appState === AppState.CODE_READY) && (
            <Sidebar
              showSelectAndEditFeature={false}
              doUpdate={doUpdate}
              regenerate={regenerate}
              cancelCodeGeneration={cancelCodeGeneration}
            />
          )}
        </CollapsibleSidebar>
      )}

      <main
        className={`transition-all duration-300 ${
          showFullscreenPortfolio ? "py-0" : "py-2"
        } ${showFullscreenPortfolio || sidebarCollapsed ? "lg:pl-0" : "lg:pl-96"}`}
      >
        {showFullscreenPortfolio && (
          <div className="relative h-[calc(100vh-1.5rem)]">
              <iframe
                srcDoc={portfolioHtmlWithHashFix}
                className="w-full h-full border-0"
                title="Portfolio Preview"
                sandbox="allow-scripts allow-same-origin"
            />
            <button
              className="absolute right-5 top-5 z-20 rounded-md border border-slate-300 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
              onClick={() => setIsPortfolioFullscreen(false)}
              title="Show workspace"
              aria-label="Show workspace"
            >
              <FaCompress size={14} />
            </button>
            {showClippyAssistant && (
              <ClippyAssistant
                onDismiss={() => setShowClippyAssistant(false)}
                onZoomOut={() => setIsPortfolioFullscreen(false)}
              />
            )}
          </div>
        )}

        {isAstroInitialView && !showFullscreenPortfolio && (
          <div className="flex flex-col">
            <div className="mx-4 mt-2 flex items-center justify-end">
              <button
                className="rounded-md border border-slate-300 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
                onClick={() => {
                  setIsPortfolioFullscreen(true);
                  setShowClippyAssistant(true);
                }}
                title="Fullscreen preview"
                aria-label="Fullscreen preview"
              >
                <FaExpand size={14} />
              </button>
            </div>
            <div className="h-[58vh] mx-4 mt-2">
              <iframe
                srcDoc={portfolioHtmlWithHashFix}
                className="w-full h-full border border-gray-200 rounded-lg"
                title="Portfolio Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
            <ThemeHistoryPage />
          </div>
        )}

        {(appState === AppState.CODING || appState === AppState.CODE_READY) && (
          <PreviewPane doUpdate={doUpdate} reset={reset} settings={settings} />
        )}
      </main>
    </div>
  );
}

export default App;
