import React, { useState } from 'react';
import {
  Sparkles,
  Trophy,
  Target,
  DollarSign,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Quote,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { AppIdea, DifficultyLevel } from '../types';

interface IdeasTabProps {
  ideas: AppIdea[];
  onSelectIdeaForBuildPlan?: (idea: AppIdea) => void;
  onNavigateToBuildPlan: () => void;
}

export const IdeasTab: React.FC<IdeasTabProps> = ({
  ideas,
  onNavigateToBuildPlan,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Top idea open by default

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const getDifficultyBadge = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'Low':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Low Complexity (Solo Fast Build)
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Medium Complexity (~1 Week MVP)
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            High Complexity (Requires Deep API Integrations)
          </span>
        );
      default:
        return null;
    }
  };

  const getRankTheme = (rank: number) => {
    if (rank === 0) {
      return {
        badge: 'bg-amber-500 text-white',
        border: 'border-amber-500/40 dark:border-amber-500/30',
        ring: 'ring-1 ring-amber-500/20',
        titleColor: 'text-amber-500',
        label: '#1 Top Recommendation',
      };
    }
    if (rank === 1) {
      return {
        badge: 'bg-zinc-700 text-zinc-100 dark:bg-zinc-300 dark:text-zinc-900',
        border: 'border-zinc-300 dark:border-zinc-700',
        ring: '',
        titleColor: 'text-zinc-500',
        label: '#2 Strong Contender',
      };
    }
    return {
      badge: 'bg-orange-700 text-orange-100',
      border: 'border-zinc-200 dark:border-zinc-800',
      ring: '',
      titleColor: 'text-orange-600 dark:text-orange-400',
      label: '#3 High Potential',
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Top 3 Ranked Software Opportunities</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Ranked using weighted multi-factor scoring: Frequency (30%), Willingness to Pay (25%), Feasibility (25%), Low Competition (20%).
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 w-fit">
          Sorted by Overall Score
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {ideas.map((idea, idx) => {
          const rankTheme = getRankTheme(idx);
          const isExpanded = expandedIndex === idx;
          const scores = idea.scores || {
            frequency: 70,
            willingnessToPay: 70,
            feasibility: 75,
            competition: 65,
            overall: 70,
          };

          return (
            <div
              key={idx}
              className={`rounded-2xl bg-white dark:bg-zinc-900 border transition-all shadow-sm overflow-hidden ${rankTheme.border} ${rankTheme.ring}`}
            >
              {/* Card Header Section */}
              <div className="p-6 sm:p-7">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${rankTheme.badge}`}>
                        {rankTheme.label}
                      </span>
                      {getDifficultyBadge(idea.difficulty)}
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {idea.targetUser}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight pt-1">
                      {idea.title}
                    </h4>

                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400/90 leading-relaxed">
                      “{idea.oneLiner}”
                    </p>
                  </div>

                  {/* Right Overall Score Callout */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-100 dark:border-zinc-800">
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                        Composite Score
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
                          {scores.overall}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">/100</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => toggleExpand(idx)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Collapse Details' : 'View Full Details'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Score Matrix Breakdown Bar */}
                <div className="mt-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-500 dark:text-zinc-400">Frequency (30%)</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">{scores.frequency}</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${scores.frequency}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-500 dark:text-zinc-400">Willingness to Pay (25%)</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">{scores.willingnessToPay}</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${scores.willingnessToPay}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-500 dark:text-zinc-400">Tech Feasibility (25%)</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">{scores.feasibility}</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${scores.feasibility}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-500 dark:text-zinc-400">Low Competition (20%)</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">{scores.competition}</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${scores.competition}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Deep Dive Body */}
              {isExpanded && (
                <div className="px-6 sm:px-7 pb-7 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
                  {/* Problem & Strategic Fit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60">
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                        Core Problem Solved
                      </span>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {idea.problem}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
                        Why It Fits Prompt History
                      </span>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {idea.whyItFits}
                      </p>
                    </div>
                  </div>

                  {/* MVP Features */}
                  {idea.mvpFeatures && idea.mvpFeatures.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Recommended MVP Feature Scope:</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {idea.mvpFeatures.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200 flex items-start gap-2 font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Monetization & Evidence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Monetization */}
                    <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Pricing & Monetization Strategy</span>
                      </span>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                        {idea.monetization}
                      </p>
                    </div>

                    {/* Evidence Quote */}
                    {idea.evidence && idea.evidence.length > 0 && (
                      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <Quote className="w-3.5 h-3.5" />
                          <span>Supporting Prompt Evidence</span>
                        </span>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 font-mono italic line-clamp-3">
                          “{idea.evidence[0]}”
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onNavigateToBuildPlan}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Inspect Complete Build Plan & PRD</span>
                    </button>
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
