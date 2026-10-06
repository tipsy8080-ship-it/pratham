import React from 'react';
import { LoanInputState } from '../../types';
import { formatINR } from '../../utils/formatters';

interface Step1Props {
  input: LoanInputState;
  updateInput: (updates: Partial<LoanInputState>) => void;
}

export const Step1LoanDetails: React.FC<Step1Props> = ({ input, updateInput }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#15233F]">1. Core Loan Parameters</h3>
        <p className="text-sm text-[#55657F]">
          Specify your principal requirement, lender interest rate, and proposed repayment tenure.
        </p>
      </div>

      {/* Country Selection */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-[#15233F] uppercase tracking-wider">
          Study Destination
        </label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => updateInput({ country: 'india' })}
            className={`py-2.5 px-4 rounded-lg font-semibold text-xs border text-center transition-all ${
              input.country === 'india'
                ? 'bg-blue-50 border-[#2547D0] text-[#2547D0] shadow-xs'
                : 'bg-slate-50 border-slate-200 text-[#55657F] hover:bg-slate-100'
            }`}
          >
            Study in India (INR)
          </button>
          <button
            type="button"
            onClick={() => updateInput({ country: 'abroad' })}
            className={`py-2.5 px-4 rounded-lg font-semibold text-xs border text-center transition-all ${
              input.country === 'abroad'
                ? 'bg-blue-50 border-[#2547D0] text-[#2547D0] shadow-xs'
                : 'bg-slate-50 border-slate-200 text-[#55657F] hover:bg-slate-100'
            }`}
          >
            Study Abroad (Multi-Currency & FX Risk)
          </button>
        </div>

        {/* Study Abroad FX Controls */}
        {input.country === 'abroad' && (
          <div className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#15233F]">Study Abroad Currency & FX Assumption</span>
              <span className="text-[11px] text-[#55657F]">Estimates INR currency exposure</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#55657F] mb-1">Target Currency</label>
                <select
                  value={input.abroad.currency}
                  onChange={(e) =>
                    updateInput({
                      abroad: {
                        ...input.abroad,
                        currency: e.target.value as any,
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs font-semibold text-[#15233F]"
                >
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="CAD">CAD ($ - Canadian Dollar)</option>
                  <option value="AUD">AUD ($ - Australian Dollar)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#55657F] mb-1">Current Exchange Rate (₹/FX)</label>
                <input
                  type="number"
                  step="0.5"
                  value={input.abroad.exchangeRate}
                  onChange={(e) =>
                    updateInput({
                      abroad: {
                        ...input.abroad,
                        exchangeRate: parseFloat(e.target.value) || 86,
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs font-bold text-[#15233F] tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[#55657F] mb-1">Stress FX Rate (Weak INR)</label>
                <input
                  type="number"
                  step="0.5"
                  value={input.abroad.stressExchangeRate}
                  onChange={(e) =>
                    updateInput({
                      abroad: {
                        ...input.abroad,
                        stressExchangeRate: parseFloat(e.target.value) || 92,
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs font-bold text-amber-700 tabular-nums"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loan Amount */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-[#15233F] uppercase tracking-wider block">
              Loan Amount Required
            </label>
            <span className="text-xs text-[#55657F]">Total principal to be borrowed from lender</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#2547D0] tabular-nums">
              {formatINR(input.loanAmount)}
            </span>
          </div>
        </div>

        <input
          type="range"
          min="100000"
          max="10000000"
          step="50000"
          value={input.loanAmount}
          onChange={(e) => updateInput({ loanAmount: Number(e.target.value) })}
          className="w-full accent-[#2547D0] cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-[#55657F]">
          <span>Min: ₹1,00,000 (₹1L)</span>
          <div className="flex gap-1.5">
            {[750000, 1500000, 2500000, 4000000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateInput({ loanAmount: preset })}
                className="px-2 py-0.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-[#15233F] font-medium transition-colors text-[10px]"
              >
                ₹{(preset / 100000).toFixed(preset % 100000 === 0 ? 0 : 1)}L
              </button>
            ))}
          </div>
          <span>Max: ₹1,00,00,000 (₹1 Cr)</span>
        </div>
      </div>

      {/* Interest Rate & Repayment Tenure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Interest Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-[#15233F] uppercase tracking-wider block">
                Interest Rate (Annual)
              </label>
              <span className="text-xs text-[#55657F]">Lender floating / fixed rate per annum</span>
            </div>
            <span className="text-lg font-bold text-[#2547D0] tabular-nums">
              {input.interestRate.toFixed(1)}% p.a.
            </span>
          </div>

          <input
            type="range"
            min="6.0"
            max="18.0"
            step="0.25"
            value={input.interestRate}
            onChange={(e) => updateInput({ interestRate: parseFloat(e.target.value) })}
            className="w-full accent-[#2547D0] cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-[#55657F]">
            <span>6.0% (Public Sector)</span>
            <span>10.0% (Standard)</span>
            <span>18.0% (NBFC/Unsecured)</span>
          </div>
        </div>

        {/* Repayment Tenure */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-[#15233F] uppercase tracking-wider block">
                Repayment Tenure
              </label>
              <span className="text-xs text-[#55657F]">Active monthly repayment period</span>
            </div>
            <span className="text-lg font-bold text-[#2547D0] tabular-nums">
              {input.tenureYears} Years ({input.tenureYears * 12} EMIs)
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={input.tenureYears}
            onChange={(e) => updateInput({ tenureYears: parseInt(e.target.value, 10) })}
            className="w-full accent-[#2547D0] cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-[#55657F]">
            <span>1 Year</span>
            <span>7 Years</span>
            <span>10 Years (Typical)</span>
            <span>20 Years</span>
          </div>
        </div>
      </div>

      {/* Course Duration & Grace Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-[#15233F] uppercase tracking-wider block">
                Course Duration
              </label>
              <span className="text-xs text-[#55657F]">Time in college prior to graduation</span>
            </div>
            <span className="text-base font-bold text-[#15233F] tabular-nums">
              {input.courseDurationYears} {input.courseDurationYears === 1 ? 'Year' : 'Years'}
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={input.courseDurationYears}
            onChange={(e) => updateInput({ courseDurationYears: parseFloat(e.target.value) })}
            className="w-full accent-[#2547D0] cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-[#55657F]">
            <span>6 Months</span>
            <span>2 Years (PG/MBA)</span>
            <span>4 Years (BTech)</span>
            <span>5 Years (MBBS/Law)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-[#15233F] uppercase tracking-wider block">
                Post-Study Grace / Moratorium
              </label>
              <span className="text-xs text-[#55657F]">Buffer period post-graduation to land a job</span>
            </div>
            <span className="text-base font-bold text-[#15233F] tabular-nums">
              {input.gracePeriodYears} {input.gracePeriodYears === 1 ? 'Year' : 'Years'} (
              {input.gracePeriodYears * 12} mo)
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="3"
            step="0.5"
            value={input.gracePeriodYears}
            onChange={(e) => updateInput({ gracePeriodYears: parseFloat(e.target.value) })}
            className="w-full accent-[#2547D0] cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-[#55657F]">
            <span>0 Months</span>
            <span>6 Months</span>
            <span>1 Year (Standard RBI)</span>
            <span>3 Years</span>
          </div>
        </div>
      </div>
    </div>
  );
};
