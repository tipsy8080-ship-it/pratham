import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LoanInputState } from './types';
import { runLoanCalculations } from './calculations/engine';
import { INITIAL_DEMO_STATE, STORAGE_KEY } from './data/defaultState';
import { Header, ActiveTab } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { StickyLiveSummary } from './components/StickyLiveSummary';
import { Step1LoanDetails } from './components/planner/Step1LoanDetails';
import { Step2EducationCost } from './components/planner/Step2EducationCost';
import { Step3Disbursements } from './components/planner/Step3Disbursements';
import { Step4Moratorium } from './components/planner/Step4Moratorium';
import { Step5FeesSubsidies } from './components/planner/Step5FeesSubsidies';
import { Step6IncomeScenarios } from './components/planner/Step6IncomeScenarios';
import { Step7Affordability } from './components/planner/Step7Affordability';
import { StressTestingView } from './components/StressTestingView';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ResultsDashboard } from './components/ResultsDashboard';
import { PresentationDemo } from './components/PresentationDemo';
import { InstitutionDashboard } from './components/InstitutionDashboard';
import { BusinessModelView } from './components/BusinessModelView';
import { MethodologyView } from './components/MethodologyView';
import { FamilyReportModal } from './components/FamilyReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [plannerStep, setPlannerStep] = useState<number>(1);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize input state from localStorage or demo defaults
  const [input, setInput] = useState<LoanInputState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback on parse error
    }
    return INITIAL_DEMO_STATE;
  });

  // Calculate master outputs dynamically
  const results = runLoanCalculations(input);

  const updateInput = (updates: Partial<LoanInputState>) => {
    setInput((prev) => ({ ...prev, ...updates }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSavePlan = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
      showToast('Plan saved locally in your browser!');
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } catch {
      showToast('Error saving plan.');
    }
  };

  const handleResetPlan = () => {
    if (window.confirm('Reset all planner inputs to standard ₹15L default example?')) {
      setInput(INITIAL_DEMO_STATE);
      localStorage.removeItem(STORAGE_KEY);
      setPlannerStep(1);
      showToast('Plan reset to default.');
    }
  };

  const handleStartPlanning = () => {
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchDemo = () => {
    setActiveTab('demo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyDemoToPlanner = (demoState: LoanInputState) => {
    setInput(demoState);
    setActiveTab('results');
    showToast('Demo scenario loaded into your planner!');
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
  };

  const stepLabels = [
    '1. Loan',
    '2. Cost',
    '3. Disbursement',
    '4. Moratorium',
    '5. Fees',
    '6. Income',
    '7. Affordability',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F5F9] text-[#15233F]">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartPlanning={handleStartPlanning}
        onLaunchDemo={handleLaunchDemo}
      />

      {/* Floating Save/Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#15233F] text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPage
            onStartPlanning={handleStartPlanning}
            onTryDemo={handleLaunchDemo}
            onExploreFeatures={(tab) => setActiveTab(tab as any)}
          />
        )}

        {activeTab === 'demo' && (
          <PresentationDemo
            onExitDemo={() => setActiveTab('planner')}
            onApplyDemoToPlanner={handleApplyDemoToPlanner}
          />
        )}

        {activeTab === 'planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Planner Left Form Canvas (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Progress Steps Header */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-xs">
                  <span className="font-bold text-[#15233F]">
                    Planner Step {plannerStep} of 7: {stepLabels[plannerStep - 1]}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSavePlan}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#15233F] bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      Save Plan
                    </button>
                    <button
                      onClick={handleResetPlan}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#55657F] hover:text-rose-700 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Step indicator bar */}
                <div className="grid grid-cols-7 gap-1">
                  {stepLabels.map((label, idx) => {
                    const stepNum = idx + 1;
                    const isDone = plannerStep > stepNum;
                    const isCurrent = plannerStep === stepNum;
                    return (
                      <button
                        key={stepNum}
                        onClick={() => setPlannerStep(stepNum)}
                        className={`py-1.5 px-0.5 rounded-sm text-[10px] font-bold text-center truncate transition-all ${
                          isCurrent
                            ? 'bg-[#2547D0] text-white shadow-2xs'
                            : isDone
                            ? 'bg-blue-100 text-[#2547D0] hover:bg-blue-200'
                            : 'bg-slate-100 text-[#55657F] hover:bg-slate-200'
                        }`}
                        title={label}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Form View */}
              {plannerStep === 1 && <Step1LoanDetails input={input} updateInput={updateInput} />}
              {plannerStep === 2 && <Step2EducationCost input={input} updateInput={updateInput} />}
              {plannerStep === 3 && <Step3Disbursements input={input} updateInput={updateInput} />}
              {plannerStep === 4 && (
                <Step4Moratorium input={input} results={results} updateInput={updateInput} />
              )}
              {plannerStep === 5 && (
                <Step5FeesSubsidies input={input} results={results} updateInput={updateInput} />
              )}
              {plannerStep === 6 && (
                <Step6IncomeScenarios input={input} results={results} updateInput={updateInput} />
              )}
              {plannerStep === 7 && (
                <Step7Affordability
                  input={input}
                  results={results}
                  updateInput={updateInput}
                  onGoToResults={() => {
                    setActiveTab('results');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {/* Step Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPlannerStep((prev) => Math.max(1, prev - 1))}
                  disabled={plannerStep === 1}
                  className="px-4 py-2 text-xs font-semibold text-[#15233F] bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
                >
                  ← Back
                </button>

                <span className="text-xs text-[#55657F]">
                  Step {plannerStep} of 7
                </span>

                {plannerStep < 7 ? (
                  <button
                    type="button"
                    onClick={() => setPlannerStep((prev) => Math.min(7, prev + 1))}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#2547D0] hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('results');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
                  >
                    View Final Dashboard →
                  </button>
                )}
              </div>
            </div>

            {/* Sticky Live Summary (4 Cols) */}
            <div className="lg:col-span-4 sticky top-20 space-y-4">
              <StickyLiveSummary
                input={input}
                results={results}
                onViewFullResults={() => {
                  setActiveTab('results');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onRunStressTest={() => {
                  setActiveTab('stress');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'stress' && (
          <StressTestingView
            input={input}
            results={results}
            onModifyPlan={() => setActiveTab('planner')}
          />
        )}

        {activeTab === 'whatif' && (
          <WhatIfSimulator
            input={input}
            results={results}
            onApplyToRealPlan={(modified) => {
              setInput(modified);
              showToast('Changes applied to your real plan!');
              setActiveTab('results');
            }}
          />
        )}

        {activeTab === 'results' && (
          <ResultsDashboard
            input={input}
            results={results}
            onModifyPlan={() => setActiveTab('planner')}
            onRunStressTest={() => setActiveTab('stress')}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}

        {activeTab === 'institutions' && <InstitutionDashboard />}

        {activeTab === 'business' && <BusinessModelView />}

        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Family Report Modal */}
      <FamilyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        input={input}
        results={results}
      />

      {/* Footer */}
      <Footer onNavigate={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
