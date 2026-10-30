import React from 'react';
import { ShieldCheck, ArrowRight, LayoutDashboard, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  pendingQuotesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  isAdmin,
  onToggleAdmin,
  pendingQuotesCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-slate-800 transition-colors">
              DZ
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-950 whitespace-nowrap">
                DUROZEN <span className="font-light text-slate-500">APPAREL</span>
              </span>
              <span className="text-[10px] tracking-wider text-slate-500 font-medium uppercase -mt-1 hidden sm:block">
                B2B Bulk Manufacturing
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('collections')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentView === 'collections' ? 'text-slate-950 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => onNavigate('builder')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentView === 'builder' ? 'text-slate-950 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Bulk Order Builder
            </button>
            <button
              onClick={() => onNavigate('customizer')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentView === 'customizer' ? 'text-slate-950 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Design Studio
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentView === 'portfolio' ? 'text-slate-950 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Our Work
            </button>
            <button
              onClick={() => onNavigate('tracker')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentView === 'tracker' ? 'text-slate-950 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Track Order / Quote
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentView === 'about' ? 'text-slate-950 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentView === 'contact' ? 'text-slate-950 font-semibold border-b-2 border-slate-900' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: 1 primary action with Admin workspace switch affordance */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleAdmin}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isAdmin
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle B2B Operations Admin Dashboard"
            >
              {isAdmin ? (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Storefront</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                  {pendingQuotesCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                  )}
                </>
              )}
            </button>

            {!isAdmin && (
              <button
                onClick={() => onNavigate('builder')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Configure Bulk Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
