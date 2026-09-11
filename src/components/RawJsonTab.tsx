import React, { useState } from 'react';
import { Code, Copy, Check, Download } from 'lucide-react';
import { AnalysisResult } from '../types';
import { downloadJSON } from '../utils/exportUtils';

interface RawJsonTabProps {
  result: AnalysisResult;
}

export const RawJsonTab: React.FC<RawJsonTabProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const formattedJson = JSON.stringify(result, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-zinc-400" />
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            Raw Analysis Payload (JSON)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => downloadJSON(result)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800 p-5 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[600px] overflow-y-auto leading-relaxed selection:bg-amber-500/30">
        <pre>{formattedJson}</pre>
      </div>
    </div>
  );
};
