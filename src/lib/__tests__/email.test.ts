import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { reminderEmailHtml, sendEmail } from '../email';

describe('reminderEmailHtml', () => {
  it('embeds patient, clinic, date, time and type', () => {
    const html = reminderEmailHtml({
      patientName: 'Juan',
      clinicName: 'BrightSmile Dental',
      date: '2026-06-15',
      time: '9:00 AM',
      type: 'Cleaning',
    });
    expect(html).toContain('Juan');
    expect(html).toContain('BrightSmile Dental');
    expect(html).toContain('2026-06-15');
    expect(html).toContain('9:00 AM');
    expect(html).toContain('Cleaning');
  });
});

describe('sendEmail', () => {
  beforeEach(() => {
    process.env.BREVO_API_KEY = 'test-key';
    process.env.BREVO_SENDER_EMAIL = 'sender@example.com';
    delete process.env.BREVO_SENDER_NAME;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BREVO_API_KEY;
    delete process.env.BREVO_SENDER_EMAIL;
  });

  it('returns an error when not configured', async () => {
    delete process.env.BREVO_API_KEY;
    const r = await sendEmail({ to: 'a@b.com', subject: 's', html: '<p>x</p>' });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/not configured/i);
  });

  it('posts to Brevo with clinic name as sender and a reply-to', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    const r = await sendEmail({
      to: 'patient@x.com',
      subject: 'Reminder',
      html: '<p>hi</p>',
      fromName: 'BrightSmile Dental',
      replyTo: 'clinic@x.com',
    });

    expect(r.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain('api.brevo.com');
    expect(opts.headers['api-key']).toBe('test-key');
    const body = JSON.parse(opts.body);
    expect(body.sender).toEqual({ email: 'sender@example.com', name: 'BrightSmile Dental' });
    expect(body.to).toEqual([{ email: 'patient@x.com' }]);
    expect(body.replyTo).toEqual({ email: 'clinic@x.com' });
    expect(body.htmlContent).toBe('<p>hi</p>');
  });

  it('falls back to BREVO_SENDER_NAME / default when no fromName', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);
    await sendEmail({ to: 'a@b.com', subject: 's', html: 'x' });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.sender.name).toBe('Smiley');
    expect(body.replyTo).toBeUndefined();
  });

  it('sanitizes unsafe characters in the sender display name', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);
    await sendEmail({ to: 'a@b.com', subject: 's', html: 'x', fromName: 'Evil <x>\n"Clinic"' });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.sender.name).toBe('Evil xClinic');
  });

  it('returns an error string on a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 400, text: async () => 'bad request' }));
    const r = await sendEmail({ to: 'a@b.com', subject: 's', html: 'x' });
    expect(r.ok).toBe(false);
    expect(r.error).toContain('400');
  });

  it('returns an error on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNRESET')));
    const r = await sendEmail({ to: 'a@b.com', subject: 's', html: 'x' });
    expect(r.ok).toBe(false);
    expect(r.error).toContain('ECONNRESET');
  });
});
