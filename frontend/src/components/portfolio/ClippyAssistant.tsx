interface ClippyAssistantProps {
  onDismiss: () => void;
  onZoomOut: () => void;
}

export default function ClippyAssistant({
  onDismiss,
  onZoomOut,
}: ClippyAssistantProps) {
  return (
    <div className="pointer-events-none absolute bottom-6 right-6 z-30 animate-[clippyEnter_360ms_ease-out]">
      <div className="pointer-events-auto flex items-end gap-3">
        <div className="relative max-w-xs rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.7)]">
          <button
            onClick={onDismiss}
            className="absolute right-2 top-2 h-6 w-6 rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close assistant"
          >
            x
          </button>
          <p className="pr-6 text-sm font-medium text-slate-700">
            I&apos;m finally building my portfolio!
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Click the top-right button - or tap me - to zoom out and vibe your
            portfolio.
          </p>
          <div className="absolute -bottom-2 right-10 h-4 w-4 rotate-45 border-b border-r border-slate-300 bg-white" />
        </div>

        <button
          onClick={onZoomOut}
          className="h-24 w-24 cursor-pointer rounded-full drop-shadow-[0_12px_14px_rgba(30,64,175,0.22)]"
          aria-label="Show workspace"
          title="Show workspace"
        >
          <svg
            viewBox="0 0 180 200"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Paperclip assistant"
          >
            <defs>
              <linearGradient id="clipStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8bb7ff" />
                <stop offset="55%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="clipHighlight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            <ellipse cx="90" cy="178" rx="44" ry="10" fill="#bfdbfe" opacity="0.55" />

            <path
              d="M131 45c17 14 20 38 6 54l-34 40c-11 13-31 14-44 3-13-11-15-30-3-44l34-39c8-10 24-11 34-2 10 9 12 23 4 33l-31 35c-6 8-17 9-25 3s-10-17-3-25l26-30"
              fill="none"
              stroke="url(#clipStroke)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M127 49c12 10 14 28 4 40L96 129c-8 10-23 11-33 3-10-8-11-23-3-33l34-39c5-6 13-8 21-5"
              fill="none"
              stroke="url(#clipHighlight)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle cx="94" cy="74" r="12" fill="#f8fafc" stroke="#1e40af" strokeWidth="2.5" />
            <circle cx="116" cy="93" r="11" fill="#f8fafc" stroke="#1e40af" strokeWidth="2.5" />
            <circle cx="95" cy="75" r="4.2" fill="#1e293b" />
            <circle cx="116" cy="94" r="4" fill="#1e293b" />
            <circle cx="97" cy="72" r="1.5" fill="#ffffff" />
            <circle cx="118" cy="91" r="1.4" fill="#ffffff" />
          </svg>
        </button>
      </div>
    </div>
  );
}
