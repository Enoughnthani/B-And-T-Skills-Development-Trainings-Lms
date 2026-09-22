import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, ChevronUp, Mail, Phone, Clock } from "lucide-react";

export default function Help() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            id: 1,
            question: "How do I apply for a learnership?",
            answer: "To apply for a learnership, create an account on our platform, browse available programs, and click 'Apply Now'. Complete the application form and upload required documents. You'll receive confirmation via email."
        },
        {
            id: 2,
            question: "What are the entry requirements?",
            answer: "Entry requirements vary by program level. Generally: NQF Level 2-4 requires Grade 10-12, Level 5 requires Grade 12, Level 6 requires relevant NQF Level 5 qualification. Check specific program details."
        },
        {
            id: 3,
            question: "How do I reset my password?",
            answer: "Click 'Forgot Password' on the login page, enter your registered email, and follow the OTP verification process. You'll receive a 6-digit code to reset your password securely."
        },
        {
            id: 4,
            question: "How long are learnership programs?",
            answer: "Learnership durations vary: Certificate programs (12 months), Diploma programs (18 months), Advanced Diploma (24 months). Each includes theoretical learning and workplace experience."
        },
        {
            id: 5,
            question: "Is financial aid available?",
            answer: "Yes, we offer various funding options including NSFAS, bursaries, and payment plans. Contact our financial aid office for eligibility criteria and application deadlines."
        },
        {
            id: 6,
            question: "How are assessments conducted?",
            answer: "Assessments include formative (assignments, quizzes) and summative (exams, portfolios). Some are online, others require in-person attendance at designated centers."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Help Center</h1>
                        <p className="text-xl text-gray-300">How can we assist you today?</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                    </div>

                    {/* Main Content */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                        {/* FAQ Section */}
                        <div className="p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                            
                            <div className="space-y-4">
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map(faq => (
                                        <div key={faq.id} className="border  border-white/20 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                                className="w-full text-left bg-zinc-600/30 px-6 py-4 flex justify-between items-center hover:bg-white/10 transition"
                                            >
                                                <span className="text-white font-medium">{faq.question}</span>
                                                {openFaq === faq.id ? 
                                                    <ChevronUp className="text-sky-400" size={20} /> : 
                                                    <ChevronDown className="text-sky-400" size={20} />
                                                }
                                            </button>
                                            {openFaq === faq.id && (
                                                <div className="px-6 py-4 bg-black/20 border-t border-white/20">
                                                    <p className="text-gray-300">{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-300 text-center py-8">No results found. Please try a different search term.</p>
                                )}
                            </div>
                        </div>

                        {/* Contact Support Section */}
                        <div className="bg-black/20 p-6 md:p-8 border-t border-white/20">
                            <h3 className="text-xl font-bold text-white mb-6 text-center">Still need help?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <Mail className="mx-auto text-sky-400 mb-3" size={32} />
                                    <h4 className="text-white font-semibold mb-2">Email Support</h4>
                                    <p className="text-gray-300 text-sm">support@btskills.com</p>
                                    <p className="text-gray-400 text-xs mt-1">Response within 24hrs</p>
                                </div>
                                <div className="text-center">
                                    <Phone className="mx-auto text-sky-400 mb-3" size={32} />
                                    <h4 className="text-white font-semibold mb-2">Phone Support</h4>
                                    <p className="text-gray-300 text-sm">+27 (0) 11 123 4567</p>
                                    <p className="text-gray-400 text-xs mt-1">Mon-Fri, 8am-5pm</p>
                                </div>
                                <div className="text-center">
                                    <Clock className="mx-auto text-sky-400 mb-3" size={32} />
                                    <h4 className="text-white font-semibold mb-2">Live Chat</h4>
                                    <p className="text-gray-300 text-sm">Available 24/7</p>
                                    <button className="mt-2 text-sky-400 hover:text-sky-300 text-sm font-semibold">
                                        Start Chat →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Resources */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-300">
                            Can't find what you're looking for?{" "}
                            <button className="text-sky-400 hover:text-sky-300 font-semibold">
                                Submit a support ticket
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}