import React from 'react';
import { Layers, Quote, AlertCircle, Hash } from 'lucide-react';
import { Cluster } from '../types';

interface ClustersTabProps {
  clusters: Cluster[];
}

export const ClustersTab: React.FC<ClustersTabProps> = ({ clusters }) => {
  if (!clusters || clusters.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500">
        No task clusters detected in this dataset.
      </div>
    );
  }

  // Calculate max frequency to display proportional progress bars
  const maxFreq = Math.max(...clusters.map((c) => c.frequency || 1), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Recurring Prompt Clusters & Intent Friction</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Grouped by recurring workflow bottlenecks and underlying job-to-be-done.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 w-fit">
          {clusters.length} Distinct Themes Discovered
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {clusters.map((cluster, idx) => {
          const freqPercent = Math.min(100, Math.round(((cluster.frequency || 1) / maxFreq) * 100));

          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition hover:border-amber-500/40"
            >
              {/* Cluster Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center justify-center text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                      {cluster.name}
                    </h4>
                  </div>
                </div>

                {/* Frequency Badge */}
                <div className="flex items-center gap-2">
                  <div className="w-24 sm:w-32 bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${freqPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                    {cluster.frequency} {cluster.frequency === 1 ? 'mention' : 'occurrences'}
                  </span>
                </div>
              </div>

              {/* Core Pain Point */}
              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 mb-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-0.5">
                      Underlying Pain Point:
                    </span>
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                      {cluster.painPoint}
                    </p>
                  </div>
                </div>
              </div>

              {/* Evidence Quotes */}
              {cluster.evidence && cluster.evidence.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                    <Quote className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Evidence Found in Prompt History ({cluster.evidence.length}):</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {cluster.evidence.map((ev, evIdx) => (
                      <div
                        key={evIdx}
                        className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs text-zinc-700 dark:text-zinc-300 font-mono flex items-start gap-2"
                      >
                        <span className="text-amber-500 font-bold shrink-0">“</span>
                        <span className="leading-relaxed">{ev}</span>
                        <span className="text-amber-500 font-bold shrink-0">”</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
