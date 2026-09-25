import React from 'react';

export default function Privacy() {
  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <span className="inline-block text-xs font-bold text-[#E30613] tracking-[0.2em] uppercase mb-3">
            Legal
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            How we collect, use and protect information when you use our website and LMS.
          </p>
          <p className="text-sm text-slate-400 mt-6">
            Last updated: 1 January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="prose prose-slate max-w-none">

          <LegalSection title="1. Overview">
            <p>
              This Privacy Policy describes how B and T Skills Development Trainings
              collects, uses and protects information when you visit our website or use
              our Learning Management System (LMS).
            </p>
            <p>
              For information about how we handle personal information under South African
              law, please also see our{' '}
              <a href="/popi">POPI Act Compliance</a> page.
            </p>
          </LegalSection>

          <LegalSection title="2. Information we collect">
            <p>We may collect the following types of information:</p>
            <ul>
              <li>
                <strong>Information you provide</strong> — such as your name, email address,
                phone number and message content when you contact us or apply for a
                programme.
              </li>
              <li>
                <strong>Account information</strong> — if you log into the LMS, we collect
                your email address and password (stored securely).
              </li>
              <li>
                <strong>Usage data</strong> — such as pages visited, time spent, browser
                type, device and IP address.
              </li>
              <li>
                <strong>Cookies</strong> — small files used to remember your preferences and
                analyse traffic.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. How we use your information">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, operate and improve our website and LMS</li>
              <li>Respond to your enquiries and support requests</li>
              <li>Process applications and manage learner accounts</li>
              <li>Send administrative messages (programme updates, assessment notices)</li>
              <li>Analyse site usage to improve content and user experience</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Cookies">
            <p>
              We use cookies to remember your preferences and understand how visitors use
              our site. You can control or disable cookies through your browser settings.
              Disabling cookies may affect the functionality of certain parts of the site.
            </p>
            <p>We use the following types of cookies:</p>
            <ul>
              <li>
                <strong>Essential cookies</strong> — required for the site to function
                (e.g. login session).
              </li>
              <li>
                <strong>Analytics cookies</strong> — help us understand how visitors use
                the site.
              </li>
              <li>
                <strong>Preference cookies</strong> — remember your settings across visits.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Sharing of information">
            <p>
              We do not sell or rent your personal information. We may share information
              with:
            </p>
            <ul>
              <li>Our service providers (hosting, email, analytics) under strict contracts</li>
              <li>Government bodies, SETAs or QCTO where required by law</li>
              <li>Law enforcement or regulators where legally required</li>
            </ul>
          </LegalSection>

          <LegalSection title="6. Data security">
            <p>
              We implement reasonable technical and organisational measures to protect
              your information. These include encryption in transit (HTTPS), access
              controls, and secure storage. However, no method of transmission over the
              internet is 100% secure.
            </p>
          </LegalSection>

          <LegalSection title="7. Data retention">
            <p>
              We retain personal information only as long as necessary to fulfil the
              purposes described in this policy, or as required by law. Learner records
              are retained for a minimum of five years after programme completion.
            </p>
          </LegalSection>

          <LegalSection title="8. Your rights">
            <p>You have the right to:</p>
            <ul>
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal limits)</li>
              <li>Object to certain types of processing</li>
              <li>Lodge a complaint with the Information Regulator</li>
            </ul>
          </LegalSection>

          <LegalSection title="9. Third-party links">
            <p>
              Our site may link to third-party websites. We are not responsible for their
              privacy practices. We encourage you to read the privacy policy of any site
              you visit.
            </p>
          </LegalSection>

          <LegalSection title="10. Children's privacy">
            <p>
              Our services are intended for learners aged 16 and above. We do not
              knowingly collect personal information from children under 16 without
              parental or guardian consent.
            </p>
          </LegalSection>

          <LegalSection title="11. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. The current version
              will always be available on this page.
            </p>
          </LegalSection>

          <LegalSection title="12. Contact">
            <p>
              For questions or requests related to this policy, contact us at{' '}
              <a href="mailto:info@btsdtrainings.co.za">
                info@btsdtrainings.co.za
              </a>
              .
            </p>
          </LegalSection>
        </div>
      </section>
    </div>
  );
}

function LegalSection({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
        {title}
      </h2>
      <div className="space-y-4 text-slate-600 leading-relaxed text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-[#E30613] [&_a]:underline [&_strong]:text-slate-800 [&_strong]:font-semibold">
        {children}
      </div>
    </section>
  );
}