/**
 * Free LLM wrapper built on Groq's OpenAI-compatible API (no SDK dependency).
 * Get a free key at https://console.groq.com (no credit card).
 * Set GROQ_API_KEY. Optionally override GROQ_MODEL.
 */
export function aiConfigured(): boolean {
  return !!process.env.GROQ_API_KEY;
}

export async function askAI(opts: {
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxTokens?: number;
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return { ok: false, error: 'GROQ_API_KEY not set' };
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: opts.maxTokens ?? 500,
        temperature: 0.4,
        messages: [{ role: 'system', content: opts.system }, ...opts.messages],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Groq ${res.status}: ${text}` };
    }
    const json = await res.json();
    const text = (json.choices?.[0]?.message?.content ?? '').trim();
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
