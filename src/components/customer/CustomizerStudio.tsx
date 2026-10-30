import React, { useState } from 'react';
import { Product } from '../../types';
import { TshirtSvg } from '../common/TshirtSvg';
import { Upload, RefreshCw, ZoomIn, ZoomOut, Check, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface CustomizerStudioProps {
  products: Product[];
  onUseInBuilder: (product: Product, customLogoUrl?: string, placement?: string) => void;
}

const SAMPLE_LOGOS = [
  {
    name: 'Tech Enterprise',
    category: 'Corporate',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" rx="14" fill="%232563eb"/><path d="M35 50 L45 60 L65 40" stroke="white" stroke-width="8" fill="none" stroke-linecap="round"/><text x="50" y="78" fill="white" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">APEX TECH</text></svg>'
  },
  {
    name: 'Athletic Crest',
    category: 'Sports',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 88,30 88,65 50,90 12,65 12,30" fill="%23dc2626" stroke="%23f8fafc" stroke-width="3"/><text x="50" y="55" fill="white" font-size="16" font-family="sans-serif" font-weight="900" text-anchor="middle">IIT</text><text x="50" y="70" fill="white" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">ATHLETICS</text></svg>'
  },
  {
    name: 'Minimalist Monogram',
    category: 'Streetwear',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%23ffffff" stroke-width="3"/><text x="50" y="58" fill="white" font-size="22" font-family="sans-serif" font-weight="800" text-anchor="middle">DZ</text></svg>'
  },
  {
    name: 'Marathon Run',
    category: 'Event',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2316a34a"/><path d="M30 45 Q50 20 70 45 Q50 70 30 45" fill="white"/><text x="50" y="78" fill="white" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">BLR 10K</text></svg>'
  }
];

export const CustomizerStudio: React.FC<CustomizerStudioProps> = ({
  products,
  onUseInBuilder,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [colorHex, setColorHex] = useState<string>(products[0].availableColours[0]?.hex || '#0f172a');
  const [showBackView, setShowBackView] = useState<boolean>(false);
  const [logoPlacement, setLogoPlacement] = useState<string>('Left Chest (Pocket Size)');
  const [logoScale, setLogoScale] = useState<number>(1);
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(SAMPLE_LOGOS[0].svg);
  const [logoName, setLogoName] = useState<string>('Tech Enterprise Emblem');

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomLogoUrl(event.target.result as string);
        setLogoName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_LOGOS[0]) => {
    setCustomLogoUrl(sample.svg);
    setLogoName(sample.name);
  };

  return (
    <section id="customizer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          <span>Virtual Proofing Engine</span>
          <span aria-hidden="true">·</span>
          <span>Screen & Embroidery Alignment</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Interactive Design Studio
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Visualize your logo placement, test fabric colors, and inspect scale on actual garment silhouettes before initiating bulk procurement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Canvas Preview (Cols 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col items-center shadow-xs">
          
          {/* Top Controls: View Toggle */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{selectedProduct.name}</span>
              <span className="text-xs text-slate-500">· {selectedProduct.gsm} GSM</span>
            </div>

            <button
              onClick={() => setShowBackView(!showBackView)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Flip to {showBackView ? 'Front' : 'Back'}</span>
            </button>
          </div>

          {/* SVG Render Stage */}
          <div className="w-full h-80 sm:h-96 my-6 flex items-center justify-center bg-slate-50/70 rounded-xl p-4 border border-slate-100">
            <TshirtSvg
              type={selectedProduct.svgType}
              colorHex={colorHex}
              showBackView={showBackView}
              logoDataUrl={customLogoUrl}
              logoPlacement={logoPlacement}
              logoScale={logoScale}
              className="w-full h-full max-h-88"
            />
          </div>

          {/* Scale & Position Sliders */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Emblem / Print Scale:</span>
                <span className="font-mono">{Math.round(logoScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.6"
                step="0.05"
                value={logoScale}
                onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-slate-700 block">Current Graphic:</span>
              <div className="text-slate-600 truncate bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 font-mono text-[11px]">
                {logoName}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Customization Controls (Cols 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Garment Silhouette Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              1. Select Garment Model
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {products.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setColorHex(p.availableColours[0]?.hex || '#0f172a');
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedProduct.id === p.id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-2xs font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="truncate">{p.name.split(' ')[0]} {p.name.split(' ')[1] || ''}</div>
                  <div className={`text-[10px] ${selectedProduct.id === p.id ? 'text-slate-300' : 'text-slate-400'}`}>
                    {p.code}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex justify-between items-center text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-900">
                2. Garment Fabric Color
              </h4>
              <span className="text-slate-500 font-medium">
                {selectedProduct.availableColours.find(c => c.hex === colorHex)?.name}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {selectedProduct.availableColours.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setColorHex(c.hex)}
                  className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                    colorHex === c.hex
                      ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Placement Zone */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              3. Branding Zone
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'Left Chest (Pocket Size)', label: 'Left Chest (Front)' },
                { id: 'Full Front Graphic', label: 'Full Center Chest' },
                { id: 'Back Large Print', label: 'Full Back (Rear)' },
                { id: 'Right Sleeve Logo', label: 'Right Sleeve' },
              ].map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => {
                    setLogoPlacement(zone.id);
                    if (zone.id.includes('Back')) {
                      setShowBackView(true);
                    } else {
                      setShowBackView(false);
                    }
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    logoPlacement === zone.id
                      ? 'border-slate-900 bg-slate-100 font-bold text-slate-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Logo / Artwork Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              4. Upload Logo or Pick Sample
            </h4>

            {/* Custom file upload */}
            <label className="border border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-slate-50/50 text-xs font-semibold text-slate-700 transition-colors">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Upload Custom PNG / SVG / JPG</span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.svg"
                onChange={handleCustomUpload}
                className="hidden"
              />
            </label>

            {/* Sample logos */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              {SAMPLE_LOGOS.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2 rounded-lg border flex items-center gap-2 text-left transition-colors cursor-pointer ${
                    customLogoUrl === sample.svg
                      ? 'border-slate-900 bg-slate-50 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <img src={sample.svg} alt={sample.name} className="w-6 h-6 object-contain" />
                  <span className="truncate">{sample.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct CTA to Bulk Builder with these settings */}
          <button
            onClick={() => onUseInBuilder(selectedProduct, customLogoUrl, logoPlacement)}
            className="w-full py-3.5 px-4 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Transfer to Bulk Order Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </section>
  );
};
