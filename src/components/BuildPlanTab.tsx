import React, { useState } from 'react';
import {
  FileText,
  Code2,
  Database,
  Calendar,
  Copy,
  Check,
  CheckSquare,
  Square,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { BuildPlan } from '../types';

interface BuildPlanTabProps {
  buildPlan: BuildPlan;
  topIdeaTitle?: string;
}

export const BuildPlanTab: React.FC<BuildPlanTabProps> = ({ buildPlan, topIdeaTitle }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [completedSprintDays, setCompletedSprintDays] = useState<Record<number, boolean>>({});

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleDayComplete = (dayIdx: number) => {
    setCompletedSprintDays((prev) => ({
      ...prev,
      [dayIdx]: !prev[dayIdx],
    }));
  };

  const techStackList = buildPlan?.techStack || [
    'Next.js 15 / React 19',
    'TypeScript',
    'Tailwind CSS v4',
    'PostgreSQL / Supabase',
    'Drizzle ORM',
    'Stripe Webhooks',
    'Resend (Transactional Emails)',
  ];

  const sprintList = buildPlan?.sprint || [
    'Day 1: Project setup, database migration, and auth integration.',
    'Day 2: Core webhook handlers and event listeners.',
    'Day 3: Client dashboard and status views.',
    'Day 4: Integration testing and recovery emails.',
    'Day 5: Deployment, documentation, and production testing.',
  ];

  const completedCount = Object.values(completedSprintDays).filter(Boolean).length;
  const sprintProgress = Math.round((completedCount / sprintList.length) * 100);

  return (
    <div className="space-y-8">
      {/* Tab Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Executable Implementation Plan
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mt-1">
            MVP Build Specification: {topIdeaTitle || 'Recommended Opportunity'}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Turn this opportunity into a working production MVP in a single 1-week focused sprint.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            handleCopy(
              `# PRD\n${buildPlan.prd}\n\n# Tech Stack\n${techStackList.join('\n')}\n\n# Schema\n${buildPlan.schema}\n\n# Sprint\n${sprintList.join('\n')}`,
              'all'
            )
          }
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          {copiedSection === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedSection === 'all' ? 'Copied Entire Plan' : 'Copy Full Plan'}</span>
        </button>
      </div>

      {/* 1. Recommended Tech Stack */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              1. Recommended Tech Stack
            </h4>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(techStackList.join(', '), 'tech')}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 transition"
          >
            {copiedSection === 'tech' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copiedSection === 'tech' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {techStackList.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Database Schema */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              2. PostgreSQL Schema Architecture
            </h4>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(buildPlan?.schema || '', 'schema')}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 transition"
          >
            {copiedSection === 'schema' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copiedSection === 'schema' ? 'Copied SQL' : 'Copy SQL'}</span>
          </button>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs p-4 sm:p-5 max-h-[360px] overflow-y-auto leading-relaxed selection:bg-amber-500/30">
          <pre className="whitespace-pre-wrap">{buildPlan?.schema || '-- No schema provided'}</pre>
        </div>
      </div>

      {/* 3. 1-Week Sprint Plan */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              3. One-Week Sprint Execution Roadmap
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {completedCount} of {sprintList.length} milestones complete ({sprintProgress}%)
            </div>
            <button
              type="button"
              onClick={() => handleCopy(sprintList.join('\n'), 'sprint')}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 transition"
            >
              {copiedSection === 'sprint' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === 'sprint' ? 'Copied Sprint' : 'Copy Sprint'}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${sprintProgress}%` }}
          />
        </div>

        {/* Sprint Checklist items */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          {sprintList.map((step, idx) => {
            const isDone = !!completedSprintDays[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleDayComplete(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isDone
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-zinc-500 dark:text-zinc-400'
                    : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-700/60 hover:border-amber-500/40 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400 focus:outline-none"
                  aria-label={isDone ? 'Mark milestone incomplete' : 'Mark milestone complete'}
                >
                  {isDone ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-zinc-400" />}
                </button>
                <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                  <span className={isDone ? 'line-through opacity-75' : ''}>{step}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Product Requirements Document (PRD) */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              4. Product Requirements Document (PRD)
            </h4>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(buildPlan?.prd || '', 'prd')}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 transition"
          >
            {copiedSection === 'prd' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copiedSection === 'prd' ? 'Copied PRD' : 'Copy PRD'}</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 prose dark:prose-invert max-w-none text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-amber-500/20">
          {buildPlan?.prd || 'No PRD generated.'}
        </div>
      </div>
    </div>
  );
};
