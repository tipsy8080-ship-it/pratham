import React from 'react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#15233F]">Methodology & Calculation Transparency</h2>
        <p className="text-sm text-[#55657F]">
          Complete mathematical formulas, regulatory benchmarks, and architectural assumptions powering the planner.
        </p>
      </div>

      {/* 3 Explicit Data Classifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <span className="font-bold text-[#2547D0] uppercase tracking-wider text-[11px] block">
            1. User Inputs (Deterministic)
          </span>
          <h4 className="font-bold text-sm text-[#15233F]">What You Provide</h4>
          <p className="text-[#55657F]">
            Specific figures entered directly by the student or family: loan amount, quoted lender interest rate, course duration, grace period, disbursement dates, expected starting salary, and household liquid reserves.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <span className="font-bold text-[#F2A900] uppercase tracking-wider text-[11px] block">
            2. Mathematical Outputs
          </span>
          <h4 className="font-bold text-sm text-[#15233F]">What The Engine Computes</h4>
          <p className="text-[#55657F]">
            Strict mathematical derivations without speculation: monthly rate $r$, standard amortizing EMI, accrued study-period simple interest, capitalized principal, overall lifetime repayment, and monthly cash flow surplus/deficit.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <span className="font-bold text-emerald-700 uppercase tracking-wider text-[11px] block">
            3. Scenario Assumptions
          </span>
          <h4 className="font-bold text-sm text-[#15233F]">Dynamic Risk Models</h4>
          <p className="text-[#55657F]">
            Simulated stress conditions that you can vary dynamically: ±25% placement variation, 3-to-6 month onboarding freeze, floating interest rate hikes (+1-2%), and study abroad foreign exchange volatility.
          </p>
        </div>
      </div>

      {/* Formulas & Code Architecture */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#15233F]">Core Financial Formulas</h3>

        <div className="space-y-4 text-xs">
          {/* Formula 1 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#15233F] text-sm">
                1. Monthly Amortization EMI (Equated Monthly Installment)
              </span>
              <code className="text-[11px] bg-slate-200 px-2 py-0.5 rounded-sm font-mono text-slate-800">
                calculateEMI()
              </code>
            </div>
            <div className="p-3 bg-white border border-slate-300 rounded-md font-mono text-xs text-[#2547D0] overflow-x-auto">
              EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ - 1)
            </div>
            <p className="text-[#55657F]">
              Where <strong>P</strong> is the principal balance at repayment commencement (including any capitalized moratorium interest), <strong>r</strong> is the monthly interest rate (Annual Rate ÷ 12 ÷ 100), and <strong>n</strong> is total monthly payment periods (Tenure in Years × 12).
            </p>
          </div>

          {/* Formula 2 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#15233F] text-sm">
                2. Moratorium & Staggered Disbursement Simple Interest
              </span>
              <code className="text-[11px] bg-slate-200 px-2 py-0.5 rounded-sm font-mono text-slate-800">
                calculateDisbursementAndMoratoriumInterest()
              </code>
            </div>
            <div className="p-3 bg-white border border-slate-300 rounded-md font-mono text-xs text-[#2547D0] overflow-x-auto">
              Interest_Accrued = Σ [ Tranche_Amount_i × (Annual_Rate ÷ 1200) × Active_Months_i ]
            </div>
            <p className="text-[#55657F]">
              Under Indian banking convention (IBA Education Loan Scheme), interest during the study and grace moratorium is calculated on simple interest terms for each released tranche. If the family does not pay this monthly, it is added to principal at repayment initiation (capitalization).
            </p>
          </div>

          {/* Formula 3 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#15233F] text-sm">
                3. Affordability Ratio & Monthly Buffer Engine
              </span>
              <code className="text-[11px] bg-slate-200 px-2 py-0.5 rounded-sm font-mono text-slate-800">
                determineAffordability()
              </code>
            </div>
            <div className="p-3 bg-white border border-slate-300 rounded-md font-mono text-xs text-[#2547D0] overflow-x-auto">
              EMI_Share = Monthly_EMI ÷ Starting_Salary
              <br />
              Monthly_Buffer = Starting_Salary - Essential_Living_Expenses - Monthly_EMI
            </div>
            <div className="text-[#55657F] space-y-1">
              <p>Status Thresholds:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li><strong>COMFORTABLE:</strong> EMI Share ≤ 35% AND Buffer ≥ 40% of EMI (Healthy safety margin)</li>
                <li><strong>BORDERLINE:</strong> EMI Share ≤ 45% AND Buffer &gt; ₹5,000/mo (Vulnerable to inflation/delays)</li>
                <li><strong>STRETCHED:</strong> EMI Share ≤ 55% AND Buffer ≥ 0 (Little room for medical emergencies)</li>
                <li><strong>HIGH RISK:</strong> EMI Share &gt; 55% OR Buffer &lt; 0 (Unsustainable monthly deficit)</li>
              </ul>
            </div>
          </div>

          {/* Formula 4 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#15233F] text-sm">
                4. Safe Borrowing Range Reverse Inversion
              </span>
              <code className="text-[11px] bg-slate-200 px-2 py-0.5 rounded-sm font-mono text-slate-800">
                calculateSafeBorrowingRange()
              </code>
            </div>
            <div className="p-3 bg-white border border-slate-300 rounded-md font-mono text-xs text-[#2547D0] overflow-x-auto">
              Safe_EMI = min( 0.35 × Starting_Salary, Starting_Salary - Living_Expenses - Cushion )
              <br />
              P_safe = Safe_EMI × ((1 + r)ⁿ - 1) / ( r × (1 + r)ⁿ )
            </div>
            <p className="text-[#55657F]">
              Inverts the amortization equation based on an individual's disposable income capacity rather than maximum lender collateral limits, safeguarding the student from predatory over-leverage.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#55657F] leading-relaxed">
        <strong>Important Notice:</strong> Actual lender terms and compounding conventions may vary slightly based on lender-specific policies (e.g. daily reducing vs monthly reducing balance, penal interest clauses, and restructuring rules). Verify all contractual disclosures on the lender's official Key Fact Statement (KFS) prior to signing loan sanction agreements.
      </div>
    </div>
  );
};
