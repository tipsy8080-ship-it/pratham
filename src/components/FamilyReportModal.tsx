import React from 'react';
import { LoanInputState, CalculationResults } from '../types';
import { formatINR, formatINRLakhs } from '../utils/formatters';
import { BrandLogo } from './BrandLogo';

interface FamilyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: LoanInputState;
  results: CalculationResults;
}

export const FamilyReportModal: React.FC<FamilyReportModalProps> = ({
  isOpen,
  onClose,
  input,
  results,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMFORTABLE':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'BORDERLINE':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'STRETCHED':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Top Floating Action Bar (Hidden in Print) */}
        <div className="no-print bg-[#15233F] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size={28} />
            <span className="font-bold text-sm tracking-tight">Family Loan Planning Report</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold text-[#15233F] bg-[#F2A900] hover:bg-amber-400 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Download PDF / Print</span>
              <span>🖨️</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable 1-Page Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-[#15233F] bg-white print:p-0">
          {/* Report Header */}
          <div className="flex items-start justify-between pb-5 border-b-2 border-slate-900">
            <div className="flex items-center gap-4">
              <BrandLogo size={56} />
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#15233F]">
                  Education Loan Planning Report
                </h1>
                <p className="text-xs text-[#55657F] font-medium">
                  Family Decision-Support & Responsible Borrowing Assessment
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-[#2547D0]">CONFIDENTIAL ADVISORY</div>
              <div className="text-slate-500 tabular-nums">
                Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <div className="text-slate-500">Ref: ELP-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
          </div>

          {/* Student & Course Particulars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-[#55657F] block text-[11px]">Student Name:</span>
              <span className="font-bold">{input.studentName || 'Student Co-Applicant'}</span>
            </div>
            <div>
              <span className="text-[#55657F] block text-[11px]">Academic Course:</span>
              <span className="font-bold">{input.courseName || 'Higher Education Degree'}</span>
            </div>
            <div>
              <span className="text-[#55657F] block text-[11px]">Target Institution:</span>
              <span className="font-bold">{input.institutionName || 'Recognized University'}</span>
            </div>
            <div>
              <span className="text-[#55657F] block text-[11px]">Course & Grace Term:</span>
              <span className="font-bold">
                {input.courseDurationYears}y Course + {input.gracePeriodYears}y Grace
              </span>
            </div>
          </div>

          {/* Core Decision Summary Box */}
          <div className="border-2 border-[#2547D0] bg-blue-50/40 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2547D0] uppercase tracking-wider">
                Executive Family Affordability Verdict
              </span>
              <span className={`px-2.5 py-0.5 rounded-sm text-xs font-black border ${getStatusBadge(results.affordabilityStatus)}`}>
                {results.affordabilityStatus}
              </span>
            </div>
            <p className="text-xs text-[#15233F] leading-relaxed">
              {results.familyDecisionSummary}
            </p>
          </div>

          {/* Primary Financial Snapshot Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="border border-slate-200 p-3 rounded-lg">
              <span className="text-[#55657F] block">Borrowed Principal:</span>
              <span className="text-base font-bold text-[#15233F] tabular-nums">
                {formatINR(input.loanAmount)}
              </span>
              <span className="text-[10px] text-slate-500 block">Rate: {input.interestRate}% p.a.</span>
            </div>

            <div className="border border-slate-200 p-3 rounded-lg">
              <span className="text-[#55657F] block">Monthly Amortizing EMI:</span>
              <span className="text-base font-bold text-[#2547D0] tabular-nums">
                {formatINR(results.monthlyEMI)}
              </span>
              <span className="text-[10px] text-slate-500 block">{input.tenureYears} Yrs ({input.tenureYears * 12} EMIs)</span>
            </div>

            <div className="border border-slate-200 p-3 rounded-lg">
              <span className="text-[#55657F] block">Total Repayment:</span>
              <span className="text-base font-bold text-[#15233F] tabular-nums">
                {formatINRLakhs(results.totalRepaidOverall)}
              </span>
              <span className="text-[10px] text-slate-500 block">Interest: {formatINRLakhs(results.totalInterestOverall)}</span>
            </div>

            <div className="border border-slate-200 p-3 rounded-lg">
              <span className="text-[#55657F] block">Safe Borrowing Range:</span>
              <span className="text-base font-bold text-emerald-700 tabular-nums">
                {formatINRLakhs(results.safeBorrowingMin)} – {formatINRLakhs(results.safeBorrowingMax)}
              </span>
              <span className="text-[10px] text-slate-500 block">For &lt;35% EMI-to-income</span>
            </div>
          </div>

          {/* Staggered Disbursements & Moratorium Treatment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 p-3.5 rounded-lg space-y-2">
              <div className="font-bold text-[#15233F] border-b border-slate-100 pb-1.5 flex justify-between">
                <span>Disbursement Tranches</span>
                <span className="text-slate-500 font-normal">Total: {formatINRLakhs(input.loanAmount)}</span>
              </div>
              <ul className="space-y-1 text-[11px]">
                {input.disbursements.map((d, i) => (
                  <li key={d.id} className="flex justify-between">
                    <span className="text-[#55657F]">
                      Year {Math.floor(d.monthOffset / 12) + 1} ({d.description}):
                    </span>
                    <span className="font-bold tabular-nums">{formatINR(d.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-slate-200 p-3.5 rounded-lg space-y-2">
              <div className="font-bold text-[#15233F] border-b border-slate-100 pb-1.5 flex justify-between">
                <span>Moratorium Strategy</span>
                <span className="font-bold text-[#2547D0]">
                  {input.moratoriumOption === 'service_full'
                    ? 'Simple Interest Serviced'
                    : input.moratoriumOption === 'service_partial'
                    ? 'Partial Payment'
                    : 'Accrued & Capitalized'}
                </span>
              </div>
              <div className="text-[11px] space-y-1 text-[#55657F]">
                <div className="flex justify-between">
                  <span>Pre-EMI Study Interest:</span>
                  <span className="font-bold text-[#15233F] tabular-nums">
                    {formatINR(results.accumulatedMoratoriumInterest || results.servicedMoratoriumInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Capitalized Principal at Repayment:</span>
                  <span className="font-bold text-[#15233F] tabular-nums">
                    {formatINR(results.capitalizedPrincipalAtRepayment)}
                  </span>
                </div>
                {results.savingsByServicingMoratorium > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Potential Moratorium Savings:</span>
                    <span className="tabular-nums">~{formatINRLakhs(results.savingsByServicingMoratorium)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Income Scenarios & Cashflow Stress Testing */}
          <div className="border border-slate-200 p-3.5 rounded-lg space-y-2 text-xs">
            <div className="font-bold text-[#15233F] border-b border-slate-100 pb-1.5 flex justify-between">
              <span>Salary Scenarios & Debt Burden</span>
              <span className="text-slate-500 font-normal">Monthly Living: {formatINR(input.estimatedLivingExpenses)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="bg-slate-50 p-2 rounded-md">
                <span className="text-[#55657F] block">Downside (₹45k)</span>
                <span className="font-bold text-[#15233F] block tabular-nums">{formatINR(input.downsideSalaryMonthly)}</span>
                <span className="text-amber-700 font-semibold tabular-nums">
                  {Math.round(results.downsideEmiToIncomeRatio * 100)}% EMI Share
                </span>
              </div>
              <div className="bg-blue-50/60 p-2 rounded-md border border-blue-200">
                <span className="text-[#2547D0] font-bold block">Base Target (₹60k)</span>
                <span className="font-bold text-[#15233F] block tabular-nums">{formatINR(input.expectedStartingSalary)}</span>
                <span className="text-[#2547D0] font-bold tabular-nums">
                  {Math.round(results.emiToIncomeRatio * 100)}% EMI Share
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-md">
                <span className="text-[#55657F] block">Upside (₹75k)</span>
                <span className="font-bold text-[#15233F] block tabular-nums">{formatINR(input.upsideSalaryMonthly)}</span>
                <span className="text-emerald-700 font-semibold tabular-nums">
                  {Math.round((results.monthlyEMI / (input.upsideSalaryMonthly || 1)) * 100)}% EMI Share
                </span>
              </div>
            </div>
          </div>

          {/* Crucial Risk Checks */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-[#15233F] block text-[11px] uppercase tracking-wider">
              Key Borrower Vulnerabilities & Guardrails
            </span>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#55657F]">
              <li>
                <strong>Job Delay Shock:</strong> A 6-month onboard delay requires{' '}
                <strong className="text-[#15233F]">{formatINR(results.monthlyEMI * 6)}</strong> in cash to avoid NPA default.
              </li>
              <li>
                <strong>Interest Rate Sensitivity:</strong> If floating repo rates rise by 1.0%, monthly EMI increases by{' '}
                <strong className="text-[#15233F]">~{formatINR(Math.round(results.monthlyEMI * 0.05))}</strong>.
              </li>
              {input.country === 'abroad' && (
                <li>
                  <strong>Currency Exposure:</strong> Overseas degree is vulnerable to INR depreciation (stress rate: ₹{input.abroad.stressExchangeRate}/{input.abroad.currency}).
                </li>
              )}
            </ul>
          </div>

          {/* Regulatory Disclaimer & Sign-off */}
          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 leading-tight space-y-1">
            <p>
              <strong>Disclaimer:</strong> This planning report provides financial estimates based on user-entered assumptions and does not constitute certified financial advice or guaranteed lender sanctions. Actual interest rates, compounding frequency, processing charges, and eligibility must be verified directly with regulated lending institutions.
            </p>
            <p className="flex justify-between items-center pt-2 text-[9px] text-slate-400">
              <span>Education Loan Repayment Planner</span>
              <span>Generated locally · No private credit data stored</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
