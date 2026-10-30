import React from 'react';
import { Factory, ShieldCheck, Cpu, Leaf, Globe2, Award, Users, CheckCircle2 } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Manufacturing Infrastructure</span>
          <span aria-hidden="true">·</span>
          <span>Since 2014</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
          Direct Factory Knitting, Dyeing & High-Speed Embellishment
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Durozen Technologies Apparel Division operates an integrated 45,000 sq.ft apparel manufacturing facility situated in the Tirupur Textile Industrial Corridor. We bridge the gap between industrial knitwear manufacturing and modern B2B tech procurement.
        </p>
      </div>

      {/* Stats KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="font-mono text-3xl font-black text-slate-950">10,000+</span>
          <span className="block text-xs font-bold text-slate-700">Daily Garment Capacity</span>
          <span className="text-[11px] text-slate-500 block">Round the clock stitching lines</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="font-mono text-3xl font-black text-slate-950">450+</span>
          <span className="block text-xs font-bold text-slate-700">Corporate & Institutional Clients</span>
          <span className="text-[11px] text-slate-500 block">IT firms, colleges & event agencies</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="font-mono text-3xl font-black text-slate-950">100%</span>
          <span className="block text-xs font-bold text-slate-700">OEKO-TEX Certified Cotton</span>
          <span className="text-[11px] text-slate-500 block">AZO-free non-toxic bio dyes</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="font-mono text-3xl font-black text-slate-950">48-Hr</span>
          <span className="block text-xs font-bold text-slate-700">Physical Sampling Turnaround</span>
          <span className="text-[11px] text-slate-500 block">Express pre-production sign-off</span>
        </div>
      </div>

      {/* Core Manufacturing Capabilities */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-950">Industrial Manufacturing Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
              <Factory className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-950">Circular Knitting & Bio-Wash</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mayer & Cie German circular knitting machines churning 180 to 280 GSM single jersey and pique fabrics. Equipped with continuous silicone bio-wash tumblers ensuring zero pilling and strict 3% shrinkage tolerances.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-950">Automatic Screen & DTF Carousels</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              3 M&R automatic 12-color screen printing machines capable of producing 1,200 prints per hour with laser micro-registration. Supported by dual 60cm industrial DTF printers for high-definition full-color gradients.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-950">Japanese Tajima Embroidery</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              4 Tajima multi-head computerized embroidery setups running Madeira viscose and metallic threads up to 1,000 stitches per minute with 3D foam puff capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Quality Standards & Ethics */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 space-y-6">
        <div className="max-w-2xl space-y-2">
          <h3 className="text-xl font-bold text-white">Quality Assurance & Compliance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every bulk consignment undergoes a rigorous 4-stage Quality Inspection process before leaving the packing floor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Yarn Tensile Test</span>
            </div>
            <p className="text-slate-400 text-[11px]">Testing tear resistance and yarn consistency before fabric knitting.</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Color Fastness 50+</span>
            </div>
            <p className="text-slate-400 text-[11px]">Standardized wash test under 60°C water to guarantee zero dye bleeding.</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dimensional Stability</span>
            </div>
            <p className="text-slate-400 text-[11px]">Calibrated shrinkage tests keeping chest and length variance under ±0.5 inches.</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Needle Metal Detector</span>
            </div>
            <p className="text-slate-400 text-[11px]">100% automated conveyor metal scanning to ensure zero broken needle fragments.</p>
          </div>
        </div>
      </div>

    </section>
  );
};
