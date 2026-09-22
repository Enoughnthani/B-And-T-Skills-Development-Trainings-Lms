import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Policy() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms & Policy</h1>
                    <p className="text-gray-300 mb-8">Effective date: {new Date().toLocaleDateString()}</p>
                    
                    <div className="space-y-6 text-gray-200">
                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">1. Acceptance of Terms</h2>
                            <p>By accessing and using B&T Skills Development Platform, you agree to be bound by these Terms & Policy. If you disagree with any part, please do not use our services.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">2. Learnership Programs</h2>
                            <p className="mb-2">Our NQF learnership programs are subject to specific terms:</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>Program duration ranges from 12-24 months</li>
                                <li>Attendance and participation requirements apply</li>
                                <li>Assessment and portfolio submission deadlines must be met</li>
                                <li>Successful completion requires meeting all learning outcomes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">3. User Accounts</h2>
                            <p>You are responsible for:</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Maintaining the confidentiality of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized use</li>
                                <li>Providing accurate and complete information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">4. Prohibited Activities</h2>
                            <p>Users are prohibited from:</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Plagiarism or academic dishonesty</li>
                                <li>Sharing account credentials with others</li>
                                <li>Attempting to manipulate assessment results</li>
                                <li>Harassing or intimidating other learners or staff</li>
                                <li>Attempting to gain unauthorized access to systems</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">5. Payment Terms</h2>
                            <p>For paid programs:</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Fees are due as per the payment schedule</li>
                                <li>Refunds are subject to our refund policy</li>
                                <li>Late payments may result in program suspension</li>
                                <li>Sponsorship arrangements require written agreements</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">6. Termination</h2>
                            <p>We reserve the right to terminate or suspend access to our service for violations of these terms, including but not limited to academic misconduct, non-payment, or breach of conduct.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">7. Changes to Terms</h2>
                            <p>We may modify these terms at any time. We will notify users of material changes via email or through our platform. Continued use after changes constitutes acceptance.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">8. Contact Information</h2>
                            <p>For questions about these terms, contact us at:</p>
                            <p className="mt-2">
                                Email: <a href="mailto:legal@btskills.com" className="text-sky-400 hover:underline">legal@btskills.com</a><br />
                                Phone: +27 (0) 11 123 4567
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}