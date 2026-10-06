import React from 'react';
import { BrandLogo } from './BrandLogo';
import { formatINR, formatINRLakhs } from '../utils/formatters';

interface LandingPageProps {
  onStartPlanning: () => void;
  onTryDemo: () => void;
  onExploreFeatures: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onTryDemo,
  onExploreFeatures,
}) => {
  return (
    <div className="space-y-16 py-6 md:py-10">
      {/* 1. Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 px-4">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-2xs">
          <BrandLogo size={22} />
          <span className="text-xs font-bold text-[#2547D0] tracking-tight">
            Education Loan Repayment Planner
          </span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#15233F] tracking-tight leading-[1.15]">
          From “What is the EMI?” to{' '}
          <span className="text-[#2547D0] relative inline-block">
            “Can we afford this?”
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-[#55657F] max-w-2xl mx-auto leading-relaxed">
          See the true cost of an education loan — including moratorium interest, income uncertainty, and what happens when things don't go as planned.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartPlanning}
            className="px-6 py-3 text-sm font-bold text-white bg-[#2547D0] hover:bg-blue-700 rounded-xl shadow-sm transition-all transform active:scale-98"
          >
            Build My Loan Plan →
          </button>
          <button
            onClick={onTryDemo}
            className="px-6 py-3 text-sm font-bold text-[#15233F] bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-xs transition-all"
          >
            Try ₹15L Example (Demo Mode)
          </button>
        </div>

        <div className="text-xs text-[#55657F] pt-1">
          Built for students and families making education financing decisions · 100% Free · No Login Required
        </div>
      </section>

      {/* 2. Core Differentiator: Traditional EMI vs Our Planner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2547D0]">
            The Core Product Differentiator
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15233F]">
            An EMI tells you the payment. We help you understand whether you can carry it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card A: Traditional Calculator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-5 shadow-xs flex flex-col justify-between opacity-85">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Standard Bank Website
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-sm">
                  Partial Picture
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-3">Traditional EMI Calculator</h3>
              <p className="text-xs text-slate-500 mt-1">
                Computes a single nominal formula assuming immediate repayment.
              </p>

              <div className="mt-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Loan Amount</div>
                  <div className="text-xl font-bold text-slate-800 tabular-nums">₹15,00,000</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Monthly EMI</div>
                  <div className="text-2xl font-black text-slate-800 tabular-nums">
                    ₹19,800 <span className="text-xs font-normal text-slate-500">/ month</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-xs text-rose-900 space-y-1">
                  <div className="font-bold">❌ What it conceals:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Ignores ₹4.5L+ interest accrued while studying</li>
                    <li>No stress testing if campus joining is delayed</li>
                    <li>Zero check on starting salary after rent/living costs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 italic">
              "You owe ₹19,800/mo. Figure out if you can afford it on your own."
            </div>
          </div>

          {/* Card B: Our Planner */}
          <div className="bg-gradient-to-b from-blue-50/70 to-white rounded-2xl border-2 border-[#2547D0] p-6 md:p-8 space-y-5 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#2547D0] text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg tracking-wider">
              Responsible Borrowing
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2547D0]">
                  Education Loan Repayment Planner
                </span>
                <span className="text-[11px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-sm">
                  Complete Picture
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#15233F] mt-3">Family Decision Engine</h3>
              <p className="text-xs text-[#55657F] mt-1">
                Full lifecycle modeling from matriculation through first job paycheck.
              </p>

              <div className="mt-6 space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[#55657F]">Loan Amount:</span>
                  <span className="font-bold text-[#15233F] tabular-nums">₹15,00,000</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[#55657F]">Monthly EMI (Real with Moratorium):</span>
                  <span className="font-bold text-[#2547D0] tabular-nums">
                    ₹19,800 – ₹25,800/mo
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[#55657F]">Total Lifetime Repayment:</span>
                  <span className="font-bold text-[#15233F] tabular-nums">~₹31 Lakhs</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[#55657F]">Starting Income Required:</span>
                  <span className="font-bold text-[#15233F] tabular-nums">₹60,000 – ₹70,000/mo</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[#55657F]">Monthly Cash-Flow Buffer:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">₹10,200/mo cushion</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[#55657F]">Job 6-Mo Delay Scenario:</span>
                  <span className="font-bold text-amber-700">Borderline (Needs ₹1.5L cash)</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[#55657F]">Estimated Safe Borrowing Range:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">₹10L – ₹13L</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-200 flex items-center justify-between">
              <span className="text-xs font-bold text-[#2547D0]">
                Can your family carry this loan?
              </span>
              <button
                onClick={onStartPlanning}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#2547D0] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
              >
                Plan Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 10-Step Visual Storytelling Journey */}
      <section className="max-w-5xl mx-auto px-4 bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-xs space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2547D0]">
            The Borrower's Realistic Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#15233F]">
            How a Family Makes an Informed Decision
          </h2>
          <p className="text-xs text-[#55657F]">
            From the initial admission letter to retirement peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {[
            { step: '01', title: 'I want to study', desc: 'Admission letter received for dream degree.' },
            { step: '02', title: 'I need ₹15 lakh', desc: 'Itemize tuition, hostel, and laptop costs.' },
            { step: '03', title: 'My EMI is ₹19,800', desc: 'Standard bank calculator gives first number.' },
            { step: '04', title: 'Study interest accrues', desc: '₹4.5L accumulates during course & grace.' },
            { step: '05', title: 'What if salary is lower?', desc: 'Simulate downside campus placement offers.' },
            { step: '06', title: 'What if job starts late?', desc: 'Stress test 6-month onboard delay shocks.' },
            { step: '07', title: 'What if rates rise?', desc: 'Test floating repo rate hikes (+1-2%).' },
            { step: '08', title: 'What if I borrow less?', desc: 'Simulate ₹3L less borrowing via savings.' },
            { step: '09', title: 'Now I know true cost', desc: 'Total ₹31L repayment picture unlocked.' },
            { step: '10', title: 'Can we carry it?', desc: 'Family signs loan with eyes wide open.' },
          ].map((item) => (
            <div
              key={item.step}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-[#2547D0] transition-colors"
            >
              <span className="text-[11px] font-black text-[#2547D0] block">{item.step}</span>
              <h4 className="font-bold text-[#15233F]">{item.title}</h4>
              <p className="text-[11px] text-[#55657F] leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Who Uses This Planner */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2547D0]">
            Target Audience
          </span>
          <h2 className="text-2xl font-bold text-[#15233F]">Built for Both Families and Education Partners</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-[#15233F] flex items-center gap-2">
              <span>👨‍👩‍👧</span>
              <span>Primary Users: Students & Families</span>
            </h3>
            <ul className="text-xs text-[#55657F] space-y-2 list-disc pl-5">
              <li>
                <strong>Students:</strong> Understand your true starting cash flow post-graduation so loan EMIs don't force you into panic career choices.
              </li>
              <li>
                <strong>Parents & Co-Applicants:</strong> Protect retirement savings by stress testing what happens if job joining is postponed.
              </li>
              <li>
                <strong>Family Decision Council:</strong> Generate a clear 1-page financial summary to review together before signing agreements.
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-[#15233F] flex items-center gap-2">
              <span>🏛️</span>
              <span>Institutional Partners: Colleges & Counsellors</span>
            </h3>
            <ul className="text-xs text-[#55657F] space-y-2 list-disc pl-5">
              <li>
                <strong>Colleges & Universities:</strong> Promote financial literacy during admissions and lower student dropouts caused by debt shocks.
              </li>
              <li>
                <strong>Study-Abroad Counsellors:</strong> Model foreign currency risk (USD/INR) so families are prepared for exchange rate shifts.
              </li>
              <li>
                <strong>Responsible Lenders:</strong> Foster lower default rates and higher customer trust by lending within calculated safe limits.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
