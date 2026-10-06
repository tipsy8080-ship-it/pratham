import React from 'react';
import { formatINR, formatINRLakhs } from '../../utils/formatters';
import { CalculationResults, LoanInputState } from '../../types';
import { generateAmortizationTrajectory } from '../../calculations/engine';

interface ChartsProps {
  input: LoanInputState;
  results: CalculationResults;
}

/**
 * 1. Principal vs Interest vs Fees Donut / Proportion Bar
 */
export const PrincipalInterestBreakdown: React.FC<ChartsProps> = ({ results }) => {
  const principal = results.capitalizedPrincipalAtRepayment;
  const interest = results.totalInterestRepaymentPeriod;
  const fees = results.upfrontFeesTotal;
  const total = principal + interest + fees;

  const principalPct = total > 0 ? (principal / total) * 100 : 50;
  const interestPct = total > 0 ? (interest / total) * 100 : 45;
  const feesPct = total > 0 ? (fees / total) * 100 : 5;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-[#15233F]">Repayment Composition</h4>
          <p className="text-xs text-[#55657F]">Where every rupee of your total repayment goes</p>
        </div>
        <span className="text-xs font-semibold text-[#15233F] tabular-nums">
          Total: {formatINRLakhs(total)}
        </span>
      </div>

      {/* Segmented bar */}
      <div className="w-full h-7 rounded-lg overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
        <div
          style={{ width: `${principalPct}%` }}
          className="bg-[#2547D0] h-full rounded-l-md transition-all duration-300 relative group"
          title={`Principal: ${formatINR(principal)} (${principalPct.toFixed(1)}%)`}
        />
        <div
          style={{ width: `${interestPct}%` }}
          className="bg-[#F2A900] h-full transition-all duration-300 relative group"
          title={`Interest: ${formatINR(interest)} (${interestPct.toFixed(1)}%)`}
        />
        {fees > 0 && (
          <div
            style={{ width: `${feesPct}%` }}
            className="bg-[#15233F] h-full rounded-r-md transition-all duration-300 relative group"
            title={`Fees & Ins: ${formatINR(fees)} (${feesPct.toFixed(1)}%)`}
          />
        )}
      </div>

      {/* Legend & amounts */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
        <div>
          <div className="flex items-center gap-1.5 text-[#55657F] mb-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#2547D0] inline-block shrink-0" />
            <span>Principal</span>
          </div>
          <div className="font-bold text-[#15233F] tabular-nums">{formatINRLakhs(principal)}</div>
          <div className="text-[11px] text-[#55657F] tabular-nums">{principalPct.toFixed(0)}%</div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[#55657F] mb-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#F2A900] inline-block shrink-0" />
            <span>Total Interest</span>
          </div>
          <div className="font-bold text-[#15233F] tabular-nums">{formatINRLakhs(interest)}</div>
          <div className="text-[11px] text-[#55657F] tabular-nums">{interestPct.toFixed(0)}%</div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[#55657F] mb-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#15233F] inline-block shrink-0" />
            <span>Fees & Charges</span>
          </div>
          <div className="font-bold text-[#15233F] tabular-nums">{formatINR(fees)}</div>
          <div className="text-[11px] text-[#55657F] tabular-nums">{feesPct.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Monthly Cashflow Waterfall (Salary -> Expenses -> EMI -> Buffer)
 */
export const MonthlyCashflowWaterfall: React.FC<ChartsProps> = ({ input, results }) => {
  const salary = input.expectedStartingSalary;
  const expenses = input.estimatedLivingExpenses;
  const emi = results.monthlyEMI;
  const buffer = results.monthlyRemainingBuffer;

  const maxVal = Math.max(salary, expenses + emi, 1000);

  const expensesWidth = Math.min(100, (expenses / maxVal) * 100);
  const emiWidth = Math.min(100, (emi / maxVal) * 100);
  const bufferWidth = Math.max(0, Math.min(100, (buffer / maxVal) * 100));

  const isBufferPositive = buffer >= 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-[#15233F]">Monthly Cash-Flow Split</h4>
          <p className="text-xs text-[#55657F]">How starting salary divides every single month</p>
        </div>
        <span className="text-xs font-semibold text-[#15233F] tabular-nums">
          Salary: {formatINR(salary)}/mo
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Salary Row */}
        <div>
          <div className="flex justify-between text-[#55657F] mb-1">
            <span className="font-medium text-[#15233F]">1. Gross Starting Salary</span>
            <span className="font-bold text-[#15233F] tabular-nums">{formatINR(salary)}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-md h-3 overflow-hidden">
            <div className="bg-slate-700 h-full rounded-md" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Expenses Row */}
        <div>
          <div className="flex justify-between text-[#55657F] mb-1">
            <span>2. Essential Living Expenses (Rent, food, etc.)</span>
            <span className="font-semibold text-slate-800 tabular-nums">-{formatINR(expenses)}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-md h-3 overflow-hidden">
            <div className="bg-slate-400 h-full rounded-md" style={{ width: `${expensesWidth}%` }} />
          </div>
        </div>

        {/* EMI Row */}
        <div>
          <div className="flex justify-between text-[#55657F] mb-1">
            <span className="font-semibold text-[#2547D0]">3. Monthly Education Loan EMI</span>
            <span className="font-bold text-[#2547D0] tabular-nums">-{formatINR(emi)}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-md h-3 overflow-hidden">
            <div className="bg-[#2547D0] h-full rounded-md" style={{ width: `${emiWidth}%` }} />
          </div>
        </div>

        {/* Buffer Row */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex justify-between mb-1">
            <span className={`font-bold ${isBufferPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
              4. Remaining Cash-Flow Buffer
            </span>
            <span className={`font-bold tabular-nums ${isBufferPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
              {formatINR(buffer)}/mo
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-md h-3.5 overflow-hidden">
            <div
              className={`h-full rounded-md ${isBufferPositive ? 'bg-emerald-600' : 'bg-rose-600'}`}
              style={{ width: `${isBufferPositive ? bufferWidth : Math.min(100, (Math.abs(buffer) / maxVal) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#55657F] mt-1.5">
            {isBufferPositive
              ? `After paying ₹${emi.toLocaleString('en-IN')} EMI and ₹${expenses.toLocaleString('en-IN')} expenses, you retain ₹${buffer.toLocaleString('en-IN')} for emergency savings and discretionary needs.`
              : `Warning: Expenses plus EMI exceed starting income by ₹${Math.abs(buffer).toLocaleString('en-IN')}/month. Family must bridge this deficit.`}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. Amortization Balance Curve Over Tenure (SVG Line Graph)
 */
export const AmortizationCurve: React.FC<ChartsProps> = ({ input, results }) => {
  const trajectory = generateAmortizationTrajectory(
    results.capitalizedPrincipalAtRepayment,
    input.interestRate,
    input.tenureYears,
    results.monthlyEMI
  );

  const width = 500;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 55 };

  const maxBalance = Math.max(...trajectory.map((t) => t.balance), 1);
  const yearsCount = trajectory.length - 1;

  const points = trajectory.map((t, idx) => {
    const x = padding.left + (idx / yearsCount) * (width - padding.left - padding.right);
    const y = height - padding.bottom - (t.balance / maxBalance) * (height - padding.top - padding.bottom);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - padding.right},${height - padding.bottom} L ${padding.left},${height - padding.bottom} Z`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-bold text-[#15233F]">Loan Paydown Trajectory</h4>
          <p className="text-xs text-[#55657F]">Outstanding balance from Year 1 to Year {input.tenureYears}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#55657F]">Starting Balance</div>
          <div className="text-xs font-bold text-[#2547D0] tabular-nums">
            {formatINRLakhs(results.capitalizedPrincipalAtRepayment)}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-48 select-none">
          {/* Grid lines */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#E2E8F0"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={(height - padding.top - padding.bottom) / 2 + padding.top}
            x2={width - padding.right}
            y2={(height - padding.top - padding.bottom) / 2 + padding.top}
            stroke="#F1F5F9"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Area fill */}
          <path d={areaD} fill="rgba(37, 71, 208, 0.08)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#2547D0" strokeWidth="2.5" strokeLinecap="round" />

          {/* Dots on years */}
          {trajectory.map((t, idx) => {
            const x = padding.left + (idx / yearsCount) * (width - padding.left - padding.right);
            const y = height - padding.bottom - (t.balance / maxBalance) * (height - padding.top - padding.bottom);
            if (idx === 0 || idx === trajectory.length - 1 || idx % 2 === 0) {
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="3.5" fill="#FFFFFF" stroke="#2547D0" strokeWidth="2" />
                  <text
                    x={x}
                    y={height - 10}
                    fontSize="10"
                    fill="#64748B"
                    textAnchor="middle"
                    className="tabular-nums"
                  >
                    Y{t.year}
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Y-axis Labels */}
          <text
            x={padding.left - 8}
            y={padding.top + 5}
            fontSize="10"
            fill="#64748B"
            textAnchor="end"
            className="tabular-nums"
          >
            {formatINRLakhs(maxBalance)}
          </text>
          <text
            x={padding.left - 8}
            y={height - padding.bottom}
            fontSize="10"
            fill="#64748B"
            textAnchor="end"
            className="tabular-nums"
          >
            ₹0
          </text>
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-[#55657F] pt-2 border-t border-slate-100">
        <span>Tenure: {input.tenureYears} Years ({input.tenureYears * 12} EMIs)</span>
        <span className="font-semibold text-emerald-700">Fully Paid: Year {input.tenureYears}</span>
      </div>
    </div>
  );
};

/**
 * 4. Income Scenario Comparison (Base vs Downside vs Upside)
 */
export const IncomeScenarioComparisonChart: React.FC<ChartsProps> = ({ input, results }) => {
  const emi = results.monthlyEMI;
  const baseSalary = input.expectedStartingSalary;
  const downsideSalary = input.downsideSalaryMonthly;
  const upsideSalary = input.upsideSalaryMonthly;

  const scenarios = [
    {
      name: 'Downside Case',
      salary: downsideSalary,
      ratio: downsideSalary > 0 ? emi / downsideSalary : 1,
      buffer: downsideSalary - input.estimatedLivingExpenses - emi,
      label: 'Campus offer below expectation',
    },
    {
      name: 'Base Case',
      salary: baseSalary,
      ratio: baseSalary > 0 ? emi / baseSalary : 1,
      buffer: baseSalary - input.estimatedLivingExpenses - emi,
      label: 'Expected market placement',
    },
    {
      name: 'Upside Case',
      salary: upsideSalary,
      ratio: upsideSalary > 0 ? emi / upsideSalary : 1,
      buffer: upsideSalary - input.estimatedLivingExpenses - emi,
      label: 'Top-tier firm or bonus role',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-[#15233F]">Income Sensitivity Comparison</h4>
          <p className="text-xs text-[#55657F]">How EMI pressure shifts if your starting offer varies</p>
        </div>
        <span className="text-xs font-semibold text-[#2547D0] tabular-nums">
          Fixed EMI: {formatINR(emi)}/mo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((sc, idx) => {
          const emiShare = Math.round(sc.ratio * 100);
          const isHealthy = emiShare <= 35 && sc.buffer > 0;
          const isStretched = emiShare > 50 || sc.buffer < 0;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border text-xs ${
                idx === 1
                  ? 'border-[#2547D0] bg-blue-50/40'
                  : isStretched
                  ? 'border-rose-200 bg-rose-50/30'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[#15233F]">{sc.name}</span>
                {idx === 1 && (
                  <span className="text-[10px] font-bold text-[#2547D0] bg-white px-1.5 py-0.5 rounded-sm border border-blue-200">
                    Primary Plan
                  </span>
                )}
              </div>
              <div className="text-base font-bold text-[#15233F] tabular-nums mb-1">
                {formatINR(sc.salary)}
                <span className="text-xs font-normal text-[#55657F]">/mo</span>
              </div>
              <p className="text-[11px] text-[#55657F] mb-3">{sc.label}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span className="text-[#55657F]">EMI Share of Income:</span>
                  <span className="font-bold tabular-nums text-[#15233F]">{emiShare}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#55657F]">Remaining Buffer:</span>
                  <span
                    className={`font-bold tabular-nums ${
                      sc.buffer >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {formatINR(sc.buffer)}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#55657F]">Status:</span>
                  <span
                    className={`font-semibold ${
                      isHealthy
                        ? 'text-emerald-700'
                        : isStretched
                        ? 'text-rose-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {isHealthy ? 'Comfortable' : isStretched ? 'Stretched' : 'Borderline'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
