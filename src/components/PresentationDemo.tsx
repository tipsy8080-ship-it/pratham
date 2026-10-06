import React, { useState } from 'react';
import { LoanInputState } from '../types';
import { runLoanCalculations } from '../calculations/engine';
import { formatINR, formatINRLakhs } from '../utils/formatters';

interface PresentationDemoProps {
  onExitDemo: () => void;
  onApplyDemoToPlanner: (state: LoanInputState) => void;
}

export const PresentationDemo: React.FC<PresentationDemoProps> = ({
  onExitDemo,
  onApplyDemoToPlanner,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Dedicated demo scenario state
  const baseDemoState: LoanInputState = {
    loanAmount: 1500000,
    interestRate: 10.0,
    tenureYears: 10,
    courseDurationYears: 2,
    gracePeriodYears: 1,
    country: 'india',
    abroad: {
      currency: 'USD',
      exchangeRate: 86.5,
      stressExchangeRate: 92.0,
      tuitionFX: 25000,
      livingFX: 15000,
    },
    educationCosts: {
      tuition: 1200000,
      hostel: 250000,
      living: 150000,
      books: 40000,
      travel: 30000,
      insurance: 20000,
      applicationFees: 10000,
      other: 0,
      scholarship: 0,
      familyContribution: 200000,
      existingSavings: 0,
    },
    disbursements: [
      { id: 'd-1', yearNumber: 1, monthOffset: 0, amount: 750000, description: 'Year 1 Fee' },
      { id: 'd-2', yearNumber: 2, monthOffset: 12, amount: 750000, description: 'Year 2 Fee' },
    ],
    // Step 3 will toggle moratoriumOption between accrue and service_full
    moratoriumOption: currentStep < 3 ? 'service_full' : currentStep === 6 ? 'service_full' : 'accrue',
    customMoratoriumPayment: 6000,
    processingFeePercent: 1.0,
    processingFeeFlat: 0,
    insuranceFee: 12000,
    otherFees: 3000,
    hasSubsidy: false,
    subsidyPercent: 0,
    subsidyPeriodYears: 2,
    expectedStartingSalary: 60000,
    annualSalaryGrowth: 8.0,
    downsideSalaryMonthly: 45000,
    upsideSalaryMonthly: 75000,
    jobStartDelayMonths: currentStep === 5 ? 6 : 0,
    estimatedLivingExpenses: 30000,
    existingFamilyBuffer: 200000,
    studentName: 'Aarav Sharma',
    courseName: 'MBA Program (2 Years)',
    institutionName: 'Top B-School',
  };

  // Adjust for step 6: Borrow ₹3L less
  const activeDemoState: LoanInputState = {
    ...baseDemoState,
    loanAmount: currentStep === 6 ? 1200000 : 1500000,
  };

  const results = runLoanCalculations(activeDemoState);

  const stepsData = [
    {
      step: 1,
      title: 'STEP 1: "Here is the loan."',
      summary: 'A family seeks ₹15,00,000 for a 2-year post-graduate degree.',
      headline: 'The Borrowing Need: ₹15 Lakhs',
      explanation:
        'A student gets admitted into a premier institute. The total cost is ₹17 Lakhs; with ₹2 Lakhs in family savings, the funding requirement is ₹15,00,000. Interest is quoted at 10% per annum over a 10-year repayment tenure.',
    },
    {
      step: 2,
      title: 'STEP 2: "Here is the EMI."',
      summary: 'Traditional calculators say: ₹19,800/month.',
      headline: 'The Traditional Metric: ₹19,800 / month',
      explanation:
        'The family opens a traditional EMI calculator. It multiplies principal and formula to say: "Your EMI is ₹19,800/month." The family thinks: "We can manage ₹20k once our child gets a campus job!" But this hides the entire deferment phase.',
    },
    {
      step: 3,
      title: 'STEP 3: "What happens to interest while studying?"',
      summary: 'Moratorium interest accumulates to make EMI ~₹25,800/month!',
      headline: 'The Hidden Shift: ₹19,800 → ₹25,800 / month',
      explanation:
        'During 2 years of study + 1 year grace (36 months total), ~₹4.5 Lakhs of interest accumulates. If not serviced monthly, it capitalizes! The principal becomes ~₹19.5 Lakhs, boosting the monthly EMI to ~₹25,800 and total repayment to ~₹31 Lakhs! However, servicing interest monthly preserves the ₹19,800 EMI and saves ~₹2.6 Lakhs.',
    },
    {
      step: 4,
      title: 'STEP 4: "What if starting salary is lower than expected?"',
      summary: 'Downside scenario: ₹45,000/month starting offer.',
      headline: 'Income Downside Shock: EMI eats 57% of Salary',
      explanation:
        'Campus hiring cools down. Instead of ₹60,000/month, the starting salary is ₹45,000/month. Essential rent and living costs consume ₹30,000. An EMI of ~₹25,800 leaves a negative cash flow (-₹10,800/month deficit!). The student is in immediate financial distress.',
    },
    {
      step: 5,
      title: 'STEP 5: "Now let\'s delay the job by six months."',
      summary: 'Corporate joining freeze postpones onboarding by 180 days.',
      headline: 'Job Delay Stress Test: ₹1.5 Lakhs Cash Needed Upfront',
      explanation:
        'Moratorium ends, but the firm defers onboarding by 6 months. For 6 months without salary, the family must pay 6 × ₹25,800 = ₹1,54,800 in EMIs. Can the family emergency reserve absorb this shock, or will the student face immediate loan default and CIBIL impairment?',
    },
    {
      step: 6,
      title: 'STEP 6: "What if the family borrows ₹3 lakh less?"',
      summary: 'Proactive What-If: Borrow ₹12L instead of ₹15L.',
      headline: 'The Power of Borrowing Less: ₹12L Loan',
      explanation:
        'What if the family cuts non-essential expenses or secures a ₹3L scholarship/family loan, borrowing ₹12 Lakhs instead of ₹15 Lakhs? The EMI drops significantly to ~₹15,800/mo, total repayment falls by ~₹6 Lakhs, and the family gains peace of mind.',
    },
    {
      step: 7,
      title: 'STEP 7: "Can our family actually carry this loan?"',
      summary: 'Final executive assessment: From EMI to Affordability.',
      headline: 'The True Picture: Responsible Borrowing Decision',
      explanation:
        'The conclusion is clear: an EMI tells you the payment, but this planner tells you whether your family can carry it. The family now has full transparency on moratorium interest, downside risks, safe borrowing limits, and a print-ready Family Report.',
    },
  ];

  const currentStepData = stepsData[currentStep - 1];

  return (
    <div className="bg-[#15233F] text-white rounded-2xl p-6 md:p-8 shadow-xl space-y-6 border border-slate-700">
      {/* Top Header & Presenter Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-sm bg-[#F2A900] text-[#15233F] text-xs font-bold uppercase tracking-wider">
              Finance Innovation Pitch Mode
            </span>
            <span className="text-xs text-slate-400">Illustrative ₹15L Presentation Case</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mt-1">Presentation Demo: 7-Step Decision Story</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onApplyDemoToPlanner(activeDemoState)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2547D0] hover:bg-blue-700 rounded-lg transition-colors"
          >
            Load Into Planner
          </button>
          <button
            onClick={onExitDemo}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            Exit Demo
          </button>
        </div>
      </div>

      {/* Step Progress Pill Rail */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {stepsData.map((s) => (
          <button
            key={s.step}
            onClick={() => setCurrentStep(s.step)}
            className={`py-2 px-1 rounded-md text-[11px] font-bold transition-all ${
              currentStep === s.step
                ? 'bg-[#2547D0] text-white ring-2 ring-blue-400 shadow-sm'
                : currentStep > s.step
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Step {s.step}
          </button>
        ))}
      </div>

      {/* Active Step Presentation Canvas */}
      <div className="bg-slate-900/90 rounded-xl p-6 border border-slate-800 space-y-5">
        <div>
          <span className="text-xs font-bold text-[#F2A900] uppercase tracking-wider">
            {currentStepData.title}
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold text-white mt-1">
            {currentStepData.headline}
          </h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {currentStepData.explanation}
          </p>
        </div>

        {/* Live Dynamic Illustrative Numbers Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Loan Amount:</span>
            <span className="text-base font-bold text-white tabular-nums">
              {formatINRLakhs(activeDemoState.loanAmount)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Calculated Monthly EMI:</span>
            <span className="text-base font-bold text-amber-400 tabular-nums">
              {formatINR(results.monthlyEMI)}/mo
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Total Repayment:</span>
            <span className="text-base font-bold text-white tabular-nums">
              ~{formatINRLakhs(results.totalRepaidOverall)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Affordability Status:</span>
            <span
              className={`inline-block font-extrabold px-2 py-0.5 rounded-xs text-[11px] ${
                results.affordabilityStatus === 'COMFORTABLE'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                  : results.affordabilityStatus === 'BORDERLINE'
                  ? 'bg-amber-950 text-amber-400 border border-amber-700'
                  : 'bg-rose-950 text-rose-400 border border-rose-700'
              }`}
            >
              {results.affordabilityStatus}
            </span>
          </div>
        </div>

        {/* Presenter Pitch Note */}
        <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-lg text-xs text-blue-200">
          <strong className="text-blue-300 font-semibold">Presenter MBA Talking Point:</strong>{' '}
          {currentStep === 1 &&
            'Begin by establishing the context: ₹15L is the standard Indian education loan bracket for Tier-1/2 MBA and engineering courses.'}
          {currentStep === 2 &&
            'Show the audience how existing bank calculators stop right here at ₹19,800/mo, creating a dangerous false sense of affordability.'}
          {currentStep === 3 &&
            'Reveal the punchline: 3 years of study interest increases the EMI to ~₹25,800/mo or adds ₹4.5L to debt. Servicing interest monthly saves ₹2.6L!'}
          {currentStep === 4 &&
            'Demonstrate sensitivity: What if campus placements dip? An EMI of ₹25,800 against ₹45,000 salary leaves families in financial distress.'}
          {currentStep === 5 &&
            'Introduce joining delay: With 6 months onboard delay, the family needs ₹1.5L in cash just to prevent NPA classification.'}
          {currentStep === 6 &&
            'Show the actionable solution: Reducing borrowing by just ₹3L restores safety and comfort.'}
          {currentStep === 7 &&
            'Conclude with the core thesis: We turn "What is the EMI?" into "Can we afford this?" for millions of Indian households.'}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg border border-slate-700 transition-colors"
        >
          ← Previous Step
        </button>

        <span className="text-xs text-slate-400 font-medium">
          Step {currentStep} of {stepsData.length}
        </span>

        {currentStep < stepsData.length ? (
          <button
            onClick={() => setCurrentStep((prev) => Math.min(stepsData.length, prev + 1))}
            className="px-5 py-2 text-xs font-bold text-[#15233F] bg-[#F2A900] hover:bg-amber-400 rounded-lg transition-colors shadow-sm"
          >
            Next Step →
          </button>
        ) : (
          <button
            onClick={() => onApplyDemoToPlanner(activeDemoState)}
            className="px-5 py-2 text-xs font-bold text-white bg-[#2547D0] hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
          >
            Explore in Full Planner →
          </button>
        )}
      </div>
    </div>
  );
};
