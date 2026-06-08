import { describe, it, expect, afterEach, vi } from 'vitest';
import { aiConfigured, askAI } from '../ai';

describe('aiConfigured', () => {
  afterEach(() => { delete process.env.GROQ_API_KEY; });

  it('is false without a key', () => {
    delete process.env.GROQ_API_KEY;
    expect(aiConfigured()).toBe(false);
  });

  it('is true with a key', () => {
    process.env.GROQ_API_KEY = 'gsk_x';
    expect(aiConfigured()).toBe(true);
  });
});

describe('askAI', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GROQ_API_KEY;
  });

  it('fails fast when no key is set', async () => {
    delete process.env.GROQ_API_KEY;
    const r = await askAI({ system: 's', messages: [{ role: 'user', content: 'hi' }] });
    expect(r.ok).toBe(false);
  });

  it('returns the assistant text on success', async () => {
    process.env.GROQ_API_KEY = 'gsk_x';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '  Hello!  ' } }] }),
    }));
    const r = await askAI({ system: 's', messages: [{ role: 'user', content: 'hi' }] });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.text).toBe('Hello!');
  });

  it('prepends the system prompt as the first message', async () => {
    process.env.GROQ_API_KEY = 'gsk_x';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'x' } }] }),
    });
    vi.stubGlobal('fetch', fetchMock);
    await askAI({ system: 'SYSTEM PROMPT', messages: [{ role: 'user', content: 'hi' }] });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.messages[0]).toEqual({ role: 'system', content: 'SYSTEM PROMPT' });
    expect(body.messages[1]).toEqual({ role: 'user', content: 'hi' });
  });

  it('returns an error string on a non-ok response (e.g. rate limit)', async () => {
    process.env.GROQ_API_KEY = 'gsk_x';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429, text: async () => 'rate limited' }));
    const r = await askAI({ system: 's', messages: [] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('429');
  });
});
