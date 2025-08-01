import { LoanProposal, LoanFormData, CreditAnalysis } from '../types/LoanTypes';

// Service class để xử lý tạo đề xuất vay
export class LoanProposalService {
  
  /**
   * Tạo ID duy nhất cho đề xuất vay
   */
  private static generateLoanId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);
    return `LP_${timestamp}_${randomPart}`.toUpperCase();
  }

  /**
   * Tạo địa chỉ ví giả lập cho người vay
   */
  private static generateBorrowerAddress(): string {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 8; i++) {
      address += chars[Math.floor(Math.random() * 16)];
    }
    address += '...';
    for (let i = 0; i < 4; i++) {
      address += chars[Math.floor(Math.random() * 16)];
    }
    return address;
  }

  /**
   * Chuyển đổi từ USD sang tài sản được chọn
   */
  private static convertUSDToAsset(usdAmount: number, currency: string): number {
    const usdToAssetRates = {
      USD: 1,
      ETH: 1 / 3830.31,
      BTC: 1 / 118416.70,
      PenGx: 1 / 3294.04,
      USDC: 1
    };
    const rate = usdToAssetRates[currency as keyof typeof usdToAssetRates] || 1;
    return usdAmount * rate;
  }

  /**
   * Xác định mức độ rủi ro dựa trên điểm tín dụng
   */
  private static determineRiskLevel(creditScore: number): 'low' | 'medium' | 'high' {
    if (creditScore >= 680) return 'low';
    if (creditScore >= 580) return 'medium';
    return 'high';
  }

  /**
   * Chuyển đổi nghề nghiệp sang loại người vay
   */
  private static mapProfessionToBorrowerType(profession: string): 'student' | 'employee' | 'worker' | 'small_business' {
    switch (profession) {
      case 'student':
        return 'student';
      case 'employee':
      case 'teacher':
      case 'healthcare':
      case 'tech':
        return 'employee';
      case 'worker':
        return 'worker';
      case 'small_business':
      case 'freelancer':
        return 'small_business';
      default:
        return 'employee';
    }
  }

  /**
   * Lấy mô tả mục đích vay
   */
  private static getPurposeDescription(formData: LoanFormData): string {
    const purposeMap = {
      education: 'Học phí / Chi phí giáo dục',
      living: 'Chi phí sinh hoạt',
      business: 'Vốn kinh doanh / Khởi nghiệp',
      emergency: 'Chi phí khẩn cấp / Y tế',
      home: 'Sửa chữa / Cải thiện nhà ở',
      travel: 'Du lịch / Nghỉ dưỡng',
      debt: 'Hợp nhất nợ',
      investment: 'Đầu tư cá nhân',
      other: formData.customPurpose || 'Mục đích khác'
    };
    return purposeMap[formData.purpose];
  }

  /**
   * Tạo đề xuất vay từ dữ liệu form và kết quả phân tích
   */
  static createLoanProposal(
    formData: LoanFormData, 
    creditAnalysis: CreditAnalysis,
    onSuccess?: (proposal: LoanProposal) => void,
    onError?: (error: string) => void
  ): Promise<LoanProposal> {
    return new Promise((resolve, reject) => {
      try {
        // Validate dữ liệu đầu vào
        if (!formData.usdAmount || formData.usdAmount < 100 || formData.usdAmount > 100000) {
          const error = 'Số tiền vay không hợp lệ (phải từ $100 - $100,000)';
          onError?.(error);
          reject(new Error(error));
          return;
        }

        const actualTerm = formData.term || parseInt(formData.customTerm) || 6;
        if (actualTerm < 1 || actualTerm > 60) {
          const error = 'Kỳ hạn vay không hợp lệ (phải từ 1-60 tháng)';
          onError?.(error);
          reject(new Error(error));
          return;
        }

        if (creditAnalysis.approvalChance < 15) {
          const error = 'Đơn vay không đủ điều kiện phê duyệt. Vui lòng cải thiện hồ sơ và thử lại.';
          onError?.(error);
          reject(new Error(error));
          return;
        }

        // Tạo đề xuất vay mới
        const assetAmount = this.convertUSDToAsset(formData.usdAmount, formData.currency);
        
        const loanProposal: LoanProposal = {
          id: this.generateLoanId(),
          borrower: this.generateBorrowerAddress(),
          amount: assetAmount,
          term: actualTerm,
          purpose: this.getPurposeDescription(formData),
          creditScore: creditAnalysis.creditScore,
          creditGrade: creditAnalysis.creditGrade,
          interestRate: creditAnalysis.interestRate,
          fundedAmount: 0, // Bắt đầu từ 0, sẽ được cập nhật khi có người cho vay
          status: 'funding' as const,
          riskLevel: this.determineRiskLevel(creditAnalysis.creditScore),
          borrowerType: this.mapProfessionToBorrowerType(formData.profession),
          currency: formData.currency
        };

        // Simulate tạo đề xuất với delay thực tế
        setTimeout(() => {
          try {
            // Thêm một số validation cuối cùng
            if (creditAnalysis.interestRate > 30) {
              const error = 'Lãi suất quá cao, không thể tạo đề xuất. Vui lòng cải thiện điều kiện vay.';
              onError?.(error);
              reject(new Error(error));
              return;
            }

            // Thành công
            onSuccess?.(loanProposal);
            resolve(loanProposal);
          } catch (err) {
            const error = 'Lỗi khi tạo đề xuất vay. Vui lòng thử lại.';
            onError?.(error);
            reject(new Error(error));
          }
        }, 2000); // 2 giây để simulate thời gian xử lý

      } catch (err) {
        const error = 'Có lỗi xảy ra khi xử lý đề xuất vay';
        onError?.(error);
        reject(new Error(error));
      }
    });
  }

  /**
   * Tính toán phí xử lý dựa trên số tiền và loại tài sản
   */
  static calculateProcessingFee(usdAmount: number, currency: string): number {
    let baseFeeRate = 0.015; // 1.5% cơ bản
    
    // Điều chỉnh phí theo loại tài sản
    switch (currency) {
      case 'PenGx':
        baseFeeRate = 0.010; // Giảm phí cho PenGx users
        break;
      case 'USDC':
        baseFeeRate = 0.012; // Phí thấp hơn cho stablecoin
        break;
      case 'ETH':
      case 'BTC':
        baseFeeRate = 0.018; // Phí cao hơn cho crypto biến động
        break;
    }

    return usdAmount * baseFeeRate;
  }

  /**
   * Tạo thông báo thành công sau khi tạo đề xuất
   */
  static generateSuccessMessage(proposal: LoanProposal, formData: LoanFormData): {
    title: string;
    message: string;
    nextSteps: string[];
  } {
    const assetAmount = this.convertUSDToAsset(formData.usdAmount, formData.currency);
    
    return {
      title: '🎉 Đề xuất vay đã được tạo thành công!',
      message: `Đề xuất vay ${proposal.id} của bạn với số tiền ${this.formatCurrency(assetAmount, formData.currency)} đã được đưa vào hệ thống và sẵn sàng để các nhà đầu tư xem xét.`,
      nextSteps: [
        'Đề xuất của bạn sẽ hiển thị trong danh sách cho vay trong vòng 5-10 phút',
        'Các nhà đầu tư sẽ bắt đầu đánh giá và có thể bắt đầu gây quỹ',
        `Với điểm tín dụng ${proposal.creditScore} và lãi suất ${proposal.interestRate}%, dự kiến sẽ gây quỹ thành công trong 2-7 ngày`,
        'Bạn sẽ nhận được thông báo qua email khi có tiến triển',
        'Có thể theo dõi tiến độ gây quỹ trong tab "Lend" của ứng dụng'
      ]
    };
  }

  /**
   * Format tiền tệ để hiển thị
   */
  private static formatCurrency(amount: number, currency: string): string {
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
  }

  /**
   * Validate form data trước khi tạo đề xuất
   */
  static validateLoanForm(formData: LoanFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Kiểm tra số tiền
    if (!formData.usdAmount || formData.usdAmount < 100) {
      errors.push('Số tiền vay tối thiểu là $100');
    }
    if (formData.usdAmount > 100000) {
      errors.push('Số tiền vay tối đa là $100,000');
    }

    // Kiểm tra kỳ hạn
    const actualTerm = formData.term || parseInt(formData.customTerm) || 0;
    if (actualTerm < 1) {
      errors.push('Kỳ hạn vay phải ít nhất 1 tháng');
    }
    if (actualTerm > 60) {
      errors.push('Kỳ hạn vay tối đa là 60 tháng');
    }

    // Kiểm tra mục đích
    if (formData.purpose === 'other' && !formData.customPurpose?.trim()) {
      errors.push('Vui lòng mô tả mục đích vay khi chọn "Mục đích khác"');
    }

    // Kiểm tra thu nhập cho khoản vay lớn
    if (formData.usdAmount > 10000 && !formData.monthlyIncome?.trim()) {
      errors.push('Vay trên $10,000 cần phải khai báo thu nhập hàng tháng');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
