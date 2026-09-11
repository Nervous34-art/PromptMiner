export interface ParsedPromptsResult {
  prompts: string[];
  rawText: string;
  source: 'manual' | 'preset' | 'file-txt' | 'file-csv' | 'file-json';
  fileName?: string;
}

export function parsePromptsFromText(text: string): string[] {
  if (!text || !text.trim()) {
    return [];
  }

  // Check if text is separated by "---"
  if (text.includes('---')) {
    const parts = text
      .split(/\n?\s*---\s*\n?/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    if (parts.length > 1) {
      return parts;
    }
  }

  // Otherwise split by newlines
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines;
}

export async function parseUploadedFile(file: File): Promise<{ prompts: string[]; rawText: string }> {
  const content = await file.text();
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith('.json')) {
    try {
      const parsed = JSON.parse(content);
      const extracted: string[] = [];

      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === 'string' && item.trim()) {
            extracted.push(item.trim());
          } else if (typeof item === 'object' && item !== null) {
            // Common keys in prompt/chat exports
            const possibleText =
              item.prompt ||
              item.content ||
              item.text ||
              item.message ||
              item.query ||
              item.instruction ||
              (item.messages && Array.isArray(item.messages)
                ? item.messages.map((m: Record<string, unknown>) => m.content || m.text).join(' ')
                : null);

            if (possibleText && typeof possibleText === 'string' && possibleText.trim()) {
              extracted.push(possibleText.trim());
            }
          }
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        if (Array.isArray(parsed.prompts)) {
          for (const p of parsed.prompts) {
            if (typeof p === 'string' && p.trim()) extracted.push(p.trim());
          }
        }
      }

      if (extracted.length > 0) {
        return {
          prompts: extracted,
          rawText: extracted.join('\n---\n'),
        };
      }
    } catch {
      // Fallback to text parsing if JSON parse fails
    }
  }

  if (lowerName.endsWith('.csv')) {
    const rows = content.split(/\r?\n/);
    const extracted: string[] = [];
    let isFirstRow = true;
    let promptColIndex = 0;

    for (const row of rows) {
      if (!row.trim()) continue;
      // Simple CSV cell splitter handling basic quotes
      const cells = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim());

      if (isFirstRow) {
        isFirstRow = false;
        const headerIdx = cells.findIndex((c) => /prompt|query|input|text|message/i.test(c));
        if (headerIdx !== -1) {
          promptColIndex = headerIdx;
          continue; // skip header row
        }
      }

      const val = cells[promptColIndex] || cells[0];
      if (val && val.trim()) {
        extracted.push(val.trim());
      }
    }

    if (extracted.length > 0) {
      return {
        prompts: extracted,
        rawText: extracted.join('\n---\n'),
      };
    }
  }

  // Default .txt or fallback
  const prompts = parsePromptsFromText(content);
  return {
    prompts,
    rawText: content,
  };
}
