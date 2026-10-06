import React from 'react';
import { LoanInputState, CalculationResults } from '../../types';
import { formatINR } from '../../utils/formatters';

interface Step6Props {
  input: LoanInputState;
  results: CalculationResults;
  updateInput: (updates: Partial<LoanInputState>) => void;
}

export const Step6IncomeScenarios: React.FC<Step6Props> = ({ input, results, updateInput }) => {
  const delays = [0, 3, 6, 12];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#15233F]">6. Future Income Scenarios & Job Uncertainty</h3>
        <p className="text-sm text-[#55657F]">
          Loans are repaid from future cash flow, not college dreams. Plan for baseline campus expectations, downside packages, and job onboarding delays.
        </p>
      </div>

      {/* Main Income Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#15233F] uppercase tracking-wider">
                Expected Starting Salary (Monthly)
              </label>
              <span className="text-base font-bold text-[#2547D0] tabular-nums">
                {formatINR(input.expectedStartingSalary)}/mo
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="250000"
              step="5000"
              value={input.expectedStartingSalary}
              onChange={(e) => {
                const base = Number(e.target.value);
                updateInput({
                  expectedStartingSalary: base,
                  downsideSalaryMonthly: Math.round(base * 0.75),
                  upsideSalaryMonthly: Math.round(base * 1.25),
                });
              }}
              className="w-full accent-[#2547D0] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#55657F] mt-1">
              <span>₹20,000/mo</span>
              <span>₹60,000 (Base)</span>
              <span>₹1,20,000</span>
              <span>₹2,50,000/mo</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#15233F] uppercase tracking-wider">
                Estimated Monthly Living Expenses
              </label>
              <span className="text-base font-bold text-[#15233F] tabular-nums">
                {formatINR(input.estimatedLivingExpenses)}/mo
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="150000"
              step="2500"
              value={input.estimatedLivingExpenses}
              onChange={(e) => updateInput({ estimatedLivingExpenses: Number(e.target.value) })}
              className="w-full accent-slate-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#55657F] mt-1">
              <span>₹10k (Tier 2/3)</span>
              <span>₹30k (Standard Metro)</span>
              <span>₹60k+ (Bangalore/Mumbai/Abroad)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Downside, Base, Upside Editable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Downside */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
              Downside Case (-25%)
            </span>
          </div>
          <p className="text-[11px] text-[#55657F] mb-3">
            Off-campus search or tech hiring slow-down package.
          </p>
          <div className="space-y-2 text-xs">
            <label className="block text-[#55657F]">Monthly In-Hand (₹):</label>
            <input
              type="number"
              step="5000"
              value={input.downsideSalaryMonthly}
              onChange={(e) => updateInput({ downsideSalaryMonthly: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 font-bold text-[#15233F] tabular-nums"
            />
            <div className="pt-2 text-[11px] text-[#55657F] flex justify-between">
              <span>EMI Share:</span>
              <span className="font-bold tabular-nums text-amber-700">
                {Math.round(results.downsideEmiToIncomeRatio * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Base */}
        <div className="bg-blue-50/50 rounded-xl border-2 border-[#2547D0] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#2547D0] bg-white px-2 py-0.5 rounded-sm border border-blue-200">
              Base Case (Target)
            </span>
          </div>
          <p className="text-[11px] text-[#55657F] mb-3">
            Expected median campus placement offer.
          </p>
          <div className="space-y-2 text-xs">
            <label className="block text-[#55657F]">Monthly In-Hand (₹):</label>
            <input
              type="number"
              step="5000"
              value={input.expectedStartingSalary}
              onChange={(e) => updateInput({ expectedStartingSalary: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className="w-full bg-white border border-blue-300 rounded-md p-2 font-bold text-[#2547D0] tabular-nums"
            />
            <div className="pt-2 text-[11px] text-[#55657F] flex justify-between">
              <span>EMI Share:</span>
              <span className="font-bold tabular-nums text-[#2547D0]">
                {Math.round(results.emiToIncomeRatio * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Upside */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
              Upside Case (+25%)
            </span>
          </div>
          <p className="text-[11px] text-[#55657F] mb-3">
            Day-0 dream company offer or international placement.
          </p>
          <div className="space-y-2 text-xs">
            <label className="block text-[#55657F]">Monthly In-Hand (₹):</label>
            <input
              type="number"
              step="5000"
              value={input.upsideSalaryMonthly}
              onChange={(e) => updateInput({ upsideSalaryMonthly: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 font-bold text-[#15233F] tabular-nums"
            />
            <div className="pt-2 text-[11px] text-[#55657F] flex justify-between">
              <span>EMI Share:</span>
              <span className="font-bold tabular-nums text-emerald-700">
                {Math.round((results.monthlyEMI / (input.upsideSalaryMonthly || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Start Delay Risk Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#15233F]">
            Job Joining Delay Risk Assessment
          </h4>
          <p className="text-xs text-[#55657F]">
            What if company onboarding is postponed after your moratorium concludes?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {delays.map((months) => (
            <button
              key={months}
              type="button"
              onClick={() => updateInput({ jobStartDelayMonths: months })}
              className={`p-3 rounded-lg border text-xs text-left transition-all ${
                input.jobStartDelayMonths === months
                  ? 'border-[#2547D0] bg-blue-50/50 ring-2 ring-blue-300 font-bold'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 font-medium'
              }`}
            >
              <div className="text-sm font-bold text-[#15233F] mb-0.5">
                {months === 0 ? 'On Time (0 mos)' : `${months} Months Late`}
              </div>
              <div className="text-[11px] text-[#55657F]">
                {months === 0
                  ? 'Immediate paycheck'
                  : `Requires ${formatINR(results.monthlyEMI * months)} family cash`}
              </div>
            </button>
          ))}
        </div>

        {input.jobStartDelayMonths > 0 && (
          <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>⏱️ Joining Delayed by {input.jobStartDelayMonths} Months</span>
            </div>
            <p className="leading-relaxed">
              During these {input.jobStartDelayMonths} months without an income, your family must pay{' '}
              <strong className="font-bold">{formatINR(results.jobDelayDeficit)}</strong> in EMIs directly from savings. Your entered family emergency buffer of{' '}
              <strong className="font-bold">{formatINR(input.existingFamilyBuffer)}</strong> can cover{' '}
              <strong className="font-bold">{results.monthsOfBufferCovered} months</strong> of EMIs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
