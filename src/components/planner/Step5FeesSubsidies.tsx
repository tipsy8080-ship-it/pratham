import React from 'react';
import { LoanInputState, CalculationResults } from '../../types';
import { formatINR } from '../../utils/formatters';

interface Step5Props {
  input: LoanInputState;
  results: CalculationResults;
  updateInput: (updates: Partial<LoanInputState>) => void;
}

export const Step5FeesSubsidies: React.FC<Step5Props> = ({ input, results, updateInput }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#15233F]">5. Lender Fees & Government Subsidies</h3>
        <p className="text-sm text-[#55657F]">
          Account for mandatory loan processing fees, mandatory student loan insurance, and eligible interest subsidy schemes (e.g. CSIS / Padho Pardesh).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fees Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#15233F]">
              Upfront Lender Fees
            </h4>
            <span className="text-xs font-bold text-[#15233F] tabular-nums">
              Total Fees: {formatINR(results.upfrontFeesTotal)}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[#55657F]">Processing Fee Percentage (%)</label>
                <span className="font-bold text-[#15233F] tabular-nums">
                  {input.processingFeePercent}% ({formatINR(input.loanAmount * (input.processingFeePercent / 100))})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.25"
                value={input.processingFeePercent}
                onChange={(e) => updateInput({ processingFeePercent: parseFloat(e.target.value) })}
                className="w-full accent-[#2547D0]"
              />
            </div>

            <div>
              <label className="block text-[#55657F] mb-1">Flat Administrative / Legal Fee (₹)</label>
              <input
                type="number"
                step="1000"
                value={input.processingFeeFlat}
                onChange={(e) => updateInput({ processingFeeFlat: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 font-semibold text-[#15233F] tabular-nums"
              />
            </div>

            <div>
              <label className="block text-[#55657F] mb-1">Student Loan Life Insurance Premium (₹)</label>
              <input
                type="number"
                step="2000"
                value={input.insuranceFee}
                onChange={(e) => updateInput({ insuranceFee: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 font-semibold text-[#15233F] tabular-nums"
              />
              <p className="text-[11px] text-[#55657F] mt-1">
                Most Indian public & private lenders require mandatory term insurance on loans &gt;₹7.5L to protect co-applicants.
              </p>
            </div>

            <div>
              <label className="block text-[#55657F] mb-1">Documentation, Stamp Duty & Valuation Fees (₹)</label>
              <input
                type="number"
                step="1000"
                value={input.otherFees}
                onChange={(e) => updateInput({ otherFees: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 font-semibold text-[#15233F] tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Subsidies Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#15233F]">
              Government Interest Subsidy Support
            </h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={input.hasSubsidy}
                onChange={(e) => updateInput({ hasSubsidy: e.target.checked })}
                className="accent-[#2547D0] w-4 h-4"
              />
              <span className="text-xs font-semibold text-[#15233F]">Apply Subsidy</span>
            </label>
          </div>

          {input.hasSubsidy ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#55657F] mb-1">
                  Interest Subvention / Waiver Percentage (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={input.subsidyPercent}
                    onChange={(e) => updateInput({ subsidyPercent: parseFloat(e.target.value) || 0 })}
                    className="w-28 bg-slate-50 border border-slate-200 rounded-md p-2 font-bold text-[#2547D0] tabular-nums"
                  />
                  <span className="text-[11px] text-[#55657F]">
                    e.g. Full interest waiver during moratorium (CSIS for family income &lt; ₹4.5L)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#55657F] mb-1">Subsidy Applicable Period (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={input.subsidyPeriodYears}
                  onChange={(e) => updateInput({ subsidyPeriodYears: parseInt(e.target.value, 10) || 1 })}
                  className="w-28 bg-slate-50 border border-slate-200 rounded-md p-2 font-bold text-[#15233F] tabular-nums"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-950">
                <span className="font-bold">Calculated Subsidy Relief:</span> Estimated total government benefit of{' '}
                <strong className="font-bold">{formatINR(results.subsidyTotalBenefit)}</strong> during the moratorium period.
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-[#55657F] space-y-2">
              <p>
                No interest subsidy currently applied. Eligible schemes in India include:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li><strong>CSIS Scheme:</strong> Full interest subsidy during course + 1 year for economically weaker sections (EWS family income up to ₹4.5L/year).</li>
                <li><strong>Girl Child Concession:</strong> 0.50% interest concession across major PSU lenders (SBI, PNB, BoB).</li>
                <li><strong>Dr. Ambedkar Central Sector Scheme:</strong> Interest subsidy for OBC/EBC students studying abroad.</li>
              </ul>
            </div>
          )}

          {/* Mandatory Guardrail Disclaimer */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-[#55657F] italic leading-relaxed">
            * <strong>Important:</strong> Eligibility and scheme rules should be verified directly with the relevant official government portal (e.g. Vidya Lakshmi, MoE) or your originating lender. The planner does not guarantee subsidy sanction.
          </div>
        </div>
      </div>
    </div>
  );
};
