import React from 'react';
import { Sparkles, Target, Layers, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { AnalysisResult } from '../types';

interface SummaryTabProps {
  result: AnalysisResult;
  onNavigateToTab: (tab: 'clusters' | 'ideas' | 'buildPlan') => void;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ result, onNavigateToTab }) => {
  const topIdea = result.ideas?.[0];
  const totalClusters = result.clusters?.length || 0;
  const totalOccurrences = result.clusters?.reduce((acc, c) => acc + (c.frequency || 1), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Executive Narrative */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Executive Synthesis
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-3">
          What your prompt patterns reveal about what you should build:
        </h3>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          {result.summary}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Top Venture */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Top Venture Pick</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-white truncate">
            {topIdea ? topIdea.title.split(':')[0] : 'N/A'}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              {topIdea?.scores?.overall || 0}/100 Score
            </span>
            <span className="text-zinc-400">{topIdea?.difficulty} Difficulty</span>
          </div>
        </div>

        {/* Recurring Clusters */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Clusters Discovered</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {totalClusters}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            Spanning {totalOccurrences} repeated friction occurrences
          </p>
        </div>

        {/* Monetization Readiness */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Avg. Willingness to Pay</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {Math.round(
              (result.ideas?.reduce((acc, i) => acc + (i.scores?.willingnessToPay || 70), 0) || 75) /
                (result.ideas?.length || 1)
            )}
            /100
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            High commercial intent across prompts
          </p>
        </div>

        {/* Tech Feasibility */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Avg. Feasibility</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {Math.round(
              (result.ideas?.reduce((acc, i) => acc + (i.scores?.feasibility || 75), 0) || 80) /
                (result.ideas?.length || 1)
            )}
            /100
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            Buildable as solo MVP in ~1 week
          </p>
        </div>
      </div>

      {/* Top Idea Spotlight Preview */}
      {topIdea && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                #1 Ranked Software Opportunity
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {topIdea.monetization}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mt-1.5">
              {topIdea.title}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1 max-w-3xl">
              {topIdea.oneLiner}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onNavigateToTab('ideas')}
              className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Explore All 3 Ideas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('buildPlan')}
              className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>View Build Plan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
