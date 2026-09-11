import React, { useState } from 'react';
import { AlertTriangle, Key, Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorAlertProps {
  errorMessage: string;
  onOpenSettings: () => void;
  onRunDemoMode: () => void;
  onRetry: () => void;
  isLoading: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  errorMessage,
  onOpenSettings,
  onRunDemoMode,
  onRetry,
  isLoading,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 shadow-sm animate-fade-in space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
            Analysis Request Encountered an Issue
          </h4>
          <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
            {errorMessage.includes('API key') || errorMessage.includes('403') || errorMessage.includes('401')
              ? 'Could not authenticate with the Gemini API. Please check your API key in Settings, or use Demo Mode to experience the full UI and export functionality.'
              : errorMessage}
          </p>

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-mono text-rose-600 dark:text-rose-400 hover:underline mt-2 flex items-center gap-1"
          >
            <span>{showDetails ? 'Hide technical logs' : 'View raw error logs'}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showDetails && (
            <div className="mt-2 p-3 rounded-lg bg-black/80 text-rose-200 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto max-h-40">
              {errorMessage}
            </div>
          )}
        </div>
      </div>

      {/* Suggested Quick Actions */}
      <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/50 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 shadow-xs"
        >
          <Key className="w-3.5 h-3.5" />
          <span>Configure API Key in Settings</span>
        </button>

        <button
          type="button"
          onClick={onRunDemoMode}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Run Built-in Demo Analysis Instead</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );
};
