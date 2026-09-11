import { AnalysisResult, AppIdea } from '../types';

export const STORAGE_KEY_API_KEY = 'promptminer_api_key';
export const STORAGE_KEY_MODEL = 'promptminer_model';
export const STORAGE_KEY_HISTORY = 'promptminer_history';

export const DEFAULT_MODEL = 'gemini-2.5-flash';

export const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Recommended - Fast & Accurate)' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Legacy Default)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Latest Experimental)' },
];

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
}

export function setStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key) {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  }
}

export function getStoredModel(): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL;
  return localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL;
}

export function setStoredModel(model: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_MODEL, model);
}

const SYSTEM_PROMPT = `You are a product strategist. Analyze the user's AI prompt history. Identify repeated tasks, pain points, domains, target users, and monetizable app opportunities. Return valid JSON only.`;

function buildUserPrompt(prompts: string[]): string {
  const formattedPrompts = prompts.map((p, idx) => `[Prompt #${idx + 1}]\n${p.trim()}`).join('\n\n---\n\n');

  return `Here are the user's recent AI prompts:
${formattedPrompts}

Return JSON matching this schema:
{
  "summary": "string",
  "clusters": [
    {
      "name": "string",
      "frequency": 0,
      "painPoint": "string",
      "evidence": ["string"]
    }
  ],
  "ideas": [
    {
      "title": "string",
      "oneLiner": "string",
      "problem": "string",
      "targetUser": "string",
      "mvpFeatures": ["string"],
      "monetization": "string",
      "difficulty": "Low|Medium|High",
      "scores": {
        "frequency": 0,
        "willingnessToPay": 0,
        "feasibility": 0,
        "competition": 0,
        "overall": 0
      },
      "whyItFits": "string",
      "evidence": ["string"]
    }
  ],
  "buildPlan": {
    "prd": "string",
    "techStack": ["string"],
    "schema": "string",
    "sprint": ["string"]
  }
}

Rules:
- Scores are 0-100.
- Overall is weighted: frequency 30%, willingnessToPay 25%, feasibility 25%, competition 20% (lower competition = higher score).
- Return exactly 3 ideas.
- If prompts are too short, still produce best-effort ideas and note assumptions.`;
}

function cleanAndParseJSON(rawText: string): AnalysisResult {
  let cleaned = rawText.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  // Find the first '{' and last '}'
  const firstOpen = cleaned.indexOf('{');
  const lastClose = cleaned.lastIndexOf('}');
  if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
    cleaned = cleaned.substring(firstOpen, lastClose + 1);
  }

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(cleaned) as AnalysisResult;
  } catch (err) {
    console.error('Initial JSON parse error, attempting regex repairs:', err);
    // Remove trailing commas if any
    const relaxed = cleaned.replace(/,\s*([\]}])/g, '$1');
    parsed = JSON.parse(relaxed) as AnalysisResult;
  }

  // Validate and post-process
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Received non-object JSON payload from Gemini');
  }

  if (!parsed.summary) {
    parsed.summary = 'Analysis completed. Identified primary repetitive friction points and opportunities.';
  }

  if (!Array.isArray(parsed.clusters)) {
    parsed.clusters = [];
  }

  if (!Array.isArray(parsed.ideas)) {
    parsed.ideas = [];
  }

  // Ensure overall scores are calculated and valid, and difficulty is typed
  parsed.ideas = parsed.ideas.map((idea: AppIdea) => {
    const s = idea.scores || {
      frequency: 75,
      willingnessToPay: 75,
      feasibility: 80,
      competition: 70,
      overall: 75,
    };

    const freq = Number(s.frequency) || 70;
    const wtp = Number(s.willingnessToPay) || 70;
    const feas = Number(s.feasibility) || 75;
    const comp = Number(s.competition) || 65;

    // Formula: frequency 30%, willingnessToPay 25%, feasibility 25%, competition 20%
    const computedOverall = Math.round(freq * 0.3 + wtp * 0.25 + feas * 0.25 + comp * 0.2);

    let difficulty = idea.difficulty;
    if (difficulty !== 'Low' && difficulty !== 'Medium' && difficulty !== 'High') {
      difficulty = 'Medium';
    }

    return {
      ...idea,
      difficulty,
      mvpFeatures: Array.isArray(idea.mvpFeatures) ? idea.mvpFeatures : [],
      evidence: Array.isArray(idea.evidence) ? idea.evidence : [],
      scores: {
        frequency: Math.min(100, Math.max(0, freq)),
        willingnessToPay: Math.min(100, Math.max(0, wtp)),
        feasibility: Math.min(100, Math.max(0, feas)),
        competition: Math.min(100, Math.max(0, comp)),
        overall: Math.min(100, Math.max(0, s.overall || computedOverall)),
      },
    };
  });

  // Sort ideas by overall score descending
  parsed.ideas.sort((a, b) => b.scores.overall - a.scores.overall);

  // Guarantee exactly 3 ideas if possible
  if (parsed.ideas.length > 3) {
    parsed.ideas = parsed.ideas.slice(0, 3);
  }

  // Check buildPlan
  if (!parsed.buildPlan) {
    parsed.buildPlan = {
      prd: '# MVP Build Plan\n\nNo PRD details returned.',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      schema: '-- Schema details\n',
      sprint: ['Day 1: Setup', 'Day 2-3: Core Features', 'Day 4-5: Polish & Deploy'],
    };
  } else {
    if (!Array.isArray(parsed.buildPlan.techStack)) {
      parsed.buildPlan.techStack = [];
    }
    if (!Array.isArray(parsed.buildPlan.sprint)) {
      parsed.buildPlan.sprint = [];
    }
  }

  return parsed;
}

export async function analyzePromptsWithGemini(
  prompts: string[],
  apiKey: string,
  modelName: string = DEFAULT_MODEL
): Promise<{ result: AnalysisResult; rawResponseText: string }> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Gemini API key is required. Please set your key in Settings or use Demo Mode.');
  }

  if (!prompts || prompts.length === 0) {
    throw new Error('No prompts provided for analysis. Please paste or upload prompts.');
  }

  const cleanKey = apiKey.trim();
  const cleanModel = modelName.trim() || DEFAULT_MODEL;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${cleanKey}`;

  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: buildUserPrompt(prompts) }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (netErr: unknown) {
    const errorMsg = netErr instanceof Error ? netErr.message : String(netErr);
    throw new Error(`Network error connecting to Gemini API: ${errorMsg}. Check your internet connection.`);
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error?.message || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text();
    }

    if (response.status === 400) {
      throw new Error(`Gemini API 400 Bad Request: ${errorDetail}`);
    } else if (response.status === 403 || response.status === 401) {
      throw new Error(`Invalid Gemini API Key or unauthorized access (${response.status}): ${errorDetail}`);
    } else if (response.status === 429) {
      throw new Error(`Gemini API rate limit reached (429). Please wait a moment before re-trying: ${errorDetail}`);
    } else {
      throw new Error(`Gemini API error (${response.status}): ${errorDetail}`);
    }
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('Gemini API returned an empty response. The prompt may have triggered a safety filter.');
  }

  const parsedResult = cleanAndParseJSON(textOutput);
  return {
    result: parsedResult,
    rawResponseText: textOutput,
  };
}
