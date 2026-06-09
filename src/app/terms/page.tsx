import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Logo } from '@/components/Logo';

export const metadata = {
  title: 'Terms of Service — Smiley',
  description: 'Terms and conditions governing use of the Smiley clinic management platform.',
};

export default function TermsOfServicePage() {
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
            <FileText size={24} className="text-sky-600" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-sky-900 mb-2">Terms of Service</h1>
            <p className="text-sky-600/70 text-sm">
              Effective date: May 30, 2026 &nbsp;·&nbsp; Last updated: May 30, 2026
            </p>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-2xl px-5 py-4 mb-10 text-sm text-sky-800 leading-relaxed">
          <strong>Please read these terms carefully.</strong> By registering a clinic or using Smiley, you agree to be legally bound by these Terms of Service. These terms are governed by Philippine law, including Republic Act No. 8792 (Electronic Commerce Act of 2000) and the Civil Code of the Philippines.
        </div>

        <div className="space-y-10 text-sky-900">

          <Section title="1. Definitions">
            <ul className="space-y-2 list-none">
              <Li><strong>&ldquo;StackWise&rdquo; / &ldquo;we&rdquo; / &ldquo;us&rdquo;</strong> — StackWise, the operator of the &ldquo;Smiley&rdquo; clinic management platform.</Li>
              <Li><strong>&ldquo;Clinic&rdquo;</strong> — a dental clinic that registers and subscribes to the platform.</Li>
              <Li><strong>&ldquo;Authorized User&rdquo;</strong> — an admin or dentist account created under a registered Clinic.</Li>
              <Li><strong>&ldquo;Patient&rdquo;</strong> — an individual whose dental records are managed through the platform.</Li>
              <Li><strong>&ldquo;Service&rdquo;</strong> — all features accessible through Smiley, including patient records, appointment scheduling, reminders, and dashboards.</Li>
            </ul>
          </Section>

          <Section title="2. Acceptance of Terms">
            <p>
              By clicking &ldquo;Create Clinic,&rdquo; &ldquo;Sign In,&rdquo; or otherwise accessing or using the Service, you represent that:
            </p>
            <ul className="space-y-2 list-none mt-3">
              <Li>You are at least 18 years old and legally capable of entering into a binding contract under Philippine law (Civil Code, Article 1327).</Li>
              <Li>If acting on behalf of a clinic or organization, you have authority to bind that entity to these Terms.</Li>
              <Li>You have read and agree to our <Link href="/privacy" className="text-sky-600 underline">Privacy Policy</Link>, which is incorporated herein by reference.</Li>
            </ul>
          </Section>

          <Section title="3. Service Description and License">
            <p>
              Smiley provides a web-based dental clinic management system allowing clinics to manage patient records, appointments, and communications. Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service solely for your clinic&apos;s internal business operations.
            </p>
            <p className="mt-3">
              Each clinic receives a unique subdomain (e.g., <code className="bg-sky-50 px-1.5 py-0.5 rounded text-sky-700">yourclinic.smileyhq.it.com</code>) and is solely responsible for all activity occurring under that subdomain.
            </p>
          </Section>

          <Section title="4. Acceptable Use Policy">
            <p className="mb-3">You agree <strong>not</strong> to:</p>
            <ul className="space-y-2 list-none">
              <Li>Use the Service for any unlawful purpose or in violation of any Philippine law or regulation, including RA 10173 (Data Privacy Act), RA 8792 (E-Commerce Act), and RA 11930 (Anti-Online Sexual Abuse Act).</Li>
              <Li>Access, tamper with, or use non-public areas of the Service or its infrastructure.</Li>
              <Li>Attempt to reverse-engineer, decompile, or extract source code from the platform.</Li>
              <Li>Upload or transmit malware, viruses, or any malicious code.</Li>
              <Li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity.</Li>
              <Li>Use automated tools (scrapers, bots) to extract data from the platform without our prior written consent.</Li>
              <Li>Share account credentials with unauthorized individuals outside your clinic&apos;s registered users.</Li>
              <Li>Use patient health data for any purpose other than the direct provision of dental care services.</Li>
            </ul>
          </Section>

          <Section title="5. Clinic and User Responsibilities">
            <p className="mb-3">
              As a Personal Information Controller under the Philippine Data Privacy Act (RA 10173), each registered clinic is independently responsible for:
            </p>
            <ul className="space-y-2 list-none">
              <Li>Obtaining valid patient consent before entering their personal and health data into the platform.</Li>
              <Li>Ensuring that patient records entered are accurate and up to date.</Li>
              <Li>Maintaining the confidentiality of admin and dentist login credentials.</Li>
              <Li>Complying with all applicable laws, including the DPA, the Philippine Medical Act (RA 2382), and DOH regulations on medical record retention.</Li>
              <Li>Notifying Smiley promptly of any unauthorized access or suspected breach involving your clinic&apos;s account.</Li>
            </ul>
            <p className="mt-4 text-sm text-sky-600/80">
              Smiley acts as a Personal Information Processor on behalf of each clinic for the patient data stored within that clinic&apos;s account. Smiley&apos;s own processing of platform-level data (accounts, usage) is governed by our Privacy Policy.
            </p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              All intellectual property rights in the Smiley platform — including software, designs, trademarks, logos, and content created by us — are and shall remain the exclusive property of StackWise. Nothing in these Terms grants you any rights to our intellectual property except the limited license in Section 3.
            </p>
            <p className="mt-3">
              <strong>Your clinic data</strong> (patient records, appointment data, and content you upload) remains your property. You grant us a limited license to process and store this data solely to provide the Service.
            </p>
          </Section>

          <Section title="7. Payment and Subscription">
            <p>
              Certain features of Smiley may require a paid subscription. Pricing, billing cycles, and payment terms will be communicated at the time of subscription. All fees are in Philippine Peso (PHP) unless otherwise stated.
            </p>
            <p className="mt-3">
              Under RA 7394 (Consumer Act of the Philippines), you are entitled to clear and accurate information about pricing before you are charged. We will not change subscription pricing without at least 30 days&apos; prior notice.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p className="mb-3">
              To the maximum extent permitted by Philippine law:
            </p>
            <ul className="space-y-2 list-none">
              <Li>Smiley provides the Service on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.</Li>
              <Li>We do not warrant that the Service will be uninterrupted, error-free, or completely secure.</Li>
              <Li>Smiley shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.</Li>
              <Li>Our total liability to you for any claims arising from these Terms or the Service shall not exceed the amount you paid to us in the three (3) months preceding the claim.</Li>
            </ul>
            <p className="mt-4 text-sm text-sky-600/80">
              Nothing in this section limits liability for gross negligence, fraud, or willful misconduct, which cannot be waived under Philippine law (Civil Code, Article 1172).
            </p>
          </Section>

          <Section title="9. Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless Smiley and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or in any way connected with:
            </p>
            <ul className="space-y-2 list-none mt-3">
              <Li>Your violation of these Terms or applicable law;</Li>
              <Li>Your clinic&apos;s failure to comply with the Data Privacy Act or other data protection obligations;</Li>
              <Li>Any claim by a third party (including patients) arising from your use of the Service.</Li>
            </ul>
          </Section>

          <Section title="10. Account Suspension and Termination">
            <p className="mb-3">
              We reserve the right to suspend or terminate your account, with or without notice, if:
            </p>
            <ul className="space-y-2 list-none">
              <Li>You breach any provision of these Terms;</Li>
              <Li>We are required to do so by applicable law or a government order;</Li>
              <Li>Your account has been inactive for more than 12 consecutive months;</Li>
              <Li>You engage in fraudulent, abusive, or harmful conduct toward other users or the platform.</Li>
            </ul>
            <p className="mt-4">
              Upon termination, your license to use the Service ends immediately. You may request an export of your clinic data within 30 days of termination, after which data may be permanently deleted in accordance with our <Link href="/privacy" className="text-sky-600 underline">Privacy Policy</Link>.
            </p>
          </Section>

          <Section title="11. Dispute Resolution">
            <p>
              These Terms are governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions.
            </p>
            <p className="mt-3">
              <strong>Step 1 — Amicable Resolution:</strong> We encourage you to contact us at{' '}
              <a href="mailto:support@stackwise.com" className="text-sky-600 underline">support@stackwise.com</a>{' '}
              first. Most issues can be resolved within 15 business days without formal proceedings.
            </p>
            <p className="mt-3">
              <strong>Step 2 — Mediation:</strong> If the dispute cannot be resolved amicably, both parties agree to submit to mediation before filing formal legal action, in accordance with the Alternative Dispute Resolution Act of 2004 (RA 9285).
            </p>
            <p className="mt-3">
              <strong>Step 3 — Jurisdiction:</strong> Any unresolved dispute shall be subject to the exclusive jurisdiction of the proper courts of <strong>Metro Manila, Philippines</strong>.
            </p>
          </Section>

          <Section title="12. Force Majeure">
            <p>
              Smiley shall not be liable for any failure or delay in performance under these Terms due to causes beyond our reasonable control, including but not limited to natural disasters, acts of government, power outages, internet infrastructure failures, or pandemics (Civil Code, Article 1174).
            </p>
          </Section>

          <Section title="13. Modifications to the Service and Terms">
            <p>
              We reserve the right to modify or discontinue the Service (or any part thereof) at any time. We will provide at least <strong>30 days&apos; notice</strong> for material changes via email or in-app notification.
            </p>
            <p className="mt-3">
              Continued use of the Service after the effective date of any amendment constitutes your acceptance of the revised Terms. If you do not agree, you must stop using the Service and may request data deletion.
            </p>
          </Section>

          <Section title="14. Severability">
            <p>
              If any provision of these Terms is found to be unenforceable or invalid by a Philippine court, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.
            </p>
          </Section>

          <Section title="15. Contact Us">
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm space-y-1">
              <p><strong>StackWise</strong> — operator of Smiley</p>
              <p>Email: <a href="mailto:support@stackwise.com" className="text-sky-600 underline">support@stackwise.com</a></p>
              <p>Data Privacy Officer: <a href="mailto:privacy@stackwise.com" className="text-sky-600 underline">privacy@stackwise.com</a></p>
              <p>Address: Philippines</p>
            </div>
          </Section>

        </div>

        {/* Footer links */}
        <div className="mt-12 pt-6 border-t border-sky-100 flex flex-wrap gap-4 text-sm text-sky-600">
          <Link href="/privacy" className="hover:text-sky-800 transition-colors underline">Privacy Policy</Link>
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
