import {
  LoanInputState,
  CalculationResults,
  StressScenarioResult,
  AffordabilityStatus,
  Disbursement,
} from '../types';

/**
 * Standard Monthly Rate
 */
export function calculateMonthlyRate(annualRatePercentage: number): number {
  if (annualRatePercentage <= 0) return 0;
  return annualRatePercentage / 12 / 100;
}

/**
 * Standard Amortizing EMI Formula
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(principal: number, annualRatePercentage: number, tenureYears: number): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const n = Math.round(tenureYears * 12);
  const r = calculateMonthlyRate(annualRatePercentage);
  
  if (r === 0) {
    return principal / n;
  }
  
  const factor = Math.pow(1 + r, n);
  const emi = (principal * r * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Calculate Accumulated Study & Moratorium Interest
 * Based on staggered disbursements and timing of release
 */
export function calculateDisbursementAndMoratoriumInterest(
  loanAmount: number,
  disbursements: Disbursement[],
  annualRatePercentage: number,
  courseDurationYears: number,
  gracePeriodYears: number,
  subsidyPercent = 0
): {
  accumulatedInterest: number;
  effectivePrincipalDisbursed: number;
  monthlySimpleInterestEstimate: number;
} {
  const effectiveRate = Math.max(0, annualRatePercentage - subsidyPercent);
  const totalMoratoriumMonths = Math.round((courseDurationYears + gracePeriodYears) * 12);
  const monthlyRate = effectiveRate / 12 / 100;

  // If user has provided custom disbursements that sum to roughly the loan amount
  const totalDisbursedConfig = disbursements.reduce((acc, d) => acc + d.amount, 0);
  
  let totalInterest = 0;
  const hasValidDisbursements = disbursements.length > 0 && Math.abs(totalDisbursedConfig - loanAmount) < 1000;

  if (hasValidDisbursements) {
    disbursements.forEach((d) => {
      // Months this specific tranche earns interest before repayment starts
      const monthsActive = Math.max(0, totalMoratoriumMonths - d.monthOffset);
      const interestForTranche = d.amount * monthlyRate * monthsActive;
      totalInterest += interestForTranche;
    });
  } else {
    // Default model if no explicit tranches: 50% year 1, 50% year 2 or equal distribution across course
    const tranches = Math.max(1, Math.round(courseDurationYears));
    const trancheAmount = loanAmount / tranches;
    for (let i = 0; i < tranches; i++) {
      const monthOffset = i * 12;
      const monthsActive = Math.max(0, totalMoratoriumMonths - monthOffset);
      const interestForTranche = trancheAmount * monthlyRate * monthsActive;
      totalInterest += interestForTranche;
    }
  }

  const roundedInterest = Math.round(totalInterest);
  const monthlyAverage = totalMoratoriumMonths > 0 ? Math.round(roundedInterest / totalMoratoriumMonths) : 0;

  return {
    accumulatedInterest: roundedInterest,
    effectivePrincipalDisbursed: loanAmount,
    monthlySimpleInterestEstimate: monthlyAverage,
  };
}

/**
 * Determine Affordability Status from Ratio & Buffer
 */
export function determineAffordability(
  emiToIncomeRatio: number,
  monthlyBuffer: number,
  monthlyEMI: number
): AffordabilityStatus {
  if (emiToIncomeRatio <= 0.35 && monthlyBuffer >= monthlyEMI * 0.4) {
    return 'COMFORTABLE';
  }
  if (emiToIncomeRatio <= 0.45 && monthlyBuffer > 5000) {
    return 'BORDERLINE';
  }
  if (emiToIncomeRatio <= 0.55 && monthlyBuffer >= 0) {
    return 'STRETCHED';
  }
  return 'HIGH RISK';
}

/**
 * Master Calculation Function
 */
export function runLoanCalculations(input: LoanInputState): CalculationResults {
  const {
    loanAmount,
    interestRate,
    tenureYears,
    courseDurationYears,
    gracePeriodYears,
    disbursements,
    moratoriumOption,
    customMoratoriumPayment,
    processingFeePercent,
    processingFeeFlat,
    insuranceFee,
    otherFees,
    hasSubsidy,
    subsidyPercent,
    expectedStartingSalary,
    downsideSalaryMonthly,
    estimatedLivingExpenses,
    jobStartDelayMonths,
    existingFamilyBuffer,
    educationCosts,
  } = input;

  const totalRepaymentMonths = Math.round(tenureYears * 12);
  const totalMoratoriumMonths = Math.round((courseDurationYears + gracePeriodYears) * 12);

  // 1. Moratorium Interest Calculations
  const activeSubsidy = hasSubsidy ? subsidyPercent : 0;
  const { accumulatedInterest } = calculateDisbursementAndMoratoriumInterest(
    loanAmount,
    disbursements,
    interestRate,
    courseDurationYears,
    gracePeriodYears,
    activeSubsidy
  );

  let servicedMoratoriumInterest = 0;
  let accumulatedMoratoriumInterest = accumulatedInterest;
  let capitalizedPrincipalAtRepayment = loanAmount;

  if (moratoriumOption === 'service_full') {
    servicedMoratoriumInterest = accumulatedInterest;
    accumulatedMoratoriumInterest = 0;
    capitalizedPrincipalAtRepayment = loanAmount;
  } else if (moratoriumOption === 'service_partial') {
    const totalServiced = Math.min(accumulatedInterest, customMoratoriumPayment * totalMoratoriumMonths);
    servicedMoratoriumInterest = Math.round(totalServiced);
    accumulatedMoratoriumInterest = Math.max(0, accumulatedInterest - servicedMoratoriumInterest);
    capitalizedPrincipalAtRepayment = loanAmount + accumulatedMoratoriumInterest;
  } else {
    // 'accrue' - full moratorium interest capitalized
    servicedMoratoriumInterest = 0;
    capitalizedPrincipalAtRepayment = loanAmount + accumulatedMoratoriumInterest;
  }

  // 2. Base EMI without moratorium vs actual EMI
  const baseEMIWithoutMoratorium = calculateEMI(loanAmount, interestRate, tenureYears);
  const emiWithFullStudyInterestPaid = baseEMIWithoutMoratorium;
  const monthlyEMI = calculateEMI(capitalizedPrincipalAtRepayment, interestRate, tenureYears);

  // 3. Total Repayment Breakdown
  const totalInterestRepaymentPeriod = Math.max(0, (monthlyEMI * totalRepaymentMonths) - capitalizedPrincipalAtRepayment);
  const totalInterestOverall = totalInterestRepaymentPeriod + (moratoriumOption === 'service_full' ? servicedMoratoriumInterest : accumulatedMoratoriumInterest);

  const upfrontFeesTotal = Math.round(
    (loanAmount * (processingFeePercent / 100)) + processingFeeFlat + insuranceFee + otherFees
  );

  const totalRepaidOverall = Math.round(
    (monthlyEMI * totalRepaymentMonths) + servicedMoratoriumInterest + upfrontFeesTotal
  );

  // Compare how much you save by servicing full interest during moratorium
  const hypotheticalAccruedEMI = calculateEMI(loanAmount + accumulatedInterest, interestRate, tenureYears);
  const totalCostAccrued = (hypotheticalAccruedEMI * totalRepaymentMonths) + upfrontFeesTotal;
  const totalCostServiced = (baseEMIWithoutMoratorium * totalRepaymentMonths) + accumulatedInterest + upfrontFeesTotal;
  const savingsByServicingMoratorium = Math.max(0, Math.round(totalCostAccrued - totalCostServiced));

  // 4. Affordability Calculations
  const emiToIncomeRatio = expectedStartingSalary > 0 ? monthlyEMI / expectedStartingSalary : 1.0;
  const downsideEmiToIncomeRatio = downsideSalaryMonthly > 0 ? monthlyEMI / downsideSalaryMonthly : 1.0;

  const monthlyRemainingBuffer = Math.round(expectedStartingSalary - estimatedLivingExpenses - monthlyEMI);
  const downsideMonthlyBuffer = Math.round(downsideSalaryMonthly - estimatedLivingExpenses - monthlyEMI);

  const affordabilityStatus = determineAffordability(emiToIncomeRatio, monthlyRemainingBuffer, monthlyEMI);
  const downsideAffordabilityStatus = determineAffordability(
    downsideEmiToIncomeRatio,
    downsideMonthlyBuffer,
    monthlyEMI
  );

  const jobDelayDeficit = Math.round(monthlyEMI * jobStartDelayMonths);
  const monthsOfBufferCovered = monthlyEMI > 0 ? Math.round((existingFamilyBuffer / monthlyEMI) * 10) / 10 : 0;

  // 5. Safe Borrowing Range
  // Safe EMI benchmark = 35% of baseline salary, or net disposable income minus 15% cushion
  const safeEMIBenchmark = Math.max(5000, Math.round(Math.min(
    expectedStartingSalary * 0.35,
    Math.max(1000, expectedStartingSalary - estimatedLivingExpenses - 10000)
  )));
  
  const r = calculateMonthlyRate(interestRate);
  const factor = Math.pow(1 + r, totalRepaymentMonths);
  const safePrincipalBase = r > 0 ? (safeEMIBenchmark * (factor - 1)) / (r * factor) : safeEMIBenchmark * totalRepaymentMonths;

  const safeBorrowingMin = Math.round(Math.max(200000, safePrincipalBase * 0.8 / 50000) * 50000);
  const safeBorrowingMax = Math.round(Math.max(300000, safePrincipalBase * 1.1 / 50000) * 50000);

  // 6. Education Funding Gap Check
  const totalEducationCost =
    educationCosts.tuition +
    educationCosts.hostel +
    educationCosts.living +
    educationCosts.books +
    educationCosts.travel +
    educationCosts.insurance +
    educationCosts.applicationFees +
    educationCosts.other;

  const familyFundingAvailable =
    educationCosts.scholarship +
    educationCosts.familyContribution +
    educationCosts.existingSavings;

  const netFundingRequirement = Math.max(0, totalEducationCost - familyFundingAvailable);
  const isBorrowingExcess = netFundingRequirement > 0 && loanAmount > netFundingRequirement * 1.1;
  const excessBorrowingAmount = Math.max(0, loanAmount - netFundingRequirement);

  // 7. Plain-English Dynamic Family Decision Summary
  const familyDecisionSummary = generateFamilySummary(
    loanAmount,
    monthlyEMI,
    affordabilityStatus,
    downsideAffordabilityStatus,
    monthlyRemainingBuffer,
    jobStartDelayMonths,
    jobDelayDeficit,
    existingFamilyBuffer,
    moratoriumOption,
    savingsByServicingMoratorium
  );

  return {
    basePrincipal: loanAmount,
    accumulatedMoratoriumInterest,
    servicedMoratoriumInterest,
    capitalizedPrincipalAtRepayment,
    monthlyEMI,
    baseEMIWithoutMoratorium,
    emiWithFullStudyInterestPaid,
    totalRepaymentMonths,
    totalInterestRepaymentPeriod: Math.round(totalInterestRepaymentPeriod),
    totalInterestOverall: Math.round(totalInterestOverall),
    totalRepaidOverall,
    upfrontFeesTotal,
    subsidyTotalBenefit: hasSubsidy ? Math.round(loanAmount * (subsidyPercent / 100) * (courseDurationYears + gracePeriodYears)) : 0,
    savingsByServicingMoratorium,
    emiToIncomeRatio,
    downsideEmiToIncomeRatio,
    monthlyRemainingBuffer,
    downsideMonthlyBuffer,
    affordabilityStatus,
    downsideAffordabilityStatus,
    jobDelayDeficit,
    monthsOfBufferCovered,
    safeBorrowingMin,
    safeBorrowingMax,
    recommendedMaxEMI: safeEMIBenchmark,
    totalEducationCost,
    familyFundingAvailable,
    netFundingRequirement,
    isBorrowingExcess,
    excessBorrowingAmount,
    familyDecisionSummary,
  };
}

/**
 * Plain-English Dynamic Assessment Generator
 */
function generateFamilySummary(
  loanAmount: number,
  monthlyEMI: number,
  affordabilityStatus: AffordabilityStatus,
  downsideAffordabilityStatus: AffordabilityStatus,
  monthlyRemainingBuffer: number,
  jobStartDelayMonths: number,
  jobDelayDeficit: number,
  existingFamilyBuffer: number,
  moratoriumOption: string,
  savings: number
): string {
  let assessment = `Based on the financial assumptions entered, your monthly EMI of ₹${monthlyEMI.toLocaleString('en-IN')} appears `;

  if (affordabilityStatus === 'COMFORTABLE') {
    assessment += `comfortably manageable under the expected starting salary, leaving an estimated monthly cash cushion of ₹${monthlyRemainingBuffer.toLocaleString('en-IN')}. `;
  } else if (affordabilityStatus === 'BORDERLINE') {
    assessment += `within reach but tight, with a slim monthly buffer of ₹${monthlyRemainingBuffer.toLocaleString('en-IN')}. `;
  } else if (affordabilityStatus === 'STRETCHED') {
    assessment += `heavily stretched relative to expected starting income and essential living expenses. `;
  } else {
    assessment += `high risk, as the required EMI exceeds safe debt limits and creates a monthly cash-flow deficit. `;
  }

  // Downside impact
  if (downsideAffordabilityStatus !== affordabilityStatus) {
    assessment += `In a downside salary scenario, the loan transitions to ${downsideAffordabilityStatus.toLowerCase()}, signaling sensitivity to starting package variations. `;
  }

  // Job delay vulnerability
  if (jobStartDelayMonths > 0) {
    if (existingFamilyBuffer >= jobDelayDeficit) {
      assessment += `A ${jobStartDelayMonths}-month delay in employment requires ₹${jobDelayDeficit.toLocaleString('en-IN')} in bridging funds, which your reported family reserve can absorb. `;
    } else {
      assessment += `However, a ${jobStartDelayMonths}-month delay requires ₹${jobDelayDeficit.toLocaleString('en-IN')} in loan repayments before salary begins, exceeding your current emergency buffer. `;
    }
  }

  // Moratorium note
  if (moratoriumOption === 'accrue' && savings > 50000) {
    assessment += `Notably, paying interest monthly during study could save your family approximately ₹${(savings / 100000).toFixed(1)} Lakh over the loan tenure.`;
  }

  return assessment;
}

/**
 * 9 Core Stress Test Scenarios
 */
export function runStressTests(input: LoanInputState, baseResults: CalculationResults): StressScenarioResult[] {
  const tests: StressScenarioResult[] = [];

  // 1. 3-Month Job Delay
  const delay3Deficit = baseResults.monthlyEMI * 3;
  tests.push({
    id: 'delay-3',
    title: 'Job starts 3 months late',
    description: 'Moratorium ends but campus placement joining is delayed by 1 quarter.',
    type: 'delay',
    baseEMI: baseResults.monthlyEMI,
    stressedEMI: baseResults.monthlyEMI,
    baseBuffer: baseResults.monthlyRemainingBuffer,
    stressedBuffer: baseResults.monthlyRemainingBuffer,
    baseStatus: baseResults.affordabilityStatus,
    stressedStatus: input.existingFamilyBuffer >= delay3Deficit ? baseResults.affordabilityStatus : 'BORDERLINE',
    keyObservation: `Requires ₹${delay3Deficit.toLocaleString('en-IN')} in family cash buffer to service EMIs before the first paycheck arrives.`,
  });

  // 2. 6-Month Job Delay
  const delay6Deficit = baseResults.monthlyEMI * 6;
  tests.push({
    id: 'delay-6',
    title: 'Job starts 6 months late',
    description: 'Hiring freeze or delayed onboard date leaves 6 months without salary.',
    type: 'delay',
    baseEMI: baseResults.monthlyEMI,
    stressedEMI: baseResults.monthlyEMI,
    baseBuffer: baseResults.monthlyRemainingBuffer,
    stressedBuffer: baseResults.monthlyRemainingBuffer,
    baseStatus: baseResults.affordabilityStatus,
    stressedStatus: input.existingFamilyBuffer >= delay6Deficit ? 'BORDERLINE' : 'STRETCHED',
    keyObservation: `Requires ₹${delay6Deficit.toLocaleString('en-IN')} in liquid reserves. Without family support, loan may default.`,
  });

  // 3. Starting Salary -10%
  const salaryMinus10 = input.expectedStartingSalary * 0.9;
  const ratio10 = baseResults.monthlyEMI / salaryMinus10;
  const buffer10 = Math.round(salaryMinus10 - input.estimatedLivingExpenses - baseResults.monthlyEMI);
  tests.push({
    id: 'salary-10',
    title: 'Starting salary falls 10%',
    description: 'Market adjustment reduces campus offer CTC from expectations.',
    type: 'salary',
    baseEMI: baseResults.monthlyEMI,
    stressedEMI: baseResults.monthlyEMI,
    baseBuffer: baseResults.monthlyRemainingBuffer,
    stressedBuffer: buffer10,
    baseStatus: baseResults.affordabilityStatus,
    stressedStatus: determineAffordability(ratio10, buffer10, baseResults.monthlyEMI),
    keyObservation: `Monthly buffer contracts from ₹${baseResults.monthlyRemainingBuffer.toLocaleString('en-IN')} to ₹${buffer10.toLocaleString('en-IN')}.`,
  });

  // 4. Starting Salary -20%
  const salaryMinus20 = input.expectedStartingSalary * 0.8;
  const ratio20 = baseResults.monthlyEMI / salaryMinus20;
  const buffer20 = Math.round(salaryMinus20 - input.estimatedLivingExpenses - baseResults.monthlyEMI);
  tests.push({
    id: 'salary-20',
    title: 'Starting salary falls 20%',
    description: 'Substantial market downturn or off-campus entry-level package.',
    type: 'salary',
    baseEMI: baseResults.monthlyEMI,
    stressedEMI: baseResults.monthlyEMI,
    baseBuffer: baseResults.monthlyRemainingBuffer,
    stressedBuffer: buffer20,
    baseStatus: baseResults.affordabilityStatus,
    stressedStatus: determineAffordability(ratio20, buffer20, baseResults.monthlyEMI),
    keyObservation: `EMI consumes ${Math.round(ratio20 * 100)}% of gross income, leaving very little flexibility.`,
  });

  // 5. Interest Rate +1.0%
  const ratePlus1 = input.interestRate + 1.0;
  const inputRatePlus1: LoanInputState = { ...input, interestRate: ratePlus1 };
  const resRate1 = runLoanCalculations(inputRatePlus1);
  tests.push({
    id: 'rate-1',
    title: 'Interest rate increases +1.0%',
    description: 'Repo rate hike or floating lending rate spread adjustment.',
    type: 'rate',
    baseEMI: baseResults.monthlyEMI,
    stressedEMI: resRate1.monthlyEMI,
    baseBuffer: baseResults.monthlyRemainingBuffer,
    stressedBuffer: resRate1.monthlyRemainingBuffer,
    baseStatus: baseResults.affordabilityStatus,
    stressedStatus: resRate1.affordabilityStatus,
    keyObservation: `EMI rises by ₹${(resRate1.monthlyEMI - baseResults.monthlyEMI).toLocaleString('en-IN')}/mo; adds ₹${((resRate1.totalRepaidOverall - baseResults.totalRepaidOverall) / 100000).toFixed(1)}L to total repayment.`,
  });

  // 6. Interest Rate +2.0%
  const ratePlus2 = input.interestRate + 2.0;
  const inputRatePlus2: LoanInputState = { ...input, interestRate: ratePlus2 };
  const resRate2 = runLoanCalculations(inputRatePlus2);
  tests.push({
    id: 'rate-2',
    title: 'Interest rate increases +2.0%',
    description: 'Macro-economic rate surge during your 10-year repayment window.',
    type: 'rate',
    baseEMI: baseResults.monthlyEMI,
    stressedEMI: resRate2.monthlyEMI,
    baseBuffer: baseResults.monthlyRemainingBuffer,
    stressedBuffer: resRate2.monthlyRemainingBuffer,
    baseStatus: baseResults.affordabilityStatus,
    stressedStatus: resRate2.affordabilityStatus,
    keyObservation: `EMI jumps by ₹${(resRate2.monthlyEMI - baseResults.monthlyEMI).toLocaleString('en-IN')}/month over 120 payments.`,
  });

  // 7. Education Cost +15%
  const higherLoan = input.loanAmount * 1.15;
  const inputHigherLoan: LoanInputState = { ...input, loanAmount: higherLoan };
  const resHigher = runLoanCalculations(inputHigherLoan);
  tests.push({
    id: 'cost-15',
    title: 'Education cost & loan increases 15%',
    description: 'Hostel rent hike, laptop purchase, exam fees, or inflation.',
    type: 'cost',
    baseEMI: baseResults.monthlyEMI,
    stressedEMI: resHigher.monthlyEMI,
    baseBuffer: baseResults.monthlyRemainingBuffer,
    stressedBuffer: resHigher.monthlyRemainingBuffer,
    baseStatus: baseResults.affordabilityStatus,
    stressedStatus: resHigher.affordabilityStatus,
    keyObservation: `Increases principal by ₹${((higherLoan - input.loanAmount) / 100000).toFixed(1)}L, lifting EMI by ₹${(resHigher.monthlyEMI - baseResults.monthlyEMI).toLocaleString('en-IN')}/mo.`,
  });

  // 8. Tenure shortened to 7 Years (faster payoff)
  const tenureShort = Math.max(3, Math.min(7, input.tenureYears - 3));
  const inputShortTenure: LoanInputState = { ...input, tenureYears: tenureShort };
  const resShortTenure = runLoanCalculations(inputShortTenure);
  tests.push({
    id: 'tenure-short',
    title: `Repayment tenure shortened to ${tenureShort} years`,
    description: 'Accelerated debt paydown test: higher monthly EMI but massive interest savings.',
    type: 'tenure',
    baseEMI: baseResults.monthlyEMI,
    stressedEMI: resShortTenure.monthlyEMI,
    baseBuffer: baseResults.monthlyRemainingBuffer,
    stressedBuffer: resShortTenure.monthlyRemainingBuffer,
    baseStatus: baseResults.affordabilityStatus,
    stressedStatus: resShortTenure.affordabilityStatus,
    keyObservation: `Saves ₹${((baseResults.totalRepaidOverall - resShortTenure.totalRepaidOverall) / 100000).toFixed(1)}L in interest, but lifts monthly EMI by ₹${(resShortTenure.monthlyEMI - baseResults.monthlyEMI).toLocaleString('en-IN')}.`,
  });

  // 9. Study Abroad Currency Depreciation (INR Weakens 6-8%)
  if (input.country === 'abroad') {
    const fxImpact = Math.round(input.loanAmount * (input.abroad.stressExchangeRate / input.abroad.exchangeRate));
    const fxInput: LoanInputState = { ...input, loanAmount: fxImpact };
    const resFX = runLoanCalculations(fxInput);
    tests.push({
      id: 'abroad-fx',
      title: `INR depreciates from ₹${input.abroad.exchangeRate} to ₹${input.abroad.stressExchangeRate}/${input.abroad.currency}`,
      description: 'Foreign exchange volatility inflates tuition and living costs in rupee terms.',
      type: 'fx',
      baseEMI: baseResults.monthlyEMI,
      stressedEMI: resFX.monthlyEMI,
      baseBuffer: baseResults.monthlyRemainingBuffer,
      stressedBuffer: resFX.monthlyRemainingBuffer,
      baseStatus: baseResults.affordabilityStatus,
      stressedStatus: resFX.affordabilityStatus,
      keyObservation: `Requires borrowing ₹${((fxImpact - input.loanAmount) / 100000).toFixed(1)}L extra in INR, adding ₹${(resFX.monthlyEMI - baseResults.monthlyEMI).toLocaleString('en-IN')}/mo.`,
    });
  }

  return tests;
}

/**
 * Generate Amortization Schedule Data for Charts
 */
export function generateAmortizationTrajectory(
  principal: number,
  annualRate: number,
  tenureYears: number,
  monthlyEMI: number
): Array<{ year: number; balance: number; interestPaidCumulative: number; principalPaidCumulative: number }> {
  const trajectory: Array<{ year: number; balance: number; interestPaidCumulative: number; principalPaidCumulative: number }> = [];
  const monthlyRate = calculateMonthlyRate(annualRate);
  let currentBalance = principal;
  let cumInterest = 0;
  let cumPrincipal = 0;

  trajectory.push({
    year: 0,
    balance: Math.round(currentBalance),
    interestPaidCumulative: 0,
    principalPaidCumulative: 0,
  });

  const totalMonths = Math.round(tenureYears * 12);
  for (let m = 1; m <= totalMonths; m++) {
    const interestForMonth = currentBalance * monthlyRate;
    const principalForMonth = Math.min(currentBalance, monthlyEMI - interestForMonth);
    currentBalance = Math.max(0, currentBalance - principalForMonth);
    cumInterest += interestForMonth;
    cumPrincipal += principalForMonth;

    if (m % 12 === 0 || m === totalMonths) {
      trajectory.push({
        year: Math.round(m / 12),
        balance: Math.round(currentBalance),
        interestPaidCumulative: Math.round(cumInterest),
        principalPaidCumulative: Math.round(cumPrincipal),
      });
    }
  }

  return trajectory;
}
