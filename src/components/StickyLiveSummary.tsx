import React from 'react';
import { formatINR, formatINRLakhs } from '../utils/formatters';
import { CalculationResults, LoanInputState } from '../types';

interface StickyLiveSummaryProps {
  input: LoanInputState;
  results: CalculationResults;
  onViewFullResults: () => void;
  onRunStressTest: () => void;
}

export const StickyLiveSummary: React.FC<StickyLiveSummaryProps> = ({
  input,
  results,
  onViewFullResults,
  onRunStressTest,
}) => {
  const statusColor =
    results.affordabilityStatus === 'COMFORTABLE'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
      : results.affordabilityStatus === 'BORDERLINE'
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : results.affordabilityStatus === 'STRETCHED'
      ? 'bg-orange-50 text-orange-800 border-orange-300'
      : 'bg-rose-50 text-rose-800 border-rose-300';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F]">
            Your Live Loan Snapshot
          </span>
          <div className="text-sm font-bold text-[#15233F]">
            {input.studentName || 'Education Loan Plan'}
          </div>
        </div>
        <div
          className={`px-2.5 py-1 rounded-md text-xs font-bold border ${statusColor}`}
          title="Overall Affordability Assessment"
        >
          {results.affordabilityStatus}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <div>
          <div className="text-[#55657F]">Borrowed Principal</div>
          <div className="text-sm font-bold text-[#15233F] tabular-nums">
            {formatINRLakhs(input.loanAmount)}
          </div>
        </div>

        <div>
          <div className="text-[#55657F]">Monthly EMI</div>
          <div className="text-sm font-bold text-[#2547D0] tabular-nums">
            {formatINR(results.monthlyEMI)}
            <span className="text-[11px] font-normal text-[#55657F]">/mo</span>
          </div>
        </div>

        <div>
          <div className="text-[#55657F]">Total Repayment</div>
          <div className="text-sm font-bold text-[#15233F] tabular-nums">
            {formatINRLakhs(results.totalRepaidOverall)}
          </div>
        </div>

        <div>
          <div className="text-[#55657F]">Monthly Buffer</div>
          <div
            className={`text-sm font-bold tabular-nums ${
              results.monthlyRemainingBuffer >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {formatINR(results.monthlyRemainingBuffer)}
            <span className="text-[11px] font-normal text-[#55657F]">/mo</span>
          </div>
        </div>
      </div>

      {/* Moratorium & Safe Range highlights */}
      <div className="bg-slate-50 rounded-lg p-2.5 text-[11px] space-y-1.5 border border-slate-200/60 mb-3">
        <div className="flex justify-between">
          <span className="text-[#55657F]">Study Interest Strategy:</span>
          <span className="font-semibold text-[#15233F]">
            {input.moratoriumOption === 'service_full'
              ? 'Paid Monthly'
              : input.moratoriumOption === 'service_partial'
              ? 'Partial Paid'
              : 'Capitalized into Loan'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#55657F]">Safe Borrowing Range:</span>
          <span className="font-semibold text-[#2547D0] tabular-nums">
            {formatINRLakhs(results.safeBorrowingMin)} – {formatINRLakhs(results.safeBorrowingMax)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRunStressTest}
          className="flex-1 py-1.5 text-xs font-semibold text-[#15233F] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 text-center"
        >
          Stress Test
        </button>
        <button
          onClick={onViewFullResults}
          className="flex-1 py-1.5 text-xs font-semibold text-white bg-[#2547D0] hover:bg-blue-700 rounded-lg transition-colors text-center shadow-xs"
        >
          View Dashboard
        </button>
      </div>
    </div>
  );
};
