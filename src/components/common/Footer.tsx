import React from 'react';
import { Mail, Phone, MapPin, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-950 flex items-center justify-center font-bold text-sm tracking-wider">
                DZ
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                DUROZEN <span className="font-light text-slate-400">APPAREL</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Industrial bulk T-shirt manufacturing & custom apparel solutions. Trusted by 450+ corporations, universities, and sporting organizations across India and internationally.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Factory Pricing · Zero Middleman Markup</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Pre-Shrunk Bio-Wash Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Digital Artwork Proof within 2 Hours</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Collections</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-white transition-colors cursor-pointer">
                  Round Neck Crewtees
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-white transition-colors cursor-pointer">
                  Corporate Pique Polos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-white transition-colors cursor-pointer">
                  Urban Streetwear Oversized
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-white transition-colors cursor-pointer">
                  Dry-Fit Sports Jerseys
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-white transition-colors cursor-pointer">
                  Winter French Terry Hoodies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-white transition-colors cursor-pointer">
                  Workwear & Industrial Polos
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('builder')} className="hover:text-white transition-colors cursor-pointer">
                  Smart Bulk Order Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customizer')} className="hover:text-white transition-colors cursor-pointer">
                  Interactive Design Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracker')} className="hover:text-white transition-colors cursor-pointer">
                  Track Bulk Quotation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracker')} className="hover:text-white transition-colors cursor-pointer">
                  Order Production Status
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-white transition-colors cursor-pointer">
                  Client Case Studies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  Factory Infrastructure
                </button>
              </li>
            </ul>
          </div>

          {/* Factory & Corporate Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">B2B Sales Desk</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Tirupur Apparel Industrial Corridor, SIDCO Garment Park, Tamil Nadu 641603</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>+91 98450 12890 / +91 421 249800</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>b2b-sales@durozenapparel.com</span>
              </div>
              <div className="pt-2 text-slate-500 text-[11px]">
                GSTIN: 33AAACD9218P1ZM
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Durozen Technologies Pvt. Ltd. All rights reserved. B2B Wholesale Apparel Engine.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-400 transition-colors">
              Terms & Manufacturing Conditions
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-400 transition-colors">
              Privacy & IP Protection Policy
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-400 transition-colors">
              Quality Assurance Norms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
