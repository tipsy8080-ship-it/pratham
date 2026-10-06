import React, { useState } from 'react';
import { LoanInputState, CalculationResults } from '../types';
import { runStressTests } from '../calculations/engine';
import { formatINR } from '../utils/formatters';

interface StressTestingViewProps {
  input: LoanInputState;
  results: CalculationResults;
  onModifyPlan: () => void;
}

export const StressTestingView: React.FC<StressTestingViewProps> = ({
  input,
  results,
  onModifyPlan,
}) => {
  const stressTests = runStressTests(input, results);
  const [selectedTestId, setSelectedTestId] = useState<string>(stressTests[0]?.id || 'delay-6');

  const selectedTest = stressTests.find((t) => t.id === selectedTestId) || stressTests[0];

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#15233F]">Stress Test Your Education Loan</h2>
          <p className="text-sm text-[#55657F]">
            Simulate real-life financial shocks before signing legal loan documents.
          </p>
        </div>
        <button
          onClick={onModifyPlan}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-[#15233F] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
        >
          Adjust Loan Assumptions
        </button>
      </div>

      {/* Hero Active Stress Test Detailed Comparison */}
      {selectedTest && (
        <div className="bg-white rounded-xl border-2 border-[#2547D0] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-[#2547D0] uppercase tracking-wider block">
                Active Stress Scenario
              </span>
              <h3 className="text-lg font-bold text-[#15233F]">{selectedTest.title}</h3>
              <p className="text-xs text-[#55657F] mt-0.5">{selectedTest.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#55657F]">Affordability Shift:</span>
              <span className={`px-2 py-0.5 rounded-sm text-xs font-bold border ${getStatusBadge(selectedTest.baseStatus)}`}>
                {selectedTest.baseStatus}
              </span>
              <span className="text-[#55657F]">→</span>
              <span className={`px-2 py-0.5 rounded-sm text-xs font-bold border ${getStatusBadge(selectedTest.stressedStatus)}`}>
                {selectedTest.stressedStatus}
              </span>
            </div>
          </div>

          {/* Before vs After Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Base Case */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#55657F] uppercase tracking-wider">
                  Base Plan (Normal Case)
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs border ${getStatusBadge(selectedTest.baseStatus)}`}>
                  {selectedTest.baseStatus}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#55657F]">Monthly EMI:</span>
                  <span className="font-bold text-[#15233F] tabular-nums">
                    {formatINR(selectedTest.baseEMI)}/mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#55657F]">Remaining Monthly Buffer:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {formatINR(selectedTest.baseBuffer)}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Stressed Case */}
            <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-300 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Stressed Scenario Outcome
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs border ${getStatusBadge(selectedTest.stressedStatus)}`}>
                  {selectedTest.stressedStatus}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-amber-950 font-medium">Stressed Monthly EMI:</span>
                  <span className="font-bold text-amber-900 tabular-nums">
                    {formatINR(selectedTest.stressedEMI)}/mo{' '}
                    {selectedTest.stressedEMI !== selectedTest.baseEMI && (
                      <span className="text-[11px] font-semibold text-rose-600">
                        (+{formatINR(selectedTest.stressedEMI - selectedTest.baseEMI)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-950 font-medium">Stressed Monthly Buffer:</span>
                  <span
                    className={`font-bold tabular-nums ${
                      selectedTest.stressedBuffer >= 0 ? 'text-amber-800' : 'text-rose-700'
                    }`}
                  >
                    {formatINR(selectedTest.stressedBuffer)}/mo{' '}
                    {selectedTest.stressedBuffer !== selectedTest.baseBuffer && (
                      <span className="text-[11px] font-semibold text-rose-600">
                        ({formatINR(selectedTest.stressedBuffer - selectedTest.baseBuffer)})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-[#15233F]">
            <strong className="text-[#2547D0] font-bold">Key Financial Observation:</strong>{' '}
            {selectedTest.keyObservation}
          </div>
        </div>
      )}

      {/* Grid of all 9 Stress Scenarios */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#15233F] mb-3">
          Select From 9 Realistic Stress Scenarios
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stressTests.map((t) => {
            const isSelected = t.id === selectedTestId;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTestId(t.id)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#2547D0] bg-blue-50/50 shadow-xs ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[#15233F] truncate">{t.title}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs border shrink-0 ${getStatusBadge(
                      t.stressedStatus
                    )}`}
                  >
                    {t.stressedStatus}
                  </span>
                </div>
                <p className="text-[11px] text-[#55657F] line-clamp-2 mb-3">{t.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-[#55657F]">Buffer Impact:</span>
                  <span
                    className={`font-bold tabular-nums ${
                      t.stressedBuffer >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {formatINR(t.stressedBuffer)}/mo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
