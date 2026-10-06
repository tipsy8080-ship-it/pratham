import React from 'react';
import { BrandLogo } from './BrandLogo';

export type ActiveTab =
  | 'landing'
  | 'planner'
  | 'stress'
  | 'whatif'
  | 'results'
  | 'institutions'
  | 'business'
  | 'methodology'
  | 'demo';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onStartPlanning: () => void;
  onLaunchDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onStartPlanning,
  onLaunchDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Zone with Logo */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <BrandLogo size={36} />
          <span className="text-base sm:text-lg font-bold tracking-tight text-[#15233F] whitespace-nowrap">
            Education Loan Planner
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#55657F]">
          <button
            onClick={() => setActiveTab('planner')}
            className={`transition-colors hover:text-[#15233F] pb-0.5 whitespace-nowrap ${
              activeTab === 'planner'
                ? 'text-[#2547D0] font-semibold border-b-2 border-[#2547D0]'
                : ''
            }`}
          >
            Loan Planner
          </button>
          <button
            onClick={() => setActiveTab('stress')}
            className={`transition-colors hover:text-[#15233F] pb-0.5 whitespace-nowrap ${
              activeTab === 'stress'
                ? 'text-[#2547D0] font-semibold border-b-2 border-[#2547D0]'
                : ''
            }`}
          >
            Stress Testing
          </button>
          <button
            onClick={() => setActiveTab('whatif')}
            className={`transition-colors hover:text-[#15233F] pb-0.5 whitespace-nowrap ${
              activeTab === 'whatif'
                ? 'text-[#2547D0] font-semibold border-b-2 border-[#2547D0]'
                : ''
            }`}
          >
            What-If Simulator
          </button>
          <button
            onClick={() => setActiveTab('institutions')}
            className={`transition-colors hover:text-[#15233F] pb-0.5 whitespace-nowrap ${
              activeTab === 'institutions'
                ? 'text-[#2547D0] font-semibold border-b-2 border-[#2547D0]'
                : ''
            }`}
          >
            Institutions
          </button>
          <button
            onClick={() => setActiveTab('methodology')}
            className={`transition-colors hover:text-[#15233F] pb-0.5 whitespace-nowrap ${
              activeTab === 'methodology'
                ? 'text-[#2547D0] font-semibold border-b-2 border-[#2547D0]'
                : ''
            }`}
          >
            Methodology
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onLaunchDemo}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#15233F] bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200 whitespace-nowrap"
            title="Launch 7-step presentation demo mode"
          >
            Try ₹15L Demo
          </button>
          <button
            onClick={onStartPlanning}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2547D0] hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            Start Planning
          </button>
        </div>
      </div>
    </header>
  );
};
