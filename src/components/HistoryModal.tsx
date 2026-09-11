import React from 'react';
import {
  X,
  History,
  Calendar,
  Layers,
  Trash2,
  ArrowRight,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 id="history-modal-title" className="text-base font-bold text-zinc-900 dark:text-white">
                Analysis History
              </h3>
              <span className="text-xs text-zinc-400">
                {history.length} saved {history.length === 1 ? 'analysis' : 'analyses'} in localStorage
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="Close history modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of items */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 space-y-2">
              <History className="w-8 h-8 mx-auto opacity-40 text-zinc-400" />
              <p className="text-sm font-medium">No previous analyses saved yet.</p>
              <p className="text-xs text-zinc-500">
                Whenever you run an analysis on prompt logs, your results are saved locally here.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const topIdea = item.result.ideas?.[0];
              const dateStr = new Date(item.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/70 hover:border-amber-500/40 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div
                    onClick={() => {
                      onSelectHistoryItem(item);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer space-y-1"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        {item.promptsCount} prompts
                      </span>
                      {item.isDemo && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Demo
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-zinc-400">
                        {item.modelUsed.replace('gemini-', '')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate max-w-md">
                        {topIdea ? topIdea.title : 'Software Opportunity Analysis'}
                      </h4>
                      {topIdea && (
                        <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          {topIdea.scores?.overall || 0}/100
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {item.result.summary}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectHistoryItem(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white transition flex items-center gap-1 shadow-xs"
                    >
                      <span>Reload</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.id);
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      aria-label="Delete history item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
