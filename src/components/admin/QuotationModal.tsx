import React from 'react';
import { Quotation } from '../../types';
import { X, Printer, Share2, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters';

interface QuotationModalProps {
  quotation: Quotation | null;
  onClose: () => void;
  onApprove?: (quoteId: string) => void;
  onConvertToOrder?: (quote: Quotation) => void;
  isAdmin?: boolean;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  quotation,
  onClose,
  onApprove,
  onConvertToOrder,
  isAdmin = false,
}) => {
  if (!quotation) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${quotation.customer.fullName},\n\nHere is your official bulk apparel quotation ${quotation.quotationNumber} from Durozen Apparel:\nProduct: ${quotation.productSummary.productName} (${quotation.productSummary.totalQuantity} Units)\nGrand Total: ${formatINR(quotation.grandTotal)} (incl. 18% GST)\nAdvance Payable (50%): ${formatINR(quotation.advancePayable)}\n\nValid until: ${formatDate(quotation.validUntil)}`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 print:p-0 print:bg-white">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col print:border-none print:shadow-none print:max-h-none print:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold bg-white text-slate-800 px-2.5 py-1 rounded border border-slate-300">
              {quotation.quotationNumber}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
              quotation.status === 'Approved' || quotation.status === 'Converted'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {quotation.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE QUOTATION INVOICE DOCUMENT */}
        <div className="p-8 sm:p-12 space-y-8 bg-white print:p-0">
          
          {/* Header Row: Company & Quotation Info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-base tracking-wider">
                  DZ
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-950">
                    DUROZEN APPAREL
                  </h1>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                    Durozen Technologies Pvt. Ltd. · Wholesale Division
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 mt-3 space-y-0.5 leading-relaxed">
                <div>Plot 42-45, SIDCO Garment Park, Anupparpalayam</div>
                <div>Tirupur, Tamil Nadu 641603, India</div>
                <div>GSTIN: <strong>33AAACD9218P1ZM</strong> · PAN: AAACD9218P</div>
                <div>Email: b2b-sales@durozenapparel.com · Desk: +91 98450 12890</div>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-2xl font-black text-slate-950 tracking-tight block">
                COMMERCIAL QUOTATION
              </span>
              <div className="text-xs text-slate-600 space-y-1 font-mono">
                <div>Quote No: <strong className="text-slate-950">{quotation.quotationNumber}</strong></div>
                <div>Enquiry Ref: <strong>{quotation.enquiryId}</strong></div>
                <div>Date: <strong>{formatDate(quotation.date)}</strong></div>
                <div>Valid Until: <strong className="text-amber-700">{formatDate(quotation.validUntil)}</strong></div>
              </div>
            </div>
          </div>

          {/* Billed To / Consignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Client / Consignee:
              </span>
              <div className="font-bold text-slate-950 text-sm">{quotation.customer.fullName}</div>
              {quotation.customer.companyName && (
                <div className="font-semibold text-slate-800">{quotation.customer.companyName}</div>
              )}
              <div className="text-slate-600 mt-1">Phone: {quotation.customer.mobileNumber}</div>
              <div className="text-slate-600">Email: {quotation.customer.email}</div>
            </div>

            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Delivery Destination:
              </span>
              <div className="text-slate-800 leading-relaxed font-medium">
                {quotation.customer.deliveryLocation}
              </div>
              <div className="text-slate-600 mt-1 font-semibold">
                Destination State: {quotation.customer.state} ({quotation.customer.city})
              </div>
            </div>
          </div>

          {/* Order Scope Specifications */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Garment Scope & Technical Specifications
            </h3>
            <div className="p-3.5 bg-slate-100/70 rounded-lg text-xs space-y-1 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-600">Model:</span>
                <span className="font-bold text-slate-900">{quotation.productSummary.productName} ({quotation.productSummary.productCode})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Fabric & Knits:</span>
                <span className="font-semibold text-slate-900">{quotation.productSummary.fabric}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Color Quantities:</span>
                <span className="font-semibold text-slate-900">{quotation.productSummary.colors.join(' · ')}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-white font-semibold">
                <tr>
                  <th className="px-4 py-3">Item Description & Finish</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Blank Rate</th>
                  <th className="px-3 py-3 text-right">Print/Emb.</th>
                  <th className="px-4 py-3 text-right">Total (Excl. Tax)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {quotation.lineItems.map((li) => (
                  <tr key={li.id}>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-950">{li.description}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{li.specifications}</div>
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono font-bold text-slate-900">
                      {li.quantity}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono">
                      {formatINR(li.unitPrice)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono">
                      {formatINR(li.customizationPricePerUnit)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-950">
                      {formatINR(li.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Calculation Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-8">
            {/* Terms Column (Cols 7) */}
            <div className="sm:col-span-7 space-y-3 text-xs text-slate-600">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Payment Terms & Conditions
              </div>
              <div className="space-y-1.5 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-900">{quotation.paymentTerms}</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[11px] pt-1">
                  {quotation.termsAndConditions.map((tc, idx) => (
                    <li key={idx}>{tc}</li>
                  ))}
                </ul>
              </div>

              {/* Bank Transfer Details */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-[11px] font-mono space-y-0.5 text-slate-600">
                <div className="font-bold text-slate-900 font-sans">Bank Transfer Details (NEFT / RTGS):</div>
                <div>Account Name: DUROZEN TECHNOLOGIES PRIVATE LIMITED</div>
                <div>Bank: HDFC Bank Ltd, Tirupur Industrial Finance Branch</div>
                <div>A/C Number: 50200084920194 · IFSC: HDFC0001840</div>
              </div>
            </div>

            {/* Calculations Column (Cols 5) */}
            <div className="sm:col-span-5 space-y-2 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(quotation.subtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Screen / Punch Setup Charges:</span>
                  <span className="font-mono text-slate-900">{formatINR(quotation.printingAndSetupCharges)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Surface Freight / Cargo:</span>
                  <span className="font-mono text-slate-900">{formatINR(quotation.deliveryCharges)}</span>
                </div>

                {quotation.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Volume Discount:</span>
                    <span className="font-mono">-{formatINR(quotation.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-800 font-semibold pt-1 border-t border-slate-200">
                  <span>Taxable Base:</span>
                  <span className="font-mono">{formatINR(quotation.taxableAmount)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>GST ({quotation.gstRate}%):</span>
                  <span className="font-mono text-slate-900">{formatINR(quotation.gstAmount)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                  <span>Grand Total:</span>
                  <span className="font-mono">{formatINR(quotation.grandTotal)}</span>
                </div>
              </div>

              {/* Advance Breakdown */}
              <div className="bg-slate-950 text-white p-3.5 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Required Advance ({quotation.advancePercentage}%):</span>
                  <span className="font-mono font-bold text-white">{formatINR(quotation.advancePayable)}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Balance Before Dispatch:</span>
                  <span className="font-mono text-slate-300">{formatINR(quotation.balancePayable)}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
            <div>
              <div className="font-bold text-slate-800">Prepared by Merchandising Lead:</div>
              <div className="text-[11px] text-slate-600 mt-1">Durozen Bulk Apparel Division</div>
              <div className="text-[10px] text-slate-400">Digitally generated commercial estimate</div>
            </div>

            <div className="text-right">
              <div className="w-40 border-b border-slate-400 pb-1 mb-1 font-mono text-[11px] text-slate-700 font-semibold">
                Authorized Signatory
              </div>
              <div className="text-[10px] text-slate-400">For Durozen Technologies Pvt. Ltd.</div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions (Hidden in Print) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 print:hidden">
          <div className="text-xs text-slate-600">
            Status: <strong className="text-slate-900">{quotation.status}</strong>
            {quotation.approvedAt && ` · Approved on ${formatDate(quotation.approvedAt)}`}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {quotation.status !== 'Approved' && quotation.status !== 'Converted' && onApprove && (
              <button
                onClick={() => onApprove(quotation.id)}
                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Mark / Customer Approve</span>
              </button>
            )}

            {isAdmin && quotation.status === 'Approved' && onConvertToOrder && (
              <button
                onClick={() => onConvertToOrder(quotation)}
                className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Convert to Confirmed Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
