import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Logo } from '@/components/Logo';

export const metadata = {
  title: 'Privacy Policy — Smiley',
  description: 'How Smiley collects, uses, and protects your personal information under Philippine law.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50/40 font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-4xl mx-auto">
        <Logo href="/" size={32} textClassName="text-sky-800 font-semibold text-base" className="hover:opacity-80 transition-opacity" />
        <Link href="/" className="text-sm text-sky-600 hover:text-sky-800 transition-colors">
          ← Back to Home
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 pb-20 pt-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center flex-shrink-0">
            <Shield size={24} className="text-sky-600" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-sky-900 mb-2">Privacy Policy</h1>
            <p className="text-sky-600/70 text-sm">
              Effective date: May 30, 2026 &nbsp;·&nbsp; Last updated: May 30, 2026
            </p>
          </div>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4 mb-10 text-sm text-teal-800 leading-relaxed">
          <strong>Summary:</strong> Smiley is a dental clinic management platform. We collect and process personal and health-related data to run the service. Under Philippine law (Republic Act No. 10173 — the Data Privacy Act of 2012), dental/health records are classified as <strong>sensitive personal information</strong> and are given the highest level of protection. This policy explains what we collect, why, and your rights as a data subject.
        </div>

        <div className="space-y-10 text-sky-900">

          <Section title="1. Who We Are (Personal Information Controller)">
            <p>
              <strong>Smiley</strong> (operating under the brand name &ldquo;DentaFlow&rdquo;) is the Personal Information Controller (PIC) as defined under Republic Act No. 10173, the <em>Data Privacy Act of 2012</em> (DPA), and its Implementing Rules and Regulations (IRR).
            </p>
            <p className="mt-3">
              <strong>Contact — Data Privacy Officer (DPO):</strong><br />
              Email: <a href="mailto:privacy@dentaflow.app" className="text-sky-600 underline">privacy@dentaflow.app</a><br />
              Address: Philippines
            </p>
            <p className="mt-3 text-sm text-sky-600/80">
              Under Section 21 of the DPA, you have the right to be informed of who controls your data. This section fulfills that requirement.
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p className="mb-3">We collect the following categories of information:</p>
            <Table rows={[
              ['Patient Name, Date of Birth', 'Personal Information', 'Patient identification and login'],
              ['Clinic Contact Details (email, phone, address)', 'Personal Information', 'Account creation and communication'],
              ['Admin & Dentist Email + Password (hashed)', 'Personal Information', 'Authentication'],
              ['Dental Records (procedures, diagnoses, treatment notes)', 'Sensitive Personal Information', 'Clinic operations, patient care'],
              ['Appointment History & Schedules', 'Personal Information', 'Scheduling and reminders'],
              ['Device & Usage Data (IP address, browser, pages visited)', 'Personal Information', 'Security and analytics'],
            ]} headers={['Data Type', 'Classification', 'Purpose']} />
            <p className="mt-4 text-sm text-sky-600/80">
              <strong>Note:</strong> Health and dental records are <strong>Sensitive Personal Information</strong> under Section 3(l) of the DPA. Processing this data requires explicit consent and heightened security measures, which we comply with.
            </p>
          </Section>

          <Section title="3. Legal Bases for Processing">
            <p className="mb-3">Under Section 12 and 13 of the DPA, we process your data on the following lawful grounds:</p>
            <ul className="space-y-2 list-none">
              <Li><strong>Consent</strong> — You actively agree to this Privacy Policy when registering a clinic or using the platform as a patient.</Li>
              <Li><strong>Performance of Contract</strong> — Processing is necessary to deliver the clinic management services you subscribed to (Section 12[b]).</Li>
              <Li><strong>Legitimate Interest</strong> — We process minimal usage data to keep the platform secure and functional.</Li>
              <Li><strong>Compliance with Legal Obligation</strong> — Philippine health regulations may require retention of certain medical records.</Li>
            </ul>
          </Section>

          <Section title="4. How We Use Your Data">
            <ul className="space-y-2 list-none">
              <Li>Provide, operate, and improve the Smiley clinic management platform</Li>
              <Li>Authenticate users and prevent unauthorized access</Li>
              <Li>Enable dentists and admins to manage patient records and appointments</Li>
              <Li>Send appointment reminders (SMS/email) where the clinic enables this feature</Li>
              <Li>Respond to support requests and technical issues</Li>
              <Li>Comply with applicable Philippine laws and regulations</Li>
            </ul>
            <p className="mt-4 text-sm text-sky-600/80">
              We <strong>do not sell, rent, or trade</strong> your personal information to third parties for marketing purposes.
            </p>
          </Section>

          <Section title="5. Data Sharing and Third-Party Processors">
            <p className="mb-3">
              We share data only with trusted sub-processors who are contractually bound to protect it. Under Section 14 of the DPA, processors must comply with our instructions and applicable law.
            </p>
            <Table rows={[
              ['Supabase Inc.', 'Database & authentication hosting', 'USA (SCCs apply)'],
              ['Email/SMS Providers', 'Appointment reminders (if enabled)', 'Philippines / Cloud'],
            ]} headers={['Processor', 'Purpose', 'Location']} />
            <p className="mt-4 text-sm text-sky-600/80">
              For transfers outside the Philippines, we ensure safeguards such as Standard Contractual Clauses (SCCs) are in place in accordance with NPC Advisory No. 2017-01.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <Table rows={[
              ['Patient Dental Records', 'Duration of clinic subscription + 10 years', 'DOH record-keeping guidelines'],
              ['Account Credentials', 'Active account lifespan', 'Security'],
              ['Appointment Logs', '3 years from appointment date', 'Operational records'],
              ['Usage / Access Logs', '12 months', 'Security auditing'],
            ]} headers={['Data Type', 'Retention Period', 'Basis']} />
            <p className="mt-4 text-sm text-sky-600/80">
              Upon account deletion or clinic termination, personal data is anonymized or securely deleted within 30 days, except where retention is required by law.
            </p>
          </Section>

          <Section title="7. Your Rights as a Data Subject (Philippine DPA, Chapter IV)">
            <p className="mb-3">Under Sections 16–20 of the DPA, you have the following rights:</p>
            <ul className="space-y-3 list-none">
              <Li><strong>Right to be Informed</strong> — You have the right to know how your data is collected, processed, and stored (Section 16).</Li>
              <Li><strong>Right to Access</strong> — You may request a copy of your personal information held by us (Section 16[c]).</Li>
              <Li><strong>Right to Rectification</strong> — You may request correction of inaccurate or outdated data (Section 16[d]).</Li>
              <Li><strong>Right to Erasure or Blocking</strong> — You may request deletion or blocking of data that is unlawfully processed or no longer necessary (Section 16[e]).</Li>
              <Li><strong>Right to Object</strong> — You may object to processing based on legitimate interest (Section 18).</Li>
              <Li><strong>Right to Data Portability</strong> — You may request your data in a structured, commonly used format (Section 18[b]).</Li>
              <Li><strong>Right to Damages</strong> — You may claim compensation if you suffered damages due to inaccurate, incomplete, or false data (Section 16[f]).</Li>
            </ul>
            <p className="mt-4">
              To exercise these rights, email our DPO at{' '}
              <a href="mailto:privacy@dentaflow.app" className="text-sky-600 underline">privacy@dentaflow.app</a>.
              We will respond within <strong>15 working days</strong> as required by NPC Circular 16-01.
            </p>
          </Section>

          <Section title="8. Security Measures">
            <p className="mb-3">
              Under Section 20 of the DPA, we implement reasonable and appropriate organizational, physical, and technical measures to protect your data:
            </p>
            <ul className="space-y-2 list-none">
              <Li>All data is encrypted in transit (TLS 1.2+) and at rest (AES-256)</Li>
              <Li>Passwords are hashed and never stored in plain text</Li>
              <Li>Role-based access control — dentists can only access their clinic&apos;s patients</Li>
              <Li>Regular security reviews and vulnerability assessments</Li>
              <Li>Supabase infrastructure complies with SOC 2 Type II standards</Li>
            </ul>
            <p className="mt-4 text-sm text-sky-600/80">
              In the event of a personal data breach, we will notify the National Privacy Commission (NPC) within <strong>72 hours</strong> of discovery and inform affected data subjects without unreasonable delay, as required by Section 20(f) of the DPA.
            </p>
          </Section>

          <Section title="9. Cookies and Tracking">
            <p className="mb-3">We use the following cookies and similar technologies:</p>
            <Table rows={[
              ['Session Cookie', 'Strictly Necessary', 'Keeps you logged in during your session'],
              ['CSRF Token', 'Strictly Necessary', 'Prevents cross-site request forgery attacks'],
              ['Analytics (future)', 'Optional', 'Aggregate usage statistics — you can opt out'],
            ]} headers={['Cookie', 'Type', 'Purpose']} />
            <p className="mt-4 text-sm text-sky-600/80">
              Strictly necessary cookies do not require consent. Optional analytics cookies, if implemented, will be subject to prior consent in line with NPC Advisory No. 2020-01.
            </p>
          </Section>

          <Section title="10. Children's Data">
            <p>
              Smiley is not directed to children under 13 years of age as primary account holders. However, clinics may register patients who are minors. In such cases, the clinic (as an independent Personal Information Controller for its patients) is responsible for obtaining parental consent as required by Section 13(e) of the DPA.
            </p>
          </Section>

          <Section title="11. Filing a Complaint">
            <p>
              If you believe your data privacy rights have been violated, you may file a complaint with the:
            </p>
            <div className="mt-3 bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm">
              <strong>National Privacy Commission (NPC)</strong><br />
              Website:{' '}
              <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">
                www.privacy.gov.ph
              </a><br />
              Email: <a href="mailto:complaints@privacy.gov.ph" className="text-sky-600 underline">complaints@privacy.gov.ph</a><br />
              Address: 3F Core G, GSIS Complex, Roxas Blvd., Pasay City, Metro Manila, Philippines
            </div>
            <p className="mt-3 text-sm text-sky-600/80">
              We encourage you to contact our DPO first so we can resolve concerns directly.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Material changes will be notified via email or a prominent notice in the app at least <strong>30 days</strong> before taking effect. Continued use after the effective date constitutes acceptance of the revised policy.
            </p>
          </Section>

        </div>

        {/* Footer links */}
        <div className="mt-12 pt-6 border-t border-sky-100 flex flex-wrap gap-4 text-sm text-sky-600">
          <Link href="/terms" className="hover:text-sky-800 transition-colors underline">Terms of Service</Link>
          <Link href="/" className="hover:text-sky-800 transition-colors">← Back to Smiley</Link>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl text-sky-800 mb-3 pb-2 border-b border-sky-100">{title}</h2>
      <div className="text-sky-800/80 leading-relaxed text-sm sm:text-base">{children}</div>
    </section>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function Table({ rows, headers }: { rows: string[][]; headers: string[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-sky-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-sky-50 text-sky-700">
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-2.5 font-semibold first:rounded-tl-xl last:rounded-tr-xl">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sky-800/80">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
