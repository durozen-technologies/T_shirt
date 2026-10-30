import React, { useState } from 'react';
import { Product, Enquiry, Quotation, Order, PortfolioItem } from './types';
import { 
  getStoredProducts, 
  getStoredEnquiries, 
  getStoredQuotations, 
  getStoredOrders, 
  getStoredPortfolio,
  saveQuotations,
  saveOrders,
  saveEnquiries,
  generateOrderId
} from './utils/storage';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Hero } from './components/customer/Hero';
import { Catalogue } from './components/customer/Catalogue';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { BulkOrderBuilder } from './components/customer/BulkOrderBuilder';
import { CustomizerStudio } from './components/customer/CustomizerStudio';
import { OrderTracker } from './components/customer/OrderTracker';
import { Portfolio } from './components/customer/Portfolio';
import { AboutUs } from './components/customer/AboutUs';
import { ContactUs } from './components/customer/ContactUs';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { QuotationModal } from './components/admin/QuotationModal';
import { CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  // Master Datasets with localStorage persistence
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(getStoredEnquiries);
  const [quotations, setQuotations] = useState<Quotation[]>(getStoredQuotations);
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(getStoredPortfolio);

  // App Navigation View
  const [currentView, setCurrentView] = useState<string>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Modals & Context States
  const [specsProduct, setSpecsProduct] = useState<Product | null>(null);
  const [builderProduct, setBuilderProduct] = useState<Product | undefined>(undefined);
  const [activeQuotation, setActiveQuotation] = useState<Quotation | null>(null);
  const [trackerSearchId, setTrackerSearchId] = useState<string>('BTQ-2026-00001');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Handlers for switching views & flows
  const handleSelectProductForBuilder = (product: Product) => {
    setBuilderProduct(product);
    setCurrentView('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseCustomizerInBuilder = (product: Product, customLogoUrl?: string, placement?: string) => {
    setBuilderProduct(product);
    setCurrentView('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded ${product.name} with custom artwork into Bulk Order Builder!`);
  };

  const handleEnquirySubmitted = (newEnquiry: Enquiry) => {
    setEnquiries((prev) => [newEnquiry, ...prev]);
    showToast(`Bulk enquiry ${newEnquiry.id} submitted successfully to factory desk!`);
  };

  const handleNavigateToTracker = (enquiryId: string) => {
    setTrackerSearchId(enquiryId);
    setCurrentView('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quotation Approval Flow
  const handleApproveQuotation = (quoteId: string) => {
    const updatedQuotes = quotations.map((q) => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: 'Approved' as const,
          approvedAt: new Date().toISOString(),
        };
      }
      return q;
    });
    saveQuotations(updatedQuotes);
    setQuotations(updatedQuotes);

    // Update active modal quotation if open
    if (activeQuotation && activeQuotation.id === quoteId) {
      setActiveQuotation({
        ...activeQuotation,
        status: 'Approved',
        approvedAt: new Date().toISOString(),
      });
    }

    // Also update linked enquiry status to Approved
    const targetQuote = quotations.find((q) => q.id === quoteId);
    if (targetQuote) {
      const updatedEnquiries = enquiries.map((e) => {
        if (e.id === targetQuote.enquiryId) {
          return {
            ...e,
            status: 'Approved' as const,
            statusHistory: [
              ...e.statusHistory,
              {
                status: 'Approved',
                timestamp: new Date().toISOString(),
                updatedBy: 'Customer Approval Portal',
                note: `Customer approved quotation ${quoteId}`,
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return e;
      });
      saveEnquiries(updatedEnquiries);
      setEnquiries(updatedEnquiries);
    }

    showToast(`Quotation ${quoteId} has been successfully approved!`);
  };

  // Convert Approved Quotation to Confirmed Order
  const handleConvertQuotationToOrder = (quote: Quotation) => {
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
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          note: `Converted from approved quotation ${quote.quotationNumber}. Advance payment verified.`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    setOrders(updatedOrders);

    // Update quote status
    const updatedQuotes = quotations.map((q) =>
      q.id === quote.id ? { ...q, status: 'Converted' as const, convertedToOrderId: newOrderId } : q
    );
    saveQuotations(updatedQuotes);
    setQuotations(updatedQuotes);

    // Update enquiry status
    const updatedEnqs = enquiries.map((e) =>
      e.id === quote.enquiryId ? { ...e, status: 'Converted to Order' as const, orderId: newOrderId } : e
    );
    saveEnquiries(updatedEnqs);
    setEnquiries(updatedEnqs);

    setActiveQuotation(null);
    showToast(`Order ${newOrderId} created and forwarded to production queue!`);
  };

  const pendingQuotesCount = enquiries.filter(
    (e) => e.status === 'New' || e.status === 'Quotation Pending'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Dashboard Mode OR Customer Storefront */}
      {isAdmin ? (
        <AdminDashboard
          products={products}
          enquiries={enquiries}
          quotations={quotations}
          orders={orders}
          onUpdateProducts={setProducts}
          onUpdateEnquiries={setEnquiries}
          onUpdateQuotations={setQuotations}
          onUpdateOrders={setOrders}
          onViewQuotation={(q) => setActiveQuotation(q)}
          onExitAdmin={() => setIsAdmin(false)}
        />
      ) : (
        <>
          {/* Customer Header */}
          <Header
            currentView={currentView}
            onNavigate={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isAdmin={isAdmin}
            onToggleAdmin={() => setIsAdmin(true)}
            pendingQuotesCount={pendingQuotesCount}
          />

          {/* Customer Main Views */}
          <main className="flex-1">
            {currentView === 'home' && (
              <>
                <Hero
                  products={products}
                  onSelectProductForBuilder={handleSelectProductForBuilder}
                  onExploreCollections={() => {
                    setCurrentView('collections');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                <Catalogue
                  products={products}
                  onSelectProduct={handleSelectProductForBuilder}
                  onOpenSpecs={(p) => setSpecsProduct(p)}
                />

                {/* Bulk Ordering Process Section (SRS Section 3.1 & 14) */}
                <section className="bg-slate-950 text-white py-16 border-t border-b border-slate-900">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="max-w-2xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <span>Commercial Production Workflow</span>
                        <span aria-hidden="true">·</span>
                        <span>Zero Retail Friction</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        How Durozen B2B Bulk Ordering Operates
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        Every batch is precision-manufactured at our Tirupur knitting & print plant with dedicated merchandisers overseeing your color matching and delivery deadlines.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
                        <span className="font-mono text-xl font-black text-slate-400 block">01</span>
                        <h3 className="text-base font-bold text-white">Configure Garment & Matrix</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Select fabric weight (180 to 350 GSM), choose from 24+ Pantone shades, and distribute exact size quantities (S to 3XL).
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
                        <span className="font-mono text-xl font-black text-slate-400 block">02</span>
                        <h3 className="text-base font-bold text-white">Upload Artwork & Proof</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Attach vector logos or design briefs. Our studio generates a digital mock-up and screen layout proof within 2 hours.
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
                        <span className="font-mono text-xl font-black text-slate-400 block">03</span>
                        <h3 className="text-base font-bold text-white">Official Tax Quotation</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Receive an itemized GST quotation with screen setup fees, unit rates, and courier dispatch timelines for your procurement approval.
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
                        <span className="font-mono text-xl font-black text-slate-400 block">04</span>
                        <h3 className="text-base font-bold text-white">Knitting, Print & Dispatch</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Automated cutting, high-speed carousels, and 100% metal-detecting quality checks, dispatched with live surface AWB tracking.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Portfolio
                  portfolio={portfolio}
                  onStartOrder={() => {
                    setCurrentView('builder');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                <AboutUs />
                <ContactUs />
              </>
            )}

            {currentView === 'collections' && (
              <div className="py-8">
                <Catalogue
                  products={products}
                  onSelectProduct={handleSelectProductForBuilder}
                  onOpenSpecs={(p) => setSpecsProduct(p)}
                />
              </div>
            )}

            {currentView === 'builder' && (
              <BulkOrderBuilder
                products={products}
                preselectedProduct={builderProduct}
                onEnquirySubmitted={handleEnquirySubmitted}
                onNavigateToTracker={handleNavigateToTracker}
              />
            )}

            {currentView === 'customizer' && (
              <CustomizerStudio
                products={products}
                onUseInBuilder={handleUseCustomizerInBuilder}
              />
            )}

            {currentView === 'tracker' && (
              <OrderTracker
                enquiries={enquiries}
                orders={orders}
                quotations={quotations}
                initialSearchId={trackerSearchId}
                onViewQuotation={(q) => setActiveQuotation(q)}
                onApproveQuotation={handleApproveQuotation}
              />
            )}

            {currentView === 'portfolio' && (
              <Portfolio
                portfolio={portfolio}
                onStartOrder={() => {
                  setCurrentView('builder');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'about' && <AboutUs />}
            {currentView === 'contact' && <ContactUs />}
          </main>

          {/* Customer Footer */}
          <Footer
            onNavigate={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}

      {/* Product Detail & Specs Modal */}
      <ProductDetailModal
        product={specsProduct}
        onClose={() => setSpecsProduct(null)}
        onConfigure={(p) => {
          setSpecsProduct(null);
          handleSelectProductForBuilder(p);
        }}
      />

      {/* Official Quotation Modal */}
      <QuotationModal
        quotation={activeQuotation}
        onClose={() => setActiveQuotation(null)}
        onApprove={handleApproveQuotation}
        onConvertToOrder={handleConvertQuotationToOrder}
        isAdmin={isAdmin}
      />

    </div>
  );
}
