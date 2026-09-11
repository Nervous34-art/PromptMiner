import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, Lightbulb, FileSpreadsheet } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  const stages = [
    { label: 'Parsing prompt patterns & intent telemetry...', icon: BrainCircuit },
    { label: 'Clustering repeated friction points and frequencies...', icon: Sparkles },
    { label: 'Synthesizing & scoring 3 ranked software opportunities...', icon: Lightbulb },
    { label: 'Formulating PRD, tech stack, DB schema & 1-week sprint plan...', icon: FileSpreadsheet },
  ];

  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1600);
    return () => clearInterval(timer);
  }, [stages.length]);

  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      {/* Active Stage Banner */}
      <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 animate-pulse">
            {React.createElement(stages[activeStage].icon, { className: 'w-5 h-5' })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Step {activeStage + 1} of {stages.length}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            </div>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
              {stages[activeStage].label}
            </p>
          </div>
        </div>

        {/* Mini progress ticks */}
        <div className="flex items-center gap-1.5 w-full md:w-48">
          {stages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                idx <= activeStage ? 'bg-amber-500' : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Skeleton Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
              <div className="h-7 w-12 bg-amber-500/20 rounded-lg" />
            </div>
            <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded" />
            <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-800/60 rounded" />

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 space-y-2">
              <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded" />
              <div className="h-2 w-4/5 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
