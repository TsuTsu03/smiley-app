/**
 * Thin wrapper over the Anthropic Messages API (no SDK dependency).
 * Set ANTHROPIC_API_KEY. Optionally override ANTHROPIC_MODEL.
 */
export function aiConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

export async function askClaude(opts: {
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxTokens?: number;
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { ok: false, error: 'ANTHROPIC_API_KEY not set' };
  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: opts.maxTokens ?? 500,
        system: opts.system,
        messages: opts.messages,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Anthropic ${res.status}: ${text}` };
    }
    const json = await res.json();
    const text = (json.content ?? [])
      .filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('\n')
      .trim();
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
