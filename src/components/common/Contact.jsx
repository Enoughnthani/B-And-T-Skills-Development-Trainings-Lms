import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Send,
  CheckCircle2,
} from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General enquiry',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: 'General enquiry', message: '' });
      setTimeout(() => setSent(false), 6000);
    }, 800);
  };

  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <span className="inline-block text-xs font-bold text-[#E30613] tracking-[0.2em] uppercase mb-3">
            Get in touch
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Whether you need a corporate training programme, learnerships or a national
            skills development project — our team is ready to discuss your requirements.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info — left */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="tel:0120041175"
              className="group no-underline flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5 hover:border-[#E30613] transition-colors"
            >
              <div className="w-10 h-10 bg-slate-50 group-hover:bg-[#E30613]/10 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                <Phone size={18} className="text-[#E30613]" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Telephone
                </div>
                <div className="font-bold text-slate-900 group-hover:text-[#E30613] transition-colors">
                  012 004 1175
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/27785134511"
              target="_blank"
              rel="noopener noreferrer"
              className="group no-underline flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5 hover:border-green-600 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-50 group-hover:bg-green-50 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                <MessageCircle size={18} className="text-green-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  WhatsApp
                </div>
                <div className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                  078 513 45 11
                </div>
              </div>
            </a>

            <a
              href="mailto:info@btsdtrainings.co.za"
              className="group  no-underline flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5 hover:border-[#E30613] transition-colors"
            >
              <div className="w-10 h-10 bg-slate-50 group-hover:bg-[#E30613]/10 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                <Mail size={18} className="text-[#E30613]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Email
                </div>
                <div className="font-bold text-slate-900 group-hover:text-[#E30613] truncate transition-colors">
                  info@btsdtrainings.co.za
                </div>
              </div>
            </a>

            <div className="flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-[#E30613]" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Head Office
                </div>
                <div className="font-bold text-slate-900 leading-snug">
                  299 Burger Street
                  <br />
                  Pretoria North, 0182
                </div>
              </div>
            </div>
          </div>

          {/* Form — right */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Send us a message
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                We'll get back to you within one business day.
              </p>

              {sent && (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <strong>Message sent.</strong> We'll be in touch shortly.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="012 345 6789"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors"
                    >
                      <option>General enquiry</option>
                      <option>Corporate training</option>
                      <option>Learnerships</option>
                      <option>B-BBEE partnerships</option>
                      <option>Occupational training</option>
                      <option>Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your requirements…"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-7 py-3 rounded-lg transition-colors"
                >
                  <Send size={16} />
                  {loading ? 'Sending…' : 'Send message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}