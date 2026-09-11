import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  Trash2,
  Play,
  FileCode,
  Layers,
  ChevronDown,
  Info,
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/samplePrompts';
import { parseUploadedFile } from '../utils/promptParser';

interface PromptInputAreaProps {
  rawText: string;
  promptsCount: number;
  isLoading: boolean;
  onTextChange: (newText: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  onLoadPreset: (presetId: string) => void;
  onFileUploaded: (prompts: string[], rawText: string, fileName: string) => void;
  hasApiKey: boolean;
  isDemoMode: boolean;
}

export const PromptInputArea: React.FC<PromptInputAreaProps> = ({
  rawText,
  promptsCount,
  isLoading,
  onTextChange,
  onAnalyze,
  onClear,
  onLoadPreset,
  onFileUploaded,
  hasApiKey,
  isDemoMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    try {
      const { prompts, rawText: fileRawText } = await parseUploadedFile(file);
      if (prompts.length === 0) {
        setUploadError(`No valid prompts found in "${file.name}". Ensure it contains text, CSV rows, or JSON prompts.`);
        return;
      }
      onFileUploaded(prompts, fileRawText, file.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to read file';
      setUploadError(`Failed to process ${file.name}: ${msg}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (promptsCount > 0 && !isLoading) {
        onAnalyze();
      }
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Top Bar / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <span>Input AI Prompts</span>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              (paste one per line or delimited by <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-amber-600 dark:text-amber-400 font-mono text-[11px]">---</code>)
            </span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Analyze your ChatGPT, Claude, or Gemini prompt logs to discover high-value problems you repeatedly ask AI to solve.
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition"
              aria-expanded={showPresetsMenu}
              aria-haspopup="true"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load sample prompts</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showPresetsMenu && (
              <div
                className="absolute right-0 mt-1 w-72 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xl py-1.5 z-40"
                role="menu"
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Select Sample Persona
                </div>
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onLoadPreset(preset.id);
                      setShowPresetsMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition flex flex-col"
                    role="menuitem"
                  >
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{preset.label}</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {preset.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upload File button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,.json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition"
            title="Upload .txt, .csv, or .json prompt export"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Upload File</span>
          </button>

          {/* Clear button */}
          {rawText.trim() && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="Clear input text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* File Upload Error Alert */}
      {uploadError && (
        <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 flex items-center justify-between">
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-rose-500 font-bold hover:underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Drag and drop wrapper & Textarea */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative mt-4 rounded-xl transition-all border-2 ${
          isDragging
            ? 'border-dashed border-amber-500 bg-amber-50/20 dark:bg-amber-950/20'
            : 'border-zinc-200 dark:border-zinc-800 focus-within:border-amber-500 dark:focus-within:border-amber-500'
        }`}
      >
        <textarea
          value={rawText}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your recent AI prompts here...

Example:
Write a Python script that pulls cancellation feedback from Stripe and categorizes reasons.
---
Help me draft a 3-part re-engagement email sequence for users who signed up 7 days ago.
---
How can I calculate net revenue retention (NRR) in Postgres given subscriptions and invoice tables?"
          rows={9}
          className="w-full bg-transparent p-4 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none resize-y font-mono leading-relaxed selection:bg-amber-500/20"
          aria-label="Prompts input"
        />

        {isDragging && (
          <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-xs rounded-xl flex items-center justify-center pointer-events-none">
            <div className="bg-white dark:bg-zinc-900 border border-amber-500 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-medium">
              <Upload className="w-4 h-4 animate-bounce" />
              <span>Drop .txt, .csv, or .json file to import prompts</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar with stats & Analyze CTA */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Layers className="w-3 h-3 mr-1 text-amber-500" />
              {promptsCount} {promptsCount === 1 ? 'prompt' : 'prompts'} detected
            </span>
            <span>•</span>
            <span>{rawText.length.toLocaleString()} characters</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[11px] text-zinc-400">
            <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[10px]">
              ⌘ + Enter
            </kbd>
            <span>to analyze</span>
          </div>
        </div>

        {/* Analyze button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!hasApiKey && isDemoMode && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
              <Info className="w-3 h-3" />
              <span>Demo instant preview</span>
            </span>
          )}

          <button
            type="button"
            onClick={onAnalyze}
            disabled={isLoading || promptsCount === 0}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
              promptsCount === 0 || isLoading
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25 hover:shadow-md active:scale-[0.99] cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Prompts with Gemini...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Analyze Prompts & Mine Ideas</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
