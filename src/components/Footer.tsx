import React from 'react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="no-print bg-[#15233F] text-white border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BrandLogo size={36} />
            <div>
              <div className="text-base font-bold tracking-tight">Education Loan Repayment Planner</div>
              <div className="text-xs text-slate-400">
                Responsible Education Financing & Decision Planning
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
            <button onClick={() => onNavigate('planner')} className="hover:text-white transition-colors">
              How It Works
            </button>
            <button onClick={() => onNavigate('methodology')} className="hover:text-white transition-colors">
              Methodology & Formulas
            </button>
            <button onClick={() => onNavigate('business')} className="hover:text-white transition-colors">
              Business Model & Trust
            </button>
            <button onClick={() => onNavigate('institutions')} className="hover:text-white transition-colors">
              Institutions Prototype
            </button>
            <button onClick={() => onNavigate('stress')} className="hover:text-white transition-colors">
              Stress Testing
            </button>
          </div>
        </div>

        {/* Mandatory Regulatory & Consumer Disclaimer */}
        <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
          <p>
            <strong>Statutory Disclaimer:</strong> This planner provides estimates based on user-entered assumptions and is not financial advice. Actual loan terms, interest treatment, subsidies, fees, and eligibility may differ by lender and scheme. Verify current terms directly with regulated financial institutions or official portals (such as Vidya Lakshmi) before borrowing.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            <span>© 2026 Education Loan Repayment Planner. All rights reserved.</span>
            <span>Local Browser Storage Enabled · DPDP Act Compliant · Regulated Lender Neutral</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
