import { LoanInputState } from '../types';

export const INITIAL_DEMO_STATE: LoanInputState = {
  loanAmount: 1500000, // ₹15 Lakhs
  interestRate: 10.0, // 10% annual
  tenureYears: 10, // 10 years
  courseDurationYears: 2, // 2 years
  gracePeriodYears: 1, // 1 year grace (3 years total moratorium)
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
    {
      id: 'd-1',
      yearNumber: 1,
      monthOffset: 0,
      amount: 750000,
      description: 'Year 1 Admission & Tuition Fee',
    },
    {
      id: 'd-2',
      yearNumber: 2,
      monthOffset: 12,
      amount: 750000,
      description: 'Year 2 Tuition & Campus Living',
    },
  ],

  // Default: start with 'accrue' so the user/presenter can reveal the moratorium impact
  moratoriumOption: 'accrue',
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
  jobStartDelayMonths: 0,
  estimatedLivingExpenses: 30000,
  existingFamilyBuffer: 200000,

  studentName: 'Aarav Sharma',
  courseName: 'MBA / Post-Graduate Program',
  institutionName: 'Top Management Institute, India',
};

export const STORAGE_KEY = 'education_loan_planner_state_v1';
