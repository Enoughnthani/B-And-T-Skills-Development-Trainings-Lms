import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function PopiAct() {
  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <span className="inline-block text-xs font-bold text-[#E30613] tracking-[0.2em] uppercase mb-3">
            Legal
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            POPI Act Compliance
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            How B and T Skills Development Trainings protects your personal information in
            line with the Protection of Personal Information Act, 4 of 2013 (POPIA).
          </p>
          <p className="text-sm text-slate-400 mt-6">
            Last updated: 1 January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="prose prose-slate max-w-none">

          <LegalSection title="1. Introduction">
            <p>
              B and T Skills Development Trainings ("we", "us", "our") respects your
              privacy and is committed to protecting your personal information. This
              notice explains how we collect, use, share and safeguard your personal
              information in accordance with the Protection of Personal Information Act
              (POPIA).
            </p>
            <p>
              By interacting with our programmes, website or services, you consent to the
              practices described in this notice.
            </p>
          </LegalSection>

          <LegalSection title="2. What information we collect">
            <p>We may collect the following categories of personal information:</p>
            <ul>
              <li>Identifying information (full name, ID number, date of birth, gender)</li>
              <li>Contact details (email address, phone number, physical address)</li>
              <li>Educational and employment history</li>
              <li>Qualifications and certifications</li>
              <li>Banking details for stipend payments (where applicable)</li>
              <li>Assessment records, Portfolio of Evidence and progress data</li>
              <li>Any other information you provide voluntarily</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. How we use your information">
            <p>Your personal information is used for the following purposes:</p>
            <ul>
              <li>Learner recruitment and enrolment</li>
              <li>Programme delivery, assessment and certification</li>
              <li>Compliance with SETA, QCTO and DHET reporting requirements</li>
              <li>Payment of stipends and grants (where applicable)</li>
              <li>Communication regarding your programme</li>
              <li>Monitoring and evaluation of programme outcomes</li>
              <li>Reporting to funders and government bodies (in anonymised or aggregated form where possible)</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Legal basis for processing">
            <p>
              We process your personal information on the basis of your consent, the
              performance of a contract (your learnership or employment agreement), and
              our legal obligations under South African education and training
              legislation.
            </p>
          </LegalSection>

          <LegalSection title="5. Sharing your information">
            <p>
              We may share your personal information with the following parties, strictly
              on a need-to-know basis:
            </p>
            <ul>
              <li>The relevant SETA, QCTO or government department for compliance and reporting</li>
              <li>Host employers where you are placed for workplace learning</li>
              <li>Funders supporting your programme (in anonymised or aggregated form where possible)</li>
              <li>Our service providers who assist with administration, IT or payments</li>
            </ul>
            <p>
              We do not sell your personal information to any third party.
            </p>
          </LegalSection>

          <LegalSection title="6. How long we keep your information">
            <p>
              We retain your personal information for as long as necessary to fulfil the
              purposes for which it was collected, and for a minimum of five years after
              the completion of your programme, in line with statutory record-keeping
              requirements.
            </p>
          </LegalSection>

          <LegalSection title="7. Your rights">
            <p>Under POPIA, you have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction or deletion of your personal information</li>
              <li>Object to the processing of your personal information</li>
              <li>Withdraw your consent at any time (subject to legal limitations)</li>
              <li>Lodge a complaint with the Information Regulator</li>
            </ul>
          </LegalSection>

          <LegalSection title="8. Security">
            <p>
              We implement appropriate technical and organisational measures to protect
              your personal information against unauthorised access, loss, misuse or
              alteration. Access to personal information is restricted to authorised
              personnel only.
            </p>
          </LegalSection>

          <LegalSection title="9. Cookies">
            <p>
              Our website may use cookies to improve your browsing experience and analyse
              site traffic. You can control cookies through your browser settings. Please
              see our Privacy Policy for more details.
            </p>
          </LegalSection>

          <LegalSection title="10. Changes to this notice">
            <p>
              We may update this notice from time to time. The most current version will
              always be available on our website. We recommend that you review it
              periodically.
            </p>
          </LegalSection>

          <LegalSection title="11. Contact us">
            <p>
              If you have any questions about this notice or wish to exercise your rights,
              please contact our Information Officer:
            </p>
            <div className="not-prose mt-6 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#E30613] shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Email
                  </div>
                  <a
                    href="mailto:info@btsdtrainings.co.za"
                    className="font-bold text-slate-900 hover:text-[#E30613]"
                  >
                    info@btsdtrainings.co.za
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#E30613] shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Telephone
                  </div>
                  <a
                    href="tel:0120041175"
                    className="font-bold text-slate-900 hover:text-[#E30613]"
                  >
                    012 004 1175
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[#E30613] shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Head Office
                  </div>
                  <div className="font-bold text-slate-900">
                    299 Burger Street, Pretoria North, 0182
                  </div>
                </div>
              </div>
            </div>
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