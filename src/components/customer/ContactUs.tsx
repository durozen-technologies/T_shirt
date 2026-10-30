import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    estimatedQuantity: '100 - 500 pcs',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        estimatedQuantity: '100 - 500 pcs',
        message: '',
      });
    }, 4000);
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="max-w-2xl mb-12 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Factory Sales Desk & Support</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
          Connect With Our Apparel Specialists
        </h2>
        <p className="text-sm text-slate-600">
          Have queries about GSM selection, custom dying to Pantone match, or large-scale tender orders? Our merchandising leads respond within 30 minutes during business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Direct Contacts (Cols 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <h3 className="text-base font-bold text-slate-950">Manufacturing & Regional Hubs</h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Tirupur Plant & Dyehouse</div>
                  <div className="mt-0.5 leading-relaxed">
                    Plot 42-45, SIDCO Garment Park, Anupparpalayam, Tirupur, Tamil Nadu 641603
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Bengaluru Corporate Sales Suite</div>
                  <div className="mt-0.5 leading-relaxed">
                    Level 5, Tower B, Prestige Meridian, MG Road, Bengaluru, Karnataka 560001
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Direct Telephone Desk</div>
                  <div className="mt-0.5 leading-relaxed font-mono">
                    +91 98450 12890 / +91 421 249800
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Official Electronic Inbound</div>
                  <div className="mt-0.5 leading-relaxed font-mono">
                    b2b-sales@durozenapparel.com
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Production & Floor Hours</div>
                  <div className="mt-0.5 leading-relaxed">
                    Monday to Saturday: 08:30 AM – 07:30 PM IST
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA Button */}
            <a
              href="https://wa.me/919845012890?text=Hi%20Durozen%20Apparel%20Team%2C%20I%20need%20a%20bulk%20T-shirt%20quotation."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp Business Desk</span>
            </a>

          </div>

        </div>

        {/* Right Column: Fast Contact Form (Cols 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <h3 className="text-base font-bold text-slate-950 mb-1">Send a Fast Procurement Inquiry</h3>
          <p className="text-xs text-slate-500 mb-6">
            For structured bulk quotes with size ratios, please use our <strong className="text-slate-800">Smart Bulk Order Builder</strong>. For general inquiries, submit below:
          </p>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-950">Inquiry Dispatched Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for contacting Durozen Apparel. A factory merchandising specialist will get in touch with you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anand Mahindra"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Organization / Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. TechCorp, SRM College"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. anand@company.com"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Phone / Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98450 00000"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Estimated Volume Requirement</label>
                <select
                  value={formData.estimatedQuantity}
                  onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="50 - 100 pcs">50 - 100 pcs (Minimum Run)</option>
                  <option value="100 - 500 pcs">100 - 500 pcs (Corporate Batch)</option>
                  <option value="500 - 2,500 pcs">500 - 2,500 pcs (College / Marathon)</option>
                  <option value="2,500+ pcs">2,500+ pcs (Enterprise / Institutional)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Requirement Details</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the fabric GSM, preferred colors, delivery destination and deadlines..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry to Sales Desk</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </section>
  );
};
