'use strict';

/*****
Authors: 
    Kite Christianson (christiansonk1@email.arizona.edu)
    Christian Blandford (christianblandford@me.com)

Purpose:
    Main Code for Terry Finnegan's (terry.finnegan@gmail.com)
    and Neal Meinke's (nealm682@gmail.com)
    Home Ready Evaluator app (app.uxweb.io)
*****/

/* tslint:disable */

(function() {

class MainController {
    
    $http;
    $scope;
    $window;
    $document;
    $location;
    $anchorScroll;
    $timeout;
    $localStorage; 
    
    inputContents = '';
    messageIndex = 0;
    inputType = 'string';
    disableActions = false;

    maxHousingExpense;
    totalIncome;
    totalAssets;
    nonHousingDebt;

    theMortgage;
    principleAndInterestPayment;

    userEmail = '';
    loggedIn = false;
    userId = '';

    isAdmin;
    isLoanOfficer;
    realtorAppName = '';
    realtors = [];
    realtor = {
        loanOfficerName: ''
    };
    loanOfficers = [];
    loanOfficer = {
        navbarColor: '',
        mobilePhone: '',
        name: '',
        email: ''
    };
    loanOfficerStyles;
    messages = [];
    
    // this.vars declared after constructor
    userDataStorm = {
        account: {
            customData: {
                loanOfficerName: '',
                ADMIN: ''
            }
        }
    };
    
    texts = [];
    
    estimatedPropertyTax;
    estimatedInsurance;
    estimatedMortgageInsurance;
    
    userName;
    
    

  constructor($http, $scope, $window, $document, $location, $anchorScroll, $timeout, $localStorage) {
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.$document = $document;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.$localStorage = $localStorage; 
    
    this.inputContents = '';
    this.messageIndex = 0;
    this.inputType = 'string';
    this.disableActions = false;
    
    this.maxHousingExpense = 0;
    this.totalIncome = 0;
    this.totalAssets = 0;
    this.nonHousingDebt = 0;
    
    this.theMortgage = 0;
    this.principleAndInterestPayment = 0;
    
    this.userEmail = '';
    this.loggedIn = false;
    this.userId = '';
    
    this.isAdmin = false;
    this.isLoanOfficer;
    this.realtorAppName = '';
    this.realtors = [];
    this.realtor = {
        loanOfficerName: ''
    };
    this.loanOfficers = [];
    this.loanOfficer = {
        navbarColor: '',
        mobilePhone: '',
        name: '',
        email: ''
    };
    
    /***
    Initial Logic
    ***/
    
    // admin and loan officer auth logic
    this.$http.get('/me').then((response)=> { 
        this.userDataStorm = response.data;
        this.isAdmin = this.userDataStorm.account.customData.ADMIN;
        if (typeof this.isAdmin === 'undefined') {
            this.isAdmin = false;
        } else { 
            this.isAdmin = true;
        }
        
        this.isLoanOfficer = this.userDataStorm.account.customData.loanOfficerName;
        if (typeof this.isLoanOfficer === 'undefined') {
            this.isLoanOfficer = false;
        } else { 
            this.isLoanOfficer = true;
        }
    });
    
    // realtor setter logic -> message initialization -> user auth
    this.realtorAppName = this.$localStorage.realtorAppName;
    this.$http.get('api/realtors').then((response)=> {
        this.realtors = response.data;
        if (!this.realtorAppName) {
            // Kite will always be default. 
            this.realtorAppName = 'kitechristianson';
        }
        for (var i=0; i<this.realtors.length; i++) {
            if (this.realtorAppName === this.realtors[i].realtorAppName) {
                this.realtor = this.realtors[i]; // we got our realtor.
                console.log(this.realtor);
            }
        }
        
        // Got the realtor?
        // Now we have to get the realtor's loan officer to fillout the data
        this.$http.get('api/loanOfficers').then((response)=> {
            this.loanOfficers = response.data;
        
            for (var i=0; i<this.loanOfficers.length; i++) {
                if (this.realtor.loanOfficerName === this.loanOfficers[i].loanOfficerName) {
                    this.loanOfficer = this.loanOfficers[i]; // we got our loan officer.
                    console.log(this.loanOfficer);
                }
            }
            
            this.loanOfficerStyles = {'background-color':this.loanOfficer.navbarColor};
            
            // okay we are set! load up them questions
            
            /***
            BEGIN QUESTIONS
            ***/
                
            this.messages = [{
                content: 'Welcome to your personal evaluation of your home buying readiness.'
            },{
                content: 'You will be asked a series of questions that will be used to ' +
                    'determine if you are ready to buy your first/next home.'
            },{
                content: 'This is a personal application and all you need to enter is ' +
                    'your name and email address. This is so you can return to the application without ' +
                    'having to re-enter all of your data.'
            },{
                content: 'What is your email? ',
                answer: '',
                type: 'email',
                slug: 'initialEmail'
            },{
                content: 'What is your name?',
                answer: '',
                type: 'string',
                slug: 'name'
            }, {
                content: 'Nice to meet you, %name%!'
            }, 
            /* 
            {
                    content: 'Are you over 18 years old?',
                    answer: '',
                    type: 'button',
                    slug: 'isAnAdult',
                    choices: ['Yes', 'No']
            }, {
                        content: 'Unfortunately, you need to be over 18 years over to apply.',
                        answer: '',
                        showIf: 'isAnAdult === No',
                        type: 'string',
                        slug: 'deadEndAge',
            },
            */
            {
                content: 'Are you needing a prequalification for you and another person?',
                answer: '',
                type: 'button',
                slug: 'existsOtherPerson',
                choices: ['Just me', 'There will be me and others']
            }, {
                    content: 'How many others?',
                    showIf: 'existsOtherPerson === There will be me and others',
                    answer: '',
                    type: 'button',
                    slug: 'howManyOthers',
                    choices: ['1 other person', '2 more people']
            }, 
            {
                         content: 'Let\'s begin with you first.',
                         showIf: 'howManyOthers === 1 other person || howManyOthers === 2 more people',
            }, 
            // begin second time home buyer fork
            {
                content: 'Have you owned a home before?',
                answer: '',
                type: 'button',
                slug: 'ownedHomeBefore',
                choices: ['Yes', 'No']
            }, {
                    content: 'Tell me about this home.',
                    showIf: 'ownedHomeBefore === yes'
            }, {
                    content: 'Was it a short sale, foreclosure, or neither?',
                    showIf: 'ownedHomeBefore === yes',
                    answer: '',
                    type: 'button',
                    slug: 'shortSaleOrForeClosure',
                    choices: ['Short Sale', 'Foreclosure', 'Neither']
            }, 
                        // note in the following I don't have an AND gate on ownedHomeBefore. 
                        // this is because the slug is unanswered (null). 
            {
                        content: 'How many years ago did the foreclosure occur?',
                        showIf: 'shortSaleOrForeClosure === Foreclosure',
                        answer: '',
                        type: 'selectRange',
                        slug: 'foreClosureYearsAgo',
                        range: [0, 70],
                        scale: 1
            }, {
                            content: 'Note that you may have the following on your prequalification: '
                                + 'high rate, large down payment, and high FICO. ',
                            showIf: 'foreClosureYearsAgo < 7'
            }, {
                            content: 'Do you want to proceed? ',
                            showIf: 'foreClosureYearsAgo < 7',
                            answer: '',
                            type: 'button',
                            slug: 'proceed',
                            choices: ['Yes', 'No']
            }, {
                                content: 'Thank you for using the Mortgage App. If you have any questions, please contact'
                                         + ' me at ' + this.loanOfficer.mobilePhone + '  to receieve your quote.',
                                showIf: 'proceed === no',
                                answer: '',
                                type: 'string',
                                slug: 'deadend'
            }, {
                                content: 'Contact me at <a>'+ this.loanOfficer.mobilePhone +'</a> to receive your quote.',
                                showIf: 'proceed === yes',
                                answer: '',
                                type: 'string',
                                slug: 'deadend'
            }, {
                        content: 'How many years ago did the short sale occur?',
                        showIf: 'shortSaleOrForeClosure === short sale',
                        answer: '',
                        type: 'selectRange',
                        slug: 'shortSaleYearsAgo',
                        range: [0, 70],
                        scale: 1
            }, {
                            content: 'Note that you may have the following on your prequalification: '
                                + 'high rate, large down payment, and high FICO. ',
                            showIf: 'shortSaleYearsAgo < 4'
            }, {
                            content: 'Do you want to proceed? ',
                            showIf: 'shortSaleYearsAgo < 4',
                            answer: '',
                            type: 'button',
                            slug: 'proceed2',
                            choices: ['Yes', 'No']
            }, {
                                content: 'Thank you for using the Mortgage App. If you have any questions, please contact'
                                         + ' me at ' + this.loanOfficer.mobilePhone + ' to receieve your quote.',
                                showIf: 'proceed2 === no',
                                answer: '',
                                type: 'string',
                                slug: 'deadend2'
            }, {
                                content: 'Contact me at ' + this.loanOfficer.mobilePhone + ' to receive your quote.',
                                showIf: 'proceed2 === yes',
                                answer: '',
                                type: 'string',
                                slug: 'deadend2'
            }, {
                        content: 'Did you sell over three years ago?',
                        showIf: 'shortSaleOrForeClosure === neither',
                        answer: '',
                        type: 'button',
                        slug: 'neitherShortOrForeClosureOverThreeYearsAgo',
                        choices: ['Yes', 'No']
            }, {
                            content: 'Did you have a bankruptcy?',
                            showIf: 'neitherShortOrForeClosureOverThreeYearsAgo === no',
                            answer: '',
                            type: 'button',
                            slug: 'haveBankruptcy',
                            choices: ['Yes', 'No']
            }, {
                                content: 'What was the bankruptcy type?',
                                showIf: 'haveBankruptcy === yes',
                                answer: '',
                                type: 'button',
                                slug: 'bankruptcyType',
                                choices: ['Type 7', 'Type 11', 'Type 13']
            },{
                                content: 'How many years ago was the discharge?',
                                showIf: 'haveBankruptcy === yes',
                                answer: '',
                                type: 'selectRange',
                                slug: 'dischargeYears',
                                range: [0, 70],
                                scale: 1
            }, {
                                    content: 'Note that you may have the following on your prequalification: '
                                        + 'high rate, large down payment, and high FICO. ',
                                    showIf: 'dischargeYears < 7'
            }, {
                                    content: 'Do you want to proceed? ',
                                    showIf: 'dischargeYears < 7',
                                    answer: '',
                                    type: 'button',
                                    slug: 'proceed3',
                                    choices: ['Yes', 'No']
            }, {
                                        content: 'Thank you for using the Mortgage App. If you have any questions, please contact'
                                         + ' me at ' + this.loanOfficer.mobilePhone + ' to receieve your quote.',
                                        showIf: 'proceed3 === no',
                                        answer: '',
                                        type: 'string',
                                        slug: 'deadend3'
            }, {
                                        content: 'Contact me at ' + this.loanOfficer.mobilePhone + ' to receive your quote.',
                                        showIf: 'proceed3 === yes',
                                        answer: '',
                                        type: 'string',
                                        slug: 'deadend3'
            },                     
            // end second time home buyer fork
            {
                content: 'What is the source of your income?',
                answer: '',
                type: 'button',
                slug: 'incomeSource',
                choices: ['Retired', 'Disabled', 'Work']
            }, {
                    content: 'Have you been at your current job for more than two years?',
                    showIf: 'incomeSource === Work',
                    answer: '',
                    type: 'button',
                    slug: 'timeAtJobMoreThanTwoYears',
                    choices: ['Yes', 'No']
            }, {
                        content: 'How many months have you been at your job?',
                        answer: '',
                        showIf: 'timeAtJobMoreThanTwoYears === no',
                        type: 'selectRange',
                        slug: 'timeAtJobMonths',
                        range: [1, 23],
                        scale: 1
            }, {
                        content: 'Since you have only been at your current job %timeAtJobMonths% months, we need to know ' 
                            + 'more about your previous employment. There are scenarios in which less than 2 years of'
                            + ' work history is acceptable to qualify for a mortgage.',
                        showIf: 'timeAtJobMoreThanTwoYears === no',
            }, {
                        content: 'How were you paid by that employer?',
                        answer: '',
                        showIf: 'timeAtJobMoreThanTwoYears === no',
                        type: 'button',
                        slug: 'previousEmployerPaidHow',
                        choices: ['Weekly', 'Biweekly', 'Monthly']
            }, {
                        content: 'How much was your gross paycheck (before taxes) for this company?',
                        answer: '',
                        showIf: 'timeAtJobMoreThanTwoYears === no',
                        type: 'number',
                        slug: 'previousEmployerGrossPaycheck'
            }, {
                        content: 'How are you paid at your current job?',
                        answer: '',
                        type: 'button',
                        slug: 'paidHow',
                        choices: ['Weekly', 'Biweekly', 'Monthly']
            }, {
                            content: 'How much is your 2 week paycheck before taxes?',
                            showIf: 'paidHow === biweekly',
                            answer: '',
                            type: 'number',
                            slug: 'twoWeekPaycheck'
            }, {
                            content: 'How much is your weekly paycheck before taxes?',
                            showIf: 'paidHow === weekly',
                            answer: '',
                            type: 'number',
                            slug: 'weekPaycheck'
            }, {
                            content: 'How much is your monthly paycheck before taxes?',
                            showIf: 'paidHow === monthly',
                            answer: '',
                            type: 'number',
                            slug: 'monthPaycheck'
            }, {
                    content: 'Do you have social security income?',
                    showIf: 'incomeSource === retired',
                    answer: '',
                    type: 'button',
                    slug: 'hasSocialSecurity',
                    choices: ['Yes', 'No']
            }, {
                        content: 'How much do you earn monthly from social security?',
                        showIf: 'hasSocialSecurity === yes',
                        answer: '',
                        type: 'number',
                        slug: 'socialSecurityAmount'
            }, {
                    content: 'Do you collect disability?',
                    showIf: 'incomeSource === disabled',
                    answer: '',
                    type: 'button',
                    slug: 'hasDisabilityIncome',
                    choices: ['Yes', 'No']
            }, {
                        content: 'How much do you earn monthly from disability?',
                        showIf: 'hasDisabilityIncome === yes',
                        answer: '',
                        type: 'number',
                        slug: 'disabilityIncomeAmount'
            },
            
            /*
            {
                content: 'Do you have a part time job?',
                answer: '',
                type: 'button',
                slug: 'havePartTimeJob',
                choices: ['Yes', 'No']
            }, {
                    content: 'Have you worked at that job for more than 2 years?',
                    showIf: 'havePartTimeJob === yes',
                    answer: '',
                    type: 'button',
                    slug: 'partTimeJobMoreThan2Years',
                    choices: ['Yes', 'No']
            }, {
                        content: 'How are you paid?',
                        showIf: 'partTimeJobMoreThan2Years === yes',
                        answer: '',
                        type: 'button',
                        slug: 'partTimeJobPaidHow',
                        choices: ['Weekly', 'Biweekly', 'Monthly']
            }, {
                        content: 'How much is your gross paycheck (before taxes)?',
                        showIf: 'partTimeJobMoreThan2Years === yes',
                        answer: '',
                        type: 'number',
                        slug: 'partTimeJobGrossPaycheck'
            }, 
            */
            {
                content: 'Do you have any other sources of income?',
                answer: '',
                type: 'button',
                slug: 'otherIncomeSources',
                choices: ['Yes', 'No']
            }, {
                    content: 'Can you prove at least 24 months of claimed taxable income?',
                    showIf: 'otherIncomeSources === yes',
                    answer: '',
                    type: 'button',
                    slug: 'prove24monthsTaxableIncome',
                    choices: ['Yes', 'No']
            }, {
                        content: 'What is the name of the source of income? Multiple sources are allowed.',
                        showIf: 'prove24monthsTaxableIncome === yes',
                        answer: '',
                        type: 'string',
                        slug: 'otherIncomeSourceName'
            }, {
                        content: 'How much per month do you make before taxes?',
                        showIf: 'prove24monthsTaxableIncome === yes',
                        answer: '',
                        type: 'number',
                        slug: 'otherIncomeSourceMonthlyAmount'
            }, {
                content: 'Do you have any assets such as savings, brokerage, and/or checking accounts?',
                answer: '',
                type: 'button',
                slug: 'hasCashAssets',
                choices: ['Yes', 'No']
            }, {
                    content: 'How much cash do you have available today?',
                    showIf: 'hasCashAssets === yes',
                    answer: '',
                    type: 'number',
                    slug: 'cashAssetValue'
            },{
                    content: 'That is OK. You may qualify for a Down Payment Assistance Program.',
                    showIf: 'hasCashAssets === no'
            }, {
                content: 'Do you have gift money from a family member?',
                answer: '',
                type: 'button',
                slug: 'hasGiftAssets',
                choices: ['Yes', 'No']
            }, {
                    content: 'How much gift money do you have available today?',
                    showIf: 'hasGiftAssets === yes',
                    answer: '',
                    type: 'number',
                    slug: 'giftAssetValue'
            },{
                content: 'Do you have any assets in the form of property?',
                showIf: 'ownedHomeBefore === yes',
                answer: '',
                type: 'button',
                slug: 'hasPropertyAssets',
                choices: ['Yes', 'No']
            }, {
                    content: 'How much is your monthly payment?',
                    showIf: 'hasPropertyAssets === yes',
                    answer: '',
                    type: 'number',
                    slug: 'propertyAssetMonthlyPayment'
            }, {
                        content: 'How many years of payments do you owe?',
                        showIf: 'propertyAssetMonthlyPayment < 1',
                        answer: '',
                        type: 'selectRange',
                        slug: 'propertyAssetYearsOfPayments',
                        range: [0, 80],
                        scale: 1
            }, 
            /*
            {
                content: 'Do you have any assets in the form of retirement accounts?',
                answer: '',
                type: 'button',
                slug: 'hasRetirementAssets',
                choices: ['Yes', 'No']
            }, {
                    content: 'What is the total value of your retirement accounts?',
                    showIf: 'hasRetirementAssets === yes',
                    answer: '',
                    type: 'number',
                    slug: 'retirementAssetsValue'
            },
            */
            {
                content: 'How much do you pay per month for rent or an existing mortgage?',
                answer: '',
                type: 'number',
                slug: 'monthlyRent'
            },
            /*
             {
                content: 'About how much do you pay every month in credit card payments?',
                answer: '',
                type: 'number',
                slug: 'monthlyCreditCard'
            }, {
                content: 'Do you have a car payment?',
                answer: '',
                type: 'button',
                slug: 'hasCarPayment',
                choices: ['Yes', 'No']
            }, {
                    content: 'What is your monthly car payment?',
                    answer: '',
                    type: 'number',
                    showIf: 'hasCarPayment === yes',
                    slug: 'monthlyCar'
            }, 
            */
            {
                content: 'What is your total monthly debt? This includes credit card payments, '
                    + 'car payments, and others - but not student loan and housing payments.',
                answer: '',
                slug: 'totalMonthlyDebt',
                type: 'number'
            },
            {
                content: 'Do you have any student loans?',
                answer: '',
                type: 'button',
                slug: 'hasStudentLoans',
                choices: ['Yes', 'No']
            }, {
                    content: 'How much student loans do you owe in total as of now?',
                    showIf: 'hasStudentLoans === yes',
                    answer: '',
                    type: 'number',
                    slug: 'totalStudentLoan'
            }, {
                content: 'Do you make any other monthly payments that we did not cover?',
                answer: '',
                type: 'button',
                slug: 'hasOtherMonthlyPayments',
                choices: ['Yes', 'No']
            }, {
                    content: 'What is the name of the monthly payment? Multiple sources are allowed.',
                    showIf: 'hasOtherMonthlyPayments === yes',
                    answer: '',
                    type: 'string',
                    slug: 'otherMonthlyPaymentsName'
            }, {
                    content: 'How much per month do you pay monthly for this payment?',
                    showIf: 'hasOtherMonthlyPayments === yes',
                    answer: '',
                    type: 'number',
                    slug: 'otherMonthlyPaymentsAmount'
            }, {
                content: 'Do you know your credit score?',
                answer: '',
                type: 'button',
                slug: 'knowCreditScore',
                choices: ['Yes', 'No']
            }, {
                    content: 'We suggest you visit <a href="http://CreditKarma.com" target="_blank">'
                        + 'CreditKarma.com</a> to obtain a free copy of your credit score.'
                        + ' Once you have your credit score, please select continue below:',
                    showIf: 'knowCreditScore === no',
                    answer: '',
                    type: 'button',
                    slug: 'continueCreditScore',
                    choices: ['Continue']
            },{
                content: 'What is your credit score?',
                answer: '',
                type: 'selectRange',
                slug: 'creditScore',
                range: [500, 850],
                scale: 10
            }, {
                    content: 'Your credit score is too low to qualify for our program.'
                        + 'e suggest you contact us to discuss your current credit score and it\'s' 
                        + 'impact on your lending options',
                    showIf: 'creditScore < 581',
            }, {
                    content: 'Please save your information and contact ' + this.loanOfficer.name + ' via ' 
                        + '<a>' + this.loanOfficer.email + '</a> or <a>' + this.loanOfficer.mobilePhone + '</a>.',
                    showIf: 'creditScore < 581',
                    answer: '',
                    type: 'string',
                    slug: 'deadend4'
            },
            
            // incoming: old system - unused
            // at this point, we fork based on how many co-applicants we got. 
            // 1 other applicant fork
            
            /*
            {
                    content: 'Is your co-applicant ready to fill out their information right now?',
                    showIf: 'howManyOthers === 1 other person',
                    answer: '',
                    type: 'button',
                    slug: 'coApplicantReady',
                    choices: ['Yes', 'No']
            }, 
                        // <a>This link</a> will open app.uxweb.io?primaryId=x, which will link the people's info. 
            {
                        content: 'Please click <a ng-click="$ctrl.generateCoApplicantForm(true)">This link</a>'
                            + ' so your co-applicant can fill out their information.',
                        showIf: 'coApplicantReady === yes',
            }, {
                        content: 'Please enter your co-applicant\'s first name and email so we can send them' 
                            + ' a link to this app to fill out their information.',
                        showIf: 'coApplicantReady === no'
            }, {
                            content: 'Co-applicant First Name:',
                            showIf: 'coApplicantReady === no',
                            answer: '',
                            type: 'string',
                            slug: 'coApplicantFirstName'
            }, {
                            content: 'Co-applicant Email Address:',
                            showIf: 'coApplicantReady === no',
                            answer: '',
                            type: 'string',
                            slug: 'coApplicantEmail'
            }, {
                                content: 'We will send an email invite to %coApplicantFirstName% to answer their questions.',
                                showIf: 'coApplicantReady === no'      
            }, {
                                content: 'Once %coApplicantFirstName% answers their prequalifying questions, ' 
                                    + 'we will send your prequalifying results.',
                                showIf: 'coApplicantReady === no'      
            }, {
                                content: 'If you have any questions, please be sure to contact Terry Finnegan at <a>480-555-5555</a>.',
                                showIf: 'coApplicantReady === no'      
            }, {
                                content: 'Would you like us to text you their email and phone number for future contact?',
                                showIf: 'coApplicantReady === no',
                                answer: '',
                                type: 'button',
                                slug: 'phoneNumberFutureContact',
                                choices: ['Yes', 'No']                       
            }, {
                                    content: 'Your cell phone number:',
                                    showIf: 'phoneNumberFutureContact === yes',
                                    answer: '',
                                    type: 'string',
                                    slug: 'phoneNumber',                        
            }, {
                                        content: 'Have a great day!',
                                        showIf: 'phoneNumberFutureContact === yes'      
            }, {
                                        content: 'Have a great day!',
                                        showIf: 'phoneNumberFutureContact === no'      
            },
                    // end 1 other applicant fork
                    // begin 2 other applicants fork
            {
                    content: 'Are your two other co-applicants ready to fill out their information right now?',
                    showIf: 'howManyOthers === 2 more people',
                    answer: '',
                    type: 'button',
                    slug: 'otherCoApplicantsReady',
                    choices: ['Yes', 'No']
            }, 
                        // <a>This link</a> will open app.uxweb.io?mainApplicantId=x, which will link the people's info. 
            {
                        content: 'Please click <a ng-click="$ctrl.generateCoApplicantForm(true)">This link</a>'
                            + ' so your first co-applicant can fill out their information.',
                        showIf: 'otherCoApplicantsReady === yes',
            }, {
                        content: 'Please enter both co-applicant\'s first names and emails so we can send them' 
                            + ' a link to this app to fill out their information.',
                        showIf: 'otherCoApplicantsReady === no'
            }, {
                            content: 'First co-applicant First Name:',
                            showIf: 'otherCoApplicantsReady === no',
                            answer: '',
                            type: 'string',
                            slug: 'firstCoApplicantFirstName'
            }, {
                            content: 'First co-applicant Email Address:',
                            showIf: 'otherCoApplicantsReady === no',
                            answer: '',
                            type: 'string',
                            slug: 'firstCoApplicantEmail'
            }, {
                            content: 'Second co-applicant First Name:',
                            showIf: 'otherCoApplicantsReady === no',
                            answer: '',
                            type: 'string',
                            slug: 'secondCoApplicantFirstName'
            }, {
                            content: 'Second co-applicant Email Address:',
                            showIf: 'otherCoApplicantsReady === no',
                            answer: '',
                            type: 'string',
                            slug: 'secondCoApplicantEmail'
            }, {
                                content: 'We will send an email invite to %firstCoApplicantFirstName% '
                                 + 'and %secondCoApplicantFirstName% to answer their questions.',
                                showIf: 'otherCoApplicantsReady === no'      
            }, {
                                content: 'Once they answer their prequalifying questions, ' 
                                    + 'we will send your prequalifying results.',
                                showIf: 'otherCoApplicantsReady === no'      
            }, {
                                content: 'If you have any questions, please be sure to contact Terry Finnegan at <a>480-555-5555</a>.',
                                showIf: 'otherCoApplicantsReady === no'      
            }, {
                                content: 'Would you like us to text you their email and phone number for future contact?',
                                showIf: 'otherCoApplicantsReady === no',
                                answer: '',
                                type: 'button',
                                slug: 'phoneNumberFutureContact2',
                                choices: ['Yes', 'No']                       
            }, {
                                    content: 'Your cell phone number:',
                                    showIf: 'phoneNumberFutureContact2 === yes',
                                    answer: '',
                                    type: 'string',
                                    slug: 'phoneNumber',                        
            }, {
                                        content: 'Have a great day!',
                                        showIf: 'phoneNumberFutureContact2 === yes'      
            }, {
                                        content: 'Have a great day!',
                                        showIf: 'phoneNumberFutureContact2 === no'      
            },
                    // end 2 other applicants fork
            */
            {
                content: 'Great! That should be all the data we need for now.'
            }, {
                content: 'With this information, we\'ve calculated that you qualify for a $%resultAmount% monthly housing expense!'
            }, {
                    content: 'Oh, something seems out of line. If you would like me to review the information,'
                        + ' please contact me at <a>' + this.loanOfficer.mobilePhone + '</a> or' 
                        + ' <a>' + this.loanOfficer.email + '</a>.',
                    showIf: 'erroredOut === yes',
                    answer: '',
                    type: 'string',
                    slug: 'dummyVal'
            }, {
                content: 'This is the maximum housing expense permitted based on the information you have submitted. '
                    + 'Maximum monthly housing expense that you can afford. '
                    + 'The monthly housing includes the mortgage payment (P&I),'
                    + ' taxes, insurance, HOA (if applicable) and MI (if applicable).'
                    + 'HOA (Homeowners Association dues) and MI (Mortgage Insurance)'
                    + ' depends on the property and the amount of down payment.'
            }, {
                content: 'Since you have not given specific information regarding the property, we '
                    + 'have estimated taxes, insurance and MI for you to determine an estimated '
                    + 'loan amount of $%theMortgage%. This loan amount will change once the actual '
                    + ' taxes, insurance, HOA (if applicable) and MI (if applicable).'
            }, {
                content: 'Your information will need to be reviewed by  ' + this.loanOfficer.name 
                    + ' in order to obtain a pre-qualification letter or guidance on'
                    + ' developing a plan for home buying. Additionally, all loan'
                    + ' programs will be reviewed to see which ones offer the best'
                    + ' payment options for your scenario.'
            }, {
                content: 'Great! Now you will be able to access your information to edit your data when you '
                    + 'to enter specific housing costs start looking at homes. If you have any questions,'
                    + ' please contact me at <a>' + this.loanOfficer.mobilePhone + '</a> '
                    + 'or <a>' + this.loanOfficer.email + '</a>.'
            }, {
                content: 'Do you have any questions, comments, or notes for us',
                answer: '',
                type: 'string',
                slug: 'comments'               
            }
            // assumes the async API call to save has been called, hence the disabler for register link until completion
            {
                content: 'Please click <a ng-click="$ctrl.completeApplication()" ng-disabled="$ctrl.userId.length == 0">This Link</a> to '
                    + 'access, view, and print your information!'
            }
            ];
            
             
            /***
            END QUESTIONS
            ***/
        
            // Last thing to auth is the user
            // user auth logic:
            this.$http.get('api/user').then((response)=> { 
            
                // user - direct to profile page
                this.loggedIn = true;
                console.log(response.data);
                this.texts.push({content: 'Hello ' + response.data.fullName 
                + '! You can see your profile <a ng-click="$ctrl.goToResultsPage()">Here</a>.'});
                
            })['catch']((response)=> { 
            
                // not user - begin application
                this.loggedIn = false;
                if (this.getParameterByName('primaryId')) {
                    this.getPrimaryApplicantFromUrl();
                } else {
                    if (this.getParameterByName('checkpoint')) {
                        this.getSavePointFromUrl();
                    } else {
                        this.startQuestionEngine();
                    }
                }
            });
            // okay!
        });
    });    
    /***
    End Initial Logic
    ***/

    this.texts = [];
  }
  
  
  
  
  /**************************************************
    General Helper Methods - Things to aid basic JS
  ***************************************************/
  
  // helper function, gets querystring
  getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  
  // formats dollar number with commas
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  
  /**************************************************
    Methods for the View - Things called from the view or for the view
  **************************************************/
  
  // sends via click from view
  sendAnswer(input) {
    this.messages[this.messageIndex].answer = input;
    this.send(input, 'me');
    
    this.nextMessage();
  }
  
  // sends via click from view
  sendMessage(message, author) {
    this.send(message, author);
    this.nextMessage();
  }
  
  // show a messenger-esque typing bubble then removes it. 
  // dynamic with content length, which is returned to the caller  
  sendTypingBubble(contentLength) {
    var message = '<img src="http://app.uxweb.io/assets/images/typing.gif" style="max-height:28px;" />';
    var author = 'them';
    var payload = {content: message, from: author};
    var delayTime = 1000 + 10 * contentLength;
    if (delayTime > 5000) {
        delayTime = 5000;
    }
    this.texts.push(payload);
    this.disableActions = true;
    this.$timeout(()=> {
        this.texts.pop();
        this.scrollToBottom();
        this.disableActions = false;
    }, delayTime);
    return delayTime;
  }

  // this actually sends the message, by pushing to the array texts. 
  send(message, author) {
      
    //Redo this line with proper regex when you can
    //This replaces any '%variable%' with the proper variable.
    if (author === 'them' && message && message.indexOf('%') > -1) {
      var temp = message.split('%');

      for (var i = 0; i < temp.length; i++) {
        //Needs to be replaces with regex to extract the word between the %s, this almost works for now
        if (temp[i].indexOf(' ') === -1 && temp[i].length > 1) {
          if(this.findAnswerForSlug(temp[i])) {
            temp[i] = this.findAnswerForSlug(temp[i]);
          }
        }
      }

      message = '';

      for (var i = 0; i < temp.length; i++) {
        message+=temp[i];
      }
    }

    var payload = {content: message, from: author};
    this.texts.push(payload);

    //Scroll to the bottom.
    this.scrollToBottom();
  }
  
  // used to create selectRange inputs
  generateRangeArray(start, finish, scale) {
    var toReturn = [];
    for (var i = start; i <= finish; i+=scale) {
      toReturn.push(i);
    }
    return toReturn;
  }
  
   // scrolls to bottom of page
  scrollToBottom() {
    // this will always go to the last text now
    this.$location.hash('message' + (this.texts.length -1));
    this.$anchorScroll();
  }

  // unused
  scrollToNumber(number) {
    console.log('Scrolling to number... ' + number);
    this.$window.scrollTo(0, number);
  }

  //For testing:
  print(payload) {
    console.log(payload);
  }
  
  
  
  
  /**************************************************
    Application Helper Methods - aids the application core methods 
  **************************************************/
  
  // searches and returns slug
  getVariable(array, slug) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].slug === slug) {
        return array[i].answer;
      }
    }
  }
  
  // helper function to calculate user income
  getIncomeAmount(incomeType) {
    
    var totalAmount = 0;
    console.log(totalAmount);
      
    if (incomeType === 'Retired') {
        for (var i = 0; i < this.messages.length; i++) {
            if (this.messages[i].slug 
            && this.messages[i].slug === 'socialSecurityAmount') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10);
                }
            }
            /*
            if (this.messages[i].slug 
            && this.messages[i].slug === 'partTimeJobGrossPaycheck') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10);
                }
            }
            */
            if (this.messages[i].slug 
            && this.messages[i].slug === 'otherIncomeSourceMonthlyAmount') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10);
                }
            }
        }
        return totalAmount;
    }
    if (incomeType === 'Disabled') {
        for (var i = 0; i < this.messages.length; i++) {
            if (this.messages[i].slug 
            && this.messages[i].slug === 'disabilityIncomeAmount') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10);
                }
            }
            /*
            if (this.messages[i].slug 
            && this.messages[i].slug === 'partTimeJobGrossPaycheck') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10);
                }
            }
            */
            if (this.messages[i].slug 
            && this.messages[i].slug === 'otherIncomeSourceMonthlyAmount') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10);
                }
            }
        }
        return totalAmount;
    }
    if (incomeType === 'Work') {
        
        var paidHow = '';
        var multiplier = 1;
        for (var i = 0; i < this.messages.length; i++) {
            if (this.messages[i].slug && this.messages[i].slug === 'paidHow') {
                paidHow = this.messages[i].answer;
            }
        }
        
        if (paidHow === 'Biweekly') {
            multiplier = 2;
        } else if (paidHow === 'Monthly') {
            multiplier = 1;
        } else if (paidHow === 'Weekly') {
            multiplier = 4;
        } else {
            multiplier = 1;
        }
        
        // looks like multiple payments will be added but control flow
        //     only allows one income type
        for (var i = 0; i < this.messages.length; i++) {
            /*
            if (this.messages[i].slug 
            && this.messages[i].slug === 'partTimeJobGrossPaycheck') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10);
                }
            }
            */
            if (this.messages[i].slug 
            && this.messages[i].slug === 'otherIncomeSourceMonthlyAmount') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10);
                }
            }
            
            // one of the following
            if (this.messages[i].slug 
            && this.messages[i].slug === 'twoWeekPaycheck') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10)
                    * multiplier;
                }
            }
            if (this.messages[i].slug 
            && this.messages[i].slug === 'weekPaycheck') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10)
                    * multiplier;
                }
            }
            if (this.messages[i].slug 
            && this.messages[i].slug === 'monthPaycheck') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10)
                    * multiplier;
                }
            }
            if (this.messages[i].slug 
            && this.messages[i].slug === 'previousEmployerGrossPaycheck') {
                if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                    totalAmount += parseInt(this.messages[i].answer, 10)
                    * multiplier;
                }
            }
        }
    }
    
    return totalAmount;
  }
  
  // helper function to calculate user assets
  getAssetsAmount() {
    var totalAssets = 0;
    for (var i = 0; i < this.messages.length; i++) {
        if (this.messages[i].slug 
        && this.messages[i].slug === 'cashAssetValue') {
            if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                totalAssets += parseInt(this.messages[i].answer, 10);
            }
        }
        if (this.messages[i].slug 
        && this.messages[i].slug === 'giftAssetValue') {
            if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                totalAssets += parseInt(this.messages[i].answer, 10);
            }
        }
        if (this.messages[i].slug 
        && this.messages[i].slug === 'propertyAssetMonthlyPayment') {
            if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                totalAssets += parseInt(this.messages[i].answer, 10);
            }
        }
        /*
        if (this.messages[i].slug 
        && this.messages[i].slug === 'retirementAssetsValue') {
            if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                totalAssets += parseInt(this.messages[i].answer, 10);
            }
        }
        */
    }
    return totalAssets;
  }
  
  // helper function to calculate user debt
  getDebtAmount() {
    var totalDebt = 0;
    for (var i = 0; i < this.messages.length; i++) {
        if (this.messages[i].slug 
        && this.messages[i].slug === 'otherMonthlyPaymentsAmount') {
            if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                totalDebt += parseInt(this.messages[i].answer, 10);
            }
        }
        /*
        if (this.messages[i].slug 
        && this.messages[i].slug === 'monthlyCreditCard') {
            if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                totalDebt += parseInt(this.messages[i].answer, 10);
            }
        }
        if (this.messages[i].slug 
        && this.messages[i].slug === 'monthlyCar') {
            if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                totalDebt += parseInt(this.messages[i].answer, 10);
            }
        }
        */
        if (this.messages[i].slug 
        && this.messages[i].slug === 'totalMonthlyDebt') {
            if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                totalDebt += parseInt(this.messages[i].answer, 10);
            }
        }
        if (this.messages[i].slug 
        && this.messages[i].slug === 'totalStudentLoan') {
            if (!isNaN(parseInt(this.messages[i].answer, 10))) {
                totalDebt += parseInt(this.messages[i].answer, 10) * 0.01;
            }
        }
    }
    return totalDebt;
  }
  
  // calculates user final mortgage result, returns the mortgage
  // called as a special case in findAnswerForSlug. Can potentially error applications
  // upon insufficient funds. 
  // executes a shitload of math
  calculateLoanAmountAndMortgage() {
      
    var saved = false;

    // calculate total income
    this.totalIncome = 0;
    var incomeType = '';
    for (var i = 0; i < this.messages.length; i++) {
        if (this.messages[i].slug && this.messages[i].slug === 'incomeSource') {
            incomeType = this.messages[i].answer;
            // depending on income type calculate differently
            if (incomeType === 'Retired') {
                this.totalIncome = this.getIncomeAmount(incomeType);
            } else if (incomeType === 'Disabled') {
                this.totalIncome = this.getIncomeAmount(incomeType);
            } else if (incomeType === 'Work') {
                this.totalIncome = this.getIncomeAmount(incomeType);
            }
        }
    }
    
    // calculate all debt except housing
    this.totalIncome = this.totalIncome.toFixed(2);
    this.nonHousingDebt = this.getDebtAmount().toFixed(2);
    this.totalAssets = this.getAssetsAmount().toFixed(2);
        
    // this is it
    this.maxHousingExpense = (this.totalIncome * 0.43) - this.nonHousingDebt;
    this.maxHousingExpense = this.maxHousingExpense.toFixed(2);
    
    // check negative, error out if so
    if (this.maxHousingExpense < 0) {
      this.messages.push({
        answer: 'yes',
        slug: 'erroredOut'
      });    
      this.generateAndStoreUserReport(); // save if it errors here
    } else {
      this.messageIndex++;
      this.messages.unshift({
        answer: 'no',
        slug: 'erroredOut'
      });            
    }
    
    // now we do the loans and all that.
    
    // assuming property value approx $200000 in Pima County. $2000/12mo
    this.estimatedPropertyTax = 167;
    // assuming (0.0103 * mortgageAmount)/12 where mortgageAmount = 200000
    this.estimatedInsurance = 171; 
    // terry's val
    this.estimatedMortgageInsurance = 75;
    
    // P&I
    this.principleAndInterestPayment = this.maxHousingExpense
        - (this.estimatedPropertyTax + this.estimatedInsurance + this.estimatedMortgageInsurance);
    this.principleAndInterestPayment = this.principleAndInterestPayment.toFixed(2);
    
    // mortgage loan amount
    this.theMortgage = (this.principleAndInterestPayment / 5.07) * 1000; // 4.77 -> 5.07 as of 11/19
    this.theMortgage = this.theMortgage.toFixed(2);
    this.theMortgage = Math.round(this.theMortgage/1000)*1000;
    
    // check negative, error out if so
    if (this.principleAndInterestPayment < 0) {
      this.messages.push({
        answer: 'yes',
        slug: 'erroredOut'
      });    
    } else {
      this.messageIndex++;
      this.messages.unshift({
        answer: 'no',
        slug: 'erroredOut'
      });            
    }
    
    // yes this means that user's will get a oops something went wrong if they're poor
    
    return this.maxHousingExpense;
  }
  
  //Returns the answer to the question with the slug matching the input 
  findAnswerForSlug(slug) {
    // special case for %resultAmount%, so we can calculate alot of things
    if (slug === 'resultAmount') {
        var resultAmount = 0;
        resultAmount = this.numberWithCommas(this.calculateLoanAmountAndMortgage());
        return resultAmount;
    }
    if (slug === 'theMortgage') {
        return this.numberWithCommas(this.theMortgage.toFixed(2));
    }
    
    for (var i = 0; i < this.messages.length; i++) {
      if (this.messages[i].slug && this.messages[i].slug === slug) {
        return this.messages[i].answer;
      }
    }
  }
  
  // evaluates the current messageIndex's param and returns it 
  evaluateShowIf() {
    if(this.messages[this.messageIndex].showIf) {
        var showIf = this.messages[this.messageIndex].showIf;
        var showMessage = false;
        
        //Handle OR gates
        showIf = showIf.split(' || ');
        
        // This only handles OR gates. We must be able to evaluate ANDs for longer, complicated forks. -Kite
        for(var i = 0; i < showIf.length; i++) {
          var temp = showIf[i].split(' === ');
          if (temp.length > 1) {
            if(this.findAnswerForSlug(temp[0]).toLowerCase() === temp[1].toLowerCase()) {
              showMessage = true;
            }
          }
          var tempMath1 = showIf[i].split(' < ');
          if (tempMath1.length > 1) {
            if(parseInt(this.findAnswerForSlug(tempMath1[0]), 10) < parseInt(tempMath1[1], 10)) {
              showMessage = true;
            }  
          }
          var tempMath2 = showIf[i].split(' > ');
          if (tempMath2.length > 1) {
            if(parseInt(this.findAnswerForSlug(tempMath2[0]), 10) > parseInt(tempMath2[1], 10)) {
              showMessage = true;
            }
          }
          // tester
          console.log('Slug ' + this.messages[this.messageIndex].slug + ' - expression' 
            + ' (' + showIf[i] + ')' + ' evaluated to ' + showMessage
          );
        }
        
        return showMessage;
    }
  }
  
  
  
  
  /**************************************************
    Application Feature Methods - things that aid the application core
  **************************************************/
  
  // if the url has the id of the unfinished form, get it and iterate to next question
  getSavePointFromUrl() {
    this.userId = this.getParameterByName('checkpoint');
    this.$http.get('api/responses/' + this.userId).then((response)=> { 
        var myData = response.data;
        // lets find the last answered question. 
        for (var i=this.messages.length-1; i>0; i--) {
            // loop slugs from user response
            for (var property in myData) {
                if (myData.hasOwnProperty(property)) {
                    
                    // found the last answered question
                    if ((myData[property + ''] !== '') && 
                    ((myData[property + ''] !== null))&& 
                    (property === this.messages[i].slug)) {
                    
                        // mark the first message. 
                        this.messages[i].checkPoint = 'here';
                        
                        // now iterate from the beginning, filling in answers as we go
                        for (var j=0; j<this.messages.length; j++) {
                            if ('slug' in this.messages[j]) {
                                // find corresponding response
                                for (var property2 in myData) {
                                    if (myData.hasOwnProperty(property2) && (property2 === this.messages[j].slug)) {
                                        this.messages[j].answer = myData[property2];
                                    }
                                }
                            }
                            
                            if ('checkPoint' in this.messages[j]) {
                                this.messageIndex--; // question detected so go backwards
                                this.nextMessage(); // begin engine
                               
                                return 0; // free yourself from massive loop
                            }
                            this.messageIndex++;
                        }
                    }
                }
            }
        }
    }).catch((response)=> {
        // non existent ID in db
        window.location.href = this.$location.protocol() + '://'+ this.$location.host();  
    }); 
  }
  
  // detect co-applicant and begin co-applicant form.
  getPrimaryApplicantFromUrl() {
    // old system. unused
    /*
    var primaryApplicantID = this.getParameterByName('primaryId');
    this.$http.get('api/responses/' + primaryApplicantID).then((primaryResponse)=> { 
        // de-activate messages about co-applicants
        for (var i=0; i<this.messages.length; i++) {
            if (this.messages[i].slug === 'existsOtherPerson') {
                this.messages[i].showIf = 'howManyOthers === isCoApplicant'; //always false, also nice data.
            }
        }
        // modify messages and variables for sole coapplicant, 2/2 coapplicant, 1/2 coapplicant
        //      so we mark the form for the database and then make a final message. note engine start requires input
        console.log(primaryResponse.data.howManyOthers);
        if (primaryResponse.data.howManyOthers === '1 other person') {
            this.messages.push({
                content: 'We have sent an email to your primary applicant so she/he can see the results.'
            });
            this.messages.push({
                answer: 'Yes',
                slug: 'isCoApplicant',
            });  
            
        }else if ((primaryResponse.data.howManyOthers === '2 more people')
            && (this.getParameterByName('isSecondCoApplicant') === 'yes')) {
            this.messages.push({
                content: 'We have sent an email to your primary applicant so she/he can see the results.'
            }); 
            this.messages.push({
                answer: 'Yes',
                slug: 'isCoApplicantNumber2',
            });            
        }else if (primaryResponse.data.howManyOthers === '2 more people') {
            // only time generateCoApplicantForm's parameter is false (is 2nd out of 2 coapplicants)
            this.messages.push({
                answer: 'Yes',
                content: 'Please click <a ng-click="$ctrl.generateCoApplicantForm(false)">This link</a> '
                    + 'so the second co-applicant can finish the form.'
            });  
            this.messages.push({
                answer: 'Yes',
                slug: 'isCoApplicantNumber1',
            });          
        }     
        this.messages.push({
            answer: primaryApplicantID,
            slug: 'primaryApplicantId',
        }); 
                
        // THEN begin the application after async call, also considering save point
        if (this.getParameterByName('checkpoint')) {
            this.getSavePointFromUrl();
        } else {
            this.startQuestionEngine();
        }    
    });
    */
  }
  
  // called at the end of a primary applicant's form. save results and redirect to the co-applicant form.
  generateCoApplicantForm(isFirstOfTwoCoApplicants) {
    // unused
    /*
    this.saveProgress(true, isFirstOfTwoCoApplicants);
    */
  }

  // save progress by sending it up and generating a link
  saveProgress() {
    //console.log(isFirstOfTwoCoApplicants);
    
    // coapplicants removed
    
    this.$scope.savedFormLink = '';
    this.userName = this.findAnswerForSlug('name');
    this.userEmail = this.findAnswerForSlug('initialEmail');
    var toReturn = {
        createdAt: new Date(),
        _id: ''
    };
    for(var i = 0; i < this.messages.length; i++) {
      if(this.messages[i].slug) {
        toReturn[this.messages[i].slug] = this.messages[i].answer;
      }
    }
    // send to API
    if (this.getParameterByName('checkpoint')) {
        // already using a checkpoint? use PUT
        this.userId = this.getParameterByName('checkpoint');
        var payload = {
            createdAt: new Date(),
            _id: ''
        };
        //payload._id = this.userId;
        payload = toReturn;
        this.$http.put('api/responses/' + this.userId, payload).then((response)=> {
            
            /*
            // retain co-applicant querystring
            if (this.getParameterByName('primaryId')) {
                this.$scope.savedFormLink = this.$location.protocol() + '://'+ this.$location.host() + '?checkpoint=' + this.userId 
                    + '&primaryId=' + this.getParameterByName('primaryId'); 
            } else {
                this.$scope.savedFormLink = this.$location.protocol() + '://'+ this.$location.host() + '?checkpoint=' + this.userId;                
            }
            // co-applicant logic - redirects
            if (redirectToCoApplicant) {
                if (isFirstOfTwoCoApplicants) {
                    // so the first co-applicant can link to the second co-applicant
                    window.location.href = this.$location.protocol() + '://'+ this.$location.host() + '?primaryId=' + this.userId;
                } else {
                    window.location.href = this.$location.protocol() + '://'+ this.$location.host() + '?primaryId=' + this.userId + '&isSecondCoApplicant=yes';
                }                
            }
            */

            return true;
        }).catch((response)=> {
            return false;  
        }); 
    } else {
        // new user, do a POST
        var payload = {
            createdAt: new Date(),
            _id: ''
        };
        payload = toReturn;
        payload.createdAt = new Date();
        this.$http.post('api/responses', payload).then((response)=> { 
            this.$http.get('api/responses').then((response)=> { 
                var myData = response.data;
                
                // to get the current user I'm going to loop till I find their email
                var myPostedData = {
                    _id: ''
                };
                for (var i=0; i<myData.length; i++) {
                    if (myData[i].initialEmail === this.userEmail) {
                        myPostedData = myData[myData.length-1];         
                    }
                }

                /*
                this.userId = myPostedData._id;
                // retain co-applicant querystring
                if (this.getParameterByName('primaryId')) {
                    this.$scope.savedFormLink = this.$location.protocol() + '://'+ this.$location.host() + '?checkpoint=' + this.userId 
                        + '&primaryId=' + this.getParameterByName('primaryId'); 
                } else {
                    this.$scope.savedFormLink = this.$location.protocol() + '://'+ this.$location.host() + '?checkpoint=' + this.userId;             
                }          
                // co-applicant logic - redirects
                if (redirectToCoApplicant) {                
                    if (isFirstOfTwoCoApplicants) {
                        // so the first co-applicant can link to the second co-applicant
                        window.location.href = this.$location.protocol() + '://'+ this.$location.host() + '?primaryId=' + this.userId;
                    } else {
                        window.location.href = this.$location.protocol() + '://'+ this.$location.host() + '?primaryId=' + this.userId + '&isSecondCoApplicant=yes';
                    }       
                }
                */ 
                
                return true;
            }).catch((response)=> {
                return false;  
            });
        }).catch((response)=> {
            return false;  
        });
       
    }
  }
  
  // upon progress being saved. user click on modal to send email w/ link
  sendLinkToUser() {
    var emailPayload = {
        email: '',
        subject: '',
        text: ''
    };
    var thisLinkSaved = this.$scope.savedFormLink;
    console.log(this.userName);
    
    emailPayload.email = this.userEmail;
    emailPayload.subject = 'Your Home Ready Evaluator Link';
    emailPayload.text = 'Hi ' + this.userName + '!<br /><br />Click <a href="'
         + thisLinkSaved + '">This link</a> to finish your form.';
    this.$http.post('api/emails', emailPayload).then((response)=> {
        alert('Email Sent!');
    });          
  }
  
  // called upon ending form - send emails depending on situation
  sendEmails() {

    // this is the old co-applicant system. We are no longer using it
    
    /*
    // during primary applicant, co-applicant not ready: send link to co-applicant
    console.log(this.findAnswerForSlug('coApplicantReady'));
    if (this.findAnswerForSlug('coApplicantReady') === 'No') {
        console.log('passed');
        var thisLink = this.$location.protocol() + '://'+ this.$location.host() + '?primaryId=' + this.userId;
        var coApplicantName = this.findAnswerForSlug('coApplicantFirstName');
        var emailPayload = {
            email: '',
            subject: '',
            text: ''
        };
        emailPayload.email = this.findAnswerForSlug('coApplicantEmail');
        emailPayload.subject = 'Mortgage Co-Application Request from '
            + this.findAnswerForSlug('name');
        emailPayload.text = 'Hi ' + coApplicantName + '!<br /><br />Click <a href="'
             + thisLink + '">This link</a> to fill out your form.';
        console.log(emailPayload);
        this.$http.post('api/emails', emailPayload).then((response)=> {
            
        });   

     // during primary applicant, co-applicants not ready: send to co-applicants
    } else if (this.findAnswerForSlug('otherCoApplicantsReady') === 'no') {
        var thisLink1 = this.$location.protocol() + '://'+ this.$location.host() + '?primaryId=' + this.userId;
        var coApplicantName1 = this.findAnswerForSlug('firstCoApplicantFirstName');
        var emailPayload1 = {
            email: '',
            subject: '',
            text: ''
        };
        emailPayload1.email = this.findAnswerForSlug('firstCoApplicantEmail');
        emailPayload1.subject = 'Mortgage Co-Application Request from '
            + this.findAnswerForSlug('name');
        emailPayload1.text = 'Hi ' + coApplicantName1 + '!<br /><br />Click <a href="'
             + thisLink1 + '">This link</a> to fill out your form.';
        this.$http.post('email', emailPayload1).then((response)=> {
            console.log(emailPayload1);
            console.log(response);
        });   
        // make sure we mark seconder
        var thisLink2 = this.$location.protocol() + '://'+ this.$location.host() + '?primaryId=' + this.userId
            + '&isSecondCoApplicant=yes';
        var coApplicantName2 = this.findAnswerForSlug('secondCoApplicantFirstName');
        var emailPayload2 = {
            email: '',
            subject: '',
            text: ''
        };
        emailPayload2.email = this.findAnswerForSlug('secondCoApplicantEmail');
        emailPayload2.subject = 'Mortgage Co-Application Request from '
            + this.findAnswerForSlug('name');
        emailPayload2.text = 'Hi ' + coApplicantName2 + '!<br /><br />Click <a href="'
             + thisLink2 + '">This link</a> to fill out your form.';
        this.$http.post('email', emailPayload2).then((response)=> {
            console.log(emailPayload2);
            console.log(response);
        });   
        
    //  co-applicant complete: send to primary
    } else if (this.findAnswerForSlug('isCoApplicant') === 'Yes') {
        
        var primaryId = this.getParameterByName('primaryId');
        var thisLink = this.$location.protocol() + '://'+ this.$location.host() + '?checkpoint=' + primaryId;
        var coApplicantName = this.findAnswerForSlug('name');
        this.$http.get('api/responses/' + primaryId).then((response)=> {
            var primaryApplicantName = response.data.name;
            var emailPayload = {
                email: '',
                subject: '',
                text: ''
            };;
            emailPayload.email = this.findAnswerForSlug('coApplicantEmail');
            emailPayload.subject = 'Mortgage Co-Application Request from '
                + primaryApplicantName;
            emailPayload.text = 'Hi ' + coApplicantName + '!<br /><br />Click <a href="'
                 + thisLink + '">This link</a> to fill out your form.';
            console.log(emailPayload);
            this.$http.post('api/emails', emailPayload).then((response)=> {
                
            }); 
        });
    
    // co-applicant number 2 complete: send to primary
    } else if (this.findAnswerForSlug('isCoApplicantNumber2') === 'Yes') {

        var thisLink = this.$location.protocol() + '://'+ this.$location.host() + '?primaryId=' + this.userId;
        var coApplicantName = this.findAnswerForSlug('coApplicantFirstName');
        var emailPayload = {
            email: '',
            subject: '',
            text: ''
        };
        emailPayload.email = this.findAnswerForSlug('coApplicantEmail');
        emailPayload.subject = 'Mortgage Co-Application Request from '
            + this.findAnswerForSlug('name');
        emailPayload.text = 'Hi ' + coApplicantName + '!<br /><br />Click <a href="'
             + thisLink + '">This link</a> to fill out your form.';
        console.log(emailPayload);
        this.$http.post('api/emails', emailPayload).then((response)=> {
            
        });   

    } else {
    // no emails for no coapplicants. lucky you.    
    }      
    */
  }
 
  // POST to stormpath logout route
  logout() {
    var post = {};
    this.$localStorage.$reset();
    this.$http.post('logout', post).then((response)=> {
      window.location.href = this.$location.protocol() + '://'+ this.$location.host() + '/logout';
    });  
  }
  
  // go to result page
  goToResultsPage() {
    window.location.href = this.$location.protocol() + '://'+ this.$location.host() + '/result';    
  }
  
  // go to login page
  goToLogin() {
    window.location.href = this.$location.protocol() + '://'+ this.$location.host() + '/login';  
  }
  
  // go to main page
  refresh() {
    window.location.href = this.$location.protocol() + '://'+ this.$location.host();  
  }

 /**************************************************
    Application Core Methods - core application methods
  **************************************************/
  
  // starts it all by simply sending the first message
  startQuestionEngine() {
    this.send(this.messages[this.messageIndex].content, 'them');
    this.nextMessage();
  }

  // Recursive message engine.  
  nextMessage() {
    if (this.messageIndex < this.messages.length - 1) {
      
      //Queue up the next message
      this.messageIndex++;
      
      //Evaluate the showIf param, if it exists, to determine whether or not to skip this message
      var showMessage = this.evaluateShowIf();
      
      //If the passed in slug does not match the passed in anwer, skip the question
      if(showMessage === false) {
          
        // this calls the next message recursively, 
        //    allowing us to evaluate the next step's showIf, without send()ing. Keeps going if showMessage is false
        this.nextMessage(); 
        // drop the recursion once we get a good showIf and return to the normal first function call (initial recursive tier)
        return 0; 
      }      

      // skipDelays logic
      var delayTime = 1500;
      if(this.messages[this.messageIndex]) {
        delayTime = this.sendTypingBubble(this.messages[this.messageIndex].content.length);
      }
      
      //If this message exists, send it
      this.$timeout(()=> {
          if(this.messages[this.messageIndex]) {
            this.send(this.messages[this.messageIndex].content, 'them');

            //If it is a question, set the input type correctly
            if (this.messages[this.messageIndex].type) {
              this.inputType = this.messages[this.messageIndex].type;
            }

            //If it is not a question, print out messages recursively until we have a question
            if(!this.messages[this.messageIndex].slug) {
              this.nextMessage();
            }
          }
      }, delayTime);

    } else {
      // weird looking huh, but this calls the function to save data
      console.log(this.generateAndStoreUserReport());
    }
    
  }

  // recursively rolls back message iteration and texts to the previous question. 
  previousMessage() {
    this.messageIndex--;
    // if previous text is a question
    if (this.messages[this.messageIndex].slug) {
      // if there is a showIf on the previous question
      if ('showIf' in this.messages[this.messageIndex]) {
        // and we're not allowed to see it
        if (this.evaluateShowIf() === false) {
          this.previousMessage(); // roll back again.
          return 0;
        }
        
        // --- visible showIf question. end recursion
        this.messageIndex--; // go the text before the question
        this.texts.pop(); // delete question
        this.texts.pop(); // delete answer
        this.texts.pop(); // delete current question
        this.nextMessage(); // do continue, good sir!
        return 0;
        
      } else {
          
        // --- visible display. end recursion
        this.messageIndex--; // go the text before the question
        this.texts.pop(); // delete question
        this.texts.pop(); // delete answer
        this.texts.pop(); // delete current question
        this.nextMessage(); // do continue, good sir!
        return 0;
        
      }

    } else {
      // recusive case
      this.previousMessage();
    }
    
  }
  
  // for progress bar
  getCompletionRate() {
    return (((this.messageIndex / this.messages.length * 100)).toFixed(2).toString() + '%');
  }

  // called at the end of messages iteration
  generateAndStoreUserReport() {
    var toReturn = {
        maxHousingExpense: 0,
        totalIncome: 0,
        nonHousingDebt: 0,
        totalAssets: 0,
        principleAndInterestPayment: 0,
        theMortgage: 0,
        createdAt: new Date(),
        realtorAppName: ''
    };
    for(var i = 0; i < this.messages.length; i++) {
      if(this.messages[i].slug) {
        toReturn[this.messages[i].slug] = this.messages[i].answer;
      }
    }
    
    // set the calculated variables
    toReturn.maxHousingExpense = this.maxHousingExpense;
    toReturn.totalIncome = this.totalIncome;
    toReturn.nonHousingDebt = this.nonHousingDebt; 
    toReturn.totalAssets = this.totalAssets;
    toReturn.principleAndInterestPayment = this.principleAndInterestPayment; 
    toReturn.theMortgage = this.theMortgage;
    toReturn.createdAt = new Date();
    toReturn.realtorAppName = this.realtorAppName;
    
    console.log(toReturn);
    
    // send report to api
    if (this.getParameterByName('checkpoint')) {
        // update existing user's progress if they're using a checkpoint. 
        this.userId = this.getParameterByName('checkpoint');
        var payload = {
            maxHousingExpense: 0,
            totalIncome: 0,
            nonHousingDebt: 0,
            totalAssets: 0,
            principleAndInterestPayment: 0,
            theMortgage: 0,
            createdAt: new Date(),
            realtorAppName: ''        
        };
        payload = toReturn;
        //payload._id = this.userId;
        var content, statuscode, statustext;
        this.$http.put('api/responses/' + this.userId, payload).then((response)=> {
            this.sendEmails();
        });   
    } else {
        // new user, post to api
        var payload = {
            maxHousingExpense: 0,
            totalIncome: 0,
            nonHousingDebt: 0,
            totalAssets: 0,
            principleAndInterestPayment: 0,
            theMortgage: 0,
            createdAt: new Date(),
            realtorAppName: ''        
        };
        payload = toReturn;
        payload.createdAt = new Date();
        var content, statuscode, statustext;
        this.$http.post('api/responses', payload).then((response)=> {
            this.$http.get('api/responses').then((response2)=> { 
                var myData = response2.data;
                var myPostedData = myData[myData.length-1];
                this.userId = myPostedData._id; // set ID variable
                this.sendEmails(); // begin email logic
            });
        });        
    } 
    return toReturn;
  }
  
  // on click link at the last message
  completeApplication() {
    // this localStorage will persist until the login, where
    //     I will put the userId in stormpath.
    console.log(this.userId);
    this.$localStorage.userId = this.userId;
    window.location.href = this.$location.protocol() + '://'+ this.$location.host() + '/register';  
  }
  

 
}

angular.module('mortgageAppApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
