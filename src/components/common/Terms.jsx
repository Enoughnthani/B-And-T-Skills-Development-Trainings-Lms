import React from 'react';

export default function Terms() {
  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <span className="inline-block text-xs font-bold text-[#E30613] tracking-[0.2em] uppercase mb-3">
            Legal
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            The terms governing your use of the B and T Skills Development Trainings
            website, LMS portal and services.
          </p>
          <p className="text-sm text-slate-400 mt-6">
            Last updated: 1 January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="prose prose-slate max-w-none">

          <LegalSection title="1. Acceptance of terms">
            <p>
              By accessing or using the B and T Skills Development Trainings website,
              Learning Management System ("LMS") or any associated services, you agree to
              be bound by these Terms &amp; Conditions. If you do not agree, please do not
              use our services.
            </p>
          </LegalSection>

          <LegalSection title="2. Use of the site and LMS">
            <p>You agree to use our website and LMS only for lawful purposes. You must not:</p>
            <ul>
              <li>Attempt to gain unauthorised access to any part of the system</li>
              <li>Share your login credentials with any other person</li>
              <li>Interfere with the operation of the site or LMS</li>
              <li>Upload viruses, malware or harmful content</li>
              <li>Copy, reproduce or distribute our content without written permission</li>
              <li>Use the platform in any way that could damage our reputation or that of our partners</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Learner accounts">
            <p>
              If you are a learner, you are responsible for maintaining the
              confidentiality of your login credentials and for all activities that occur
              under your account. You must notify us immediately of any unauthorised use
              of your account.
            </p>
          </LegalSection>

          <LegalSection title="4. Programme participation">
            <p>
              Participation in our learnerships, occupational programmes and other training
              initiatives is subject to:
            </p>
            <ul>
              <li>Meeting eligibility requirements for the specific programme</li>
              <li>Signing the relevant learnership or employment agreement</li>
              <li>Attending scheduled training sessions and workplace placements</li>
              <li>Submitting assessments and Portfolio of Evidence by required deadlines</li>
              <li>Complying with our Learner Code of Conduct</li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Intellectual property">
            <p>
              All content on this website and LMS — including text, graphics, logos,
              course materials, assessments and design — is the property of B and T Skills
              Development Trainings or its licensors, and is protected by copyright and
              other intellectual property laws.
            </p>
            <p>
              You may not reproduce, modify, distribute or republish any content without
              our prior written consent.
            </p>
          </LegalSection>

          <LegalSection title="6. Fees and payments">
            <p>
              Where applicable, programme fees, stipends and payment terms will be set out
              in the relevant agreement between you (or your employer) and B and T Skills
              Development Trainings.
            </p>
          </LegalSection>

          <LegalSection title="7. Limitation of liability">
            <p>
              While we take reasonable care to ensure the accuracy and reliability of our
              website and services, we do not warrant that the site will be uninterrupted,
              error-free or free of viruses.
            </p>
            <p>
              To the maximum extent permitted by law, B and T Skills Development Trainings
              shall not be liable for any indirect, incidental or consequential loss
              arising from your use of the site or services.
            </p>
          </LegalSection>

          <LegalSection title="8. Third-party links">
            <p>
              Our website may contain links to third-party sites. We are not responsible
              for the content, privacy practices or terms of any third-party site. Access
              such sites at your own discretion.
            </p>
          </LegalSection>

          <LegalSection title="9. Termination">
            <p>
              We reserve the right to suspend or terminate your access to the LMS or
              services if you breach these terms, fail to meet programme requirements, or
              engage in misconduct as defined in our Learner Code of Conduct.
            </p>
          </LegalSection>

          <LegalSection title="10. Governing law">
            <p>
              These terms are governed by the laws of the Republic of South Africa. Any
              disputes arising from these terms shall be subject to the exclusive
              jurisdiction of the South African courts.
            </p>
          </LegalSection>

          <LegalSection title="11. Changes to these terms">
            <p>
              We may update these terms from time to time. The current version will always
              be available on this page. Continued use of our services after changes
              constitutes acceptance of the updated terms.
            </p>
          </LegalSection>

          <LegalSection title="12. Contact">
            <p>
              For any questions about these terms, please contact us at{' '}
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
      <div className="space-y-4 text-slate-600 leading-relaxed text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-[#E30613] [&_a]:underline">
        {children}
      </div>
    </section>
  );
}