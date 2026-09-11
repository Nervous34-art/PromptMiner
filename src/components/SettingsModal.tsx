import React, { useState } from 'react';
import {
  X,
  Key,
  Cpu,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { AVAILABLE_MODELS } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  model: string;
  isDemoMode: boolean;
  onSave: (newApiKey: string, newModel: string, newDemoMode: boolean) => void;
  onClearHistory: () => void;
  historyCount: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  model,
  isDemoMode,
  onSave,
  onClearHistory,
  historyCount,
}) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [modelInput, setModelInput] = useState(model);
  const [demoInput, setDemoInput] = useState(isDemoMode);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(keyInput.trim(), modelInput.trim(), demoInput);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleClearHistoryClick = () => {
    if (!confirmClearHistory) {
      setConfirmClearHistory(true);
      return;
    }
    onClearHistory();
    setConfirmClearHistory(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Key className="w-4 h-4" />
            </div>
            <h3 id="settings-modal-title" className="text-base font-bold text-zinc-900 dark:text-white">
              PromptMiner Settings
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Client-side privacy badge */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">100% Client-Side Architecture: </span>
              Your Gemini API key and prompt history are stored solely in your local browser{' '}
              <code className="text-amber-600 dark:text-amber-400 font-mono">localStorage</code>. No backend server has access.
            </div>
          </div>

          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="gemini-api-key" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Get API key from Google AI Studio</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="relative">
              <input
                id="gemini-api-key"
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 pr-10 rounded-xl text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-zinc-400">
              Stored locally under key <code className="font-mono text-zinc-500">promptminer_api_key</code>.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label htmlFor="model-select" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              <span>Gemini Model</span>
            </label>
            <select
              id="model-select"
              value={modelInput}
              onChange={(e) => setModelInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Demo Mode Toggle */}
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Mode (No API Key Required)</span>
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Use rich built-in prompt mining analysis so the UI and exports work seamlessly.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={demoInput}
                onChange={(e) => setDemoInput(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* History Management */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">Analysis History</span>
              <span className="text-[11px] text-zinc-400">{historyCount} saved session(s) in localStorage</span>
            </div>

            <button
              type="button"
              onClick={handleClearHistoryClick}
              disabled={historyCount === 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                confirmClearHistory
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
              } ${historyCount === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{confirmClearHistory ? 'Confirm Clear All?' : 'Clear History'}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isSaved ? 'Settings Saved' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
