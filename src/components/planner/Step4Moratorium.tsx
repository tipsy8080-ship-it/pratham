import React from 'react';
import { LoanInputState, CalculationResults } from '../../types';
import { formatINR, formatINRLakhs } from '../../utils/formatters';

interface Step4Props {
  input: LoanInputState;
  results: CalculationResults;
  updateInput: (updates: Partial<LoanInputState>) => void;
}

export const Step4Moratorium: React.FC<Step4Props> = ({ input, results, updateInput }) => {
  const totalMoratoriumMonths = Math.round((input.courseDurationYears + input.gracePeriodYears) * 12);

  // Compare Option 1 vs Option 2
  const accruedCapitalizedPrincipal = results.basePrincipal + results.accumulatedMoratoriumInterest;
  const savings = results.savingsByServicingMoratorium;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#15233F]">4. What Happens While You Are Studying?</h3>
        <p className="text-sm text-[#55657F]">
          EMI payments may be paused during a moratorium, but interest continues to accumulate. Deciding how to handle this study-period interest is one of the most powerful financial choices a family can make.
        </p>
      </div>

      {/* Explainer Callout */}
      <div className="bg-blue-50/60 rounded-xl border border-blue-200/80 p-5 text-xs text-[#15233F] space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2547D0]" />
          <h4 className="font-bold text-[#2547D0] uppercase tracking-wider text-[11px]">
            The Moratorium Interest Reality
          </h4>
        </div>
        <p className="leading-relaxed text-[#15233F]">
          During your {input.courseDurationYears}-year course plus {input.gracePeriodYears}-year grace period ({totalMoratoriumMonths} months total), the bank charges interest on every released disbursement. If your family does not service this interest monthly, it gets <strong>capitalized</strong> (added to your principal). When repayment begins, you pay interest on interest for the entire 10-year tenure!
        </p>
      </div>

      {/* Three Interactive Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Option 1 */}
        <div
          onClick={() => updateInput({ moratoriumOption: 'accrue' })}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            input.moratoriumOption === 'accrue'
              ? 'border-[#F2A900] bg-amber-50/30 ring-2 ring-amber-300 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Option 1 (Default)
            </span>
            <input
              type="radio"
              checked={input.moratoriumOption === 'accrue'}
              onChange={() => updateInput({ moratoriumOption: 'accrue' })}
              className="accent-[#F2A900]"
            />
          </div>
          <h4 className="font-bold text-sm text-[#15233F] mb-1">Do NOT Pay Study Interest</h4>
          <p className="text-xs text-[#55657F] mb-4">
            Zero payments while studying. All accumulated interest is capitalized into your principal at repayment.
          </p>
          <div className="pt-3 border-t border-slate-200/60 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#55657F]">Study Outflow:</span>
              <span className="font-bold text-emerald-700">₹0/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Starting Balance:</span>
              <span className="font-bold text-[#F2A900] tabular-nums">
                {formatINRLakhs(accruedCapitalizedPrincipal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Resulting EMI:</span>
              <span className="font-bold text-[#F2A900] tabular-nums">
                {formatINR(results.monthlyEMI)}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Option 2 */}
        <div
          onClick={() => updateInput({ moratoriumOption: 'service_full' })}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            input.moratoriumOption === 'service_full'
              ? 'border-[#2547D0] bg-blue-50/40 ring-2 ring-blue-300 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2547D0]">
              Option 2 (Smart Saver)
            </span>
            <input
              type="radio"
              checked={input.moratoriumOption === 'service_full'}
              onChange={() => updateInput({ moratoriumOption: 'service_full' })}
              className="accent-[#2547D0]"
            />
          </div>
          <h4 className="font-bold text-sm text-[#15233F] mb-1">Pay Simple Interest Monthly</h4>
          <p className="text-xs text-[#55657F] mb-4">
            Family services only the simple interest (~₹{Math.round((input.loanAmount * (input.interestRate / 100)) / 12).toLocaleString('en-IN')}/mo). Keeps principal low!
          </p>
          <div className="pt-3 border-t border-slate-200/60 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#55657F]">Study Outflow:</span>
              <span className="font-bold text-[#2547D0] tabular-nums">
                ~{formatINR(Math.round((input.loanAmount * (input.interestRate / 100)) / 12))}/mo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Starting Balance:</span>
              <span className="font-bold text-[#2547D0] tabular-nums">
                {formatINRLakhs(input.loanAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55657F]">Resulting EMI:</span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {formatINR(results.baseEMIWithoutMoratorium)}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Option 3 */}
        <div
          onClick={() => updateInput({ moratoriumOption: 'service_partial' })}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            input.moratoriumOption === 'service_partial'
              ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-300 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Option 3 (Custom Budget)
            </span>
            <input
              type="radio"
              checked={input.moratoriumOption === 'service_partial'}
              onChange={() => updateInput({ moratoriumOption: 'service_partial' })}
              className="accent-emerald-600"
            />
          </div>
          <h4 className="font-bold text-sm text-[#15233F] mb-1">Pay Custom Amount Monthly</h4>
          <p className="text-xs text-[#55657F] mb-2">
            Pay whatever the family budget permits. Unserviced portion accumulates.
          </p>

          <div className="mb-2">
            <label className="text-[11px] text-[#55657F] block mb-1">Custom Outflow (₹/mo):</label>
            <input
              type="number"
              step="1000"
              value={input.customMoratoriumPayment}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                updateInput({
                  moratoriumOption: 'service_partial',
                  customMoratoriumPayment: Math.max(0, parseInt(e.target.value, 10) || 0),
                })
              }
              className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs font-bold text-[#15233F] tabular-nums"
            />
          </div>
          <div className="text-[11px] text-[#55657F]">
            Starting balance: {formatINRLakhs(results.capitalizedPrincipalAtRepayment)}
          </div>
        </div>
      </div>

      {/* Visual Before / After Comparison */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#15233F] mb-4">
          Financial Impact Comparison (Study Interest Decision)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          {/* Column A: Without Paying */}
          <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900">Without Paying Study Interest</span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-1.5 py-0.5 rounded-xs">
                Accrued & Capitalized
              </span>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-amber-200/60">
              <div className="flex justify-between">
                <span className="text-[#55657F]">Outstanding balance at Year 3:</span>
                <span className="font-bold text-[#15233F] tabular-nums">
                  ~{formatINR(input.loanAmount + results.accumulatedMoratoriumInterest)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#55657F]">Monthly EMI for 10 years:</span>
                <span className="font-bold text-[#F2A900] tabular-nums">
                  {formatINR(results.monthlyEMI)}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#55657F]">Total loan repayment:</span>
                <span className="font-bold text-[#15233F] tabular-nums">
                  {formatINRLakhs(results.totalRepaidOverall)}
                </span>
              </div>
            </div>
          </div>

          {/* Column B: With Paying */}
          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2547D0]">With Regular Study Interest Serviced</span>
              <span className="text-[10px] bg-blue-200/80 text-[#2547D0] font-bold px-1.5 py-0.5 rounded-xs">
                Keeps Principal Fixed
              </span>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-blue-200/60">
              <div className="flex justify-between">
                <span className="text-[#55657F]">Outstanding balance at Year 3:</span>
                <span className="font-bold text-[#2547D0] tabular-nums">
                  {formatINR(input.loanAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#55657F]">Monthly EMI for 10 years:</span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  {formatINR(results.baseEMIWithoutMoratorium)}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#55657F]">Approximate Family Savings:</span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  Save ~{formatINRLakhs(savings)}!
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-[11px] text-[#55657F] leading-relaxed">
          <strong className="text-[#15233F]">Key Presentation Takeaway:</strong> In a ₹15L education loan at 10%, paying interest monthly during study keeps the EMI near <strong>₹19,800/mo</strong> rather than allowing it to expand to <strong>₹25,800/mo</strong>, saving the family roughly <strong>₹2.6 Lakh</strong> overall!
        </div>
      </div>
    </div>
  );
};
