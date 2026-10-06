import React from 'react';
import { LoanInputState, CalculationResults } from '../types';
import { formatINR, formatINRLakhs } from '../utils/formatters';
import {
  PrincipalInterestBreakdown,
  AmortizationCurve,
  IncomeScenarioComparisonChart,
} from './charts/FinancialCharts';

interface ResultsDashboardProps {
  input: LoanInputState;
  results: CalculationResults;
  onModifyPlan: () => void;
  onRunStressTest: () => void;
  onOpenReport: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  input,
  results,
  onModifyPlan,
  onRunStressTest,
  onOpenReport,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMFORTABLE':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'BORDERLINE':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'STRETCHED':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#15233F]">Loan Decision & Affordability Dashboard</h2>
          <p className="text-sm text-[#55657F]">
            Comprehensive financial picture for {input.studentName || 'Student'} ({input.courseName || 'Higher Education'})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onModifyPlan}
            className="px-3.5 py-2 text-xs font-semibold text-[#15233F] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
          >
            Adjust Assumptions
          </button>
          <button
            onClick={onRunStressTest}
            className="px-3.5 py-2 text-xs font-semibold text-[#15233F] bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            Run Stress Tests
          </button>
          <button
            onClick={onOpenReport}
            className="px-4 py-2 text-xs font-bold text-white bg-[#2547D0] hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Download Family Report</span>
            <span>📄</span>
          </button>
        </div>
      </div>

      {/* 6 Top Key Executive Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Loan Amount
          </span>
          <div className="text-lg font-bold text-[#15233F] tabular-nums mt-1">
            {formatINRLakhs(input.loanAmount)}
          </div>
          <span className="text-[10px] text-[#55657F]">{input.interestRate}% for {input.tenureYears} yrs</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Monthly EMI
          </span>
          <div className="text-lg font-bold text-[#2547D0] tabular-nums mt-1">
            {formatINR(results.monthlyEMI)}
          </div>
          <span className="text-[10px] text-[#55657F]">{Math.round(results.emiToIncomeRatio * 100)}% of salary</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Total Interest
          </span>
          <div className="text-lg font-bold text-[#F2A900] tabular-nums mt-1">
            {formatINRLakhs(results.totalInterestOverall)}
          </div>
          <span className="text-[10px] text-[#55657F]">Over repayment term</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Total Repaid
          </span>
          <div className="text-lg font-bold text-[#15233F] tabular-nums mt-1">
            {formatINRLakhs(results.totalRepaidOverall)}
          </div>
          <span className="text-[10px] text-[#55657F]">Principal + Int + Fees</span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Income Needed
          </span>
          <div className="text-lg font-bold text-[#15233F] tabular-nums mt-1">
            {formatINR(Math.round(results.monthlyEMI / 0.35))}
            <span className="text-[11px] font-normal text-[#55657F]">/mo</span>
          </div>
          <span className="text-[10px] text-[#55657F]">For &lt;35% safe ratio</span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Affordability
          </span>
          <div className="mt-1">
            <span className={`inline-block text-xs font-extrabold px-2 py-0.5 rounded-sm border ${getStatusBadge(results.affordabilityStatus)}`}>
              {results.affordabilityStatus}
            </span>
          </div>
          <span className="text-[10px] text-[#55657F] block mt-0.5">
            Buffer: {formatINR(results.monthlyRemainingBuffer)}/mo
          </span>
        </div>
      </div>

      {/* Signature Insight Banner */}
      <div className="bg-gradient-to-br from-[#15233F] via-[#1c2e52] to-[#2547D0] text-white rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-amber-300">
          <span className="text-lg">💡</span>
          <span className="text-xs font-bold uppercase tracking-wider">Signature Decision Insight</span>
        </div>
        <h3 className="text-xl font-bold">Your EMI is not the whole story.</h3>
        
        {/* Mathematical Equation Visual */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs py-2">
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <span className="text-slate-300 block text-[10px]">1. Nominal EMI</span>
            <span className="font-bold text-white tabular-nums">{formatINR(results.monthlyEMI)}</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <span className="text-slate-300 block text-[10px]">+ Moratorium Int.</span>
            <span className="font-bold text-amber-300 tabular-nums">+{formatINRLakhs(results.accumulatedMoratoriumInterest)}</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <span className="text-slate-300 block text-[10px]">+ Lender Fees</span>
            <span className="font-bold text-white tabular-nums">+{formatINR(results.upfrontFeesTotal)}</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <span className="text-slate-300 block text-[10px]">+ Income Variance</span>
            <span className="font-bold text-white tabular-nums">±25% Salary</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <span className="text-slate-300 block text-[10px]">+ Job Delay Shock</span>
            <span className="font-bold text-white tabular-nums">{input.jobStartDelayMonths} Mo Delay</span>
          </div>
          <div className="bg-amber-400 text-[#15233F] rounded-lg p-2.5 font-bold flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-wider block opacity-80">= True Reality</span>
            <span className="text-xs">True Borrowing Picture</span>
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          Traditional portals show only the ₹{results.monthlyEMI.toLocaleString('en-IN')} payment. When you add study interest capitalization, realistic entry-level living costs, and the risk of campus joining dates slipping by several months, our engine reveals your family’s genuine financial commitment.
        </p>
      </div>

      {/* Family Decision Summary Card */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2547D0] block">
              Plain-English Planner Assessment
            </span>
            <h3 className="text-lg font-bold text-[#15233F]">Can Our Family Carry This Loan?</h3>
          </div>
          <span className={`self-start sm:self-auto px-3 py-1 rounded-md text-xs font-extrabold border ${getStatusBadge(results.affordabilityStatus)}`}>
            {results.affordabilityStatus}
          </span>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg text-sm text-[#15233F] leading-relaxed border border-slate-200/80">
          {results.familyDecisionSummary}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <span className="text-[#55657F] block">Funding Requirement:</span>
            <span className="font-bold text-[#15233F] tabular-nums">{formatINR(results.netFundingRequirement)}</span>
          </div>
          <div>
            <span className="text-[#55657F] block">Downside Salary EMI Ratio:</span>
            <span className="font-bold text-amber-700 tabular-nums">
              {Math.round(results.downsideEmiToIncomeRatio * 100)}%
            </span>
          </div>
          <div>
            <span className="text-[#55657F] block">Family Reserve Coverage:</span>
            <span className="font-bold text-[#2547D0] tabular-nums">{results.monthsOfBufferCovered} Months</span>
          </div>
          <div>
            <span className="text-[#55657F] block">Safe Borrowing Range:</span>
            <span className="font-bold text-[#2547D0] tabular-nums">
              {formatINRLakhs(results.safeBorrowingMin)} – {formatINRLakhs(results.safeBorrowingMax)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrincipalInterestBreakdown input={input} results={results} />
        <AmortizationCurve input={input} results={results} />
      </div>

      <IncomeScenarioComparisonChart input={input} results={results} />
    </div>
  );
};
