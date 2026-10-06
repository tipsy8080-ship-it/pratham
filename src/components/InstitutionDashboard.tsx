import React, { useState } from 'react';
import { formatINR, formatINRLakhs } from '../utils/formatters';

export const InstitutionDashboard: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'high_risk' | 'comfortable'>('all');

  const cohortData = [
    { id: 'STU-001', name: 'Rohan Mehra', course: 'MBA in Finance', loan: 1800000, emi: 23800, salary: 55000, status: 'BORDERLINE', risk: 'Medium' },
    { id: 'STU-002', name: 'Priya Iyer', course: 'MS in Computer Science (USA)', loan: 4200000, emi: 54600, salary: 140000, status: 'COMFORTABLE', risk: 'Low' },
    { id: 'STU-003', name: 'Kavita Nair', course: 'Post-Graduate Diploma', loan: 1200000, emi: 15800, salary: 32000, status: 'STRETCHED', risk: 'High' },
    { id: 'STU-004', name: 'Aditya Verma', course: 'B.Tech Dual Degree', loan: 1500000, emi: 19800, salary: 28000, status: 'HIGH RISK', risk: 'Critical' },
    { id: 'STU-005', name: 'Sneha Patel', course: 'M.Tech AI & Data', loan: 1000000, emi: 13200, salary: 65000, status: 'COMFORTABLE', risk: 'Low' },
    { id: 'STU-006', name: 'Vikram Joshi', course: 'MBA Global Business', loan: 2400000, emi: 31800, salary: 60000, status: 'STRETCHED', risk: 'High' },
  ];

  const filtered = cohortData.filter((s) => {
    if (filter === 'high_risk') return s.status === 'HIGH RISK' || s.status === 'STRETCHED';
    if (filter === 'comfortable') return s.status === 'COMFORTABLE';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMFORTABLE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'BORDERLINE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'STRETCHED':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-sm bg-blue-100 text-[#2547D0] text-[10px] font-bold uppercase tracking-wider">
              B2B Institutional Console (Prototype)
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#15233F] mt-1">
            Colleges & Counsellor Cohort Analytics
          </h2>
          <p className="text-sm text-[#55657F]">
            Empowering admissions offices and study-abroad counsellors with student debt sustainability data.
          </p>
        </div>

        <button
          onClick={() => alert('Cohort summary report exported to CSV.')}
          className="px-3.5 py-2 text-xs font-semibold text-[#15233F] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          Export Cohort CSV
        </button>
      </div>

      {/* Cohort KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Students Assessed
          </span>
          <div className="text-xl font-bold text-[#15233F] tabular-nums mt-1">142</div>
          <span className="text-[10px] text-emerald-700 font-semibold">+24 this admission cycle</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Avg. Loan Requested
          </span>
          <div className="text-xl font-bold text-[#15233F] tabular-nums mt-1">₹18.4L</div>
          <span className="text-[10px] text-slate-500">Across 6 disciplines</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Average Monthly EMI
          </span>
          <div className="text-xl font-bold text-[#2547D0] tabular-nums mt-1">₹24,200</div>
          <span className="text-[10px] text-slate-500">Post-moratorium</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Average EMI/Income
          </span>
          <div className="text-xl font-bold text-[#15233F] tabular-nums mt-1">38.4%</div>
          <span className="text-[10px] text-amber-700 font-semibold">Borderline cohort zone</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            High-Risk Cases
          </span>
          <div className="text-xl font-bold text-rose-600 tabular-nums mt-1">18</div>
          <span className="text-[10px] text-rose-700 font-semibold">Flagged for counseling</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#55657F] block">
            Reports Generated
          </span>
          <div className="text-xl font-bold text-[#15233F] tabular-nums mt-1">129</div>
          <span className="text-[10px] text-slate-500">Family PDF packs</span>
        </div>
      </div>

      {/* Cohort Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#15233F]">Student Risk Roster</h3>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                filter === 'all' ? 'bg-white text-[#15233F] shadow-xs' : 'text-[#55657F] hover:text-[#15233F]'
              }`}
            >
              All Students ({cohortData.length})
            </button>
            <button
              onClick={() => setFilter('high_risk')}
              className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                filter === 'high_risk' ? 'bg-white text-[#15233F] shadow-xs' : 'text-[#55657F] hover:text-[#15233F]'
              }`}
            >
              High Risk / Stretched (3)
            </button>
            <button
              onClick={() => setFilter('comfortable')}
              className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                filter === 'comfortable' ? 'bg-white text-[#15233F] shadow-xs' : 'text-[#55657F] hover:text-[#15233F]'
              }`}
            >
              Comfortable (2)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] font-bold uppercase text-[#55657F] bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Student & Course</th>
                <th className="py-2.5 px-3 text-right">Loan Amount</th>
                <th className="py-2.5 px-3 text-right">Monthly EMI</th>
                <th className="py-2.5 px-3 text-right">Exp. Starting Salary</th>
                <th className="py-2.5 px-3 text-center">Affordability Status</th>
                <th className="py-2.5 px-3 text-center">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#15233F]">{s.name}</div>
                    <div className="text-[11px] text-[#55657F]">{s.course}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#15233F] tabular-nums">
                    {formatINRLakhs(s.loan)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#2547D0] tabular-nums">
                    {formatINR(s.emi)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#15233F] tabular-nums">
                    {formatINR(s.salary)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold border ${getStatusBadge(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => alert(`Reviewing plan for ${s.name}`)}
                      className="text-xs text-[#2547D0] hover:underline font-semibold"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
