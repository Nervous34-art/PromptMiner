import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Lightbulb,
  FileSpreadsheet,
  Code,
  Download,
  Copy,
  Check,
  RotateCcw,
  Pickaxe,
  TrendingUp,
} from 'lucide-react';
import { AnalysisResult, HistoryItem, TabType } from './types';
import { SAMPLE_PRESETS, DEMO_ANALYSIS_RESULT } from './data/samplePrompts';
import { parsePromptsFromText } from './utils/promptParser';
import {
  getStoredApiKey,
  setStoredApiKey,
  getStoredModel,
  setStoredModel,
  analyzePromptsWithGemini,
  STORAGE_KEY_HISTORY,
  DEFAULT_MODEL,
} from './services/geminiService';
import { downloadMarkdown, downloadJSON, generateMarkdownReport } from './utils/exportUtils';
import { Header } from './components/Header';
import { PromptInputArea } from './components/PromptInputArea';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { SummaryTab } from './components/SummaryTab';
import { ClustersTab } from './components/ClustersTab';
import { IdeasTab } from './components/IdeasTab';
import { BuildPlanTab } from './components/BuildPlanTab';
import { RawJsonTab } from './components/RawJsonTab';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import { ErrorAlert } from './components/ErrorAlert';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('promptminer_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Settings & Credential state
  const [apiKey, setApiKey] = useState<string>(() => getStoredApiKey());
  const [model, setModel] = useState<string>(() => getStoredModel());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const key = getStoredApiKey();
    return !key; // If no API key, default to Demo Mode for instant usability
  });

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Prompts Input state
  const [rawText, setRawText] = useState<string>(() => {
    // Initial friendly sample prompts from SaaS preset
    return SAMPLE_PRESETS[0].prompts.join('\n---\n');
  });
  const [prompts, setPrompts] = useState<string[]>(() => parsePromptsFromText(rawText));

  // Analysis result & UI state
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [rawResponseText, setRawResponseText] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Synchronize dark mode class on <html> element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('promptminer_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('promptminer_theme', 'light');
    }
  }, [isDarkMode]);

  // Update parsed prompts when raw text changes
  const handleTextChange = (text: string) => {
    setRawText(text);
    setPrompts(parsePromptsFromText(text));
    if (error) setError(null);
  };

  // Preset loader
  const handleLoadPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const joined = preset.prompts.join('\n---\n');
      setRawText(joined);
      setPrompts(preset.prompts);
      if (error) setError(null);
    }
  };

  // Clear handler
  const handleClear = () => {
    setRawText('');
    setPrompts([]);
    setError(null);
  };

  // File upload handler
  const handleFileUploaded = (extractedPrompts: string[], fileRawText: string) => {
    setRawText(fileRawText);
    setPrompts(extractedPrompts);
    if (error) setError(null);
  };

  // Save history to localStorage
  const saveToHistory = (newResult: AnalysisResult, rawTextData: string, pCount: number, isDemo: boolean) => {
    const newItem: HistoryItem = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      promptsCount: pCount,
      promptsRaw: rawTextData,
      result: newResult,
      modelUsed: isDemo ? 'demo-preset' : model,
      isDemo,
    };

    const updatedHistory = [newItem, ...history].slice(0, 30); // keep up to 30 items
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
  };

  // Analyze function
  const runAnalysis = async () => {
    if (prompts.length === 0) return;
    setError(null);
    setIsLoading(true);

    // If demo mode is active or no API key is provided
    if (isDemoMode || !apiKey.trim()) {
      setTimeout(() => {
        setResult(DEMO_ANALYSIS_RESULT);
        setRawResponseText(JSON.stringify(DEMO_ANALYSIS_RESULT, null, 2));
        saveToHistory(DEMO_ANALYSIS_RESULT, rawText, prompts.length, true);
        setIsLoading(false);
        setActiveTab('summary');
      }, 1500);
      return;
    }

    // Live call with Gemini REST API
    try {
      const { result: analysisResult, rawResponseText: rawTextOutput } = await analyzePromptsWithGemini(
        prompts,
        apiKey,
        model
      );

      setResult(analysisResult);
      setRawResponseText(rawTextOutput);
      saveToHistory(analysisResult, rawText, prompts.length, false);
      setActiveTab('summary');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown analysis error';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = (newApiKey: string, newModel: string, newDemoMode: boolean) => {
    setStoredApiKey(newApiKey);
    setStoredModel(newModel);
    setApiKey(newApiKey);
    setModel(newModel);
    setIsDemoMode(newDemoMode);
    if (error) setError(null);
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  };

  // Select item from history
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setRawText(item.promptsRaw);
    setPrompts(parsePromptsFromText(item.promptsRaw));
    setResult(item.result);
    setRawResponseText(JSON.stringify(item.result, null, 2));
    setActiveTab('summary');
  };

  // Delete single history item
  const handleDeleteHistoryItem = (id: string) => {
    const filtered = history.filter((h) => h.id !== id);
    setHistory(filtered);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(filtered));
  };

  // Copy Markdown report to clipboard
  const handleCopyReport = () => {
    if (!result) return;
    const md = generateMarkdownReport(result, prompts.length);
    navigator.clipboard.writeText(md);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-amber-500/25">
      {/* Header */}
      <Header
        hasApiKey={Boolean(apiKey.trim())}
        isDemoMode={isDemoMode}
        selectedModel={model}
        historyCount={history.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Sub-Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Prompt Opportunity Miner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Discover What Software You Should Build
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Paste your recent AI prompts to cluster repeated friction points, score 3 ranked monetizable app opportunities, and generate a 1-week MVP build specification.
          </p>
        </div>

        {/* Core Feature 1: Prompt Input Area */}
        <PromptInputArea
          rawText={rawText}
          promptsCount={prompts.length}
          isLoading={isLoading}
          onTextChange={handleTextChange}
          onAnalyze={runAnalysis}
          onClear={handleClear}
          onLoadPreset={handleLoadPreset}
          onFileUploaded={handleFileUploaded}
          hasApiKey={Boolean(apiKey.trim())}
          isDemoMode={isDemoMode}
        />

        {/* Error Alert */}
        {error && (
          <ErrorAlert
            errorMessage={error}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onRunDemoMode={() => {
              setIsDemoMode(true);
              setError(null);
              runAnalysis();
            }}
            onRetry={runAnalysis}
            isLoading={isLoading}
          />
        )}

        {/* Core Feature 2: Loading Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Core Feature 3: Analysis Results Section */}
        {result && !isLoading && (
          <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 animate-fade-in">
            {/* Results Header Bar with Tabs & Exports */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" role="tablist">
                {/* Summary Tab */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'summary'}
                  onClick={() => setActiveTab('summary')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === 'summary'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Summary</span>
                </button>

                {/* Clusters Tab */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'clusters'}
                  onClick={() => setActiveTab('clusters')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === 'clusters'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Clusters</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                    {result.clusters?.length || 0}
                  </span>
                </button>

                {/* Ideas Tab */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'ideas'}
                  onClick={() => setActiveTab('ideas')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === 'ideas'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Ideas</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                    3 Ranked
                  </span>
                </button>

                {/* Build Plan Tab */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'buildPlan'}
                  onClick={() => setActiveTab('buildPlan')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === 'buildPlan'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Build Plan</span>
                </button>

                {/* Raw JSON Tab */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'rawJson'}
                  onClick={() => setActiveTab('rawJson')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === 'rawJson'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>Raw JSON</span>
                </button>
              </div>

              {/* Core Feature 7: Export Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition flex items-center gap-1.5 shadow-2xs"
                  title="Copy formatted markdown report to clipboard"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReport ? 'Copied Report' : 'Copy MD'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadMarkdown(result, prompts.length)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition flex items-center gap-1.5 shadow-2xs"
                  title="Download Markdown analysis report"
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  <span>Export MD</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadJSON(result)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition flex items-center gap-1.5 shadow-2xs"
                  title="Download JSON structured data"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Tab Views */}
            <div className="pt-2">
              {activeTab === 'summary' && (
                <SummaryTab
                  result={result}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'clusters' && <ClustersTab clusters={result.clusters} />}

              {activeTab === 'ideas' && (
                <IdeasTab
                  ideas={result.ideas}
                  onNavigateToBuildPlan={() => setActiveTab('buildPlan')}
                />
              )}

              {activeTab === 'buildPlan' && (
                <BuildPlanTab
                  buildPlan={result.buildPlan}
                  topIdeaTitle={result.ideas?.[0]?.title}
                />
              )}

              {activeTab === 'rawJson' && <RawJsonTab result={result} />}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-white/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Pickaxe className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">PromptMiner</span>
            <span>— Client-side AI prompt log opportunity analyzer</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span>Powered by Google Gemini</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-zinc-600 dark:hover:text-zinc-200 underline"
            >
              Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Core Feature 9: Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        model={model}
        isDemoMode={isDemoMode}
        onSave={handleSaveSettings}
        onClearHistory={handleClearHistory}
        historyCount={history.length}
      />

      {/* Core Feature 8: History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearAll={handleClearHistory}
      />
    </div>
  );
}
