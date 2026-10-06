import React, { useState } from 'react';
import { LoanInputState, CalculationResults } from '../types';
import { runLoanCalculations } from '../calculations/engine';
import { formatINR, formatINRLakhs } from '../utils/formatters';

interface WhatIfSimulatorProps {
  input: LoanInputState;
  results: CalculationResults;
  onApplyToRealPlan: (modified: LoanInputState) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  input,
  results,
  onApplyToRealPlan,
}) => {
  // Modified state strictly for the simulator
  const [simState, setSimState] = useState<LoanInputState>({ ...input });

  // Recalculate on the fly
  const simResults = runLoanCalculations(simState);

  const applyPreset = (type: string) => {
    switch (type) {
      case 'borrow_less':
        setSimState((prev) => ({
          ...prev,
          loanAmount: Math.max(100000, prev.loanAmount - 300000), // Borrow ₹3L less
        }));
        break;
      case 'service_interest':
        setSimState((prev) => ({
          ...prev,
          moratoriumOption: 'service_full',
        }));
        break;
      case 'shorten_tenure':
        setSimState((prev) => ({
          ...prev,
          tenureYears: Math.max(3, prev.tenureYears - 3),
        }));
        break;
      case 'extend_tenure':
        setSimState((prev) => ({
          ...prev,
          tenureYears: Math.min(20, prev.tenureYears + 5),
        }));
        break;
      case 'lower_rate':
        setSimState((prev) => ({
          ...prev,
          interestRate: Math.max(6, prev.interestRate - 1.0),
        }));
        break;
      case 'higher_salary':
        setSimState((prev) => ({
          ...prev,
          expectedStartingSalary: prev.expectedStartingSalary + 15000,
          downsideSalaryMonthly: prev.downsideSalaryMonthly + 10000,
        }));
        break;
      case 'reset':
        setSimState({ ...input });
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMFORTABLE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'BORDERLINE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'STRETCHED':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  const emiDelta = simResults.monthlyEMI - results.monthlyEMI;
  const repaymentDelta = simResults.totalRepaidOverall - results.totalRepaidOverall;
  const bufferDelta = simResults.monthlyRemainingBuffer - results.monthlyRemainingBuffer;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#15233F]">What If We Change One Thing?</h2>
          <p className="text-sm text-[#55657F]">
            Test small proactive adjustments today to see how they protect your family from future financial stress.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => applyPreset('reset')}
            className="px-3 py-1.5 text-xs font-semibold text-[#55657F] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs"
          >
            Reset Simulator
          </button>
          <button
            onClick={() => onApplyToRealPlan(simState)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2547D0] hover:bg-blue-700 rounded-lg shadow-xs"
          >
            Apply Changes to Plan
          </button>
        </div>
      </div>

      {/* 1-Click Interactive Presets */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#15233F] block mb-2.5">
          Quick Lever Presets
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyPreset('borrow_less')}
            className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#2547D0] font-semibold hover:bg-blue-100 transition-colors"
          >
            Borrow ₹3 Lakh Less
          </button>
          <button
            onClick={() => applyPreset('service_interest')}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors"
          >
            Pay Interest During Study
          </button>
          <button
            onClick={() => applyPreset('shorten_tenure')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[#15233F] font-semibold hover:bg-slate-200 transition-colors"
          >
            Shorten Tenure (-3 Yrs)
          </button>
          <button
            onClick={() => applyPreset('extend_tenure')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[#15233F] font-semibold hover:bg-slate-200 transition-colors"
          >
            Extend Tenure (+5 Yrs)
          </button>
          <button
            onClick={() => applyPreset('lower_rate')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[#15233F] font-semibold hover:bg-slate-200 transition-colors"
          >
            Negotiate 1.0% Lower Rate
          </button>
          <button
            onClick={() => applyPreset('higher_salary')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[#15233F] font-semibold hover:bg-slate-200 transition-colors"
          >
            Higher Starting Salary (+₹15k)
          </button>
        </div>
      </div>

      {/* Before vs After Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Baseline Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F]">
                Baseline Plan
              </span>
              <h3 className="text-base font-bold text-[#15233F]">Current Settings</h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded-sm text-xs font-bold border ${getStatusBadge(results.affordabilityStatus)}`}>
              {results.affordabilityStatus}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#55657F]">Principal Borrowed:</span>
              <span className="font-bold text-[#15233F] tabular-nums">{formatINRLakhs(input.loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Interest Rate:</span>
              <span className="font-bold text-[#15233F] tabular-nums">{input.interestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Repayment Tenure:</span>
              <span className="font-bold text-[#15233F] tabular-nums">{input.tenureYears} Years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Monthly EMI:</span>
              <span className="font-bold text-[#2547D0] tabular-nums">{formatINR(results.monthlyEMI)}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Total Repayment:</span>
              <span className="font-bold text-[#15233F] tabular-nums">{formatINRLakhs(results.totalRepaidOverall)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Monthly Buffer:</span>
              <span className="font-bold text-emerald-700 tabular-nums">{formatINR(results.monthlyRemainingBuffer)}/mo</span>
            </div>
          </div>
        </div>

        {/* Simulated Scenario Card */}
        <div className="bg-blue-50/40 rounded-xl border-2 border-[#2547D0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-blue-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2547D0]">
                What-If Outcome
              </span>
              <h3 className="text-base font-bold text-[#15233F]">Simulated Alternative</h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded-sm text-xs font-bold border ${getStatusBadge(simResults.affordabilityStatus)}`}>
              {simResults.affordabilityStatus}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#55657F]">Principal Borrowed:</span>
              <span className="font-bold text-[#15233F] tabular-nums">
                {formatINRLakhs(simState.loanAmount)}{' '}
                {simState.loanAmount !== input.loanAmount && (
                  <span className="text-[11px] font-semibold text-emerald-700">
                    ({simState.loanAmount < input.loanAmount ? '-' : '+'}{formatINRLakhs(Math.abs(simState.loanAmount - input.loanAmount))})
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Interest Rate:</span>
              <span className="font-bold text-[#15233F] tabular-nums">{simState.interestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Repayment Tenure:</span>
              <span className="font-bold text-[#15233F] tabular-nums">{simState.tenureYears} Years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Monthly EMI:</span>
              <span className="font-bold text-[#2547D0] tabular-nums">
                {formatINR(simResults.monthlyEMI)}/mo{' '}
                {emiDelta !== 0 && (
                  <span className={`text-[11px] font-semibold ${emiDelta < 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ({emiDelta < 0 ? '-' : '+'}{formatINR(Math.abs(emiDelta))})
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Total Repayment:</span>
              <span className="font-bold text-[#15233F] tabular-nums">
                {formatINRLakhs(simResults.totalRepaidOverall)}{' '}
                {repaymentDelta !== 0 && (
                  <span className={`text-[11px] font-semibold ${repaymentDelta < 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ({repaymentDelta < 0 ? 'Save ' : '+'}{formatINRLakhs(Math.abs(repaymentDelta))})
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Monthly Buffer:</span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {formatINR(simResults.monthlyRemainingBuffer)}/mo{' '}
                {bufferDelta !== 0 && (
                  <span className={`text-[11px] font-semibold ${bufferDelta > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ({bufferDelta > 0 ? '+' : '-'}{formatINR(Math.abs(bufferDelta))})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fine-Tuning Sliders */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#15233F]">
          Manual Slider Adjustments
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#55657F]">Loan Amount:</span>
              <span className="font-bold text-[#15233F] tabular-nums">{formatINR(simState.loanAmount)}</span>
            </div>
            <input
              type="range"
              min="200000"
              max="5000000"
              step="50000"
              value={simState.loanAmount}
              onChange={(e) => setSimState({ ...simState, loanAmount: Number(e.target.value) })}
              className="w-full accent-[#2547D0]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#55657F]">Tenure:</span>
              <span className="font-bold text-[#15233F] tabular-nums">{simState.tenureYears} Years</span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              step="1"
              value={simState.tenureYears}
              onChange={(e) => setSimState({ ...simState, tenureYears: parseInt(e.target.value, 10) })}
              className="w-full accent-[#2547D0]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#55657F]">Expected Salary:</span>
              <span className="font-bold text-[#15233F] tabular-nums">{formatINR(simState.expectedStartingSalary)}/mo</span>
            </div>
            <input
              type="range"
              min="25000"
              max="200000"
              step="5000"
              value={simState.expectedStartingSalary}
              onChange={(e) => setSimState({ ...simState, expectedStartingSalary: Number(e.target.value) })}
              className="w-full accent-[#2547D0]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
