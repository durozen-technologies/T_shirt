import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../../types';
import { TshirtSvg } from '../common/TshirtSvg';
import { ArrowRight, SlidersHorizontal, Check, Info } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface CatalogueProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenSpecs: (product: Product) => void;
}

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Round Neck T-Shirts',
  'Polo T-Shirts',
  'Oversized T-Shirts',
  'Sports T-Shirts / Jerseys',
  'Hoodies & Sweatshirts',
  'Corporate Uniforms',
  'Custom Promotional T-Shirts'
];

export const Catalogue: React.FC<CatalogueProps> = ({
  products,
  onSelectProduct,
  onOpenSpecs,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [selectedFabric, setSelectedFabric] = useState<string>('All');
  const [selectedMoq, setSelectedMoq] = useState<string>('All');
  const [requireEmbroidery, setRequireEmbroidery] = useState<boolean>(false);
  const [activeColors, setActiveColors] = useState<{ [productId: string]: string }>({});

  // Collect unique fabric types for filter
  const fabricTypes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.fabricType));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedFabric !== 'All' && p.fabricType !== selectedFabric) return false;
      if (selectedMoq === '50' && p.minOrderQuantity > 50) return false;
      if (selectedMoq === '100' && p.minOrderQuantity > 100) return false;
      if (requireEmbroidery && !p.embroiderySupported) return false;
      return true;
    });
  }, [products, selectedCategory, selectedFabric, selectedMoq, requireEmbroidery]);

  const handleColorChange = (productId: string, hex: string) => {
    setActiveColors((prev) => ({ ...prev, [productId]: hex }));
  };

  return (
    <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>B2B Volume Apparel</span>
            <span aria-hidden="true">·</span>
            <span>Commercial Specifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Factory Collections & Blanks
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Strictly wholesale and bulk custom orders. Configure multiple sizes, colors, and branding placements directly with factory-floor technicians.
          </p>
        </div>

        {/* Count Indicator */}
        <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
          Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> of {products.length} blank models
        </div>
      </div>

      {/* Filter Bar */}
      <div className="py-6 space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-100/80 p-3.5 rounded-xl text-xs border border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine:</span>
          </div>

          {/* Fabric Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500">Fabric:</label>
            <select
              value={selectedFabric}
              onChange={(e) => setSelectedFabric(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {fabricTypes.map((fab) => (
                <option key={fab} value={fab}>
                  {fab}
                </option>
              ))}
            </select>
          </div>

          {/* MOQ Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500">Max MOQ:</label>
            <select
              value={selectedMoq}
              onChange={(e) => setSelectedMoq(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All MOQs</option>
              <option value="50">MOQ ≤ 50 pcs</option>
              <option value="100">MOQ ≤ 100 pcs</option>
            </select>
          </div>

          {/* Embroidery Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium select-none ml-auto">
            <input
              type="checkbox"
              checked={requireEmbroidery}
              onChange={(e) => setRequireEmbroidery(e.target.checked)}
              className="rounded text-slate-900 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Embroidery Compatible Only</span>
          </label>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center my-8">
          <p className="text-sm font-semibold text-slate-800">No blank apparel matching your filter selection.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting fabric or MOQ filters to see all available models.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedFabric('All');
              setSelectedMoq('All');
              setRequireEmbroidery(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const activeHex = activeColors[product.id] || product.availableColours[0]?.hex || '#0f172a';

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-400 hover:shadow-md transition-all group"
              >
                {/* Visual Garment Frame */}
                <div className="relative h-64 bg-slate-50/70 p-4 flex items-center justify-center border-b border-slate-100">
                  <TshirtSvg
                    type={product.svgType}
                    colorHex={activeHex}
                    logoPlacement="Left Chest (Pocket Size)"
                    className="w-full h-full max-h-56 transform group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Kicker badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold bg-white/90 text-slate-800 px-2 py-0.5 rounded shadow-xs border border-slate-200">
                      {product.code}
                    </span>
                  </div>

                  {/* MOQ pill alternative (clean quiet text overlay) */}
                  <div className="absolute bottom-3 right-3 text-[11px] font-bold text-slate-900 bg-white/95 px-2.5 py-1 rounded shadow-xs border border-slate-200">
                    MOQ: {product.minOrderQuantity} Pcs
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Metadata line */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.gsm} GSM</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-950 group-hover:text-slate-800 leading-snug">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Color Swatches */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Available Factory Colors:</span>
                      <span className="font-medium">{product.availableColours.length} options</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {product.availableColours.map((color) => (
                        <button
                          key={color.code}
                          onClick={() => handleColorChange(product.id, color.hex)}
                          title={`${color.name} (${color.code})`}
                          className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                            activeHex === color.hex
                              ? 'ring-2 ring-slate-900 ring-offset-1 scale-110'
                              : 'border-slate-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Specs & Pricing Footnote */}
                  <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
                    <span>Est. Base Blank:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ~{formatINR(product.baseEstimatedPrice)} <span className="text-[10px] text-slate-500 font-normal">/pc</span>
                    </span>
                  </div>

                  {/* Action Buttons (Strictly B2B Bulk!) */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onOpenSpecs(product)}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Tech Specs</span>
                    </button>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Configure</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
