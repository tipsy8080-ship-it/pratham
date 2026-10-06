import React from 'react';

export const BusinessModelView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#15233F]">Business Model & Trust Architecture</h2>
        <p className="text-sm text-[#55657F]">
          Sustainable financial technology designed around consumer alignment, fiduciary independence, and borrower protection.
        </p>
      </div>

      {/* 3 Core Revenue Streams Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stream 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2547D0] flex items-center justify-center font-bold text-lg">
            🏢
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
              Revenue Stream 1
            </span>
            <h3 className="text-lg font-bold text-[#15233F]">Institution Licences</h3>
          </div>
          <div className="text-2xl font-black text-[#2547D0] tabular-nums">
            ₹50,000 <span className="text-xs font-semibold text-[#55657F]">/ year / campus</span>
          </div>
          <p className="text-xs text-[#55657F] leading-relaxed">
            Annual software subscription for colleges, coaching institutes, and study-abroad counsellors. Equips campus career counseling offices to provide verified debt feasibility reports to prospective students.
          </p>
        </div>

        {/* Stream 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
            📄
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
              Revenue Stream 2
            </span>
            <h3 className="text-lg font-bold text-[#15233F]">Family Reports</h3>
          </div>
          <div className="text-2xl font-black text-[#15233F] tabular-nums">
            ₹399 <span className="text-xs font-semibold text-[#55657F]">/ comprehensive plan</span>
          </div>
          <p className="text-xs text-[#55657F] leading-relaxed">
            The core web planner is <strong>100% free</strong> for all students. Families pay ₹399 for an unbranded, downloadable, audit-ready 1-page financial advisory dossier with bank negotiation checklist.
          </p>
        </div>

        {/* Stream 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
            🤝
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
              Revenue Stream 3
            </span>
            <h3 className="text-lg font-bold text-[#15233F]">Lender Referral Fee</h3>
          </div>
          <div className="text-2xl font-black text-emerald-700 tabular-nums">
            ~0.5% <span className="text-xs font-semibold text-[#55657F]">of disbursed principal</span>
          </div>
          <p className="text-xs text-[#55657F] leading-relaxed">
            Disbursal success fee received from RBI-regulated banking partners when a borrower chooses to apply. Always fully disclosed to the applicant in compliance with digital lending norms.
          </p>
        </div>
      </div>

      {/* Cardinal Rule of Trust */}
      <div className="bg-gradient-to-r from-[#15233F] to-[#2547D0] text-white rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-300">
          <span className="text-lg">⚖️</span>
          <span className="text-xs font-bold uppercase tracking-wider">Our Non-Negotiable Fiduciary Principle</span>
        </div>
        <h3 className="text-xl font-bold">
          Lender options are ranked strictly by TOTAL COST TO THE BORROWER. Never by commission.
        </h3>
        <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
          Most loan portals promote whichever bank offers the highest affiliate bounty. We reject this conflict of interest. On our platform, a 0.25% cheaper public sector loan (e.g. SBI Scholar) will always rank ahead of a high-commission NBFC product. Trust is our primary product differentiator.
        </p>
        <div className="pt-2 text-xs font-semibold text-amber-300">
          ✓ Referral fees do not determine lender ranking or algorithmic scoring.
        </div>
      </div>

      {/* How We Protect Borrowers */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#15233F]">How We Protect Borrowers & Comply with Regulations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#55657F]">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-[#15233F]">1. RBI Digital Lending Directives</h4>
            <p>
              We operate exclusively with RBI-regulated Scheduled Commercial Banks and NBFCs. Upfront Key Fact Statements (KFS), Annual Percentage Rates (APR), and all ancillary fees must be explicitly communicated.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-[#15233F]">2. DPDP Act & Privacy Consent</h4>
            <p>
              Under India's Digital Personal Data Protection (DPDP) Act, no applicant data is shared with third-party telemarketers. All prototype calculations run locally in the client browser with zero login friction.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-[#15233F]">3. Transparent Fiduciary Estimates</h4>
            <p>
              Outputs are clearly marked as computational estimates, not guaranteed bank sanctions or certified financial advisory. We prompt every family to verify terms directly with lenders before signing.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-[#15233F]">4. Government Scheme Neutrality</h4>
            <p>
              We objectively highlight official subvention programs (CSIS, Padho Pardesh, Dr. Ambedkar scheme) so low-income households don't miss out on statutory interest waivers they are entitled to by law.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Phase Roadmap */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#15233F]">Product Evolution & Pilot Roadmap</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2547D0] text-[11px] uppercase tracking-wider">Phase 1</span>
              <span className="text-[10px] bg-blue-200 text-[#2547D0] font-bold px-1.5 py-0.5 rounded-xs">Current</span>
            </div>
            <h4 className="font-bold text-[#15233F] text-sm">Engine & Decision UX</h4>
            <ul className="space-y-1 text-[#55657F] list-disc pl-4 text-[11px]">
              <li>Build mathematical amortization engine</li>
              <li>Collect Indian public & private loan terms</li>
              <li>Interview borrowers, parents, and bank officers</li>
              <li>Calibrate with publicly available salary bands</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Phase 2</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded-xs">Next 6 Months</span>
            </div>
            <h4 className="font-bold text-[#15233F] text-sm">Pilot & Verification</h4>
            <ul className="space-y-1 text-[#55657F] list-disc pl-4 text-[11px]">
              <li>Launch web app with family PDF reports</li>
              <li>Pilot cohort testing with 5 MBA colleges & study-abroad consultants</li>
              <li>Measure if borrowers downscale excessive debt before borrowing</li>
              <li>Add regional language localizations (Hindi, Tamil, Marathi)</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Phase 3</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded-xs">Scale</span>
            </div>
            <h4 className="font-bold text-[#15233F] text-sm">Fintech Ecosystem</h4>
            <ul className="space-y-1 text-[#55657F] list-disc pl-4 text-[11px]">
              <li>Direct API integration with Vidya Lakshmi portal</li>
              <li>Consented bank introductions via Account Aggregator</li>
              <li>Enterprise college admissions dashboard</li>
              <li>Post-graduation refinancing & prepay optimization module</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
