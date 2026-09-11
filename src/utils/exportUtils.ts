import { AnalysisResult } from '../types';

export function generateMarkdownReport(result: AnalysisResult, promptCount: number = 0): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const lines: string[] = [];

  lines.push(`# PromptMiner Analysis Report`);
  lines.push(`*Generated on ${dateStr}${promptCount ? ` • Analyzed ${promptCount} prompt(s)` : ''}*`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Executive Summary');
  lines.push(result.summary);
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('## 1. Recurring Clusters & Friction Points');
  lines.push('');

  if (result.clusters && result.clusters.length > 0) {
    result.clusters.forEach((c, idx) => {
      lines.push(`### Cluster ${idx + 1}: ${c.name} (${c.frequency} occurrences)`);
      lines.push(`**Core Pain Point:** ${c.painPoint}`);
      if (c.evidence && c.evidence.length > 0) {
        lines.push('');
        lines.push('**Evidence from Prompts:**');
        c.evidence.forEach((ev) => lines.push(`- "${ev}"`));
      }
      lines.push('');
    });
  } else {
    lines.push('No clusters recorded.');
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## 2. Top 3 Ranked Software Opportunities');
  lines.push('');

  if (result.ideas && result.ideas.length > 0) {
    result.ideas.forEach((idea, idx) => {
      lines.push(`### Ranked #${idx + 1}: ${idea.title}`);
      lines.push(`> **${idea.oneLiner}**`);
      lines.push('');
      lines.push(`- **Overall Score:** **${idea.scores?.overall || 0}/100**`);
      lines.push(`- **Target User:** ${idea.targetUser}`);
      lines.push(`- **Problem Solved:** ${idea.problem}`);
      lines.push(`- **Difficulty:** ${idea.difficulty}`);
      lines.push(`- **Monetization:** ${idea.monetization}`);
      lines.push(`- **Strategic Fit:** ${idea.whyItFits}`);
      lines.push('');

      lines.push('#### Score Matrix');
      lines.push('| Metric | Score | Weight | Weighted Value |');
      lines.push('| :--- | :--- | :--- | :--- |');
      lines.push(`| **Task Frequency** | ${idea.scores?.frequency || 0}/100 | 30% | ${(Number(idea.scores?.frequency || 0) * 0.3).toFixed(1)} |`);
      lines.push(`| **Willingness to Pay** | ${idea.scores?.willingnessToPay || 0}/100 | 25% | ${(Number(idea.scores?.willingnessToPay || 0) * 0.25).toFixed(1)} |`);
      lines.push(`| **Technical Feasibility** | ${idea.scores?.feasibility || 0}/100 | 25% | ${(Number(idea.scores?.feasibility || 0) * 0.25).toFixed(1)} |`);
      lines.push(`| **Low Competition** | ${idea.scores?.competition || 0}/100 | 20% | ${(Number(idea.scores?.competition || 0) * 0.2).toFixed(1)} |`);
      lines.push(`| **Composite Overall** | **${idea.scores?.overall || 0}/100** | 100% | **${idea.scores?.overall || 0}** |`);
      lines.push('');

      if (idea.mvpFeatures && idea.mvpFeatures.length > 0) {
        lines.push('#### MVP Feature Scope');
        idea.mvpFeatures.forEach((feat) => lines.push(`- [ ] ${feat}`));
        lines.push('');
      }

      if (idea.evidence && idea.evidence.length > 0) {
        lines.push('#### Supporting Evidence');
        idea.evidence.forEach((ev) => lines.push(`> *"${ev}"*`));
        lines.push('');
      }

      lines.push('---');
      lines.push('');
    });
  }

  lines.push('## 3. Product Requirements Document (PRD)');
  lines.push('');
  lines.push(result.buildPlan?.prd || 'No PRD generated.');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('## 4. Recommended Tech Stack');
  lines.push('');
  if (result.buildPlan?.techStack && result.buildPlan.techStack.length > 0) {
    result.buildPlan.techStack.forEach((tech) => lines.push(`- ${tech}`));
  } else {
    lines.push('- Next.js / TypeScript\n- Tailwind CSS\n- PostgreSQL');
  }
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('## 5. Database Schema');
  lines.push('');
  lines.push('```sql');
  lines.push(result.buildPlan?.schema || '-- No schema defined');
  lines.push('```');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('## 6. One-Week Sprint Build Plan');
  lines.push('');
  if (result.buildPlan?.sprint && result.buildPlan.sprint.length > 0) {
    result.buildPlan.sprint.forEach((step) => lines.push(`- [ ] **${step}**`));
  } else {
    lines.push('- [ ] Day 1-7: Execution');
  }
  lines.push('');

  return lines.join('\n');
}

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(result: AnalysisResult, promptCount: number = 0): void {
  const md = generateMarkdownReport(result, promptCount);
  const slug = result.ideas?.[0]?.title
    ? result.ideas[0].title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)
    : 'analysis';
  const filename = `promptminer-${slug}-${new Date().toISOString().slice(0, 10)}.md`;
  downloadFile(filename, md, 'text/markdown;charset=utf-8;');
}

export function downloadJSON(result: AnalysisResult): void {
  const jsonStr = JSON.stringify(result, null, 2);
  const slug = result.ideas?.[0]?.title
    ? result.ideas[0].title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)
    : 'analysis';
  const filename = `promptminer-${slug}-${new Date().toISOString().slice(0, 10)}.json`;
  downloadFile(filename, jsonStr, 'application/json;charset=utf-8;');
}
