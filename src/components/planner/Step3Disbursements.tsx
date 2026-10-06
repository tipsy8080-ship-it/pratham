import React from 'react';
import { LoanInputState, Disbursement } from '../../types';
import { formatINR, formatINRLakhs } from '../../utils/formatters';

interface Step3Props {
  input: LoanInputState;
  updateInput: (updates: Partial<LoanInputState>) => void;
}

export const Step3Disbursements: React.FC<Step3Props> = ({ input, updateInput }) => {
  const disbursements = input.disbursements;
  const totalDisbursed = disbursements.reduce((sum, d) => sum + d.amount, 0);
  const diffFromLoan = input.loanAmount - totalDisbursed;

  const addDisbursement = () => {
    const nextYear = disbursements.length + 1;
    const newTranche: Disbursement = {
      id: `d-${Date.now()}`,
      yearNumber: nextYear,
      monthOffset: Math.max(0, (nextYear - 1) * 12),
      amount: Math.max(0, diffFromLoan > 0 ? diffFromLoan : Math.round(input.loanAmount / (disbursements.length + 1))),
      description: `Year ${nextYear} Academic Tranche`,
    };
    updateInput({ disbursements: [...disbursements, newTranche] });
  };

  const removeDisbursement = (id: string) => {
    if (disbursements.length <= 1) return;
    updateInput({ disbursements: disbursements.filter((d) => d.id !== id) });
  };

  const updateDisbursement = (id: string, updates: Partial<Disbursement>) => {
    updateInput({
      disbursements: disbursements.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    });
  };

  const splitEqually = () => {
    const years = Math.max(1, Math.round(input.courseDurationYears));
    const amountPerYear = Math.round(input.loanAmount / years);
    const generated: Disbursement[] = [];
    for (let i = 0; i < years; i++) {
      generated.push({
        id: `d-${i + 1}`,
        yearNumber: i + 1,
        monthOffset: i * 12,
        amount: i === years - 1 ? input.loanAmount - amountPerYear * (years - 1) : amountPerYear,
        description: `Year ${i + 1} Academic Fees & Living`,
      });
    }
    updateInput({ disbursements: generated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#15233F]">3. Staggered Disbursements Timeline</h3>
        <p className="text-sm text-[#55657F]">
          Banks disburse fees semester-by-semester or year-by-year. Interest only begins accruing once each tranche is actually released.
        </p>
      </div>

      {/* Summary Tracker */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs text-[#55657F]">Total Scheduled Disbursements</span>
            <div className="text-lg font-bold text-[#15233F] tabular-nums">
              {formatINR(totalDisbursed)}{' '}
              <span className="text-xs font-normal text-[#55657F]">
                of {formatINRLakhs(input.loanAmount)} total loan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={splitEqually}
              className="px-3 py-1.5 text-xs font-semibold text-[#15233F] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              Split Equally Over {input.courseDurationYears} Years
            </button>
            <button
              type="button"
              onClick={addDisbursement}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2547D0] hover:bg-blue-700 rounded-lg transition-colors"
            >
              + Add Disbursement
            </button>
          </div>
        </div>

        {/* Warning if mismatch */}
        {Math.abs(diffFromLoan) > 1000 && (
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div>
              <strong>Note:</strong> Total scheduled disbursements ({formatINR(totalDisbursed)}) do not match your requested loan amount ({formatINR(input.loanAmount)}). Difference: {formatINR(Math.abs(diffFromLoan))}.
            </div>
            <button
              type="button"
              onClick={() => updateInput({ loanAmount: totalDisbursed })}
              className="ml-3 underline font-bold whitespace-nowrap text-amber-950"
            >
              Update Loan to {formatINRLakhs(totalDisbursed)}
            </button>
          </div>
        )}
      </div>

      {/* Timeline Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#15233F] mb-4">
          Disbursement & Repayment Sequence
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {disbursements.map((d, index) => {
            const monthsBeforeRepayment = Math.max(
              0,
              Math.round((input.courseDurationYears + input.gracePeriodYears) * 12 - d.monthOffset)
            );
            const estInterestAccumulated = Math.round(
              d.amount * (input.interestRate / 12 / 100) * monthsBeforeRepayment
            );

            return (
              <div key={d.id} className="relative group">
                <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#2547D0] ring-4 ring-blue-50" />
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-all hover:border-slate-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-[#2547D0] rounded-sm text-[11px] font-bold">
                        Tranche {index + 1}
                      </span>
                      <span className="text-xs font-bold text-[#15233F]">
                        Month {d.monthOffset} (Year {Math.floor(d.monthOffset / 12) + 1})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#55657F]">
                        Pre-EMI Interest Accrual (~{monthsBeforeRepayment} mos):{' '}
                        <strong className="text-[#F2A900] font-bold tabular-nums">
                          +{formatINR(estInterestAccumulated)}
                        </strong>
                      </span>
                      {disbursements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDisbursement(d.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[#55657F] block mb-1">Tranche Purpose / Name</label>
                      <input
                        type="text"
                        value={d.description}
                        onChange={(e) => updateDisbursement(d.id, { description: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-md p-1.5 font-medium text-[#15233F]"
                      />
                    </div>

                    <div>
                      <label className="text-[#55657F] block mb-1">Release Month from Start</label>
                      <input
                        type="number"
                        min="0"
                        max="48"
                        value={d.monthOffset}
                        onChange={(e) =>
                          updateDisbursement(d.id, {
                            monthOffset: Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded-md p-1.5 font-bold text-[#15233F] tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="text-[#55657F] block mb-1">Tranche Amount (INR)</label>
                      <input
                        type="number"
                        step="25000"
                        value={d.amount}
                        onChange={(e) =>
                          updateDisbursement(d.id, {
                            amount: Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded-md p-1.5 font-bold text-[#2547D0] tabular-nums"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Repayment Commences Node */}
          <div className="relative group">
            <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 flex items-center justify-between">
              <div>
                <span className="font-bold">Month {Math.round((input.courseDurationYears + input.gracePeriodYears) * 12)}:</span>{' '}
                Course & Grace Period Concludes — Full Amortizing Monthly EMIs Commence!
              </div>
              <span className="font-bold text-emerald-800">10-Year Repayment Clock Begins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
