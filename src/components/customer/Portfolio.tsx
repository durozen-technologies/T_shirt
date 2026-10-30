import React, { useState } from 'react';
import { PortfolioItem } from '../../types';
import { TshirtSvg } from '../common/TshirtSvg';
import { Building2, Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface PortfolioProps {
  portfolio: PortfolioItem[];
  onStartOrder: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  portfolio,
  onStartOrder,
}) => {
  const [filter, setFilter] = useState<string>('All');

  const industries = ['All', 'Enterprise Software & Cloud', 'College & University Campus', 'Sports & Athletics Foundation', 'Supply Chain & Warehousing'];

  const filtered = filter === 'All' ? portfolio : portfolio.filter(p => p.clientIndustry === filter);

  return (
    <section id="portfolio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Verified Bulk Case Studies</span>
            <span aria-hidden="true">·</span>
            <span>Tirupur Output</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Selected B2B Deliveries & Collaborations
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Inspecting the craftsmanship behind high-volume orders delivered for premier corporate summits, athletic meets, and student councils.
          </p>
        </div>

        {/* Filter Pills / Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setFilter(ind)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filter === ind
                  ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {ind === 'All' ? 'All Deliveries' : ind.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
          >
            {/* Visual Header / Mockup Banner */}
            <div className="h-64 bg-slate-900 p-6 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="w-52 h-52 relative z-10">
                <TshirtSvg
                  type={item.productType.includes('Polo') ? 'polo' : item.productType.includes('Oversized') ? 'oversized' : item.productType.includes('Jersey') ? 'jersey' : 'round-neck'}
                  colorHex={item.accentColor}
                  className="w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Volume tag */}
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono font-bold text-white border border-white/20">
                {item.quantity.toLocaleString()} Pcs Dispatched
              </div>

              {/* Client Industry */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-slate-200">
                {item.clientIndustry}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-950 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Tech Specs Line */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Product Model:</span>
                  <span className="font-semibold text-slate-900">{item.productType}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Fabric:</span>
                  <span className="font-semibold text-slate-900">{item.fabricSpec}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Printing Spec:</span>
                  <span className="font-semibold text-slate-900">{item.printingType}</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="mt-16 bg-slate-100 rounded-2xl p-8 sm:p-10 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-950">Have a custom apparel project of 50 to 50,000 units?</h3>
          <p className="text-xs text-slate-600">We assign a dedicated senior merchandising manager to coordinate sampling, lab dips, and bulk shipping.</p>
        </div>
        <button
          onClick={onStartOrder}
          className="px-6 py-3 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Start Your Bulk Project</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
