import React, { useState, useMemo } from 'react';
import { Product, Enquiry, Quotation, Order, EnquiryStatus, OrderProductionStatus, UploadedArtwork } from '../../types';
import { 
  LayoutDashboard, 
  Inbox, 
  FileSpreadsheet, 
  Package, 
  Shirt, 
  BarChart3, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Download, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Eye, 
  UserCheck, 
  Send,
  AlertCircle
} from 'lucide-react';
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters';
import { generateQuotationId, generateOrderId, saveEnquiries, saveQuotations, saveOrders, saveProducts } from '../../utils/storage';
import { TshirtSvg } from '../common/TshirtSvg';

interface AdminDashboardProps {
  products: Product[];
  enquiries: Enquiry[];
  quotations: Quotation[];
  orders: Order[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateEnquiries: (enquiries: Enquiry[]) => void;
  onUpdateQuotations: (quotes: Quotation[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onViewQuotation: (quote: Quotation) => void;
  onExitAdmin: () => void;
}

type AdminTab = 'overview' | 'enquiries' | 'quotations' | 'orders' | 'products' | 'reports';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  enquiries,
  quotations,
  orders,
  onUpdateProducts,
  onUpdateEnquiries,
  onUpdateQuotations,
  onUpdateOrders,
  onViewQuotation,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminRole, setAdminRole] = useState<'Super Admin' | 'Sales Manager'>('Super Admin');

  // Search & Filters
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // New Note
  const [newNoteText, setNewNoteText] = useState('');

  // Quotation Generator Modal State
  const [showQuoteGenerator, setShowQuoteGenerator] = useState<boolean>(false);
  const [quoteEnquiry, setQuoteEnquiry] = useState<Enquiry | null>(null);
  const [quoteBlankRate, setQuoteBlankRate] = useState<number>(200);
  const [quoteCustomPrice, setQuoteCustomPrice] = useState<number>(45);
  const [quoteDeliveryFee, setQuoteDeliveryFee] = useState<number>(2500);
  const [quoteSetupFee, setQuoteSetupFee] = useState<number>(3000);
  const [quoteDiscount, setQuoteDiscount] = useState<number>(0);

  // Order Details / Tracking Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dispatchCourier, setDispatchCourier] = useState('');
  const [dispatchAwb, setDispatchAwb] = useState('');

  // Product Add / Edit Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Computed KPIs
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length;
  const pendingQuotations = enquiries.filter((e) => e.status === 'Quotation Pending' || e.status === 'Contacted').length;
  const quotationsSent = quotations.filter((q) => q.status === 'Sent').length;
  const approvedQuotations = quotations.filter((q) => q.status === 'Approved' || q.status === 'Converted').length;
  const totalOrders = orders.length;
  const ordersInProduction = orders.filter((o) => o.status === 'In Production' || o.status === 'Production Pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const conversionRate = totalEnquiries > 0 ? Math.round((totalOrders / totalEnquiries) * 100) : 0;

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchSearch =
        e.id.toLowerCase().includes(enquirySearch.toLowerCase()) ||
        e.customer.fullName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
        (e.customer.companyName && e.customer.companyName.toLowerCase().includes(enquirySearch.toLowerCase()));
      const matchStatus = enquiryStatusFilter === 'All' || e.status === enquiryStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [enquiries, enquirySearch, enquiryStatusFilter]);

  // Update Enquiry Status
  const handleUpdateEnquiryStatus = (enquiryId: string, newStatus: EnquiryStatus) => {
    const updated = enquiries.map((e) => {
      if (e.id === enquiryId) {
        return {
          ...e,
          status: newStatus,
          statusHistory: [
            ...e.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              updatedBy: `${adminRole}`,
              note: `Status updated to ${newStatus}`,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      }
      return e;
    });
    saveEnquiries(updated);
    onUpdateEnquiries(updated);
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry(updated.find((e) => e.id === enquiryId) || null);
    }
  };

  // Add Internal Note to Enquiry
  const handleAddInternalNote = (enquiryId: string) => {
    if (!newNoteText.trim()) return;

    const updated = enquiries.map((e) => {
      if (e.id === enquiryId) {
        return {
          ...e,
          internalNotes: [
            ...e.internalNotes,
            {
              id: `note-${Date.now()}`,
              author: adminRole,
              timestamp: formatDateTime(new Date().toISOString()),
              text: newNoteText.trim(),
            },
          ],
        };
      }
      return e;
    });
    saveEnquiries(updated);
    onUpdateEnquiries(updated);
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry(updated.find((e) => e.id === enquiryId) || null);
    }
    setNewNoteText('');
  };

  // Launch Quotation Generator for Enquiry
  const handleOpenQuoteGenerator = (enquiry: Enquiry) => {
    setQuoteEnquiry(enquiry);
    const prod = products.find((p) => p.id === enquiry.config.productId) || products[0];
    setQuoteBlankRate(prod.baseEstimatedPrice);
    setQuoteCustomPrice(enquiry.config.customizationPlacements.length * 25);
    setQuoteDeliveryFee(enquiry.totalQuantity > 500 ? 4500 : 2500);
    setQuoteSetupFee(3500);
    setQuoteDiscount(0);
    setShowQuoteGenerator(true);
  };

  // Create Quotation from Form
  const handleSaveQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteEnquiry) return;

    const qty = quoteEnquiry.totalQuantity;
    const unitPrice = quoteBlankRate;
    const customPerUnit = quoteCustomPrice;
    const lineTotal = qty * (unitPrice + customPerUnit);
    const subtotal = lineTotal;
    const taxable = subtotal + quoteSetupFee + quoteDeliveryFee - quoteDiscount;
    const gstRate = 18;
    const gstAmount = Math.round((taxable * gstRate) / 100);
    const grandTotal = taxable + gstAmount;
    const advancePercent = 50;
    const advancePayable = Math.round((grandTotal * advancePercent) / 100);
    const balancePayable = grandTotal - advancePayable;

    const newQuoteId = generateQuotationId(quotations);

    const newQuotation: Quotation = {
      id: newQuoteId,
      quotationNumber: newQuoteId,
      enquiryId: quoteEnquiry.id,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      customer: quoteEnquiry.customer,
      productSummary: {
        productName: quoteEnquiry.config.productName,
        productCode: quoteEnquiry.config.productCode,
        fabric: `${quoteEnquiry.config.gsm} GSM ${quoteEnquiry.config.fabricType}`,
        colors: quoteEnquiry.config.colorDistributions.map(
          (c) => `${c.colorName} (${c.totalForColor} pcs)`
        ),
        totalQuantity: qty,
      },
      lineItems: [
        {
          id: `li-${Date.now()}`,
          description: `${quoteEnquiry.config.productName} (${quoteEnquiry.config.gsm} GSM)`,
          specifications: `${quoteEnquiry.config.printingMethod} · Placements: ${quoteEnquiry.config.customizationPlacements.join(', ')}`,
          quantity: qty,
          unitPrice,
          customizationPricePerUnit: customPerUnit,
          lineTotal,
        },
      ],
      subtotal,
      printingAndSetupCharges: quoteSetupFee,
      deliveryCharges: quoteDeliveryFee,
      discountAmount: quoteDiscount,
      taxableAmount: taxable,
      gstRate,
      gstAmount,
      grandTotal,
      advancePercentage: advancePercent,
      advancePayable,
      balancePayable,
      paymentTerms: '50% Advance with confirmed PO; 50% Balance prior to final freight dispatch.',
      termsAndConditions: [
        'Quotation validity is 14 days from issue date.',
        'Turnaround timeline: 6 to 8 business days following payment & sample proof signoff.',
        'Fabric tolerances strictly ±3% as per Tirupur Textile Guild regulations.',
      ],
      status: 'Sent',
      createdAt: new Date().toISOString(),
    };

    const updatedQuotes = [newQuotation, ...quotations];
    saveQuotations(updatedQuotes);
    onUpdateQuotations(updatedQuotes);

    // Update enquiry to 'Quotation Sent' and link quote ID
    const updatedEnquiries = enquiries.map((enq) => {
      if (enq.id === quoteEnquiry.id) {
        return {
          ...enq,
          status: 'Quotation Sent' as EnquiryStatus,
          quotationId: newQuoteId,
          statusHistory: [
            ...enq.statusHistory,
            {
              status: 'Quotation Sent',
              timestamp: new Date().toISOString(),
              updatedBy: adminRole,
              note: `Generated quotation ${newQuoteId} for ${formatINR(grandTotal)}`,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      }
      return enq;
    });
    saveEnquiries(updatedEnquiries);
    onUpdateEnquiries(updatedEnquiries);

    setShowQuoteGenerator(false);
    onViewQuotation(newQuotation);
  };

  // Convert Quotation to Confirmed Order
  const handleConvertToOrder = (quote: Quotation) => {
    const newOrderId = generateOrderId(orders);

    const linkedEnq = enquiries.find((e) => e.id === quote.enquiryId);

    const newOrder: Order = {
      id: newOrderId,
      enquiryId: quote.enquiryId,
      quotationId: quote.id,
      quotationNumber: quote.quotationNumber,
      customer: quote.customer,
      productDetails: {
        productName: quote.productSummary.productName,
        productCode: quote.productSummary.productCode,
        fabric: quote.productSummary.fabric,
        colorDistributions: linkedEnq?.config.colorDistributions || [],
        printingMethod: linkedEnq?.config.printingMethod || 'Screen Printing',
        customizationPlacements: linkedEnq?.config.customizationPlacements || [],
      },
      totalQuantity: quote.productSummary.totalQuantity,
      grandTotal: quote.grandTotal,
      advancePaid: quote.advancePayable,
      balanceDue: quote.balancePayable,
      status: 'Order Confirmed',
      statusHistory: [
        {
          status: 'Order Confirmed',
          timestamp: formatDateTime(new Date().toISOString()),
          note: `Converted from approved quotation ${quote.quotationNumber}. Advance of ${formatINR(quote.advancePayable)} verified.`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    onUpdateOrders(updatedOrders);

    // Update quotation status to Converted
    const updatedQuotes = quotations.map((q) => {
      if (q.id === quote.id) {
        return {
          ...q,
          status: 'Converted' as const,
          convertedToOrderId: newOrderId,
        };
      }
      return q;
    });
    saveQuotations(updatedQuotes);
    onUpdateQuotations(updatedQuotes);

    // Update enquiry status to Converted to Order
    const updatedEnquiries = enquiries.map((e) => {
      if (e.id === quote.enquiryId) {
        return {
          ...e,
          status: 'Converted to Order' as EnquiryStatus,
          orderId: newOrderId,
          statusHistory: [
            ...e.statusHistory,
            {
              status: 'Converted to Order',
              timestamp: new Date().toISOString(),
              updatedBy: adminRole,
              note: `Generated confirmed order ${newOrderId}`,
            },
          ],
        };
      }
      return e;
    });
    saveEnquiries(updatedEnquiries);
    onUpdateEnquiries(updatedEnquiries);

    setActiveTab('orders');
    setSelectedOrder(newOrder);
  };

  // Update Order Production Status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderProductionStatus, note?: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const history = [
          ...o.statusHistory,
          {
            status: newStatus,
            timestamp: formatDateTime(new Date().toISOString()),
            note: note || `Production milestone updated to ${newStatus}`,
          },
        ];

        let dispatchDetails = o.dispatchDetails;
        if (newStatus === 'Dispatched' && dispatchCourier && dispatchAwb) {
          dispatchDetails = {
            courierName: dispatchCourier,
            trackingNumber: dispatchAwb,
            dispatchDate: new Date().toISOString().split('T')[0],
            estimatedDeliveryDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
          };
        }

        return {
          ...o,
          status: newStatus,
          statusHistory: history,
          dispatchDetails,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
    saveOrders(updated);
    onUpdateOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updated.find((o) => o.id === orderId) || null);
    }
  };

  // Export to CSV
  const handleExportEnquiriesCSV = () => {
    const headers = ['Enquiry ID', 'Customer Name', 'Company', 'Mobile', 'Email', 'City', 'State', 'Product', 'Total Qty', 'Status', 'Date'];
    const rows = enquiries.map((e) => [
      e.id,
      `"${e.customer.fullName}"`,
      `"${e.customer.companyName || ''}"`,
      `"${e.customer.mobileNumber}"`,
      `"${e.customer.email}"`,
      `"${e.customer.city}"`,
      `"${e.customer.state}"`,
      `"${e.config.productName}"`,
      e.totalQuantity,
      e.status,
      e.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Durozen_Bulk_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportOrdersCSV = () => {
    const headers = ['Order ID', 'Quotation Ref', 'Customer', 'Company', 'Product', 'Total Units', 'Grand Total (INR)', 'Advance Paid', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.id,
      o.quotationNumber,
      `"${o.customer.fullName}"`,
      `"${o.customer.companyName || ''}"`,
      `"${o.productDetails.productName}"`,
      o.totalQuantity,
      o.grandTotal,
      o.advancePaid,
      o.status,
      o.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Durozen_Confirmed_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Admin Top Navigation */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-950 flex items-center justify-center font-bold text-sm">
                DZ
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight block">
                  DUROZEN <span className="font-light text-slate-400">OPERATIONS CONSOLE</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">B2B Order & Merchandising Engine</span>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs ml-4">
              <button
                onClick={() => setAdminRole('Super Admin')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  adminRole === 'Super Admin' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Super Admin
              </button>
              <button
                onClick={() => setAdminRole('Sales Manager')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  adminRole === 'Sales Manager' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sales Manager
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer border border-white/10"
            >
              Exit to Storefront
            </button>
          </div>

        </div>

        {/* Tab Sub-Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-slate-900 py-2 text-xs">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'enquiries', label: `Bulk Enquiries (${enquiries.length})`, icon: Inbox },
            { id: 'quotations', label: `Quotations (${quotations.length})`, icon: FileSpreadsheet },
            { id: 'orders', label: `Production Orders (${orders.length})`, icon: Package },
            { id: 'products', label: `Product Master (${products.length})`, icon: Shirt },
            { id: 'reports', label: 'Business Reports & CSV', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs text-slate-500 font-medium">Total Bulk Enquiries</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-black text-slate-950">{totalEnquiries}</span>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {newEnquiries} New
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs text-slate-500 font-medium">Pending Quotations</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-black text-slate-950">{pendingQuotations}</span>
                  <span className="text-[11px] text-slate-500">{quotationsSent} Sent</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs text-slate-500 font-medium">Orders in Production</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-black text-slate-950">{ordersInProduction}</span>
                  <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {totalOrders} Total Confirmed
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs text-slate-500 font-medium">Confirmed Order Revenue</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xl font-black text-slate-950">{formatINR(totalRevenue)}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{conversionRate}% Conv.</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Inbound Enquiries (Cols 7) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-950">Inbound Enquiries Needing Review</h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {enquiries.slice(0, 4).map((enq) => (
                    <div key={enq.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-950">{enq.id}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {enq.status}
                          </span>
                        </div>
                        <div className="text-slate-800 font-medium mt-0.5">
                          {enq.customer.fullName} {enq.customer.companyName && `· ${enq.customer.companyName}`}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {enq.config.productName} · <strong className="text-slate-800">{enq.totalQuantity} pcs</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setActiveTab('enquiries');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleOpenQuoteGenerator(enq)}
                          className="px-2.5 py-1 text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white rounded-lg cursor-pointer shadow-2xs"
                        >
                          Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Production Orders (Cols 5) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-950">Active Manufacturing Floor</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-950">{ord.id}</span>
                        <span className="font-bold text-slate-800 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-slate-700 font-medium">
                        {ord.customer.fullName} · {ord.totalQuantity} Units
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
                        <span>Total: {formatINR(ord.grandTotal)}</span>
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setActiveTab('orders');
                          }}
                          className="text-slate-900 font-bold hover:underline cursor-pointer"
                        >
                          Manage Flow →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ENQUIRIES MANAGEMENT */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  placeholder="Search Enquiry ID, Customer, Company..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-slate-500 font-medium whitespace-nowrap">Status:</span>
                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quotation Pending">Quotation Pending</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Approved">Approved</option>
                  <option value="Converted to Order">Converted to Order</option>
                </select>

                <button
                  onClick={handleExportEnquiriesCSV}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Enquiries Master Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Enquiry Ref</th>
                      <th className="px-4 py-3">Customer & Org</th>
                      <th className="px-4 py-3">Garment & Qty</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-950">
                          {enq.id}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{enq.customer.fullName}</div>
                          {enq.customer.companyName && (
                            <div className="text-[11px] text-slate-500">{enq.customer.companyName}</div>
                          )}
                          <div className="text-[10px] text-slate-400 font-mono">{enq.customer.mobileNumber}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{enq.config.productName}</div>
                          <div className="text-[11px] font-bold text-slate-800">
                            {enq.totalQuantity} Units ({enq.config.colorDistributions.length} Colors)
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {enq.customer.city}, {enq.customer.state}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                            enq.status === 'New'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : enq.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : enq.status === 'Quotation Sent'
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}>
                            {enq.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">
                          {formatDate(enq.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleOpenQuoteGenerator(enq)}
                            className="px-3 py-1 text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white rounded-lg cursor-pointer shadow-2xs"
                          >
                            Prepare Quote
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: QUOTATIONS LIST */}
        {activeTab === 'quotations' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-950">Official Commercial Quotations</h3>
                <p className="text-xs text-slate-500">Quotation records with GST calculation, validities, and approval status.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Quote Number</th>
                      <th className="px-4 py-3">Enquiry Ref</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Garment & Units</th>
                      <th className="px-4 py-3 text-right">Grand Total (INR)</th>
                      <th className="px-4 py-3">Valid Until</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {quotations.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-950">
                          {q.quotationNumber}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500">
                          {q.enquiryId}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{q.customer.fullName}</div>
                          {q.customer.companyName && (
                            <div className="text-[11px] text-slate-500">{q.customer.companyName}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800">{q.productSummary.productName}</div>
                          <div className="text-[11px] text-slate-500">{q.productSummary.totalQuantity} Pcs</div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-950">
                          {formatINR(q.grandTotal)}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">
                          {formatDate(q.validUntil)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            q.status === 'Approved' || q.status === 'Converted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => onViewQuotation(q)}
                            className="px-3 py-1 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg cursor-pointer"
                          >
                            View / Print
                          </button>
                          {q.status === 'Approved' && (
                            <button
                              onClick={() => handleConvertToOrder(q)}
                              className="px-3 py-1 text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white rounded-lg cursor-pointer shadow-2xs"
                            >
                              Convert to Order
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-950">Confirmed Manufacturing Orders</h3>
                <p className="text-xs text-slate-500">Track 11-step factory production lifecycle, quality inspection, and dispatch tracking.</p>
              </div>

              <button
                onClick={handleExportOrdersCSV}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Orders CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <div className="font-mono text-base font-extrabold text-slate-950">{ord.id}</div>
                      <div className="text-[11px] text-slate-500">Quotation Ref: {ord.quotationNumber}</div>
                    </div>
                    <span className="text-xs bg-slate-900 text-white px-2.5 py-1 rounded font-bold">
                      {ord.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Customer</span>
                      <span className="font-bold text-slate-900">{ord.customer.fullName}</span>
                      <span className="text-slate-600 block">{ord.customer.companyName || ord.customer.city}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Order Value & Units</span>
                      <span className="font-mono font-bold text-slate-950">{formatINR(ord.grandTotal)}</span>
                      <span className="text-slate-600 block">{ord.totalQuantity} Units total</span>
                    </div>
                  </div>

                  {/* Dispatch details if available */}
                  {ord.dispatchDetails && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-0.5">
                      <div className="font-bold flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Dispatched via {ord.dispatchDetails.courierName}</span>
                      </div>
                      <div className="font-mono text-[11px]">AWB Tracking: <strong>{ord.dispatchDetails.trackingNumber}</strong></div>
                    </div>
                  )}

                  {/* Order Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatDate(ord.createdAt)}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      Update Production Flow
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 5: PRODUCT & CATEGORY MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-950">Apparel Blanks & Product Master</h3>
                <p className="text-xs text-slate-500">Configure factory garments, GSM specifications, MOQs, and active catalog status.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {p.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        MOQ: {p.minOrderQuantity} Pcs
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-950">{p.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{p.shortDescription}</p>

                    <div className="pt-2 text-xs space-y-1 text-slate-500 border-t border-slate-100">
                      <div>Fabric: <strong className="text-slate-800">{p.fabricType} ({p.gsm} GSM)</strong></div>
                      <div>Base Blank Rate: <strong className="font-mono text-slate-900">~{formatINR(p.baseEstimatedPrice)}</strong></div>
                      <div>Colors in stock: <strong className="text-slate-800">{p.availableColours.length} shades</strong></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
                    >
                      Edit Garment Spec
                    </button>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active on Storefront</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 6: BUSINESS REPORTS & CSV EXPORT */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            
            <div className="max-w-2xl space-y-1">
              <h3 className="text-base font-bold text-slate-950">Factory Merchandising & Revenue Reports</h3>
              <p className="text-xs text-slate-500">Download bulk transaction reports for accountant GST filings and production capacity planning.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950">Bulk Enquiries Export (CSV)</h4>
                    <span className="text-xs text-slate-500">Includes all client contacts, size matrix specs, and notes.</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Export complete historical enquiry records including client organizations, requested delivery dates, and status progression for CRM synchronization.
                </p>
                <button
                  onClick={handleExportEnquiriesCSV}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Enquiries Data (.CSV)</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950">Confirmed Orders & Revenue Report</h4>
                    <span className="text-xs text-slate-500">Taxable totals, advances received, and dispatch dockets.</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates an itemized transaction ledger for the current financial year. Includes GSTIN tax amounts and courier consignment dockets.
                </p>
                <button
                  onClick={handleExportOrdersCSV}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Confirmed Orders (.CSV)</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ENQUIRY DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-black text-slate-950">{selectedEnquiry.id}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {selectedEnquiry.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Submitted on {formatDateTime(selectedEnquiry.createdAt)}
                </div>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block">Customer Name</span>
                <span className="font-bold text-slate-900">{selectedEnquiry.customer.fullName}</span>
                {selectedEnquiry.customer.companyName && (
                  <span className="text-slate-700 block font-medium">{selectedEnquiry.customer.companyName}</span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block">Contact Info</span>
                <span className="font-mono text-slate-900">{selectedEnquiry.customer.mobileNumber}</span>
                <span className="text-slate-600 block">{selectedEnquiry.customer.email}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Delivery Address</span>
                <span className="text-slate-800 font-medium">{selectedEnquiry.customer.deliveryLocation}</span>
              </div>
            </div>

            {/* Color-Wise Size Quantities Matrix */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Color-Wise Size Distribution
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Color</th>
                      <th className="px-2 py-2 text-center">S</th>
                      <th className="px-2 py-2 text-center">M</th>
                      <th className="px-2 py-2 text-center">L</th>
                      <th className="px-2 py-2 text-center">XL</th>
                      <th className="px-2 py-2 text-center">2XL</th>
                      <th className="px-2 py-2 text-center">3XL</th>
                      <th className="px-3 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    {selectedEnquiry.config.colorDistributions.map((c) => (
                      <tr key={c.colorName}>
                        <td className="px-3 py-2 font-sans font-bold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.colorHex }} />
                          <span>{c.colorName}</span>
                        </td>
                        <td className="px-2 py-2 text-center">{c.sizes.S || 0}</td>
                        <td className="px-2 py-2 text-center">{c.sizes.M || 0}</td>
                        <td className="px-2 py-2 text-center">{c.sizes.L || 0}</td>
                        <td className="px-2 py-2 text-center">{c.sizes.XL || 0}</td>
                        <td className="px-2 py-2 text-center">{c.sizes['2XL'] || 0}</td>
                        <td className="px-2 py-2 text-center">{c.sizes['3XL'] || 0}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-950">{c.totalForColor}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-sans font-bold">
                      <td className="px-3 py-2">Grand Total</td>
                      <td colSpan={6} className="text-center font-mono"></td>
                      <td className="px-3 py-2 text-right font-mono text-slate-950 text-sm">
                        {selectedEnquiry.totalQuantity} Pcs
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Uploaded Artwork Preview */}
            {selectedEnquiry.config.uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Customer Uploaded Artwork Files
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedEnquiry.config.uploadedFiles.map((file) => (
                    <div key={file.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs">
                      {file.dataUrl ? (
                        <img src={file.dataUrl} alt={file.name} className="w-10 h-10 object-contain rounded bg-white border border-slate-200 p-0.5" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center font-mono font-bold text-slate-600 text-[10px]">
                          ART
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900">{file.name}</div>
                        <div className="text-[10px] text-slate-500">Placement: {file.placement}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Notes */}
            {selectedEnquiry.config.additionalNotes && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Special Manufacturing Instructions:</span>
                <p className="leading-relaxed">{selectedEnquiry.config.additionalNotes}</p>
              </div>
            )}

            {/* Status Transition Control */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-800 block">Update Enquiry Pipeline Status</label>
              <div className="flex items-center gap-2 flex-wrap">
                {(['Contacted', 'Quotation Pending', 'Quotation Sent', 'Approved', 'Rejected'] as EnquiryStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateEnquiryStatus(selectedEnquiry.id, st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      selectedEnquiry.status === st
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Mark as {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Notes Section */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Internal Staff Notes</h4>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedEnquiry.internalNotes.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">No internal staff notes yet.</div>
                ) : (
                  selectedEnquiry.internalNotes.map((note) => (
                    <div key={note.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                        <span>{note.author}</span>
                        <span className="text-slate-400 font-mono font-normal">{note.timestamp}</span>
                      </div>
                      <p className="text-slate-600">{note.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add an internal production or follow-up note..."
                  className="flex-1 text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => handleAddInternalNote(selectedEnquiry.id)}
                  className="px-3 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  const enq = selectedEnquiry;
                  setSelectedEnquiry(null);
                  handleOpenQuoteGenerator(enq);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Generate Official Quotation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* QUOTATION GENERATOR MODAL */}
      {showQuoteGenerator && quoteEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveQuotation}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-950">Prepare Official Quotation</h3>
                <span className="text-xs text-slate-500">
                  Enquiry {quoteEnquiry.id} · {quoteEnquiry.customer.fullName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowQuoteGenerator(false)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Price Configurator */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Unit Blank Price (₹ / pc)</label>
                  <input
                    type="number"
                    required
                    min="50"
                    value={quoteBlankRate}
                    onChange={(e) => setQuoteBlankRate(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Customization / Print per unit (₹ / pc)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={quoteCustomPrice}
                    onChange={(e) => setQuoteCustomPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Screen / Embroidery Setup Fee (₹ flat)</label>
                  <input
                    type="number"
                    min="0"
                    value={quoteSetupFee}
                    onChange={(e) => setQuoteSetupFee(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Freight & Delivery Fee (₹ flat)</label>
                  <input
                    type="number"
                    min="0"
                    value={quoteDeliveryFee}
                    onChange={(e) => setQuoteDeliveryFee(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700 block">Volume Discount (₹ flat discount)</label>
                  <input
                    type="number"
                    min="0"
                    value={quoteDiscount}
                    onChange={(e) => setQuoteDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Live Quotation Summary Calculation */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-600 font-sans">
                  <span>Garment Base Subtotal ({quoteEnquiry.totalQuantity} pcs × ₹{quoteBlankRate + quoteCustomPrice}):</span>
                  <span>{formatINR(quoteEnquiry.totalQuantity * (quoteBlankRate + quoteCustomPrice))}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-sans">
                  <span>Setup & Freight:</span>
                  <span>{formatINR(quoteSetupFee + quoteDeliveryFee)}</span>
                </div>
                <div className="flex justify-between text-slate-800 font-bold border-t border-slate-200 pt-1">
                  <span>Taxable Base:</span>
                  <span>{formatINR(quoteEnquiry.totalQuantity * (quoteBlankRate + quoteCustomPrice) + quoteSetupFee + quoteDeliveryFee - quoteDiscount)}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-sans">
                  <span>GST (18%):</span>
                  <span>{formatINR(Math.round(((quoteEnquiry.totalQuantity * (quoteBlankRate + quoteCustomPrice) + quoteSetupFee + quoteDeliveryFee - quoteDiscount) * 0.18)))}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 border-t-2 border-slate-900 pt-1 font-sans">
                  <span>Grand Total:</span>
                  <span>
                    {formatINR(
                      Math.round(
                        (quoteEnquiry.totalQuantity * (quoteBlankRate + quoteCustomPrice) + quoteSetupFee + quoteDeliveryFee - quoteDiscount) * 1.18
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowQuoteGenerator(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Generate & Save Quotation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ORDER PRODUCTION STAGES MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-lg font-black text-slate-950">{selectedOrder.id}</span>
                <span className="text-xs text-slate-500 block">
                  {selectedOrder.customer.fullName} · {selectedOrder.totalQuantity} Units
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Current Status */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Current Production Status:</span>
                <span className="font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded">
                  {selectedOrder.status}
                </span>
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-semibold block">Transition Production Milestone:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'Design Approved',
                      'Production Pending',
                      'In Production',
                      'Quality Check',
                      'Ready for Dispatch',
                      'Dispatched',
                      'Delivered',
                      'Completed',
                    ] as OrderProductionStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                      className={`p-2 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                        selectedOrder.status === st
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Courier Dispatch Entry if moving to Dispatched */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-900">
                Courier / Dispatch Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 block">Courier Carrier Name</label>
                  <input
                    type="text"
                    value={dispatchCourier}
                    onChange={(e) => setDispatchCourier(e.target.value)}
                    placeholder="e.g. Blue Dart Express, Delhivery Freight"
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 block">AWB Docket Tracking Number</label>
                  <input
                    type="text"
                    value={dispatchAwb}
                    onChange={(e) => setDispatchAwb(e.target.value)}
                    placeholder="e.g. BLUEDART-98421894"
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Audit History Log */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-700">Production Audit Log</h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {selectedOrder.statusHistory.map((h, i) => (
                  <div key={i} className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100 text-slate-600">
                    <div>
                      <strong className="text-slate-900">{h.status}</strong>: {h.note}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 whitespace-nowrap">{h.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PRODUCT SPEC EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-950">Edit Model: {editingProduct.code}</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Product Model Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Fabric Weight (GSM)</label>
                  <input
                    type="number"
                    value={editingProduct.gsm}
                    onChange={(e) => setEditingProduct({ ...editingProduct, gsm: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Minimum Order Quantity (MOQ)</label>
                  <input
                    type="number"
                    value={editingProduct.minOrderQuantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minOrderQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Base Reference Price (₹)</label>
                <input
                  type="number"
                  value={editingProduct.baseEstimatedPrice}
                  onChange={(e) => setEditingProduct({ ...editingProduct, baseEstimatedPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
                  saveProducts(updated);
                  onUpdateProducts(updated);
                  setEditingProduct(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
