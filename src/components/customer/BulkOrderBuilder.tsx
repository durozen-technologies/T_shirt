import React, { useState, useEffect } from 'react';
import { Product, BulkOrderConfig, ColorSizeItem, CustomizationPlacement, PrintingMethod, UploadedArtwork, CustomerDetails, Enquiry } from '../../types';
import { TshirtSvg } from '../common/TshirtSvg';
import { 
  Check, 
  ArrowRight, 
  AlertCircle, 
  Upload, 
  Trash2, 
  FileText, 
  Layers, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { generateEnquiryId, saveEnquiries, getStoredEnquiries } from '../../utils/storage';

interface BulkOrderBuilderProps {
  products: Product[];
  preselectedProduct?: Product;
  onEnquirySubmitted: (enquiry: Enquiry) => void;
  onNavigateToTracker: (enquiryId: string) => void;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

const CUSTOMIZATION_LOCATIONS: { id: CustomizationPlacement; label: string; desc: string }[] = [
  { id: 'Left Chest (Pocket Size)', label: 'Left Chest Emblem', desc: 'Standard 3.5" to 4" corporate logo placement' },
  { id: 'Full Front Graphic', label: 'Full Front Print', desc: 'Large center chest graphic (up to 12" × 16")' },
  { id: 'Back Shoulder Yoke', label: 'Back Shoulder Yoke', desc: 'Horizontal logo across upper back' },
  { id: 'Full Back Graphic', label: 'Full Back Print', desc: 'Concert, festival or large sponsor graphic' },
  { id: 'Left Sleeve Logo', label: 'Left Sleeve Logo', desc: 'Subtle brand badge or country flag' },
  { id: 'Right Sleeve Logo', label: 'Right Sleeve Logo', desc: 'Department badge, year or sponsor mark' },
  { id: 'Custom Inner Neck Tag', label: 'Inner Neck Screen Print', desc: 'Replaces generic fabric tags with custom branding' },
];

export const BulkOrderBuilder: React.FC<BulkOrderBuilderProps> = ({
  products,
  preselectedProduct,
  onEnquirySubmitted,
  onNavigateToTracker,
}) => {
  // Step navigation: 1: Product & Colors, 2: Size Quantities, 3: Customization & Artwork, 4: Buyer Details & Submit
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selected Product
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    preselectedProduct || products[0]
  );

  // Selected Colors with their size distribution
  const [colorDistributions, setColorDistributions] = useState<ColorSizeItem[]>([]);

  // Customization placements
  const [selectedPlacements, setSelectedPlacements] = useState<CustomizationPlacement[]>([
    'Left Chest (Pocket Size)',
  ]);

  // Printing method
  const [printingMethod, setPrintingMethod] = useState<PrintingMethod>(
    selectedProduct.printingOptions[0] || 'Screen Printing (Plastisol/Discharge)'
  );

  // Uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedArtwork[]>([]);

  // Additional instructions
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Customer Contact Details
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    city: '',
    state: '',
    deliveryLocation: '',
    requiredDeliveryDate: '',
  });

  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const [submissionSuccess, setSubmissionSuccess] = useState<Enquiry | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // When product changes, reset default color distribution
  useEffect(() => {
    if (selectedProduct) {
      const defaultColor = selectedProduct.availableColours[0];
      if (defaultColor) {
        setColorDistributions([
          {
            colorName: defaultColor.name,
            colorHex: defaultColor.hex,
            sizes: { S: 10, M: 25, L: 35, XL: 20, '2XL': 10, '3XL': 0 },
            totalForColor: 100,
          },
        ]);
      }
      if (!selectedProduct.printingOptions.includes(printingMethod)) {
        setPrintingMethod(selectedProduct.printingOptions[0]);
      }
    }
  }, [selectedProduct]);

  // Compute total bulk quantity across all selected colors
  const totalQuantity = colorDistributions.reduce(
    (acc, curr) => acc + curr.totalForColor,
    0
  );

  const moqSatisfied = totalQuantity >= selectedProduct.minOrderQuantity;

  // Toggle or add color to distribution list
  const handleToggleColor = (colorName: string, colorHex: string) => {
    const exists = colorDistributions.find((c) => c.colorName === colorName);
    if (exists) {
      if (colorDistributions.length === 1) {
        // Keep at least one color
        return;
      }
      setColorDistributions(colorDistributions.filter((c) => c.colorName !== colorName));
    } else {
      setColorDistributions([
        ...colorDistributions,
        {
          colorName,
          colorHex,
          sizes: { S: 5, M: 15, L: 20, XL: 10, '2XL': 0, '3XL': 0 },
          totalForColor: 50,
        },
      ]);
    }
  };

  // Update specific size quantity for a specific color
  const handleSizeQuantityChange = (colorIndex: number, size: string, value: string) => {
    const parsed = parseInt(value, 10);
    const qty = isNaN(parsed) || parsed < 0 ? 0 : parsed;

    const updated = [...colorDistributions];
    const target = updated[colorIndex];
    if (!target) return;

    target.sizes = {
      ...target.sizes,
      [size]: qty,
    };

    target.totalForColor = Object.values(target.sizes).reduce((sum, q) => sum + (q || 0), 0);
    setColorDistributions(updated);
  };

  // Quick Preset Allocator
  const applyPresetRatio = (preset: 'bell' | 'equal' | 'even100') => {
    const updated = colorDistributions.map((item) => {
      let newSizes: { [k: string]: number } = {};
      if (preset === 'bell') {
        newSizes = { S: 10, M: 30, L: 35, XL: 15, '2XL': 10, '3XL': 0 };
      } else if (preset === 'equal') {
        newSizes = { S: 20, M: 20, L: 20, XL: 20, '2XL': 20, '3XL': 0 };
      } else {
        newSizes = { S: 15, M: 35, L: 35, XL: 15, '2XL': 0, '3XL': 0 };
      }
      const sum = Object.values(newSizes).reduce((a, b) => a + b, 0);
      return {
        ...item,
        sizes: newSizes,
        totalForColor: sum,
      };
    });
    setColorDistributions(updated);
  };

  // Toggle customization location
  const handleTogglePlacement = (placement: CustomizationPlacement) => {
    if (selectedPlacements.includes(placement)) {
      setSelectedPlacements(selectedPlacements.filter((p) => p !== placement));
    } else {
      setSelectedPlacements([...selectedPlacements, placement]);
    }
  };

  // Handle client-side file upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newArt: UploadedArtwork = {
          id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
          type: file.type || 'application/octet-stream',
          dataUrl: dataUrl,
          placement: selectedPlacements[0] || 'Left Chest (Pocket Size)',
        };
        setUploadedFiles((prev) => [...prev, newArt]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: { [k: string]: string } = {};

    if (step === 2) {
      if (totalQuantity <= 0) {
        newErrors.quantity = 'Please enter at least one size quantity greater than zero.';
      } else if (totalQuantity < selectedProduct.minOrderQuantity) {
        newErrors.quantity = `Total bulk order (${totalQuantity} pcs) must be at least the Minimum Order Quantity of ${selectedProduct.minOrderQuantity} pcs.`;
      }
    }

    if (step === 4) {
      if (!customer.fullName.trim()) newErrors.fullName = 'Full Name is required.';
      if (!customer.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile Number is required.';
      if (!customer.email.trim() || !customer.email.includes('@')) newErrors.email = 'Valid Email Address is required.';
      if (!customer.city.trim()) newErrors.city = 'City is required.';
      if (!customer.state.trim()) newErrors.state = 'State is required.';
      if (!customer.deliveryLocation.trim()) newErrors.deliveryLocation = 'Delivery address is required.';
      if (!privacyAccepted) newErrors.privacy = 'You must accept the terms & privacy policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Submission
  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const existingEnquiries = getStoredEnquiries();
    const newId = generateEnquiryId(existingEnquiries);

    const config: BulkOrderConfig = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productCode: selectedProduct.code,
      fabricType: selectedProduct.fabricType,
      gsm: selectedProduct.gsm,
      colorDistributions,
      customizationPlacements: selectedPlacements,
      printingMethod,
      uploadedFiles,
      additionalNotes,
      totalQuantity,
    };

    const newEnquiry: Enquiry = {
      id: newId,
      customer,
      config,
      totalQuantity,
      status: 'New',
      internalNotes: [],
      statusHistory: [
        {
          status: 'New',
          timestamp: new Date().toISOString(),
          updatedBy: 'Customer Portal',
          note: `Configured ${totalQuantity} units of ${selectedProduct.name}`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newEnquiry, ...existingEnquiries];
    saveEnquiries(updated);
    onEnquirySubmitted(newEnquiry);
    setSubmissionSuccess(newEnquiry);
  };

  const copyReference = () => {
    if (submissionSuccess) {
      navigator.clipboard.writeText(submissionSuccess.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // If successfully submitted, display confirmation screen
  if (submissionSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Bulk Enquiry Received!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Your bulk order specifications have been forwarded to our Tirupur factory engineering desk. An official commercial quotation with tax breakup and production schedule will be prepared within 2 hours.
            </p>
          </div>

          {/* Reference ID Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-md mx-auto text-left">
            <div className="text-xs text-slate-500 font-medium">Your Unique Enquiry Reference:</div>
            <div className="flex items-center justify-between gap-3 mt-1">
              <span className="font-mono text-xl font-extrabold text-slate-900 tracking-wider">
                {submissionSuccess.id}
              </span>
              <button
                onClick={copyReference}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 border-t border-slate-200/80 pt-2 flex items-center justify-between">
              <span>{submissionSuccess.config.productName}</span>
              <span className="font-bold text-slate-900">{submissionSuccess.totalQuantity} Units</span>
            </div>
          </div>

          {/* Next steps explanation */}
          <div className="text-xs text-slate-500 max-w-md mx-auto text-left space-y-2 pt-2">
            <div className="font-semibold text-slate-800">What happens next?</div>
            <div className="space-y-1 text-slate-600">
              <div>1. Our senior apparel merchandising lead will review artwork & printability.</div>
              <div>2. You will receive an official PDF quotation on WhatsApp & Email ({submissionSuccess.customer.email}).</div>
              <div>3. Once approved by you, fabric will be cut and dispatched per schedule.</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigateToTracker(submissionSuccess.id)}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Track Enquiry Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setSubmissionSuccess(null);
                setCurrentStep(1);
              }}
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Configure Another Order
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <section id="builder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title & Step Tracker */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Factory Direct Bulk Configurator</span>
          <span aria-hidden="true">·</span>
          <span>Zero Retail Checkout</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
          Smart Bulk Order Builder
        </h2>
        <p className="text-sm text-slate-600">
          Configure multi-color size distribution, placement coordinates, high-precision print methods, and submit for factory quotation.
        </p>

        {/* Step indicator */}
        <div className="pt-6 flex items-center justify-center gap-2">
          {[
            { step: 1, label: 'Product & Colors' },
            { step: 2, label: 'Size Matrix' },
            { step: 3, label: 'Branding & Artwork' },
            { step: 4, label: 'Buyer Info' },
          ].map((item, idx) => (
            <React.Fragment key={item.step}>
              <button
                onClick={() => {
                  if (item.step < currentStep || validateStep(currentStep)) {
                    setCurrentStep(item.step);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentStep === item.step
                    ? 'bg-slate-900 text-white shadow-xs'
                    : currentStep > item.step
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <span>{item.step}.</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
              {idx < 3 && <div className="w-4 h-0.5 bg-slate-200" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Form Steps (Cols 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* STEP 1: Product & Colors */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
              
              {/* Product Select */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                    Select Garment Model
                  </h3>
                  <span className="text-xs text-slate-500">
                    MOQ: <strong className="text-slate-900">{selectedProduct.minOrderQuantity} Pcs</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        selectedProduct.id === p.id
                          ? 'border-slate-900 bg-slate-50/70 ring-1 ring-slate-900'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-12 h-12 bg-white rounded-lg p-1 border border-slate-200 shrink-0">
                        <TshirtSvg type={p.svgType} colorHex={p.availableColours[0]?.hex} className="w-full h-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{p.code} · {p.gsm} GSM</div>
                        <div className="text-[10px] text-slate-500 truncate">{p.fabricType}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Selection (Multi-select supported) */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Choose Factory Fabric Colors</h4>
                    <p className="text-xs text-slate-500">You can select multiple colors. Each color will have its own size quantity row.</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    {colorDistributions.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {selectedProduct.availableColours.map((color) => {
                    const isSelected = colorDistributions.some((c) => c.colorName === color.name);
                    return (
                      <button
                        key={color.code}
                        type="button"
                        onClick={() => handleToggleColor(color.name, color.hex)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/40 shrink-0 shadow-2xs"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold truncate leading-tight">{color.name}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                            {color.code}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 1 Next */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Continue to Size Matrix</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: Color-Wise Size Distribution Matrix */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                    Color-Wise Size Distribution Matrix
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter quantities for each color and size. Minimum bulk order for {selectedProduct.name} is {selectedProduct.minOrderQuantity} pieces.
                  </p>
                </div>

                {/* Preset Ratios */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-lg">
                  <span className="text-[10px] text-slate-500 font-semibold px-2 uppercase">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyPresetRatio('bell')}
                    className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white rounded shadow-2xs hover:bg-slate-50 cursor-pointer"
                  >
                    Bell Curve
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetRatio('equal')}
                    className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white rounded shadow-2xs hover:bg-slate-50 cursor-pointer"
                  >
                    Equal Split
                  </button>
                </div>
              </div>

              {/* Color Matrix Rows */}
              <div className="space-y-6">
                {colorDistributions.map((cDist, cIdx) => (
                  <div
                    key={cDist.colorName}
                    className="bg-slate-50/70 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: cDist.colorHex }}
                        />
                        <span className="text-sm font-bold text-slate-900">{cDist.colorName}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700">
                        Color Total: <span className="font-mono font-bold text-slate-950">{cDist.totalForColor} pcs</span>
                      </div>
                    </div>

                    {/* Size Inputs Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {AVAILABLE_SIZES.map((size) => (
                        <div key={size} className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 uppercase block text-center">
                            Size {size}
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={cDist.sizes[size] ?? 0}
                            onChange={(e) => handleSizeQuantityChange(cIdx, size, e.target.value)}
                            className="w-full text-center bg-white border border-slate-300 rounded-lg py-2 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Error warning if below MOQ */}
              {errors.quantity && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-700 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errors.quantity}</span>
                </div>
              )}

              {/* Summary Strip */}
              <div className="bg-slate-950 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Total Bulk Units Selected:</span>
                  <span className="font-mono text-xl font-extrabold text-white">
                    {totalQuantity} <span className="text-xs font-normal text-slate-400">Pcs</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
                    moqSatisfied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {moqSatisfied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Meets MOQ ({selectedProduct.minOrderQuantity} pcs)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Need {selectedProduct.minOrderQuantity - totalQuantity} more to meet MOQ</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2 Navigation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Continue to Branding & Artwork</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Customization, Printing Technique & Artwork Upload */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
              
              {/* Customization Placements */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Branding Placements on Garment
                </h3>
                <p className="text-xs text-slate-500">
                  Select one or multiple print / embroidery locations. We calibrate separate screens or digitizing punches for each zone.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {CUSTOMIZATION_LOCATIONS.map((loc) => {
                    const isSelected = selectedPlacements.includes(loc.id);
                    return (
                      <div
                        key={loc.id}
                        onClick={() => handleTogglePlacement(loc.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{loc.label}</div>
                          <div className="text-[11px] text-slate-500 leading-snug">{loc.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Printing Method */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Printing / Embellishment Technique</h4>
                  <span className="text-xs text-slate-500">Configured per factory equipment</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProduct.printingOptions.map((method) => (
                    <div
                      key={method}
                      onClick={() => setPrintingMethod(method)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        printingMethod === method
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <span className="text-xs font-semibold">{method}</span>
                      {printingMethod === method && <Check className="w-4 h-4 text-white" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Artwork & Logo Upload */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Upload Logos & Artwork Files</h4>
                  <span className="text-xs text-slate-500">Supports SVG, AI, PDF, PNG, JPG</span>
                </div>

                {/* Dropzone */}
                <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-800">
                    Click to upload or drag artwork files here
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Vector files preferred for highest print sharpness. Max 25MB per file.
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Uploaded File List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-slate-700 block">Uploaded Artwork:</span>
                    {uploadedFiles.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200 bg-white text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {f.dataUrl ? (
                            <img src={f.dataUrl} alt={f.name} className="w-8 h-8 object-contain rounded border border-slate-200 bg-slate-50 p-0.5" />
                          ) : (
                            <FileText className="w-6 h-6 text-slate-400 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate">{f.name}</div>
                            <div className="text-[10px] text-slate-500">{f.sizeKb} KB · {f.placement}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFile(f.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="space-y-2 pt-6 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block">
                  Additional Manufacturing Instructions / Packaging Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. Need individual polybag packaging with size stickers, dispatch split between Bengaluru and Mumbai offices, strict Pantone matching required..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800"
                />
              </div>

              {/* Step 3 Navigation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Continue to Buyer Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: Buyer Details & Submit Bulk Enquiry */}
          {currentStep === 4 && (
            <form onSubmit={handleSubmitEnquiry} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              
              <div>
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">4</span>
                  Organization & Delivery Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  We generate your official tax quotation and dispatch estimate based on your delivery PIN / State.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g. Vikramaditya Sharma"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-600">{errors.fullName}</p>}
                </div>

                {/* Company / Org */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    value={customer.companyName}
                    onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                    placeholder="e.g. Infosys, IIT Techfest, Nike Run Club"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    Mobile Number (for WhatsApp Quotation) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.mobileNumber}
                    onChange={(e) => setCustomer({ ...customer, mobileNumber: e.target.value })}
                    placeholder="e.g. +91 98450 12345"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  {errors.mobileNumber && <p className="text-[11px] text-red-600">{errors.mobileNumber}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    Official Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="e.g. procurement@company.com"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  {errors.email && <p className="text-[11px] text-red-600">{errors.email}</p>}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  {errors.city && <p className="text-[11px] text-red-600">{errors.city}</p>}
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  {errors.state && <p className="text-[11px] text-red-600">{errors.state}</p>}
                </div>

                {/* Full Delivery Address */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    Complete Delivery Address / Destination Hub <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.deliveryLocation}
                    onChange={(e) => setCustomer({ ...customer, deliveryLocation: e.target.value })}
                    placeholder="e.g. Building 4, Mindspace SEZ, Whitefield, Bengaluru 560066"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  {errors.deliveryLocation && <p className="text-[11px] text-red-600">{errors.deliveryLocation}</p>}
                </div>

                {/* Target Date */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    Target In-Hand Delivery Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={customer.requiredDeliveryDate}
                    onChange={(e) => setCustomer({ ...customer, requiredDeliveryDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-slate-900 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>
                    I confirm that the custom artwork uploaded is authorized for production, and I accept the B2B wholesale quotation terms and privacy policy.
                  </span>
                </label>
                {errors.privacy && <p className="text-[11px] text-red-600 mt-1">{errors.privacy}</p>}
              </div>

              {/* Step 4 Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Submit Bulk Quotation Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Right Column: Live Order Summary Card (Cols 4) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Live Bulk Summary
              </h4>
              <span className="font-mono text-xs font-bold text-slate-700">
                {selectedProduct.code}
              </span>
            </div>

            {/* Mockup Preview */}
            <div className="h-44 bg-slate-50 rounded-xl p-3 flex items-center justify-center border border-slate-100 relative">
              <TshirtSvg
                type={selectedProduct.svgType}
                colorHex={colorDistributions[0]?.colorHex || selectedProduct.availableColours[0]?.hex}
                logoPlacement={selectedPlacements[0]}
                logoDataUrl={uploadedFiles[0]?.dataUrl}
                className="w-full h-full max-h-40"
              />
              <div className="absolute bottom-2 left-2 text-[10px] bg-white/90 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                {colorDistributions[0]?.colorName || 'Base Color'}
              </div>
            </div>

            {/* Spec breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Model:</span>
                <span className="font-semibold text-slate-900">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Fabric / Weight:</span>
                <span className="font-semibold text-slate-900">{selectedProduct.gsm} GSM · {selectedProduct.fabricType}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Printing:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[170px] text-right">{printingMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Placements:</span>
                <span className="font-semibold text-slate-900">{selectedPlacements.length} Zones</span>
              </div>
            </div>

            {/* Color & Size breakdown summary */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-800 block">Colors & Quantities:</span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {colorDistributions.map((c) => (
                  <div key={c.colorName} className="flex items-center justify-between text-slate-600 py-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.colorHex }} />
                      <span>{c.colorName}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{c.totalForColor} pcs</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grand Total Quantity */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Grand Total Quantity</span>
                <span className="font-mono text-2xl font-black text-slate-950">
                  {totalQuantity} <span className="text-xs font-normal text-slate-500">pcs</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Est. Base Range</span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  ~{formatINR(totalQuantity * selectedProduct.baseEstimatedPrice)}*
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 italic">
              *Estimated baseline. Official quotation with exact printing screens, GST (18%), and freight charges is prepared upon enquiry review.
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
