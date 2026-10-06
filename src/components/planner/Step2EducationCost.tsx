import React from 'react';
import { LoanInputState } from '../../types';
import { formatINR, formatINRLakhs } from '../../utils/formatters';

interface Step2Props {
  input: LoanInputState;
  updateInput: (updates: Partial<LoanInputState>) => void;
}

export const Step2EducationCost: React.FC<Step2Props> = ({ input, updateInput }) => {
  const costs = input.educationCosts;

  const updateCostItem = (key: keyof typeof costs, value: number) => {
    updateInput({
      educationCosts: {
        ...costs,
        [key]: Math.max(0, value),
      },
    });
  };

  const totalEducationCost =
    costs.tuition +
    costs.hostel +
    costs.living +
    costs.books +
    costs.travel +
    costs.insurance +
    costs.applicationFees +
    costs.other;

  const totalSelfFunding = costs.scholarship + costs.familyContribution + costs.existingSavings;
  const netFundingRequirement = Math.max(0, totalEducationCost - totalSelfFunding);
  const isBorrowingExcess = input.loanAmount > netFundingRequirement * 1.15 && netFundingRequirement > 0;
  const excessAmount = Math.max(0, input.loanAmount - netFundingRequirement);

  const costFields = [
    { key: 'tuition', label: 'College Tuition Fees', value: costs.tuition },
    { key: 'hostel', label: 'Hostel / Campus Accommodation', value: costs.hostel },
    { key: 'living', label: 'Food & Monthly Living Expenses', value: costs.living },
    { key: 'books', label: 'Books, Supplies & Laptop', value: costs.books },
    { key: 'travel', label: 'Travel & Relocation Expenses', value: costs.travel },
    { key: 'insurance', label: 'Student Health & Travel Insurance', value: costs.insurance },
    { key: 'applicationFees', label: 'Admission & Exam Processing Fees', value: costs.applicationFees },
    { key: 'other', label: 'Contingency / Other Academic Costs', value: costs.other },
  ];

  const fundingFields = [
    { key: 'scholarship', label: 'Scholarship / Fee Waiver', value: costs.scholarship },
    { key: 'familyContribution', label: 'Family Self-Financing Support', value: costs.familyContribution },
    { key: 'existingSavings', label: 'Student Savings / Fixed Deposits', value: costs.existingSavings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#15233F]">2. True Education Cost & Funding Gap</h3>
        <p className="text-sm text-[#55657F]">
          Itemize your total academic costs to determine your actual borrowing need. Avoid over-borrowing.
        </p>
      </div>

      {/* Comparison Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pb-4 border-b border-slate-100">
          <div>
            <span className="text-[#55657F] block">Total Education Cost</span>
            <span className="text-lg font-bold text-[#15233F] tabular-nums">
              {formatINR(totalEducationCost)}
            </span>
          </div>

          <div>
            <span className="text-[#55657F] block">Self-Funded (Savings/Family)</span>
            <span className="text-lg font-bold text-emerald-700 tabular-nums">
              -{formatINR(totalSelfFunding)}
            </span>
          </div>

          <div>
            <span className="text-[#55657F] block">Estimated Funding Requirement</span>
            <span className="text-lg font-bold text-[#2547D0] tabular-nums">
              {formatINR(netFundingRequirement)}
            </span>
          </div>
        </div>

        {/* Warning if borrowing significantly more */}
        {isBorrowingExcess && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <span className="font-bold text-amber-800 text-sm">⚠️</span>
            <div>
              <span className="font-bold">You may be borrowing more than your estimated funding requirement:</span>{' '}
              Your current loan request is {formatINRLakhs(input.loanAmount)}, which is{' '}
              <strong className="font-bold">{formatINR(excessAmount)}</strong> higher than your net need of{' '}
              {formatINR(netFundingRequirement)}. Borrowing only what you strictly need saves significant interest.
              <button
                type="button"
                onClick={() => updateInput({ loanAmount: netFundingRequirement })}
                className="ml-2 font-bold underline hover:text-amber-950 inline-block"
              >
                Set loan amount to ₹{Math.round(netFundingRequirement / 10000) * 10}k
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses List */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#15233F]">
              Academic & Living Expenses
            </h4>
            <span className="text-xs font-bold text-[#15233F] tabular-nums">
              Subtotal: {formatINRLakhs(totalEducationCost)}
            </span>
          </div>

          <div className="space-y-3">
            {costFields.map((field) => (
              <div key={field.key} className="flex items-center justify-between text-xs gap-3">
                <label className="text-[#55657F] font-medium flex-1 truncate">{field.label}</label>
                <div className="relative w-36">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    step="10000"
                    value={field.value || ''}
                    placeholder="0"
                    onChange={(e) => updateCostItem(field.key as any, Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-[#15233F] tabular-nums text-right focus:bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarships & Family Savings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#15233F]">
              Own Funds & Waivers
            </h4>
            <span className="text-xs font-bold text-emerald-700 tabular-nums">
              Offsets: {formatINRLakhs(totalSelfFunding)}
            </span>
          </div>

          <div className="space-y-3">
            {fundingFields.map((field) => (
              <div key={field.key} className="flex items-center justify-between text-xs gap-3">
                <label className="text-[#55657F] font-medium flex-1 truncate">{field.label}</label>
                <div className="relative w-36">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    step="10000"
                    value={field.value || ''}
                    placeholder="0"
                    onChange={(e) => updateCostItem(field.key as any, Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-emerald-800 tabular-nums text-right focus:bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-[#55657F] leading-relaxed">
            <strong className="text-[#15233F] font-semibold">Fintech Tip:</strong> Lenders typically finance up to 100% of college-verified expenses in India, but often mandate a 15% margin (family contribution) for overseas education.
          </div>
        </div>
      </div>
    </div>
  );
};
