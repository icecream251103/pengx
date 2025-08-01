import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Eye,
  User,
  Brain,
  Zap,
  Target,
  Shield,
  Activity,
  CheckCircle,
  Clock,
  Wallet,
  FileText,
  Star,
  Link,
  Award,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { LoanProposal, LoanFormData, CreditAnalysis, CreateProposalResult, LenderProfile } from '../types/LoanTypes';
import { LoanProposalService } from '../services/LoanProposalService';
import LoanProposalSuccess from './LoanProposalSuccess';
import UserLoans from './UserLoans';

const PentaLend: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lend' | 'profile' | 'borrow'>('overview');
  const [selectedLoan, setSelectedLoan] = useState<LoanProposal | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Add loading and error states for better stability
  const [isLoadingLoans, setIsLoadingLoans] = useState(false);
  const [loanError, setLoanError] = useState<string | null>(null);

  // Borrow tab specific states - isolated to prevent interference
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCreditAnalysis, setShowCreditAnalysis] = useState(false);
  
  // States for creating loan proposal
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);
  const [proposalResult, setProposalResult] = useState<CreateProposalResult | null>(null);
  const [showProposalSuccess, setShowProposalSuccess] = useState(false);
  
  // User loans management - persistent storage like DCA
  const [userLoans, setUserLoans] = useState<LoanProposal[]>(() => {
    // Clear any existing demo data from localStorage
    localStorage.removeItem('pentalend_user_loans');
    
    // Load from localStorage on initialization
    try {
      const saved = localStorage.getItem('pentalend_user_loans');
      const savedLoans = saved ? JSON.parse(saved) : [];
      
      // Start with empty loans array (removed demo loans)
      if (savedLoans.length === 0) {
        return [];
      }
      
      return savedLoans;
    } catch (error) {
      console.warn('Error loading user loans from localStorage:', error);
      return [];
    }
  });
  
  // Borrow tab view mode
  const [borrowViewMode, setBorrowViewMode] = useState<'create' | 'myloans'>('create');
  
  // Enhanced form state - using stable object pattern
  const [loanForm, setLoanForm] = useState({
    usdAmount: 5000, // USD amount user wants to borrow
    currency: 'USD' as 'USD' | 'ETH' | 'BTC' | 'PenGx' | 'USDC',
    term: 6,
    customTerm: '',
    purpose: 'education' as 'education' | 'living' | 'business' | 'emergency' | 'home' | 'travel' | 'debt' | 'investment' | 'other',
    customPurpose: '',
    profession: 'student' as 'student' | 'employee' | 'worker' | 'freelancer' | 'small_business' | 'teacher' | 'healthcare' | 'tech' | 'other',
    monthlyIncome: '',
    description: ''
  });

  // Safe form handler - sử dụng useCallback để tránh re-render và stable reference
  const updateLoanForm = React.useCallback((field: string, value: any) => {
    // Use setTimeout to defer state update and prevent input interruption
    setTimeout(() => {
      setLoanForm(prevForm => {
        // Chỉ update nếu value thực sự thay đổi
        if (prevForm[field as keyof typeof prevForm] === value) {
          return prevForm; // Return same object to prevent re-render
        }
        return {
          ...prevForm,
          [field]: value
        };
      });
    }, 0); // Defer to next tick
  }, []); // Empty dependency array for stable reference

  // Save user loans to localStorage
  const saveUserLoansToStorage = React.useCallback((loans: LoanProposal[]) => {
    try {
      localStorage.setItem('pentalend_user_loans', JSON.stringify(loans));
    } catch (error) {
      console.warn('Error saving user loans to localStorage:', error);
    }
  }, []);

  // Add loan to user's loan list
  const addUserLoan = React.useCallback((loan: LoanProposal) => {
    setUserLoans(prevLoans => {
      const newLoans = [loan, ...prevLoans];
      saveUserLoansToStorage(newLoans);
      return newLoans;
    });
  }, [saveUserLoansToStorage]);

  // Update user loan status (for simulation)
  const updateUserLoanStatus = React.useCallback((loanId: string, updates: Partial<LoanProposal>) => {
    setUserLoans(prevLoans => {
      const newLoans = prevLoans.map(loan => 
        loan.id === loanId ? { ...loan, ...updates } : loan
      );
      saveUserLoansToStorage(newLoans);
      return newLoans;
    });
  }, [saveUserLoansToStorage]);

  // Delete user loan
  const deleteUserLoan = React.useCallback((loanId: string) => {
    console.log('deleteUserLoan called with loanId:', loanId);
    console.log('Current userLoans before delete:', userLoans.length);
    
    setUserLoans(prevLoans => {
      console.log('Previous loans:', prevLoans.map(l => l.id));
      const newLoans = prevLoans.filter(loan => loan.id !== loanId);
      console.log('New loans after filter:', newLoans.map(l => l.id));
      console.log('Calling saveUserLoansToStorage with', newLoans.length, 'loans');
      saveUserLoansToStorage(newLoans);
      return newLoans;
    });
  }, [saveUserLoansToStorage]);

  // Function to convert USD to selected asset
  const getAssetAmountFromUSD = React.useCallback((usdAmount: number, currency: string): number => {
    const usdToAssetRates = {
      USD: 1, // 1 USD = 1 USD
      ETH: 1 / 3830.31, // 1 USD = 0.000261 ETH (ETH price: $3,830.31)
      BTC: 1 / 118416.70, // 1 USD = 0.0000084 BTC (BTC price: $118,416.70)
      PenGx: 1 / 3294.04, // 1 USD = 0.000304 oz gold (Gold price: $3,294.04/oz)
      USDC: 1 // 1 USD = 1 USDC
    };
    const rate = usdToAssetRates[currency as keyof typeof usdToAssetRates] || 1;
    return usdAmount * rate;
  }, []);

  // Get the actual asset amount to borrow
  const getAssetAmount = React.useCallback(() => {
    return getAssetAmountFromUSD(loanForm.usdAmount, loanForm.currency);
  }, [loanForm.usdAmount, loanForm.currency, getAssetAmountFromUSD]);

  // Enhanced AI Analysis with diverse scenarios based on user input
  const simulateAIAnalysis = () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    setShowCreditAnalysis(false);
    
    // Realistic processing time based on complexity
    const processingTime = 2000 + (loanForm.description ? 800 : 0) + (loanForm.monthlyIncome ? 500 : 0);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowCreditAnalysis(true);
    }, processingTime);
  };

  // Function to create loan proposal
  const createLoanProposal = async () => {
    if (isCreatingProposal) return;
    
    setIsCreatingProposal(true);
    
    try {
      // Validate form data
      const validation = LoanProposalService.validateLoanForm(loanForm as LoanFormData);
      if (!validation.isValid) {
        setProposalResult({
          success: false,
          error: validation.errors.join('. ')
        });
        return;
      }

      // Create the proposal
      const proposal = await LoanProposalService.createLoanProposal(
        loanForm as LoanFormData,
        analyzeCredit as CreditAnalysis,
        (proposal) => {
          // Success callback - Add to USER LOANS instead of general loan proposals
          const message = LoanProposalService.generateSuccessMessage(proposal, loanForm as LoanFormData);
          setProposalResult({
            success: true,
            proposal,
            message
          });
          setShowProposalSuccess(true);
          
          // Add to user's personal loan list (persistent)
          addUserLoan(proposal);
        },
        (error) => {
          // Error callback
          setProposalResult({
            success: false,
            error
          });
        }
      );

    } catch (error) {
      setProposalResult({
        success: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đề xuất vay'
      });
    } finally {
      setIsCreatingProposal(false);
    }
  };

  // Advanced credit analysis based on user input
  const analyzeCredit = React.useMemo(() => {
    const analysis = {
      creditScore: 580, // More realistic base score for new users
      creditGrade: 'C' as string,
      interestRate: 16.0, // Reduced from 22.0 to be more competitive
      approvalChance: 25, // Lower starting approval chance
      riskFactors: [] as string[],
      positiveFactors: [] as string[],
      recommendations: [] as string[],
      monthlyPayment: 0,
      processingFee: 0,
      specialOffers: [] as string[]
    };

    // Base scoring factors - More conservative approach
    let scoreModifier = 0;
    let rateModifier = 0;

    // Add baseline risk factors for new/unknown users
    analysis.riskFactors.push('Người dùng mới trên nền tảng');
    analysis.riskFactors.push('Chưa có lịch sử tín dụng trước đây');
    analysis.riskFactors.push('Cần thời gian để xây dựng uy tín');

    // 1. CURRENCY ANALYSIS - More realistic scoring
    switch (loanForm.currency) {
      case 'PenGx':
        scoreModifier += 15; // Reduced from 25
        rateModifier -= 2.0; // Reduced from 3.5
        analysis.positiveFactors.push('Sử dụng PenGx token (ưu đãi nhẹ)');
        analysis.specialOffers.push('Giảm 2% lãi suất cho người dùng PenGx mới');
        break;
      case 'ETH':
        scoreModifier += 8; // Reduced from 15
        rateModifier -= 1.0; // Reduced from 2.0
        analysis.positiveFactors.push('Thanh toán bằng ETH');
        analysis.riskFactors.push('Biến động giá ETH có thể ảnh hưởng');
        break;
      case 'BTC':
        scoreModifier += 5; // Reduced from 10
        rateModifier -= 0.5; // Reduced from 1.5
        analysis.positiveFactors.push('Thanh toán bằng BTC');
        analysis.riskFactors.push('Biến động giá BTC cần được cân nhắc');
        break;
      case 'USDC':
        scoreModifier += 12; // Reduced from 20
        rateModifier -= 1.5; // Reduced from 2.5
        analysis.positiveFactors.push('Stablecoin USDC (tương đối ổn định)');
        break;
      case 'USD':
        scoreModifier += 3; // Reduced from 5
        rateModifier -= 0.5; // Reduced from 1.0
        analysis.positiveFactors.push('Tiền tệ truyền thống');
        break;
    }

    // 2. PROFESSION ANALYSIS - More competitive rates for target groups
    switch (loanForm.profession) {
      case 'student':
        if (loanForm.purpose === 'education') {
          scoreModifier += 25; // Increased from 15
          rateModifier -= 2.0; // Better rate, increased from 1.0
          analysis.positiveFactors.push('Sinh viên vay học phí - Ưu tiên cao');
          analysis.specialOffers.push('Ưu đãi sinh viên: -2% lãi suất + hoãn trả gốc 6 tháng');
        } else {
          scoreModifier += 5; // Slight increase
          rateModifier -= 0.5; // Small benefit for students
          analysis.positiveFactors.push('Sinh viên - Đối tượng ưu tiên');
          analysis.riskFactors.push('Thu nhập chưa ổn định (sinh viên)');
        }
        break;
      case 'employee':
        scoreModifier += 35; // Increased from 25
        rateModifier -= 2.5; // Better rate, increased from 1.5
        analysis.positiveFactors.push('Nhân viên có thu nhập cố định - Nhóm ưu tiên');
        analysis.specialOffers.push('Ưu đãi nhân viên: -2.5% lãi suất');
        break;
      case 'worker':
        scoreModifier += 30; // New benefit for workers
        rateModifier -= 2.0; // Good rate for workers
        analysis.positiveFactors.push('Công nhân - Nhóm ưu tiên của nền tảng');
        analysis.specialOffers.push('Ưu đãi công nhân: -2% lãi suất');
        break;
      case 'teacher':
        scoreModifier += 40; // Increased from 30
        rateModifier -= 3.0; // Better rate, increased from 2.0
        analysis.positiveFactors.push('Giáo viên - Nghề nghiệp ổn định, ưu tiên cao');
        analysis.specialOffers.push('Ưu đãi giáo viên: -3% lãi suất');
        break;
      case 'healthcare':
        scoreModifier += 45; // Increased from 35
        rateModifier -= 3.5; // Better rate, increased from 2.5
        analysis.positiveFactors.push('Ngành y tế - Ưu tiên cao');
        analysis.specialOffers.push('Ưu đãi y bác sĩ: -3.5% lãi suất');
        break;
      case 'tech':
        scoreModifier += 25; // Slight increase from 20
        rateModifier -= 2.0; // Better rate, increased from 1.5
        analysis.positiveFactors.push('Ngành công nghệ - Thu nhập cao');
        analysis.riskFactors.push('Ngành biến động, cần đánh giá kỹ');
        break;
      case 'small_business':
        if (loanForm.purpose === 'business') {
          scoreModifier += 20; // Increased from 10
          rateModifier -= 1.0; // Better rate, changed from +1.0
          analysis.positiveFactors.push('Kinh doanh nhỏ vay vốn mở rộng');
        } else {
          scoreModifier -= 5;
          analysis.riskFactors.push('Thu nhập kinh doanh không đều');
        }
        break;
      case 'freelancer':
        scoreModifier -= 10;
        rateModifier += 1.5;
        analysis.riskFactors.push('Thu nhập freelancer không ổn định');
        break;
    }

    // 3. AMOUNT AND TERM ANALYSIS - More conservative approach
    const termMonths = loanForm.term || parseInt(loanForm.customTerm) || 6;
    const usdAmount = loanForm.usdAmount;

    // Amount risk assessment (based on USD value for consistency)
    if (usdAmount > 50000) {
      scoreModifier -= 25; // Increased penalty from 15
      rateModifier += 4.0; // Increased from 3.0
      analysis.riskFactors.push('Số tiền vay rất lớn (trên $50K) - Rủi ro cao');
      analysis.riskFactors.push('Cần tài sản thế chấp hoặc người bảo lãnh');
    } else if (usdAmount > 25000) {
      scoreModifier -= 20; // Increased penalty from 10
      rateModifier += 3.0; // Increased from 2.0
      analysis.riskFactors.push('Số tiền vay lớn ($25K-$50K) - Cần đánh giá kỹ');
      analysis.riskFactors.push('Yêu cầu chứng minh thu nhập chi tiết');
    } else if (usdAmount > 10000) {
      scoreModifier -= 10; // Increased penalty from 5
      rateModifier += 2.0; // Increased from 1.0
      analysis.riskFactors.push('Số tiền vay khá lớn ($10K-$25K)');
    } else if (usdAmount < 1000) {
      scoreModifier += 5; // Reduced benefit from 10
      rateModifier -= 0.5;
      analysis.positiveFactors.push('Số tiền vay nhỏ (dưới $1K) - Rủi ro thấp');
    } else {
      // For amounts between $1K-$10K, add some baseline assessment
      analysis.riskFactors.push('Cần thời gian để đánh giá khả năng trả nợ');
    }

    // Term risk assessment - More realistic
    if (termMonths > 24) {
      rateModifier += 3.0; // Increased from 2.0
      analysis.riskFactors.push('Kỳ hạn dài (trên 24 tháng) - Rủi ro tăng cao');
      analysis.riskFactors.push('Biến động kinh tế có thể ảnh hưởng lớn');
    } else if (termMonths > 12) {
      rateModifier += 2.0; // Increased from 1.0
      analysis.riskFactors.push('Kỳ hạn trung bình (12-24 tháng)');
    } else if (termMonths <= 6) {
      scoreModifier += 10; // Reduced from 15
      rateModifier -= 0.5; // Reduced from 1.0
      analysis.positiveFactors.push('Kỳ hạn ngắn (dưới 6 tháng) - Tốt');
    } else {
      // For 6-12 months
      analysis.positiveFactors.push('Kỳ hạn hợp lý (6-12 tháng)');
    }

    // 4. PURPOSE ANALYSIS
    switch (loanForm.purpose) {
      case 'education':
        scoreModifier += 35;
        rateModifier -= 2.5;
        analysis.positiveFactors.push('Mục đích giáo dục (đầu tư tương lai)');
        analysis.specialOffers.push('Ưu đãi học phí: Hoãn trả gốc 3 tháng');
        break;
      case 'emergency':
        scoreModifier += 25;
        rateModifier -= 1.5;
        analysis.positiveFactors.push('Chi phí khẩn cấp (cần thiết)');
        analysis.specialOffers.push('Duyệt nhanh trong 24h cho trường hợp khẩn cấp');
        break;
      case 'business':
        if (loanForm.profession === 'small_business') {
          scoreModifier += 20;
          rateModifier -= 1.0;
          analysis.positiveFactors.push('Vốn kinh doanh phù hợp với nghề nghiệp');
        } else {
          scoreModifier -= 5;
          analysis.riskFactors.push('Vay kinh doanh nhưng không phải chủ doanh nghiệp');
        }
        break;
      case 'home':
        scoreModifier += 30;
        rateModifier -= 2.0;
        analysis.positiveFactors.push('Cải thiện nhà ở (tài sản có giá trị)');
        break;
      case 'debt':
        scoreModifier -= 10;
        rateModifier += 1.0;
        analysis.riskFactors.push('Hợp nhất nợ (có nợ hiện tại)');
        analysis.recommendations.push('Cân nhắc tư vấn tài chính trước khi vay thêm');
        break;
      case 'investment':
        scoreModifier -= 20;
        rateModifier += 2.0;
        analysis.riskFactors.push('Mục đích đầu tư (rủi ro cao)');
        analysis.recommendations.push('Đầu tư có rủi ro, cân nhắc kỹ khả năng trả nợ');
        break;
      case 'living':
        scoreModifier += 10;
        analysis.positiveFactors.push('Chi phí sinh hoạt cơ bản');
        break;
      case 'travel':
        scoreModifier -= 15;
        rateModifier += 1.5;
        analysis.riskFactors.push('Du lịch không phải nhu cầu thiết yếu');
        break;
    }

    // 5. INCOME ANALYSIS - More realistic assessment
    if (loanForm.monthlyIncome) {
      const monthlyIncomeNum = parseInt(loanForm.monthlyIncome.replace(/[^0-9]/g, '')) || 0;
      
      if (monthlyIncomeNum > 20000000) { // > 20M VND
        scoreModifier += 40; // Reduced from 60
        rateModifier -= 2.5; // Reduced from 4.0
        analysis.positiveFactors.push('Thu nhập cao (trên 20M VND/tháng)');
        analysis.recommendations.push('Cần xác minh nguồn thu nhập chính thức');
      } else if (monthlyIncomeNum > 15000000) { // > 15M VND
        scoreModifier += 30; // Reduced from 45
        rateModifier -= 2.0; // Reduced from 3.0
        analysis.positiveFactors.push('Thu nhập khá cao (15-20M VND/tháng)');
        analysis.riskFactors.push('Cần chứng minh thu nhập ổn định trong 6 tháng');
      } else if (monthlyIncomeNum > 10000000) { // > 10M VND
        scoreModifier += 20; // Reduced from 30
        rateModifier -= 1.0; // Reduced from 2.0
        analysis.positiveFactors.push('Thu nhập ổn định (10-15M VND/tháng)');
        analysis.riskFactors.push('Cần giấy tờ chứng minh thu nhập');
      } else if (monthlyIncomeNum > 7000000) { // > 7M VND
        scoreModifier += 10; // Reduced from 15
        rateModifier -= 0.5; // Reduced from 1.0
        analysis.positiveFactors.push('Thu nhập trung bình (7-10M VND/tháng)');
        analysis.riskFactors.push('Thu nhập ở mức trung bình, cần đánh giá kỹ');
      } else if (monthlyIncomeNum > 5000000) { // 5-7M VND
        scoreModifier += 5;
        analysis.positiveFactors.push('Có khai báo thu nhập');
        analysis.riskFactors.push('Thu nhập khá thấp (5-7M VND/tháng)');
      } else if (monthlyIncomeNum > 0) {
        scoreModifier -= 5; // Penalty for very low income
        analysis.riskFactors.push('Thu nhập thấp (dưới 5M VND/tháng) - Rủi ro cao');
        analysis.recommendations.push('Cần có thêm nguồn thu nhập hoặc người bảo lãnh');
      }

      // Debt-to-income ratio analysis - More conservative
      const estimatedMonthlyPayment = (usdAmount * (1 + (analysis.interestRate + rateModifier) / 100 / 12)) / termMonths;
      const monthlyIncomeVND = monthlyIncomeNum;
      const monthlyIncomeUSD = monthlyIncomeVND / 26199; // Convert VND to USD for comparison
      const paymentRatio = estimatedMonthlyPayment / monthlyIncomeUSD;
      
      if (paymentRatio > 0.4) { // Lowered threshold from 0.5
        scoreModifier -= 40; // Increased penalty from 30
        rateModifier += 3.0; // Increased from 2.0
        analysis.riskFactors.push('Tỷ lệ nợ/thu nhập quá cao (>40%) - Rất rủi ro');
        analysis.recommendations.push('Bắt buộc phải giảm số tiền vay hoặc có người bảo lãnh');
      } else if (paymentRatio > 0.25) { // Lowered threshold from 0.3
        scoreModifier -= 20; // Increased penalty from 10
        rateModifier += 1.5; // Increased from 0.5
        analysis.riskFactors.push('Tỷ lệ nợ/thu nhập cao (25-40%) - Cần cân nhắc');
      } else if (paymentRatio < 0.2) {
        scoreModifier += 20;
        rateModifier -= 1.0;
        analysis.positiveFactors.push('Tỷ lệ nợ/thu nhập thấp (<20%)');
      }
    } else {
      analysis.riskFactors.push('Chưa cung cấp thông tin thu nhập');
      analysis.recommendations.push('Cung cấp thông tin thu nhập để cải thiện điều kiện vay');
    }

    // 6. DESCRIPTION ANALYSIS
    if (loanForm.description) {
      const descLength = loanForm.description.length;
      if (descLength > 200) {
        scoreModifier += 20;
        rateModifier -= 0.5;
        analysis.positiveFactors.push('Mô tả chi tiết mục đích vay');
      } else if (descLength > 100) {
        scoreModifier += 10;
        analysis.positiveFactors.push('Có mô tả mục đích vay');
      }

      // Keyword analysis for responsibility indicators
      const description = loanForm.description.toLowerCase();
      const responsibleKeywords = ['trả đúng hạn', 'có kế hoạch', 'ổn định', 'lâu dài', 'tiết kiệm', 'có kinh nghiệm'];
      const concerningKeywords = ['khó khăn', 'khẩn cấp', 'mất việc', 'bệnh tật', 'không chắc'];
      
      responsibleKeywords.forEach(keyword => {
        if (description.includes(keyword)) {
          scoreModifier += 5;
          analysis.positiveFactors.push('Thể hiện ý thức trách nhiệm trong mô tả');
        }
      });

      concerningKeywords.forEach(keyword => {
        if (description.includes(keyword)) {
          scoreModifier -= 10;
          analysis.riskFactors.push('Có dấu hiệu rủi ro trong mô tả');
        }
      });
    }

    // 7. CUSTOM TERM AND PURPOSE ANALYSIS
    if (loanForm.term === 0 && loanForm.customTerm) {
      const customTermNum = parseInt(loanForm.customTerm);
      if (customTermNum > 36) {
        scoreModifier -= 20;
        rateModifier += 2.5;
        analysis.riskFactors.push('Kỳ hạn rất dài (trên 36 tháng)');
      }
    }

    if (loanForm.purpose === 'other' && loanForm.customPurpose) {
      scoreModifier += 5;
      analysis.positiveFactors.push('Mô tả mục đích cụ thể');
    }

    // Calculate final scores - More competitive ranges for target groups
    analysis.creditScore = Math.max(300, Math.min(750, 580 + scoreModifier)); // Lower max score
    analysis.interestRate = Math.max(8.0, Math.min(28.0, 16.0 + rateModifier)); // Better base rate: 8-28% vs 12-35%

    // More conservative credit grade determination
    if (analysis.creditScore >= 720) analysis.creditGrade = 'A';
    else if (analysis.creditScore >= 680) analysis.creditGrade = 'A-';
    else if (analysis.creditScore >= 640) analysis.creditGrade = 'B+';
    else if (analysis.creditScore >= 600) analysis.creditGrade = 'B';
    else if (analysis.creditScore >= 560) analysis.creditGrade = 'B-';
    else if (analysis.creditScore >= 520) analysis.creditGrade = 'C+';
    else if (analysis.creditScore >= 480) analysis.creditGrade = 'C';
    else if (analysis.creditScore >= 440) analysis.creditGrade = 'C-';
    else analysis.creditGrade = 'D';

    // More realistic approval chance calculation
    if (analysis.creditScore >= 680) analysis.approvalChance = Math.min(85, 60 + (analysis.creditScore - 680) / 5);
    else if (analysis.creditScore >= 600) analysis.approvalChance = Math.min(70, 45 + (analysis.creditScore - 600) / 4);
    else if (analysis.creditScore >= 520) analysis.approvalChance = Math.min(50, 25 + (analysis.creditScore - 520) / 4);
    else if (analysis.creditScore >= 450) analysis.approvalChance = Math.min(30, 10 + (analysis.creditScore - 450) / 5);
    else analysis.approvalChance = Math.max(5, (analysis.creditScore - 300) / 30);

    // Calculate monthly payment
    const principal = usdAmount;
    const monthlyRate = analysis.interestRate / 100 / 12;
    const numPayments = termMonths;
    analysis.monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Calculate processing fee
    analysis.processingFee = usdAmount * 0.005; // 0.5%

    // Add more realistic general recommendations with focus on target groups
    if (analysis.creditScore < 600) {
      analysis.recommendations.push('Xây dựng lịch sử tín dụng tích cực để có điều kiện tốt hơn');
      analysis.recommendations.push('Cung cấp thêm tài liệu chứng minh thu nhập và tài sản');
      if (loanForm.profession !== 'student') {
        analysis.recommendations.push('Cân nhắc có người bảo lãnh để cải thiện điều kiện');
      }
    }
    if (analysis.interestRate > 22) {
      analysis.recommendations.push('Lãi suất hiện tại khá cao, cân nhắc kỹ khả năng trả nợ');
      analysis.recommendations.push('Xem xét giảm số tiền vay hoặc kéo dài kỳ hạn');
    } else if (analysis.interestRate > 18) {
      analysis.recommendations.push('Có thể cải thiện lãi suất bằng cách cung cấp thêm thông tin');
    }
    if (!loanForm.monthlyIncome) {
      analysis.recommendations.push('Bắt buộc phải khai báo thu nhập để được xét duyệt');
      analysis.riskFactors.push('Chưa cung cấp thông tin thu nhập - Không thể đánh giá');
    }
    if (loanForm.usdAmount > 20000 && !loanForm.monthlyIncome) {
      analysis.recommendations.push('Vay số tiền lớn cần phải có chứng minh thu nhập');
    }
    
    // Target group specific recommendations
    if (['student', 'employee', 'worker', 'small_business'].includes(loanForm.profession)) {
      analysis.positiveFactors.push(`Thuộc nhóm ưu tiên của PentaLend`);
      if (analysis.interestRate <= 16) {
        analysis.specialOffers.push('Đã áp dụng lãi suất ưu đãi cho nhóm mục tiêu');
      }
    }
    
    // Add processing fee calculation
    analysis.processingFee = usdAmount * 0.015; // Reduced to 1.5% (from 2%)
    
    // Add general disclaimer
    analysis.recommendations.push('Đây là đánh giá sơ bộ, kết quả chính thức sau 2-5 ngày');
    analysis.recommendations.push('Nhóm ưu tiên sẽ được xử lý nhanh hơn');

    return analysis;
  }, [loanForm]);

  // Mock data for demo with dynamic updates
  const [loanProposals, setLoanProposals] = useState<LoanProposal[]>([
    {
      id: 'LP001',
      borrower: '0x742d...3a9f',
      amount: 25000, // $25K USD
      term: 6,
      purpose: 'Học phí đại học',
      creditScore: 750,
      creditGrade: 'A',
      interestRate: 12.5,
      fundedAmount: 17500,
      status: 'funding',
      riskLevel: 'low',
      borrowerType: 'student',
      currency: 'USD'
    },
    {
      id: 'LP002',
      borrower: '0x8b9c...7d2e',
      amount: 15.5, // 15.5 ETH
      term: 12,
      purpose: 'Vốn kinh doanh nhỏ',
      creditScore: 680,
      creditGrade: 'B+',
      interestRate: 15.8,
      fundedAmount: 15.5,
      status: 'funded',
      riskLevel: 'medium',
      borrowerType: 'small_business',
      currency: 'ETH'
    },
    {
      id: 'LP003',
      borrower: '0x1a2b...4c5d',
      amount: 0.5, // 0.5 BTC
      term: 3,
      purpose: 'Chi phí sinh hoạt',
      creditScore: 820,
      creditGrade: 'A+',
      interestRate: 10.2,
      fundedAmount: 0.5,
      status: 'completed',
      riskLevel: 'low',
      borrowerType: 'employee',
      currency: 'BTC'
    },
    {
      id: 'LP004',
      borrower: '0x3c4d...5e6f',
      amount: 100000, // 100K PenGx
      term: 9,
      purpose: 'Đầu tư thiết bị',
      creditScore: 710,
      creditGrade: 'A-',
      interestRate: 13.2,
      fundedAmount: 75000,
      status: 'funding',
      riskLevel: 'low',
      borrowerType: 'worker',
      currency: 'PenGx'
    },
    {
      id: 'LP005',
      borrower: '0x7e8f...9g0h',
      amount: 8000, // 8K USDC
      term: 4,
      purpose: 'Mở rộng kinh doanh',
      creditScore: 695,
      creditGrade: 'B+',
      interestRate: 14.8,
      fundedAmount: 3200,
      status: 'funding',
      riskLevel: 'medium',
      borrowerType: 'small_business',
      currency: 'USDC'
    }
  ]);

  const [lenderProfile] = useState<LenderProfile>({
    address: '0x9f8e...1b2c',
    totalFunded: 250000, // Mixed assets equivalent
    successRate: 97.5,
    loansCount: 24,
    rating: 4.8,
    assetStability: 'Excellent'
  });

  // Optimized real-time updates with stability improvements
  useEffect(() => {
    // CRITICAL: Completely disable ALL background updates when in borrow tab
    if (activeTab === 'borrow') {
      return; // Exit early - no background processes at all
    }
    
    let isMounted = true;
    
    const interval = setInterval(() => {
      if (!isMounted || activeTab === 'borrow') {
        return; // Double check to prevent any updates
      }
      
      try {
        // Only update time and loans for overview/lend tabs
        if (activeTab === 'overview' || activeTab === 'lend') {
          setCurrentTime(Date.now());
          setLoanError(null);
          
          // Minimal funding updates with maximum stability
          setLoanProposals(prev => {
            let hasChanges = false;
            const updated = prev.map(loan => {
              if (loan.status === 'funding' && loan.fundedAmount < loan.amount) {
                // Very conservative update rate
                const randomIncrease = Math.random() * 0.002; // Reduced from 0.005 to 0.002
                const newFundedAmount = Math.min(
                  loan.fundedAmount * (1 + randomIncrease),
                  loan.amount
                );
                
                // Only update if change is very significant
                if (Math.abs(newFundedAmount - loan.fundedAmount) > loan.amount * 0.005) {
                  hasChanges = true;
                  const newStatus: 'active' | 'funding' | 'funded' | 'completed' = 
                    newFundedAmount >= loan.amount ? 'funded' : 'funding';
                  
                  return {
                    ...loan,
                    fundedAmount: newFundedAmount,
                    status: newStatus
                  };
                }
              }
              return loan;
            });
            
            return hasChanges ? updated : prev;
          });
        }
      } catch (error) {
        console.warn('Error updating loan proposals:', error);
        if (activeTab !== 'borrow') { // Only set error if not in borrow tab
          setLoanError('Lỗi cập nhật dữ liệu. Đang thử lại...');
        }
      }
    }, 15000); // Increased interval to 15 seconds for maximum stability

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeTab]);

  const formatCurrency = (amount: number, currency: string) => {
    if (isNaN(amount) || amount === 0) {
      return `0 ${currency}`;
    }
    
    switch (currency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        }).format(amount);
      case 'ETH':
        return `${amount.toFixed(4)} ETH`;
      case 'BTC':
        return `${amount.toFixed(6)} BTC`;
      case 'PenGx':
        return `${amount.toLocaleString()} PenGx`;
      case 'USDC':
        return `${amount.toLocaleString()} USDC`;
      default:
        return `${amount.toLocaleString()} ${currency}`;
    }
  };

  const getCreditGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30';
      case 'A': return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30';
      case 'B+': return 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30';
      case 'B': return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30';
      case 'C': return 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30';
      case 'D': return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30';
      default: return 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
    }
  };

  const getBorrowerTypeLabel = (type: string) => {
    switch (type) {
      case 'student': return 'Sinh viên';
      case 'employee': return 'Nhân viên';
      case 'worker': return 'Công nhân';
      case 'small_business': return 'Kinh doanh nhỏ';
      default: return 'Khác';
    }
  };

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">PentaLend</h1>
            <p className="text-xl mb-6 opacity-90 dark:opacity-95">
              Nền tảng cho vay P2P được tự động hóa bằng AI, phục vụ sinh viên, nhân viên và doanh nghiệp nhỏ tại Việt Nam
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 dark:bg-white/30 rounded-lg p-4 backdrop-blur">
                <div className="text-2xl font-bold">Multi-Asset</div>
                <div className="text-sm opacity-80 dark:opacity-90">USD • ETH • BTC • PenGx</div>
              </div>
              <div className="bg-white/20 dark:bg-white/30 rounded-lg p-4 backdrop-blur">
                <div className="text-2xl font-bold">97.5%</div>
                <div className="text-sm opacity-80 dark:opacity-90">Tỷ lệ thành công</div>
              </div>
              <div className="bg-white/20 dark:bg-white/30 rounded-lg p-4 backdrop-blur">
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm opacity-80 dark:opacity-90">Khoản vay hoàn thành</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 dark:bg-white/20 rounded-2xl p-6 backdrop-blur border border-white/20 dark:border-white/30">
                <Brain className="h-24 w-24 text-white mx-auto mb-4" />
                <p className="text-center text-white/90 dark:text-white">Hệ thống AI Credit Scoring</p>
              </div>
              <div className="bg-white/10 dark:bg-white/20 rounded-2xl p-6 backdrop-blur border border-white/20 dark:border-white/30">
                <Link className="h-24 w-24 text-white mx-auto mb-4" />
                <p className="text-center text-white/90 dark:text-white">Quản lý bằng Smart Contracts</p>
              </div>
              <div className="bg-white/10 dark:bg-white/20 rounded-2xl p-6 backdrop-blur border border-white/20 dark:border-white/30">
                <Activity className="h-24 w-24 text-white mx-auto mb-4" />
                <p className="text-center text-white/90 dark:text-white">Dữ liệu Oracle tin cậy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-shadow">
          <Zap className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Tự động hoàn toàn</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Toàn bộ quy trình từ đánh giá tín dụng đến quản lý khoản vay được tự động hóa bằng AI và Smart Contracts
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-shadow">
          <Target className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Phục vụ đối tượng đặc biệt</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Tập trung vào sinh viên, nhân viên, công nhân và doanh nghiệp nhỏ - những nhóm khó tiếp cận tín dụng truyền thống
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-shadow">
          <Shield className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Minh bạch & Công bằng</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Điểm tín dụng và thông tin khoản vay được hiển thị minh bạch, tạo sân chơi bình đẳng cho tất cả
          </p>
        </div>
      </div>

      {/* Live Loan Proposals */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Đề xuất vay đang hoạt động</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Activity className="h-4 w-4" />
            <span>Cập nhật realtime</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {loanProposals.slice(0, 3).map((loan) => (
            <motion.div
              key={loan.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedLoan(loan)}
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md dark:hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {getBorrowerTypeLabel(loan.borrowerType)} | {loan.currency}
                  </div>
                  <div className="font-bold text-lg text-gray-900 dark:text-white">{formatCurrency(loan.amount, loan.currency)}</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getCreditGradeColor(loan.creditGrade)}`}>
                  {loan.creditGrade}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Mục đích:</span>
                  <span className="text-gray-900 dark:text-white">{loan.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Lãi suất:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{loan.interestRate}%/năm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Kỳ hạn:</span>
                  <span className="text-gray-900 dark:text-white">{loan.term} tháng</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Tiến độ gây quỹ</span>
                  <span className="text-gray-900 dark:text-white">{Math.round((loan.fundedAmount / loan.amount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(loan.fundedAmount / loan.amount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const BorrowTab = () => (
    <div className="space-y-8">
      {/* Tab Header with Mode Switcher */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {borrowViewMode === 'create' ? 'Tạo đề xuất vay' : 'Khoản vay của bạn'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {borrowViewMode === 'create' 
                ? 'Tùy chỉnh các tham số theo nhu cầu của bạn' 
                : `Quản lý ${userLoans.length} khoản vay đã tạo`
              }
            </p>
          </div>
          
          {/* Mode Switcher */}
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setBorrowViewMode('create')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                borrowViewMode === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Tạo khoản vay
            </button>
            <button
              onClick={() => setBorrowViewMode('myloans')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                borrowViewMode === 'myloans'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>Khoản vay của bạn</span>
              {userLoans.length > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  borrowViewMode === 'myloans' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                  {userLoans.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content based on mode */}
      {borrowViewMode === 'create' ? (
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Loan Form */}
          <div className="space-y-6">
            {/* Asset Type Selection - Moved to top */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Loại tài sản muốn vay <span className="text-red-500">*</span>
              </label>
              <select 
                value={loanForm.currency}
                onChange={(e) => updateLoanForm('currency', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="USD">USD - Đô la Mỹ ($1 = 26,199 VND | Lãi suất từ 8-18%)</option>
                <option value="ETH">ETH - Ethereum ($3,830/ETH | Lãi suất từ 10-20%)</option>
                <option value="BTC">BTC - Bitcoin ($118,417/BTC | Lãi suất từ 9-19%)</option>
                <option value="PenGx">PenGx - Vàng ($3,294/oz | Lãi suất từ 8-16%)</option>
                <option value="USDC">USDC - USD Coin ($1 = 26,199 VND | Lãi suất từ 8-18%)</option>
              </select>
            </div>

            {/* USD Amount Input Section - Updated */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Số tiền USD muốn vay <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  defaultValue={loanForm.usdAmount === 0 ? '' : loanForm.usdAmount.toLocaleString('de-DE')}
                  onChange={(e) => {
                    // Tự động format số với dấu chấm phân cách nghìn
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value === '') {
                      e.target.value = '';
                      return;
                    }
                    const numValue = parseInt(value);
                    e.target.value = numValue.toLocaleString('de-DE');
                  }}
                  onBlur={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const numValue = value === '' ? 0 : parseInt(value);
                    // Don't clamp here, let user see their input for validation feedback
                    updateLoanForm('usdAmount', numValue);
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="VD: 5.000"
                />
                <span className="absolute right-3 top-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  USD
                </span>
              </div>
              
              {/* Validation warnings */}
              {loanForm.usdAmount > 0 && loanForm.usdAmount < 100 && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="text-sm text-red-700 dark:text-red-300">
                    <span className="font-medium">⚠️ Số tiền quá thấp:</span> Số tiền vay tối thiểu là $100 (~2.6M VND). 
                    Vui lòng nhập ít nhất $100 để tiếp tục.
                  </div>
                </div>
              )}
              
              {loanForm.usdAmount > 100000 && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="text-sm text-red-700 dark:text-red-300">
                    <span className="font-medium">⚠️ Số tiền quá cao:</span> Số tiền vay tối đa là $100,000 (~2.6B VND). 
                    Vui lòng nhập không quá $100,000 hoặc liên hệ để được tư vấn các gói vay đặc biệt.
                  </div>
                </div>
              )}
              
              {/* Asset conversion display - only show if amount is valid */}
              {loanForm.usdAmount >= 100 && loanForm.usdAmount <= 100000 && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-sm text-green-700 dark:text-green-300">
                    <span className="font-medium">Quy đổi thành {loanForm.currency}:</span> {(() => {
                      const assetAmount = getAssetAmountFromUSD(loanForm.usdAmount, loanForm.currency);
                      return formatCurrency(assetAmount, loanForm.currency);
                    })()}
                  </div>
                </div>
              )}
              
              {/* VND conversion display - only show if amount is valid */}
              {loanForm.usdAmount >= 100 && loanForm.usdAmount <= 100000 && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Tương đương VND:</span> {(() => {
                      const vndAmount = loanForm.usdAmount * 26199; // USD to VND rate
                      return new Intl.NumberFormat('vi-VN').format(vndAmount) + ' VND';
                    })()}
                  </div>
                </div>
              )}
              
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Tối thiểu: $100 (~2.6M VND)</span>
                <span>Tối đa: $100,000 (~2.6B VND)</span>
              </div>
            </div>

            {/* Flexible Term Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Kỳ hạn vay <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  value={loanForm.term}
                  onChange={(e) => {
                    const term = parseInt(e.target.value);
                    updateLoanForm('term', term);
                    if (term !== 0) {
                      updateLoanForm('customTerm', '');
                    }
                  }}
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="3">3 tháng</option>
                  <option value="6">6 tháng</option>
                  <option value="9">9 tháng</option>
                  <option value="12">12 tháng</option>
                  <option value="18">18 tháng</option>
                  <option value="24">24 tháng</option>
                  <option value="36">36 tháng</option>
                  <option value="0">Tùy chỉnh</option>
                </select>
                {loanForm.term === 0 && (
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Số tháng"
                    defaultValue={loanForm.customTerm}
                    onBlur={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      updateLoanForm('customTerm', value);
                    }}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Kỳ hạn dài hơn có thể có lãi suất cao hơn nhưng trả góp nhẹ hơn
              </div>
            </div>

            {/* Enhanced Purpose Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Mục đích vay <span className="text-red-500">*</span>
              </label>
              <select 
                value={loanForm.purpose}
                onChange={(e) => {
                  updateLoanForm('purpose', e.target.value);
                  if (e.target.value !== 'other') {
                    updateLoanForm('customPurpose', '');
                  }
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="education">Học phí / Chi phí giáo dục</option>
                <option value="living">Chi phí sinh hoạt</option>
                <option value="business">Vốn kinh doanh / Khởi nghiệp</option>
                <option value="emergency">Chi phí khẩn cấp / Y tế</option>
                <option value="home">Sửa chữa / Cải thiện nhà ở</option>
                <option value="travel">Du lịch / Nghỉ dưỡng</option>
                <option value="debt">Hợp nhất nợ</option>
                <option value="investment">Đầu tư cá nhân</option>
                <option value="other">Mục đích khác</option>
              </select>
              {loanForm.purpose === 'other' && (
                <input
                  type="text"
                  placeholder="Mô tả mục đích vay cụ thể..."
                  defaultValue={loanForm.customPurpose}
                  onBlur={(e) => updateLoanForm('customPurpose', e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
              )}
            </div>

            {/* Professional Information */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Nghề nghiệp <span className="text-red-500">*</span>
              </label>
              <select 
                value={loanForm.profession}
                onChange={(e) => updateLoanForm('profession', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="student">Sinh viên</option>
                <option value="employee">Nhân viên văn phòng</option>
                <option value="worker">Công nhân</option>
                <option value="freelancer">Freelancer / Tự do</option>
                <option value="small_business">Chủ kinh doanh nhỏ</option>
                <option value="teacher">Giáo viên / Giảng viên</option>
                <option value="healthcare">Y tế / Chăm sóc sức khỏe</option>
                <option value="tech">Công nghệ thông tin</option>
                <option value="other">Nghề khác</option>
              </select>
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Thu nhập hàng tháng (tùy chọn)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="VD: 10.000.000 VND"
                  defaultValue={loanForm.monthlyIncome}
                  onChange={(e) => {
                    // Tự động format số với dấu chấm phân cách nghìn
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value === '') {
                      e.target.value = '';
                      return;
                    }
                    const numValue = parseInt(value);
                    e.target.value = numValue.toLocaleString('de-DE');
                  }}
                  onBlur={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const formattedValue = value ? parseInt(value).toLocaleString('de-DE') : '';
                    updateLoanForm('monthlyIncome', formattedValue);
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
                <span className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">VND</span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Thông tin này giúp cải thiện đánh giá tín dụng của bạn
              </div>
            </div>

            {/* Additional Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Mô tả thêm (tùy chọn)
              </label>
              <textarea
                rows={3}
                placeholder="Chia sẻ thêm về hoàn cảnh, kế hoạch sử dụng tiền vay, khả năng trả nợ..."
                defaultValue={loanForm.description}
                onBlur={(e) => updateLoanForm('description', e.target.value)}
                maxLength={500}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {loanForm.description.length}/500 ký tự
              </div>
            </div>

            {/* Analysis Button and Prediction */}
            <div className="space-y-4">
              {loanError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{loanError}</span>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Dự đoán sơ bộ:</h4>
                {loanForm.usdAmount >= 100 && loanForm.usdAmount <= 100000 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Lãi suất dự kiến:</span>
                        <span className={`ml-2 font-semibold ${analyzeCredit.interestRate <= 12 ? 'text-green-600 dark:text-green-400' : analyzeCredit.interestRate <= 18 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                          {analyzeCredit.interestRate.toFixed(1)}%/năm
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Khả năng duyệt:</span>
                        <span className={`ml-2 font-semibold ${analyzeCredit.approvalChance >= 70 ? 'text-green-600 dark:text-green-400' : analyzeCredit.approvalChance >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                          {analyzeCredit.approvalChance >= 70 ? 'Cao' : analyzeCredit.approvalChance >= 50 ? 'Trung bình' : 'Thấp'} ({analyzeCredit.approvalChance.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Điểm tín dụng dự kiến:</span>
                        <span className={`font-semibold ${analyzeCredit.creditScore >= 700 ? 'text-green-600 dark:text-green-400' : analyzeCredit.creditScore >= 600 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                          {analyzeCredit.creditScore} ({analyzeCredit.creditGrade})
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-gray-600 dark:text-gray-300">Số cần vay:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {formatCurrency(loanForm.usdAmount, 'USD')} (≈ {formatCurrency(getAssetAmountFromUSD(loanForm.usdAmount, loanForm.currency), loanForm.currency)})
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-gray-600 dark:text-gray-300">Tương đương VND:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400 text-xs">
                          {(() => {
                            const vndAmount = loanForm.usdAmount * 26199; // USD to VND
                            return new Intl.NumberFormat('vi-VN').format(vndAmount) + ' VND';
                          })()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-gray-500 dark:text-gray-400">
                      {!loanForm.usdAmount ? 
                        'Vui lòng nhập số tiền USD muốn vay để xem dự đoán' :
                        'Vui lòng nhập số tiền từ $100 - $100,000 để xem dự đoán'
                      }
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={simulateAIAnalysis}
                disabled={isAnalyzing || !loanForm.usdAmount || loanForm.usdAmount < 100 || loanForm.usdAmount > 100000 || (!loanForm.term && !loanForm.customTerm)}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Hệ thống AI đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    <span>Phân tích tín dụng chi tiết</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Analysis Results Panel */}
          <div className="space-y-6">
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                      Hệ thống AI đang phân tích dữ liệu
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Phân tích dữ liệu on-chain...</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Xác minh thông tin KYC...</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Phân tích hành vi thanh toán...</span>
                    </div>
                    <div className="flex items-center space-x-2 opacity-50">
                      <Clock className="h-4 w-4" />
                      <span>Tính toán điểm tín dụng...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {showCreditAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg p-6 ${analyzeCredit.creditScore >= 650 ? 'bg-green-50 dark:bg-green-900/20' : analyzeCredit.creditScore >= 550 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {analyzeCredit.creditScore >= 650 ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : analyzeCredit.creditScore >= 550 ? (
                      <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    )}
                    <h3 className={`text-lg font-semibold ${analyzeCredit.creditScore >= 650 ? 'text-green-800 dark:text-green-300' : analyzeCredit.creditScore >= 550 ? 'text-yellow-800 dark:text-yellow-300' : 'text-red-800 dark:text-red-300'}`}>
                      Phân tích hoàn tất cho {formatCurrency(loanForm.usdAmount, 'USD')} (≈ {formatCurrency(getAssetAmountFromUSD(loanForm.usdAmount, loanForm.currency), loanForm.currency)})
                    </h3>
                  </div>
                  
                  {/* Dynamic Credit Analysis Results */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${analyzeCredit.creditScore >= 650 ? 'text-green-600 dark:text-green-400' : analyzeCredit.creditScore >= 550 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                        {analyzeCredit.creditScore}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Điểm tín dụng</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${analyzeCredit.creditScore >= 650 ? 'text-green-600 dark:text-green-400' : analyzeCredit.creditScore >= 550 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                        {analyzeCredit.creditGrade}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Xếp hạng</div>
                    </div>
                  </div>

                  {/* Enhanced Loan Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-200">Lãi suất được duyệt:</span>
                      <span className={`font-semibold ${analyzeCredit.interestRate <= 12 ? 'text-green-600 dark:text-green-400' : analyzeCredit.interestRate <= 18 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                        {analyzeCredit.interestRate.toFixed(1)}%/năm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-200">Phí xử lý:</span>
                      <span className="text-gray-900 dark:text-white">
                        1.5% ({formatCurrency(analyzeCredit.processingFee, loanForm.currency)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-200">Kỳ hạn được duyệt:</span>
                      <span className="text-gray-900 dark:text-white">
                        {loanForm.term || loanForm.customTerm} tháng
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-200">Khả năng được duyệt:</span>
                      <span className={`font-semibold ${analyzeCredit.approvalChance >= 80 ? 'text-green-600 dark:text-green-400' : analyzeCredit.approvalChance >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                        {analyzeCredit.approvalChance >= 80 ? 'Rất cao' : analyzeCredit.approvalChance >= 60 ? 'Cao' : analyzeCredit.approvalChance >= 40 ? 'Trung bình' : 'Thấp'} ({analyzeCredit.approvalChance.toFixed(0)}%)
                      </span>
                    </div>
                  </div>

                  {/* Special Offers */}
                  {analyzeCredit.specialOffers.length > 0 && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-300 flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        Ưu đãi đặc biệt:
                      </h4>
                      <ul className="text-sm space-y-1 text-purple-700 dark:text-purple-400">
                        {analyzeCredit.specialOffers.map((offer, index) => (
                          <li key={index}>🎉 {offer}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Positive Factors */}
                  {analyzeCredit.positiveFactors.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Các yếu tố tích cực:</h4>
                      <ul className="text-sm space-y-1 text-green-600 dark:text-green-400">
                        {analyzeCredit.positiveFactors.map((factor, index) => (
                          <li key={index}>✓ {factor}</li>
                        ))}
                        {analyzeCredit.creditScore >= 600 && <li>✓ Xác minh danh tính cơ bản thành công</li>}
                        {loanForm.monthlyIncome && <li>✓ Đã cung cấp thông tin thu nhập</li>}
                        {loanForm.description && <li>✓ Có mô tả chi tiết về mục đích vay</li>}
                        {loanForm.usdAmount <= 5000 && <li>✓ Số tiền vay trong tầm kiểm soát</li>}
                      </ul>
                    </div>
                  )}

                  {/* Risk Factors */}
                  {analyzeCredit.riskFactors.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-300">Yếu tố cần lưu ý:</h4>
                      <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-400">
                        {analyzeCredit.riskFactors.map((risk, index) => (
                          <li key={index}>⚠ {risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analyzeCredit.recommendations.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">Khuyến nghị:</h4>
                      <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-400">
                        {analyzeCredit.recommendations.map((rec, index) => (
                          <li key={index}>💡 {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Monthly Payment Calculation */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">Dự toán trả góp hàng tháng:</h4>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(analyzeCredit.monthlyPayment, 'USD')}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Trong {loanForm.term || loanForm.customTerm} tháng (≈ {formatCurrency(getAssetAmountFromUSD(analyzeCredit.monthlyPayment, loanForm.currency), loanForm.currency)}/tháng)
                    </div>
                    {loanForm.monthlyIncome && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Chiếm {((analyzeCredit.monthlyPayment * 26199) / parseInt(loanForm.monthlyIncome.replace(/[^0-9]/g, '')) * 100).toFixed(1)}% thu nhập hàng tháng
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button 
                    className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                      analyzeCredit.approvalChance >= 60 
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white' 
                        : analyzeCredit.approvalChance >= 40
                        ? 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white'
                        : 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white'
                    } ${isCreatingProposal ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={analyzeCredit.approvalChance >= 40 ? createLoanProposal : () => setShowCreditAnalysis(false)}
                    disabled={isCreatingProposal}
                  >
                    {isCreatingProposal ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Đang tạo đề xuất vay...</span>
                      </>
                    ) : analyzeCredit.approvalChance >= 60 ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Tạo đề xuất vay {formatCurrency(loanForm.usdAmount, 'USD')} (≈ {formatCurrency(getAssetAmountFromUSD(loanForm.usdAmount, loanForm.currency), loanForm.currency)})</span>
                      </>
                    ) : analyzeCredit.approvalChance >= 40 ? (
                      <>
                        <AlertTriangle className="h-5 w-5" />
                        <span>Gửi đề xuất với điều kiện đặc biệt</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5" />
                        <span>Cần cải thiện hồ sơ trước khi gửi</span>
                      </>
                    )}
                  </button>
                  
                  {/* Error message for proposal creation */}
                  {proposalResult && !proposalResult.success && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Lỗi tạo đề xuất:</span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {proposalResult.error}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!isAnalyzing && !showCreditAnalysis && (
              <div className="space-y-6">
                {/* Interactive Demo Features */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 border border-blue-200 dark:border-purple-800 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">Demo MVP Tương tác</h4>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                    Thay đổi các tham số bên trái để thấy sự linh hoạt của nền tảng PentaLend trong việc tùy chỉnh khoản vay theo nhu cầu cá nhân.
                  </p>
                  
                  {/* Real-time form summary */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">Bản tóm tắt khoản vay hiện tại:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Loại tài sản:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {loanForm.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Số cần vay:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(loanForm.usdAmount, 'USD')} (≈ {formatCurrency(getAssetAmountFromUSD(loanForm.usdAmount, loanForm.currency), loanForm.currency)})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Kỳ hạn:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {loanForm.term || loanForm.customTerm} tháng
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Mục đích:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {loanForm.purpose === 'education' ? 'Giáo dục' :
                           loanForm.purpose === 'business' ? 'Kinh doanh' :
                           loanForm.purpose === 'emergency' ? 'Khẩn cấp' :
                           loanForm.purpose === 'other' ? 'Tùy chỉnh' : 'Khác'}
                        </span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-gray-600 dark:text-gray-300">Tương đương VND:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {(() => {
                            const vndAmount = loanForm.usdAmount * 26199;
                            return new Intl.NumberFormat('vi-VN').format(vndAmount) + ' VND';
                          })()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Live calculation preview with AI analysis */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Trả góp dự kiến/tháng:</span>
                        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                          {(() => {
                            if (!loanForm.usdAmount || loanForm.usdAmount < 100 || loanForm.usdAmount > 100000 || (!loanForm.term && !loanForm.customTerm)) return '---';
                            return formatCurrency(analyzeCredit.monthlyPayment, 'USD');
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600 dark:text-gray-300">Lãi suất dự kiến:</span>
                        <span className={`font-semibold ${analyzeCredit.interestRate <= 12 ? 'text-green-600 dark:text-green-400' : analyzeCredit.interestRate <= 18 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                          {analyzeCredit.interestRate.toFixed(1)}%/năm
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600 dark:text-gray-300">Điểm tín dụng:</span>
                        <span className={`font-semibold ${analyzeCredit.creditScore >= 700 ? 'text-green-600 dark:text-green-400' : analyzeCredit.creditScore >= 600 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                          {analyzeCredit.creditScore} ({analyzeCredit.creditGrade})
                        </span>
                      </div>
                      {loanForm.monthlyIncome && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-600 dark:text-gray-300">Tỷ lệ nợ/thu nhập:</span>
                          <span className={`font-semibold text-xs ${((analyzeCredit.monthlyPayment * 26199) / parseInt(loanForm.monthlyIncome.replace(/[^0-9]/g, '')) * 100) <= 30 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                            {((analyzeCredit.monthlyPayment * 26199) / parseInt(loanForm.monthlyIncome.replace(/[^0-9]/g, '')) * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feature highlights */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Tùy chỉnh số tiền linh hoạt</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Nhiều loại tiền tệ</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Kỳ hạn tùy chọn</span>
                    </div>
                  </div>
                </div>

                {/* Default analysis prompt */}
                <div className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-6 text-center">
                  <Brain className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Điền thông tin và nhấn "Phân tích tín dụng chi tiết" để hệ thống AI đánh giá khả năng vay dựa trên các tham số bạn đã tùy chỉnh
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Số tiền USD: {loanForm.usdAmount ? 'Đã nhập' : 'Cần nhập'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${loanForm.term || loanForm.customTerm ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span>Kỳ hạn: {loanForm.term || loanForm.customTerm ? 'Đã chọn' : 'Cần chọn'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      ) : (
        /* User Loans View */
        <UserLoans 
          userLoans={userLoans}
          onViewLoan={(loan) => {
            setSelectedLoan(loan);
            // Could add modal or navigation to loan details
          }}
          onDeleteLoan={deleteUserLoan}
          onRefresh={() => {
            // Simulate refresh - in real app would fetch from API
            console.log('Refreshing user loans...');
          }}
        />
      )}
    </div>
  );

  // Optimized LendTab with improved performance and stability
  const LendTab = () => {
    // Filter states for better performance
    const [gradeFilter, setGradeFilter] = useState('all');
    const [currencyFilter, setCurrencyFilter] = useState('all');
    const [professionFilter, setProfessionFilter] = useState('all');

    // Memoized filtered loans to prevent unnecessary recalculations
    const filteredLoans = useMemo(() => {
      return loanProposals.filter(loan => {
        const gradeMatch = gradeFilter === 'all' || 
          (gradeFilter === 'A' && ['A+', 'A', 'A-'].includes(loan.creditGrade)) ||
          (gradeFilter === 'B' && ['B+', 'B', 'B-'].includes(loan.creditGrade)) ||
          (gradeFilter === 'C' && ['C+', 'C', 'C-', 'D'].includes(loan.creditGrade));
        
        const currencyMatch = currencyFilter === 'all' || loan.currency === currencyFilter;
        
        const professionMatch = professionFilter === 'all' || 
          (professionFilter === 'student' && loan.borrowerType === 'student') ||
          (professionFilter === 'employee' && loan.borrowerType === 'employee') ||
          (professionFilter === 'business' && loan.borrowerType === 'small_business');
        
        return gradeMatch && currencyMatch && professionMatch;
      });
    }, [loanProposals, gradeFilter, currencyFilter, professionFilter]);

    return (
      <div className="space-y-8">
        {/* Stable Lender Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Multi-Asset</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Tổng đã cho vay</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{lenderProfile.successRate}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Tỷ lệ thành công</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{lenderProfile.loansCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Khoản vay đã tài trợ</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{lenderProfile.rating}/5</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Đánh giá cho vay</div>
              </div>
            </div>
          </div>
        </div>

        {/* Optimized Available Loan Proposals */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Đề xuất vay khả dụng ({filteredLoans.length})
            </h2>
            <div className="flex space-x-2">
              <select 
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="all">Tất cả xếp hạng</option>
                <option value="A">A+ và A</option>
                <option value="B">B+ và B</option>
                <option value="C">C và dưới</option>
              </select>
              <select 
                value={currencyFilter}
                onChange={(e) => setCurrencyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="all">Tất cả tiền tệ</option>
                <option value="USD">USD</option>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="PenGx">PenGx</option>
                <option value="USDC">USDC</option>
              </select>
              <select 
                value={professionFilter}
                onChange={(e) => setProfessionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="all">Tất cả nghề nghiệp</option>
                <option value="student">Sinh viên</option>
                <option value="employee">Nhân viên</option>
                <option value="business">Kinh doanh nhỏ</option>
              </select>
            </div>
          </div>

          {/* Error display */}
          {loanError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-300">{loanError}</span>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoadingLoans && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-700 dark:text-blue-300">Đang tải dữ liệu khoản vay...</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <motion.div
                  key={loan.id}
                  whileHover={{ scale: 1.005 }} // Reduced scale for smoother animation
                  transition={{ duration: 0.2 }} // Added smooth transition
                  className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md dark:hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedLoan(loan)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          loan.borrowerType === 'student' ? 'bg-blue-500' :
                          loan.borrowerType === 'employee' ? 'bg-green-500' :
                          loan.borrowerType === 'worker' ? 'bg-purple-500' : 'bg-orange-500'
                        }`}>
                          {getBorrowerTypeLabel(loan.borrowerType).charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{loan.borrower}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {getBorrowerTypeLabel(loan.borrowerType)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-bold text-lg text-gray-900 dark:text-white">
                        {formatCurrency(loan.amount, loan.currency)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {loan.term} tháng | {loan.currency}
                      </div>
                    </div>

                    <div>
                      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getCreditGradeColor(loan.creditGrade)}`}>
                        {loan.creditGrade} ({loan.creditScore})
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Rủi ro: {loan.riskLevel === 'low' ? 'Thấp' : loan.riskLevel === 'medium' ? 'Trung bình' : 'Cao'}
                      </div>
                    </div>

                    <div>
                      <div className="font-bold text-green-600 dark:text-green-400">{loan.interestRate}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Lãi suất/năm</div>
                    </div>

                    <div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {Math.round((loan.fundedAmount / loan.amount) * 100)}%
                        </div>
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mx-auto mt-1">
                          <div 
                            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((loan.fundedAmount / loan.amount) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      {loan.status === 'funding' ? (
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle funding action
                          }}
                        >
                          Tài trợ
                        </button>
                      ) : loan.status === 'funded' ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">Đã tài trợ</span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Hoàn thành</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Mục đích: <span className="font-medium text-gray-900 dark:text-white">{loan.purpose}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Link className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-600 dark:text-gray-300">Dữ liệu on-chain đã xác minh</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-gray-600 dark:text-gray-300">KYC hoàn tất</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">Không tìm thấy khoản vay phù hợp</p>
                  <p className="text-sm">Thử thay đổi bộ lọc để xem thêm khoản vay</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProfileTab = () => (
    <div className="space-y-8">
      {/* Credit Score Overview */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 dark:from-green-600 dark:to-blue-700 rounded-xl p-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-4">Hồ sơ tín dụng của bạn</h2>
            <p className="text-xl opacity-90 dark:opacity-95 mb-6">
              Điểm tín dụng được tính toán bằng AI dựa trên nhiều nguồn dữ liệu đáng tin cậy
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 dark:bg-white/30 rounded-lg p-4 backdrop-blur">
                <div className="text-3xl font-bold">750</div>
                <div className="text-sm opacity-80 dark:opacity-90">Điểm tín dụng hiện tại</div>
              </div>
              <div className="bg-white/20 dark:bg-white/30 rounded-lg p-4 backdrop-blur">
                <div className="text-3xl font-bold">A</div>
                <div className="text-sm opacity-80 dark:opacity-90">Xếp hạng tín dụng</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">750</div>
                  <div className="text-sm">/ 850</div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-white animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit History and Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Credit Factors */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Các yếu tố ảnh hưởng điểm tín dụng</h3>
          <div className="space-y-4">
            {[
              { factor: 'Lịch sử thanh toán', score: 95, weight: '35%', color: 'green' },
              { factor: 'Tài sản on-chain', score: 88, weight: '25%', color: 'blue' },
              { factor: 'Hoạt động ví điện tử', score: 82, weight: '20%', color: 'purple' },
              { factor: 'Thông tin KYC', score: 100, weight: '10%', color: 'green' },
              { factor: 'Hành vi ứng dụng', score: 75, weight: '10%', color: 'yellow' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{item.factor}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.weight}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-${item.color}-500`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="font-bold text-gray-900 dark:text-white">{item.score}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">điểm</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Borrowing History */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Lịch sử vay</h3>
          <div className="space-y-4">
            {[
              { date: '2024-10', amount: 15000, currency: 'USD', status: 'completed', onTime: true },
              { date: '2024-07', amount: 3.2, currency: 'ETH', status: 'completed', onTime: true },
              { date: '2024-03', amount: 0.8, currency: 'BTC', status: 'completed', onTime: false }
            ].map((loan, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(loan.amount, loan.currency)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{loan.date}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {loan.onTime ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400 font-medium">Thanh toán đúng hạn</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">Thanh toán muộn 3 ngày</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800 dark:text-green-300">Thành tích tốt</span>
            </div>
            <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
              <li>• Chuỗi thanh toán đúng hạn: 24 tháng</li>
              <li>• Không có khoản nợ xấu</li>
              <li>• Tỷ lệ thanh toán đúng hạn: 94%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Khuyến nghị cải thiện điểm tín dụng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border dark:border-blue-800/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-800 dark:text-blue-300">Tăng tài sản crypto</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Nắm giữ thêm ETH, BTC hoặc PenGx có thể cải thiện điểm tín dụng lên +15 điểm
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border dark:border-green-800/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-800 dark:text-green-300">Duy trì thanh toán đúng hạn</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400">
              Tiếp tục thanh toán đúng hạn để đạt mức điểm A+ trong 6 tháng tới
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Loan Detail Modal Component
  const LoanDetailModal = ({ loan, onClose }: { loan: LoanProposal; onClose: () => void }) => {
    const [fundingAmount, setFundingAmount] = useState<string>('');
    const [isSubmittingFunding, setIsSubmittingFunding] = useState(false);
    
    // Generate detailed borrower profile based on loan data
    const borrowerProfile = useMemo(() => {
      // Simulate borrower detailed information based on loan characteristics
      const baseProfile = {
        address: loan.borrower,
        walletAge: Math.floor(Math.random() * 24) + 6, // 6-30 months
        totalTransactions: Math.floor(Math.random() * 500) + 100,
        averageBalance: Math.floor(Math.random() * 50000) + 5000,
        verificationLevel: loan.creditScore > 700 ? 'Fully Verified' : loan.creditScore > 600 ? 'Partially Verified' : 'Basic Verified',
        kycStatus: 'Completed',
        socialScore: Math.floor(loan.creditScore * 0.8), // Derived from credit score
        riskFactors: [] as string[],
        positiveFactors: [] as string[]
      };

      // Add risk factors based on credit score and loan characteristics
      if (loan.creditScore < 600) {
        baseProfile.riskFactors.push('Điểm tín dụng thấp');
      }
      if (loan.amount > 25000) {
        baseProfile.riskFactors.push('Số tiền vay lớn');
      }
      if (loan.term > 12) {
        baseProfile.riskFactors.push('Kỳ hạn vay dài');
      }
      if (loan.borrowerType === 'small_business') {
        baseProfile.riskFactors.push('Thu nhập kinh doanh có thể không đều');
      }

      // Add positive factors
      if (loan.creditScore > 700) {
        baseProfile.positiveFactors.push('Điểm tín dụng cao');
      }
      if (loan.borrowerType === 'employee' || loan.borrowerType === 'student') {
        baseProfile.positiveFactors.push('Nghề nghiệp ổn định');
      }
      if (baseProfile.walletAge > 18) {
        baseProfile.positiveFactors.push('Ví crypto lâu năm');
      }
      if (baseProfile.totalTransactions > 300) {
        baseProfile.positiveFactors.push('Hoạt động giao dịch tích cực');
      }

      return baseProfile;
    }, [loan]);

    // Calculate lending metrics
    const lendingMetrics = useMemo(() => {
      const remainingAmount = loan.amount - loan.fundedAmount;
      const monthlyPayment = (loan.amount * (1 + loan.interestRate / 100)) / loan.term;
      const totalReturn = loan.amount * loan.interestRate / 100;
      const roiAnnualized = (loan.interestRate / 100) * (12 / loan.term);
      
      return {
        remainingAmount,
        monthlyPayment,
        totalReturn,
        roiAnnualized,
        riskAdjustedReturn: roiAnnualized * (loan.creditScore / 850)
      };
    }, [loan]);

    const handleFunding = async () => {
      if (!fundingAmount || isSubmittingFunding) return;
      
      const amount = parseFloat(fundingAmount);
      if (isNaN(amount) || amount <= 0 || amount > lendingMetrics.remainingAmount) {
        alert(`Số tiền không hợp lệ. Vui lòng nhập từ 0.01 đến ${lendingMetrics.remainingAmount.toFixed(loan.currency === 'BTC' ? 6 : loan.currency === 'ETH' ? 4 : 2)} ${loan.currency}`);
        return;
      }

      setIsSubmittingFunding(true);
      
      // Simulate funding process
      setTimeout(() => {
        alert(`Đã tài trợ thành công ${formatCurrency(amount, loan.currency)} cho khoản vay này!`);
        setIsSubmittingFunding(false);
        onClose();
      }, 2000);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chi tiết khoản vay</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Thông tin đầy đủ về người vay và khoản vay</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Loan Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Loan Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border dark:border-gray-600">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Thông tin khoản vay</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Số tiền:</span>
                    <span className="font-bold text-xl text-gray-900 dark:text-white">{formatCurrency(loan.amount, loan.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Kỳ hạn:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{loan.term} tháng</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Lãi suất:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{loan.interestRate}%/năm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Mục đích:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{loan.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Trạng thái:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      loan.status === 'funding' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      loan.status === 'funded' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {loan.status === 'funding' ? 'Đang gây quỹ' : loan.status === 'funded' ? 'Đã đủ vốn' : 'Hoàn thành'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border dark:border-gray-600">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tiến độ gây quỹ</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Đã gây được:</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(loan.fundedAmount, loan.currency)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((loan.fundedAmount / loan.amount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {Math.round((loan.fundedAmount / loan.amount) * 100)}% hoàn thành
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Còn lại: {formatCurrency(lendingMetrics.remainingAmount, loan.currency)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(lendingMetrics.monthlyPayment, loan.currency)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Trả hàng tháng</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {(lendingMetrics.roiAnnualized * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">ROI hàng năm</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Borrower Profile */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Hồ sơ người vay</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Thông tin cơ bản</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        loan.borrowerType === 'student' ? 'bg-blue-500' :
                        loan.borrowerType === 'employee' ? 'bg-green-500' :
                        loan.borrowerType === 'worker' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}>
                        {getBorrowerTypeLabel(loan.borrowerType).charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{loan.borrower}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{getBorrowerTypeLabel(loan.borrowerType)}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Tuổi ví:</span>
                        <span className="text-gray-900 dark:text-white">{borrowerProfile.walletAge} tháng</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Tổng giao dịch:</span>
                        <span className="text-gray-900 dark:text-white">{borrowerProfile.totalTransactions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Số dư trung bình:</span>
                        <span className="text-gray-900 dark:text-white">${borrowerProfile.averageBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Xác minh:</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{borrowerProfile.verificationLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credit Assessment */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Đánh giá tín dụng</h4>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`inline-flex px-4 py-2 rounded-full text-lg font-bold ${getCreditGradeColor(loan.creditGrade)}`}>
                        {loan.creditGrade}
                      </div>
                      <div className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{loan.creditScore}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Điểm tín dụng</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Mức độ rủi ro:</span>
                        <span className={`font-medium ${
                          loan.riskLevel === 'low' ? 'text-green-600 dark:text-green-400' :
                          loan.riskLevel === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {loan.riskLevel === 'low' ? 'Thấp' : loan.riskLevel === 'medium' ? 'Trung bình' : 'Cao'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Điểm xã hội:</span>
                        <span className="text-gray-900 dark:text-white">{borrowerProfile.socialScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Phân tích rủi ro</h4>
                  
                  {borrowerProfile.positiveFactors.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">Yếu tố tích cực:</div>
                      <ul className="space-y-1">
                        {borrowerProfile.positiveFactors.map((factor, index) => (
                          <li key={index} className="text-xs text-green-700 dark:text-green-300 flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {borrowerProfile.riskFactors.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-red-600 dark:text-red-400">Yếu tố rủi ro:</div>
                      <ul className="space-y-1">
                        {borrowerProfile.riskFactors.map((factor, index) => (
                          <li key={index} className="text-xs text-red-700 dark:text-red-300 flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400">KYC đã xác minh</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Link className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-600 dark:text-blue-400">Dữ liệu on-chain</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Funding Action */}
            {loan.status === 'funding' && (
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border dark:border-gray-600">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tài trợ khoản vay này</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                        Số tiền muốn tài trợ
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={fundingAmount}
                          onChange={(e) => {
                            // Only allow numbers and decimal point
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            // Prevent multiple decimal points
                            const parts = value.split('.');
                            if (parts.length <= 2) {
                              setFundingAmount(value);
                            }
                          }}
                          className="w-full p-3 pr-16 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          placeholder={`Tối đa: ${lendingMetrics.remainingAmount.toFixed(loan.currency === 'BTC' ? 6 : loan.currency === 'ETH' ? 4 : 2)}`}
                        />
                        <span className="absolute right-3 top-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-1">
                          {loan.currency}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleFunding}
                      disabled={isSubmittingFunding || !fundingAmount}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      {isSubmittingFunding ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Đang xử lý...</span>
                        </>
                      ) : (
                        <>
                          <Wallet className="h-5 w-5" />
                          <span>Tài trợ ngay</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Lợi nhuận dự kiến</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Tổng lãi:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {fundingAmount ? formatCurrency(parseFloat(fundingAmount) * loan.interestRate / 100, loan.currency) : '--'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">ROI hàng năm:</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {(lendingMetrics.roiAnnualized * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Thời gian hoàn vốn:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{loan.term} tháng</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      * Lợi nhuận dự kiến dựa trên việc người vay trả đúng hạn. Đầu tư có rủi ro.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with Tabs - matching Dashboard structure */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🏦 PentaLend</h1>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                  MVP Demo
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Nền tảng cho vay P2P tự động hóa bằng AI - Được cung cấp bởi PentaGold Ecosystem
              </p>
            </div>
                
            <div className="flex items-center space-x-4">
              {/* Tab Navigation - matching Dashboard style */}
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Tổng quan', icon: Eye },
                  { id: 'borrow', label: 'Vay tiền', icon: DollarSign },
                  { id: 'lend', label: 'Cho vay', icon: TrendingUp },
                  { id: 'profile', label: 'Hồ sơ tín dụng', icon: User }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - matching Dashboard structure */}
      <main className="px-4 py-8 flex-1">
        <div>
          {/* Simplified transitions to reduce conflicts */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <OverviewTab />
            </motion.div>
          )}
          {activeTab === 'borrow' && (
            <motion.div
              key="borrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <BorrowTab />
            </motion.div>
          )}
          {activeTab === 'lend' && (
            <motion.div
              key="lend"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <LendTab />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ProfileTab />
            </motion.div>
          )}
        </div>

      </main>

      {/* Loan Detail Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <LoanDetailModal loan={selectedLoan} onClose={() => setSelectedLoan(null)} />
        )}
      </AnimatePresence>

      {/* Loan Proposal Success Modal */}
      <AnimatePresence>
        {showProposalSuccess && proposalResult && proposalResult.success && (
          <LoanProposalSuccess
            result={proposalResult}
            onClose={() => {
              setShowProposalSuccess(false);
              setProposalResult(null);
              setShowCreditAnalysis(false);
            }}
            onViewProposal={(proposal: LoanProposal) => {
              setShowProposalSuccess(false);
              setBorrowViewMode('myloans'); // Switch to user loans view
              setSelectedLoan(proposal);
            }}
            onCreateAnother={() => {
              setShowProposalSuccess(false);
              setProposalResult(null);
              setShowCreditAnalysis(false);
              setBorrowViewMode('create'); // Stay in create mode
              // Keep form data - don't reset like before
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PentaLend;
