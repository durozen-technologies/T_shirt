import React, { useState } from 'react';
import { ArrowRight, Layers, Award, Sparkles, Building2, GraduationCap, Trophy, Megaphone } from 'lucide-react';
import { Product } from '../../types';
import { TshirtSvg } from '../common/TshirtSvg';

interface HeroProps {
  products: Product[];
  onSelectProductForBuilder: (product: Product) => void;
  onExploreCollections: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  products,
  onSelectProductForBuilder,
  onExploreCollections,
}) => {
  // Allow user to switch preview garment right in hero
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
  const currentProduct = products[selectedPreviewIndex] || products[0];
  const [activeColorHex, setActiveColorHex] = useState(currentProduct.availableColours[0]?.hex || '#0f172a');

  const handleProductChange = (idx: number) => {
    setSelectedPreviewIndex(idx);
    const prod = products[idx];
    if (prod && prod.availableColours.length > 0) {
      setActiveColorHex(prod.availableColours[0].hex);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="uppercase tracking-wider">Direct Manufacturer</span>
              <span aria-hidden="true">·</span>
              <span>Tirupur Apparel Cluster</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-900 font-bold">MOQ 50 Units</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15] text-balance">
              Premium Custom T-Shirts. <br />
              <span className="text-slate-600 font-semibold">Engineered for Bulk Orders.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              From corporate uniforms to college cultural fests, sports marathons, and branded promotional apparel, we deliver precision bulk T-shirt manufacturing tailored to your exact Pantone, GSM, and branding standards.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onSelectProductForBuilder(currentProduct)}
                className="px-6 py-3.5 text-sm font-bold text-white bg-slate-950 rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
              >
                <span>Configure Bulk Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreCollections}
                className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
              >
                Explore Collections
              </button>
            </div>

            {/* Trust Markers without pill anti-pattern */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div>
                <span className="block font-bold text-slate-900 text-sm">48-Hr Sampling</span>
                <span>Fast digital & physical proofs</span>
              </div>
              <div>
                <span className="block font-bold text-slate-900 text-sm">100% Bio-Wash</span>
                <span>Zero color bleed & pre-shrunk</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block font-bold text-slate-900 text-sm">Pan-India Freight</span>
                <span>Express courier & surface cargo</span>
              </div>
            </div>

            {/* Industries Served Strip */}
            <div className="pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Trusted by 450+ organizations across:
              </span>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-500" /> IT & Tech Enterprises</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-slate-500" /> Universities & IITs</span>
                <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-slate-500" /> Sports & Marathons</span>
                <span className="flex items-center gap-1.5"><Megaphone className="w-3.5 h-3.5 text-slate-500" /> Marketing & Event Agencies</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Real-Time Product Display */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              
              {/* Garment Selector Tabs */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 border-b border-slate-100">
                {products.slice(0, 4).map((prod, idx) => (
                  <button
                    key={prod.id}
                    onClick={() => handleProductChange(idx)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      selectedPreviewIndex === idx
                        ? 'bg-slate-900 text-white font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {prod.name.split(' ')[0]} {prod.name.split(' ')[1] || ''}
                  </button>
                ))}
              </div>

              {/* Vector Mockup Visualizer */}
              <div className="relative h-72 sm:h-80 bg-slate-50/80 rounded-xl flex items-center justify-center p-4 border border-slate-100">
                <TshirtSvg
                  type={currentProduct.svgType}
                  colorHex={activeColorHex}
                  logoPlacement="Left Chest (Pocket Size)"
                  className="w-full h-full max-h-72"
                />

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-700 border border-slate-200">
                  {currentProduct.code}
                </div>

                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-900 border border-slate-200">
                  MOQ: {currentProduct.minOrderQuantity} Pcs
                </div>
              </div>

              {/* Color Swatch Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Available Factory Shades:</span>
                  <span>{currentProduct.availableColours.length} colors in stock</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {currentProduct.availableColours.map((color) => (
                    <button
                      key={color.code}
                      onClick={() => setActiveColorHex(color.hex)}
                      title={`${color.name} (${color.code})`}
                      className={`w-7 h-7 rounded-full border transition-transform cursor-pointer flex items-center justify-center ${
                        activeColorHex === color.hex
                          ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {activeColorHex === color.hex && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Quick Specs */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Fabric & Weight</span>
                  <span className="font-semibold text-slate-900">{currentProduct.gsm} GSM · {currentProduct.fabricType}</span>
                </div>
                <button
                  onClick={() => onSelectProductForBuilder(currentProduct)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Build Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
