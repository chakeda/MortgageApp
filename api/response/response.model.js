'use strict';

import mongoose from 'mongoose';

var ResponseSchema = new mongoose.Schema({
    createdAt: Date,
    initialEmail: String,
    initialPhone: String,
    
    realtorAppName: String,
    
    name: String,
    existsOtherPerson: String,
    howManyOthers: String,
    ownedHomeBefore: String,
    shortSaleOrForeClosure: String,
    foreClosureYearsAgo: String,
    proceed: String,
    deadend: String,
    shortSaleYearsAgo: String,
    proceed2: String,
    deadend2: String,
    neitherShortOrForeClosureOverThreeYearsAgo: String,
    haveBankruptcy: String,
    bankruptcyType: String,
    dischargeYears: String,
    proceed3: String,
    deadend3: String,
    incomeSource: String,
    timeAtJobMoreThanTwoYears: String,
    timeAtJobMonths: String,
    previousEmployerPaidHow: String,
    previousEmployerGrossPaycheck: String,
    paidHow: String,
    twoWeekPaycheck: Number,
    weekPaycheck: Number,
    monthPaycheck: Number,
    
    /*
    havePartTimeJob: String,
    partTimeJobMoreThan2Years: String,
    partTimeJobPaidHow: String,
    partTimeJobGrossPaycheck: String,
    */
    otherIncomeSources: String,
    otherIncomeSourceName: String,
    otherIncomeSourceMonthlyAmount: Number,
    hasCashAssets: String,
    cashAssetValue: String,
    hasPropertyAssets: String,
    stillOwnPropertyAssets: String,
    propertyAssetMonthlyPayment: String,
    propertyAssetYearsOfPayments: String,
    /*
    hasRetirementAssets: String,
    retirementAssetsValue: String,
    */
    monthlyRent: Number,
    /*
    monthlyCreditCard: String,
    hasCarPayment: String,
    monthlyCar: String,
    */
    hasStudentLoans: String,
    totalStudentLoan: String,
    deferredTime: String,
    hasOtherMonthlyPayments: String,
    creditScore: String,
    /*
    coApplicantReady: String,
    coApplicantFirstName: String,
    coApplicantEmail: String,
    phoneNumberFutureContact: String,
    phoneNumber: String,
    otherCoApplicantsReady: String,
    firstCoApplicantFirstName: String,
    firstCoApplicantEmail: String,
    secondCoApplicantFirstName: String,
    secondCoApplicantEmail: String,
    phoneNumberFutureContact2: String,
    */
    disabilityIncomeAmount: Number,
    deadEnd2: String,
    deadEnd3: String,
    deadEnd4: String,
    hasDisabilityIncome: String,
    hasSocialSecurity: String,
    otherMonthlyPaymentsAmount: Number,
    otherMonthlyPaymentsName: String,
    totalIncome: Number,
    
    nonHousingDebt: Number,
    yourMortgage: Number,
    totalMonthlyDebt: Number,
    maxHousingExpense: Number,
    hasGiftAssets: String,
    giftAssetValue: Number,
    totalAssets: Number,
    

    comments: String,
    principleAndInterestPayment: Number,
    theMortgage: Number,
    prospectiveHomeValue: Number
    
});

export default mongoose.model('Response', ResponseSchema);
