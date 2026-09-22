import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-12">

                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-gray-300 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="space-y-6 text-gray-200">
                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">1. Information We Collect</h2>
                            <p className="mb-2">We collect information you provide directly to us, including:</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>Name and contact information</li>
                                <li>Account credentials</li>
                                <li>Payment information</li>
                                <li>Communication preferences</li>
                                <li>Educational background and qualifications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">2. How We Use Your Information</h2>
                            <p className="mb-2">We use the information we collect to:</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>Provide, maintain, and improve our learnership programs</li>
                                <li>Process applications and enrollment</li>
                                <li>Send important updates about your program</li>
                                <li>Respond to your inquiries and support requests</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">3. Data Security</h2>
                            <p>We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">4. Data Sharing</h2>
                            <p>We do not sell your personal information. We may share your data with:</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Educational partners and accreditation bodies</li>
                                <li>Service providers who assist in our operations</li>
                                <li>Legal authorities when required by law</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">5. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate information</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-sky-400 mb-3">6. Contact Us</h2>
                            <p>For privacy-related questions, contact us at:</p>
                            <p className="mt-2">
                                Email: <a href="mailto:privacy@btskills.com" className="text-sky-400 hover:underline">privacy@btskills.com</a><br />
                                Phone: +27 (0) 11 123 4567<br />
                                Address: 123 Main Street, Johannesburg, 2000
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}