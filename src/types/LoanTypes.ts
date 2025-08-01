// Interface cho đề xuất vay
export interface LoanProposal {
  id: string;
  borrower: string;
  amount: number;
  term: number;
  purpose: string;
  creditScore: number;
  creditGrade: string;
  interestRate: number;
  fundedAmount: number;
  status: 'active' | 'funding' | 'funded' | 'completed';
  riskLevel: 'low' | 'medium' | 'high';
  borrowerType: 'student' | 'employee' | 'worker' | 'small_business';
  currency: 'USD' | 'ETH' | 'BTC' | 'PenGx' | 'USDC';
}

// Interface cho hồ sơ người cho vay
export interface LenderProfile {
  address: string;
  totalFunded: number;
  successRate: number;
  loansCount: number;
  rating: number;
  assetStability: string;
}

// Interface cho dữ liệu form vay
export interface LoanFormData {
  usdAmount: number;
  currency: 'USD' | 'ETH' | 'BTC' | 'PenGx' | 'USDC';
  term: number;
  customTerm: string;
  purpose: 'education' | 'living' | 'business' | 'emergency' | 'home' | 'travel' | 'debt' | 'investment' | 'other';
  customPurpose: string;
  profession: 'student' | 'employee' | 'worker' | 'freelancer' | 'small_business' | 'teacher' | 'healthcare' | 'tech' | 'other';
  monthlyIncome: string;
  description: string;
}

// Interface cho kết quả phân tích tín dụng
export interface CreditAnalysis {
  creditScore: number;
  creditGrade: string;
  interestRate: number;
  approvalChance: number;
  riskFactors: string[];
  positiveFactors: string[];
  recommendations: string[];
  monthlyPayment: number;
  processingFee: number;
  specialOffers: string[];
}

// Interface cho trạng thái ứng dụng
export interface AppState {
  activeTab: 'overview' | 'lend' | 'profile' | 'borrow';
  selectedLoan: LoanProposal | null;
  isAnalyzing: boolean;
  showCreditAnalysis: boolean;
  isLoadingLoans: boolean;
  loanError: string | null;
  isCreatingProposal: boolean;
  proposalSuccess: boolean;
}

// Interface cho kết quả tạo đề xuất vay
export interface CreateProposalResult {
  success: boolean;
  proposal?: LoanProposal;
  error?: string;
  message?: {
    title: string;
    message: string;
    nextSteps: string[];
  };
}
