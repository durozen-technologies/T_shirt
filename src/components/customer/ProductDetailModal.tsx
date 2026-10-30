import React, { useState } from 'react';
import { Product } from '../../types';
import { TshirtSvg } from '../common/TshirtSvg';
import { X, Check, ArrowRight, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onConfigure: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onConfigure,
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.availableColours[0]?.hex || '#0f172a');
  const [showBack, setShowBack] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200">
              {product.code}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Category: <strong className="text-slate-800">{product.category}</strong>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Visual Mockup & View Switcher */}
          <div className="md:col-span-5 flex flex-col items-center justify-between bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">360° Garment View</span>
              <button
                onClick={() => setShowBack(!showBack)}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Switch to {showBack ? 'Front View' : 'Back View'}</span>
              </button>
            </div>

            <div className="w-full h-72 flex items-center justify-center my-auto">
              <TshirtSvg
                type={product.svgType}
                colorHex={selectedColor}
                showBackView={showBack}
                logoPlacement={showBack ? 'Full Back Graphic' : 'Left Chest (Pocket Size)'}
                className="w-full h-full max-h-68"
              />
            </div>

            {/* Color Swatches */}
            <div className="w-full pt-4 border-t border-slate-200/80">
              <div className="text-xs font-medium text-slate-600 mb-2">
                Available Factory Color: <span className="font-semibold text-slate-900">{product.availableColours.find(c => c.hex === selectedColor)?.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {product.availableColours.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedColor(c.hex)}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      selectedColor === c.hex
                        ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                        : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Specs, Technical Tables, Actions */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 tracking-tight">{product.name}</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{product.description}</p>
            </div>

            {/* Technical Specification Matrix */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Technical Specifications</h4>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Fabric Composition</span>
                  <span className="font-semibold text-slate-900">{product.fabricType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Fabric Weight (GSM)</span>
                  <span className="font-semibold text-slate-900">{product.gsm} GSM ± 3%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Minimum Order Quantity (MOQ)</span>
                  <span className="font-semibold text-slate-900">{product.minOrderQuantity} Units</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Embroidery Compatibility</span>
                  <span className={`font-semibold ${product.embroiderySupported ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {product.embroiderySupported ? 'Yes · High-Density Supported' : 'Not Recommended for this knit'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Standard Turnaround</span>
                  <span className="font-semibold text-slate-900">{product.turnaroundDays} Working Days</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Estimated Base Blank Rate</span>
                  <span className="font-mono font-bold text-slate-900">
                    ~{formatINR(product.baseEstimatedPrice)} <span className="text-[10px] text-slate-500 font-normal">/pc (excl. print & tax)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Size Chart Guide */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider">Garment Measurements (Inches)</span>
                <span className="text-slate-500">Regular Indian / Global Fit</span>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Size</th>
                      <th className="px-3 py-2">Chest (Inches)</th>
                      <th className="px-3 py-2">Length (Inches)</th>
                      <th className="px-3 py-2">Shoulder (Inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-900">S</td>
                      <td className="px-3 py-1.5">38"</td>
                      <td className="px-3 py-1.5">26.5"</td>
                      <td className="px-3 py-1.5">16.5"</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-900">M</td>
                      <td className="px-3 py-1.5">40"</td>
                      <td className="px-3 py-1.5">27.5"</td>
                      <td className="px-3 py-1.5">17.5"</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-900">L</td>
                      <td className="px-3 py-1.5">42"</td>
                      <td className="px-3 py-1.5">28.5"</td>
                      <td className="px-3 py-1.5">18.5"</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-900">XL</td>
                      <td className="px-3 py-1.5">44"</td>
                      <td className="px-3 py-1.5">29.5"</td>
                      <td className="px-3 py-1.5">19.5"</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-900">2XL</td>
                      <td className="px-3 py-1.5">46"</td>
                      <td className="px-3 py-1.5">30.5"</td>
                      <td className="px-3 py-1.5">20.5"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supported Printing Methods */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Compatible Printing & Customization Methods
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.printingOptions.map((method) => (
                  <span
                    key={method}
                    className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onConfigure(product);
                }}
                className="flex-1 py-3 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Add to Bulk Enquiry & Configure</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
