import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  reminderEmailHtml,
  demoRequestNotificationHtml,
  demoRequestConfirmationHtml,
  trialSignupNotificationHtml,
  sendEmail,
} from '../email';

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

describe('demoRequestNotificationHtml', () => {
  it('includes every provided field', () => {
    const html = demoRequestNotificationHtml({
      name: 'Dr. Ana',
      email: 'ana@x.com',
      clinicName: 'BrightSmile',
      dentists: '2-3',
      phone: '0917',
      message: 'Interested',
    });
    expect(html).toContain('Dr. Ana');
    expect(html).toContain('ana@x.com');
    expect(html).toContain('BrightSmile');
    expect(html).toContain('2-3');
    expect(html).toContain('0917');
    expect(html).toContain('Interested');
  });

  it('omits optional rows when not provided', () => {
    const html = demoRequestNotificationHtml({
      name: 'Ana',
      email: 'a@x.com',
      clinicName: 'BrightSmile',
    });
    expect(html).not.toContain('Phone');
    expect(html).not.toContain('Dentists');
    expect(html).not.toContain('Message');
  });

  it('escapes HTML in user-supplied values', () => {
    const html = demoRequestNotificationHtml({
      name: '<script>alert(1)</script>',
      email: 'a&b@x.com',
      clinicName: 'BrightSmile',
    });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('a&amp;b@x.com');
  });
});

describe('demoRequestConfirmationHtml', () => {
  it('greets the prospect by name', () => {
    const html = demoRequestConfirmationHtml({ name: 'Maria' });
    expect(html).toContain('Maria');
    expect(html).toContain('Smiley');
  });
});

describe('trialSignupNotificationHtml', () => {
  it('includes all clinic and admin details when provided', () => {
    const html = trialSignupNotificationHtml({
      clinicName: 'BrightSmile Dental',
      slug: 'brightsmile',
      adminName: 'Dr. Ana Reyes',
      adminEmail: 'admin@brightsmile.com',
      phone: '(02) 8123-4567',
      clinicEmail: 'hello@brightsmile.com',
    });
    expect(html).toContain('BrightSmile Dental');
    expect(html).toContain('brightsmile');
    expect(html).toContain('Dr. Ana Reyes');
    expect(html).toContain('admin@brightsmile.com');
    expect(html).toContain('(02) 8123-4567');
    expect(html).toContain('hello@brightsmile.com');
    expect(html).toContain('free trial');
  });

  it('omits the optional phone and clinic email rows when missing', () => {
    const html = trialSignupNotificationHtml({
      clinicName: 'BrightSmile',
      slug: 'brightsmile',
      adminName: 'Ana',
      adminEmail: 'admin@x.com',
    });
    expect(html).not.toContain('Phone');
    expect(html).not.toContain('Clinic email');
  });

  it('escapes HTML in the clinic and admin names', () => {
    const html = trialSignupNotificationHtml({
      clinicName: '<b>Evil</b>',
      slug: 's',
      adminName: 'A & B',
      adminEmail: 'a@x.com',
    });
    expect(html).not.toContain('<b>Evil</b>');
    expect(html).toContain('&lt;b&gt;Evil&lt;/b&gt;');
    expect(html).toContain('A &amp; B');
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
