import React from 'react';
import { LoanInputState, CalculationResults } from '../../types';
import { formatINR, formatINRLakhs } from '../../utils/formatters';
import { MonthlyCashflowWaterfall } from '../charts/FinancialCharts';

interface Step7Props {
  input: LoanInputState;
  results: CalculationResults;
  updateInput: (updates: Partial<LoanInputState>) => void;
  onGoToResults: () => void;
}

export const Step7Affordability: React.FC<Step7Props> = ({
  input,
  results,
  updateInput,
  onGoToResults,
}) => {
  const getBadgeStyle = (status: string) => {
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#15233F]">7. Affordability Engine & Safe Borrowing Range</h3>
        <p className="text-sm text-[#55657F]">
          An EMI tells you what you owe; our affordability engine evaluates whether your family can realistically carry this debt without financial distress.
        </p>
      </div>

      {/* Main Affordability Hero Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-[#55657F] uppercase tracking-wider block">
              Family Affordability Verdict
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span
                className={`text-sm font-extrabold px-3 py-1 rounded-md border tracking-wide uppercase ${getBadgeStyle(
                  results.affordabilityStatus
                )}`}
              >
                {results.affordabilityStatus}
              </span>
              <span className="text-xs text-[#55657F]">
                EMI consumes <strong>{Math.round(results.emiToIncomeRatio * 100)}%</strong> of gross monthly salary
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-[#55657F] block">Remaining Monthly Buffer</span>
            <span
              className={`text-xl font-bold tabular-nums ${
                results.monthlyRemainingBuffer >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {formatINR(results.monthlyRemainingBuffer)}/mo
            </span>
          </div>
        </div>

        {/* Breakdown Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-[#55657F] block mb-0.5">Monthly Income</span>
            <span className="text-sm font-bold text-[#15233F] tabular-nums">
              {formatINR(input.expectedStartingSalary)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-[#55657F] block mb-0.5">Living Expenses</span>
            <span className="text-sm font-bold text-slate-700 tabular-nums">
              -{formatINR(input.estimatedLivingExpenses)}
            </span>
          </div>

          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <span className="text-[#2547D0] block mb-0.5 font-medium">Monthly Loan EMI</span>
            <span className="text-sm font-bold text-[#2547D0] tabular-nums">
              -{formatINR(results.monthlyEMI)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-[#55657F] block mb-0.5">Emergency Cushion</span>
            <span
              className={`text-sm font-bold tabular-nums ${
                results.monthlyRemainingBuffer >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              ={formatINR(results.monthlyRemainingBuffer)}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#55657F] leading-relaxed pt-1">
          After estimated essential living expenses of {formatINR(input.estimatedLivingExpenses)} and monthly loan EMI of{' '}
          {formatINR(results.monthlyEMI)}, your remaining monthly buffer is{' '}
          <strong className="text-[#15233F]">{formatINR(results.monthlyRemainingBuffer)}</strong>.
        </p>
      </div>

      {/* Cashflow Waterfall Chart */}
      <MonthlyCashflowWaterfall input={input} results={results} />

      {/* Safe Borrowing Range Section */}
      <div className="bg-gradient-to-r from-blue-900 to-[#15233F] text-white rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
              Calculated Recommendation
            </span>
            <h4 className="text-lg font-bold text-white">Estimated Safe Borrowing Range</h4>
          </div>

          <div className="text-left sm:text-right bg-white/10 px-4 py-2 rounded-lg border border-white/15">
            <span className="text-[11px] text-slate-300 block">Recommended Principal Range</span>
            <span className="text-xl font-extrabold text-amber-400 tabular-nums">
              {formatINRLakhs(results.safeBorrowingMin)} – {formatINRLakhs(results.safeBorrowingMax)}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          Based on your starting salary of {formatINR(input.expectedStartingSalary)}/mo and essential living needs, our algorithm targets an EMI at or below 35% of monthly cash flow (~{formatINR(results.recommendedMaxEMI)}/mo max). Your currently requested loan is{' '}
          <strong className="text-white">{formatINRLakhs(input.loanAmount)}</strong>.
        </p>

        {input.loanAmount > results.safeBorrowingMax && (
          <div className="p-3 bg-amber-400/20 border border-amber-400/40 rounded-lg text-xs text-amber-200">
            <strong>Warning:</strong> Your requested loan amount exceeds the top of your safe borrowing range by{' '}
            {formatINR(input.loanAmount - results.safeBorrowingMax)}. Consider increasing your family margin contribution or applying for merit scholarships to bridge the difference.
          </div>
        )}

        <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 italic">
          * <strong>Disclaimer:</strong> This is an estimated borrowing range based on the mathematical assumptions you entered. It is not an approved loan limit or financial advice.
        </div>
      </div>

      {/* Family Liquid Reserves Buffer */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <label className="text-xs font-bold text-[#15233F] uppercase tracking-wider block">
              Family Emergency Buffer / Liquid Reserves (₹)
            </label>
            <span className="text-xs text-[#55657F]">
              Savings available to service EMIs if job joining is delayed
            </span>
          </div>
          <span className="text-base font-bold text-[#15233F] tabular-nums">
            {formatINR(input.existingFamilyBuffer)}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1000000"
          step="25000"
          value={input.existingFamilyBuffer}
          onChange={(e) => updateInput({ existingFamilyBuffer: Number(e.target.value) })}
          className="w-full accent-[#2547D0] cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-[#55657F]">
          <span>₹0 (No Buffer)</span>
          <span>
            Covers <strong>{results.monthsOfBufferCovered} months</strong> of loan EMIs
          </span>
          <span>₹10,00,000 (₹10L)</span>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onGoToResults}
          className="px-6 py-3 bg-[#2547D0] hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors shadow-sm flex items-center gap-2"
        >
          <span>View Complete Results Dashboard</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
