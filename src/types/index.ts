export type CountryMode = 'india' | 'abroad';

export type MoratoriumOption = 'accrue' | 'service_full' | 'service_partial';

export type AffordabilityStatus = 'COMFORTABLE' | 'BORDERLINE' | 'STRETCHED' | 'HIGH RISK';

export interface Disbursement {
  id: string;
  yearNumber: number;
  monthOffset: number; // Month from start
  amount: number;
  description: string;
}

export interface EducationCostItems {
  tuition: number;
  hostel: number;
  living: number;
  books: number;
  travel: number;
  insurance: number;
  applicationFees: number;
  other: number;
  // Offsets:
  scholarship: number;
  familyContribution: number;
  existingSavings: number;
}

export interface AbroadDetails {
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  exchangeRate: number; // e.g. 86.5
  stressExchangeRate: number; // e.g. 92.0
  tuitionFX: number;
  livingFX: number;
}

export interface LoanInputState {
  // Core loan
  loanAmount: number; // in INR
  interestRate: number; // annual percentage e.g. 10.0
  tenureYears: number; // e.g. 10
  courseDurationYears: number; // e.g. 2
  gracePeriodYears: number; // e.g. 1
  country: CountryMode;

  // Study Abroad FX
  abroad: AbroadDetails;

  // Education cost breakdown
  educationCosts: EducationCostItems;

  // Disbursements
  disbursements: Disbursement[];

  // Moratorium strategy
  moratoriumOption: MoratoriumOption;
  customMoratoriumPayment: number; // INR/month if service_partial

  // Fees & Subsidies
  processingFeePercent: number; // e.g. 1%
  processingFeeFlat: number; // e.g. 10000
  insuranceFee: number; // e.g. 15000
  otherFees: number; // e.g. 5000
  hasSubsidy: boolean;
  subsidyPercent: number; // e.g. 3% interest subvention or Central Sector Interest Subsidy (CSIS)
  subsidyPeriodYears: number; // e.g. 3 years during moratorium

  // Income & Affordability
  expectedStartingSalary: number; // Monthly INR e.g. 60,000
  annualSalaryGrowth: number; // % e.g. 8%
  downsideSalaryMonthly: number; // e.g. 45,000
  upsideSalaryMonthly: number; // e.g. 75,000
  jobStartDelayMonths: number; // 0, 3, 6, 12
  estimatedLivingExpenses: number; // Monthly essential expenses e.g. 30,000
  existingFamilyBuffer: number; // e.g. 2,00,000 family emergency fund

  // Metadata
  studentName?: string;
  courseName?: string;
  institutionName?: string;
}

export interface CalculationResults {
  // Principal breakdown
  basePrincipal: number;
  accumulatedMoratoriumInterest: number;
  servicedMoratoriumInterest: number;
  capitalizedPrincipalAtRepayment: number;
  
  // Repayment metrics
  monthlyEMI: number;
  baseEMIWithoutMoratorium: number; // what standard EMI on original P would be
  emiWithFullStudyInterestPaid: number;
  totalRepaymentMonths: number;
  totalInterestRepaymentPeriod: number;
  totalInterestOverall: number;
  totalRepaidOverall: number;
  upfrontFeesTotal: number;
  subsidyTotalBenefit: number;

  // Savings comparison
  savingsByServicingMoratorium: number;

  // Affordability metrics
  emiToIncomeRatio: number; // decimal e.g. 0.33
  downsideEmiToIncomeRatio: number;
  monthlyRemainingBuffer: number;
  downsideMonthlyBuffer: number;
  affordabilityStatus: AffordabilityStatus;
  downsideAffordabilityStatus: AffordabilityStatus;
  jobDelayDeficit: number; // EMI * delayMonths
  monthsOfBufferCovered: number;

  // Safe Borrowing Range
  safeBorrowingMin: number;
  safeBorrowingMax: number;
  recommendedMaxEMI: number;

  // Funding comparison
  totalEducationCost: number;
  familyFundingAvailable: number;
  netFundingRequirement: number;
  isBorrowingExcess: boolean;
  excessBorrowingAmount: number;

  // Plain-English Assessment
  familyDecisionSummary: string;
}

export interface StressScenarioResult {
  id: string;
  title: string;
  description: string;
  type: 'delay' | 'salary' | 'rate' | 'cost' | 'tenure' | 'fx';
  baseEMI: number;
  stressedEMI: number;
  baseBuffer: number;
  stressedBuffer: number;
  baseStatus: AffordabilityStatus;
  stressedStatus: AffordabilityStatus;
  keyObservation: string;
}

export interface WhatIfChange {
  id: string;
  label: string;
  description: string;
  applied: boolean;
}
