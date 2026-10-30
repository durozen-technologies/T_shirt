import React, { useState } from 'react';
import { Enquiry, Order, Quotation } from '../../types';
import { Search, CheckCircle2, Clock, Truck, FileText, ArrowRight, Package, AlertCircle } from 'lucide-react';
import { formatDateTime, formatDate, formatINR } from '../../utils/formatters';

interface OrderTrackerProps {
  enquiries: Enquiry[];
  orders: Order[];
  quotations: Quotation[];
  initialSearchId?: string;
  onViewQuotation: (quote: Quotation) => void;
  onApproveQuotation: (quoteId: string) => void;
}

const ENQUIRY_STAGES = [
  'New',
  'Contacted',
  'Quotation Pending',
  'Quotation Sent',
  'Approved',
  'Converted to Order'
];

const ORDER_STAGES = [
  'Order Confirmed',
  'Design Approved',
  'Production Pending',
  'In Production',
  'Quality Check',
  'Ready for Dispatch',
  'Dispatched',
  'Delivered'
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  enquiries,
  orders,
  quotations,
  initialSearchId = '',
  onViewQuotation,
  onApproveQuotation,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchId);
  const [matchedEnquiry, setMatchedEnquiry] = useState<Enquiry | null>(() => {
    if (initialSearchId) {
      return enquiries.find((e) => e.id.toLowerCase() === initialSearchId.toLowerCase().trim()) || null;
    }
    return enquiries[0] || null;
  });

  const [matchedOrder, setMatchedOrder] = useState<Order | null>(() => {
    if (initialSearchId) {
      return orders.find((o) => o.id.toLowerCase() === initialSearchId.toLowerCase().trim()) || null;
    }
    return orders[0] || null;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const foundEnquiry = enquiries.find((e) => e.id.toLowerCase() === q);
    const foundOrder = orders.find((o) => o.id.toLowerCase() === q);

    setMatchedEnquiry(foundEnquiry || null);
    setMatchedOrder(foundOrder || null);
  };

  // Find linked quotation for the matched enquiry if any
  const linkedQuotation = matchedEnquiry?.quotationId
    ? quotations.find((q) => q.id === matchedEnquiry.quotationId)
    : null;

  return (
    <section id="tracker" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Real-Time Production Milestone Tracker</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Track Bulk Quotation or Order
        </h2>
        <p className="text-sm text-slate-600">
          Enter your Enquiry ID (<span className="font-mono text-slate-900 font-bold">BTQ-2026-XXXXX</span>) or Order Number (<span className="font-mono text-slate-900 font-bold">ORD-2026-XXXXX</span>).
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. BTQ-2026-00001 or ORD-2026-00001"
            className="w-full pl-11 pr-28 py-3.5 bg-white border border-slate-300 rounded-xl shadow-xs font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Track Status
          </button>
        </div>
      </form>

      {/* Result Display */}
      {matchedOrder ? (
        /* Confirmed Order Tracking */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black text-slate-950">{matchedOrder.id}</span>
                <span className="text-xs bg-slate-900 text-white font-semibold px-2.5 py-0.5 rounded">
                  {matchedOrder.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Client: <strong className="text-slate-800">{matchedOrder.customer.fullName}</strong> {matchedOrder.customer.companyName && `(${matchedOrder.customer.companyName})`}
              </div>
            </div>

            <div className="text-right sm:text-right">
              <div className="text-xs text-slate-500">Order Total ({matchedOrder.totalQuantity} pcs)</div>
              <div className="font-mono text-xl font-black text-slate-900">{formatINR(matchedOrder.grandTotal)}</div>
            </div>
          </div>

          {/* Courier Dispatch Banner if Dispatched */}
          {matchedOrder.dispatchDetails && (
            <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-300">Carrier / Surface Courier</div>
                  <div className="text-sm font-bold text-white">{matchedOrder.dispatchDetails.courierName}</div>
                  <div className="text-xs font-mono text-slate-300 mt-0.5">
                    AWB Docket: <strong>{matchedOrder.dispatchDetails.trackingNumber}</strong>
                  </div>
                </div>
              </div>

              <div className="text-xs sm:text-right">
                <span className="text-slate-400 block">Est. Delivery</span>
                <span className="text-sm font-bold text-emerald-300">{formatDate(matchedOrder.dispatchDetails.estimatedDeliveryDate)}</span>
              </div>
            </div>
          )}

          {/* Timeline of Stages */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Manufacturing & Delivery Timeline
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
              {ORDER_STAGES.map((stage, idx) => {
                const currentStageIdx = ORDER_STAGES.indexOf(matchedOrder.status);
                const isPassed = currentStageIdx >= idx;
                const isCurrent = matchedOrder.status === stage;

                return (
                  <div
                    key={stage}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-between min-h-[72px] transition-all ${
                      isCurrent
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs'
                        : isPassed
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800 font-medium'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] mb-1">
                      {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : idx + 1}
                    </div>
                    <span className="text-[11px] leading-tight">{stage}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Production History Log */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Audit Log & Shop-Floor Notes</h4>
            <div className="space-y-2 text-xs">
              {matchedOrder.statusHistory.map((h, i) => (
                <div key={i} className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">{h.status}</span>
                    {h.note && <span className="block text-slate-600 text-[11px] mt-0.5">{h.note}</span>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{h.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : matchedEnquiry ? (
        /* Enquiry Status & Quotation View */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black text-slate-950">{matchedEnquiry.id}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  Status: {matchedEnquiry.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Requested by: <strong className="text-slate-800">{matchedEnquiry.customer.fullName}</strong> · {matchedEnquiry.customer.city}, {matchedEnquiry.customer.state}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Enquiry Volume</span>
              <span className="font-mono text-lg font-bold text-slate-950">
                {matchedEnquiry.totalQuantity} Units
              </span>
            </div>
          </div>

          {/* Quotation Alert Box if Quote Generated */}
          {linkedQuotation && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-900">
                    Official Factory Quotation Ready: <span className="font-mono">{linkedQuotation.quotationNumber}</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    linkedQuotation.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {linkedQuotation.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Grand Total: <strong className="font-mono text-slate-900">{formatINR(linkedQuotation.grandTotal)}</strong> (incl. 18% GST & Freight).
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onViewQuotation(linkedQuotation)}
                  className="px-4 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  View Official Quote
                </button>
                {linkedQuotation.status !== 'Approved' && (
                  <button
                    onClick={() => onApproveQuotation(linkedQuotation.id)}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Approve Quotation
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Enquiry Progress Stages */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Quotation Review Stages
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
              {ENQUIRY_STAGES.map((stage, idx) => {
                const currentIdx = ENQUIRY_STAGES.indexOf(matchedEnquiry.status);
                const isPassed = currentIdx >= idx;
                const isCurrent = matchedEnquiry.status === stage;

                return (
                  <div
                    key={stage}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-between min-h-[64px] transition-all ${
                      isCurrent
                        ? 'border-slate-900 bg-slate-900 text-white font-bold'
                        : isPassed
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800 font-medium'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 font-mono">0{idx + 1}</span>
                    <span className="text-[11px] leading-tight">{stage}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configured Garment Details */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900">Garment Breakdown:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
              <div>Product: <strong className="text-slate-800">{matchedEnquiry.config.productName}</strong></div>
              <div>Fabric: <strong className="text-slate-800">{matchedEnquiry.config.fabricType} ({matchedEnquiry.config.gsm} GSM)</strong></div>
              <div>Printing: <strong className="text-slate-800">{matchedEnquiry.config.printingMethod}</strong></div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-slate-600">
              <span className="font-semibold text-slate-800">Color Quantities:</span>{' '}
              {matchedEnquiry.config.colorDistributions.map((c) => `${c.colorName} (${c.totalForColor} pcs)`).join(', ')}
            </div>
          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No quotation or order found for "{searchQuery}".</p>
          <p className="max-w-md mx-auto">
            Please verify the reference code printed on your acknowledgement email. Example codes: <span className="font-mono text-slate-700">BTQ-2026-00001</span> or <span className="font-mono text-slate-700">ORD-2026-00001</span>.
          </p>
        </div>
      )}

    </section>
  );
};
