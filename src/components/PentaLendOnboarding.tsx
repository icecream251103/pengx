import React, { useState } from 'react';
import { 
  X, ChevronRight, ChevronLeft, 
  Coins, TrendingUp, Shield, Users, 
  PiggyBank, HandCoins, 
  BarChart3, Lock, CheckCircle, 
  AlertTriangle, Percent
} from 'lucide-react';

interface PentaLendOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const PentaLendOnboarding: React.FC<PentaLendOnboardingProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Chào mừng đến với PentaLend',
      icon: Coins,
      content: (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            PentaLend là nền tảng cho vay-đi vay phi tập trung dựa trên token PenGx (vàng tổng hợp). 
            Kiếm lợi nhuận từ việc cho vay hoặc vay tài sản với lãi suất cạnh tranh.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Lợi ích chính:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Cho vay và kiếm lãi suất hấp dẫn (5-12% APY)</li>
              <li>• Vay tài sản với tài sản thế chấp linh hoạt</li>
              <li>• Thanh toán tức thì, không cần KYC phức tạp</li>
              <li>• Bảo mật hoàn toàn bằng smart contract</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Khái niệm cơ bản về DeFi Lending',
      icon: TrendingUp,
      content: (
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Hiểu rõ các khái niệm cơ bản trong lending/borrowing:
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <PiggyBank className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Lending (Cho vay)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Gửi token vào pool để cho người khác vay, nhận lãi suất theo thời gian.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <HandCoins className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Borrowing (Đi vay)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Thế chấp tài sản để vay token khác, trả lãi suất theo thời gian.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <Percent className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">APY (Annual Percentage Yield)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Lãi suất hàng năm, bao gồm lãi kép. Càng cao càng có lợi cho người cho vay.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Cách hoạt động của Lending Pool',
      icon: BarChart3,
      content: (
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Lending Pool là nơi tập trung tài sản từ nhiều người cho vay:
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pool PenGx</span>
              <span className="text-sm text-green-600 dark:text-green-400">8.5% APY</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Utilization: 75%</span>
              <span>Available: $125,000</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Bạn gửi token PenGx vào pool</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Người vay lấy token từ pool, thế chấp tài sản</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Bạn nhận lãi suất từ phí vay của họ</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Collateral và Liquidation',
      icon: Shield,
      content: (
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Hiểu về tài sản thế chấp và rủi ro thanh lý:
          </p>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Collateral (Tài sản thế chấp)</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Tài sản bạn khóa để đảm bảo khoản vay. Thường phải thế chấp nhiều hơn số vay (150-200%).
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200">Liquidation (Thanh lý)</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Nếu giá trị thế chấp giảm quá thấp, tài sản sẽ bị bán để trả nợ. Hãy theo dõi Health Factor!
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Ví dụ:</h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>• Bạn thế chấp $15,000 PenGx</p>
                <p>• Vay $10,000 USDC (LTV = 67%)</p>
                <p>• Nếu PenGx giảm giá → Health Factor giảm</p>
                <p>• Health Factor dưới 1.0 → Liquidation xảy ra</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Giao diện chính của PentaLend',
      icon: BarChart3,
      content: (
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Làm quen với các tab và tính năng chính:
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Overview</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Xem tổng quan thị trường, APY của các pool, total supply/borrow.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <PiggyBank className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Lend</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Gửi token vào pool để cho vay, xem earnings và withdraw tiền.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                <HandCoins className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Borrow</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Tạo khoản vay mới, quản lý loans hiện tại, theo dõi health factor.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Profile</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Xem lịch sử giao dịch, portfolio balance và lending statistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Lưu ý quan trọng về rủi ro',
      icon: AlertTriangle,
      content: (
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Trước khi bắt đầu, hãy hiểu rõ các rủi ro:
          </p>
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">⚠️ Rủi ro khi Lending:</h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Smart contract risk - Có thể có bugs</li>
                <li>• Impermanent loss nếu giá token thay đổi</li>
                <li>• Liquidity risk - Pool có thể cạn tiền</li>
              </ul>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">⚠️ Rủi ro khi Borrowing:</h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Liquidation risk - Mất tài sản thế chấp</li>
                <li>• Interest rate risk - Lãi suất có thể tăng</li>
                <li>• Price volatility - Giá token biến động mạnh</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Lời khuyên:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Bắt đầu với số tiền nhỏ để học cách hoạt động</li>
                <li>• Luôn theo dõi Health Factor khi vay</li>
                <li>• Đa dạng hóa thay vì đặt tất cả vào một pool</li>
                <li>• Hiểu rõ tokenomics trước khi tham gia</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Sẵn sàng bắt đầu!',
      icon: CheckCircle,
      content: (
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Bạn đã sẵn sàng sử dụng PentaLend!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hãy bắt đầu với một khoản nhỏ để làm quen với nền tảng.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🚀 Bước tiếp theo:</h4>
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">1</div>
                <span>Kết nối ví và kiểm tra balance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">2</div>
                <span>Xem Overview để hiểu thị trường</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">3</div>
                <span>Thử lending với số tiền nhỏ trước</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bước {currentStep + 1} / {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-500' 
                    : index < currentStep 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-500 text-white rounded-lg hover:from-blue-600 hover:to-blue-600 transition-all duration-200 font-medium"
          >
            <span>{currentStep === steps.length - 1 ? 'Bắt đầu' : 'Tiếp theo'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PentaLendOnboarding;
