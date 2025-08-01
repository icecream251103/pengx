import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Eye, TrendingUp, AlertCircle, Copy } from 'lucide-react';
import { LoanProposal, CreateProposalResult } from '../types/LoanTypes';

interface LoanProposalSuccessProps {
  result: CreateProposalResult;
  onClose: () => void;
  onViewProposal?: (proposal: LoanProposal) => void;
  onCreateAnother?: () => void;
}

const LoanProposalSuccess: React.FC<LoanProposalSuccessProps> = ({
  result,
  onClose,
  onViewProposal,
  onCreateAnother
}) => {
  if (!result.success || !result.proposal || !result.message) {
    return null;
  }

  const { proposal, message } = result;

  const copyProposalId = () => {
    navigator.clipboard.writeText(proposal.id);
    // Có thể thêm toast notification ở đây
  };

  const formatCurrency = (amount: number, currency: string) => {
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
      case 'A+': case 'A': return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30';
      case 'A-': case 'B+': return 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30';
      case 'B': case 'B-': return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30';
      case 'C+': case 'C': return 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30';
      default: return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header thành công */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4"
          >
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {message.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {message.message}
          </p>
        </div>

        {/* Thông tin đề xuất */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Chi tiết đề xuất vay
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Mã đề xuất:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {proposal.id}
                  </span>
                  <button
                    onClick={copyProposalId}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Số tiền:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(proposal.amount, proposal.currency)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Kỳ hạn:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {proposal.term} tháng
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Mục đích:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {proposal.purpose}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Điểm tín dụng:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {proposal.creditScore}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Xếp hạng:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCreditGradeColor(proposal.creditGrade)}`}>
                  {proposal.creditGrade}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Lãi suất:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {proposal.interestRate}%/năm
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Trạng thái:</span>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    Đang gây quỹ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Các bước tiếp theo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Các bước tiếp theo
          </h3>
          
          <div className="space-y-3">
            {message.nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                    {index + 1}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lưu ý quan trọng */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                Lưu ý quan trọng
              </h4>
              <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                <li>• Đề xuất vay sẽ được công khai trên nền tảng để các nhà đầu tư xem xét</li>
                <li>• Thông tin cá nhân của bạn được bảo mật, chỉ hiển thị địa chỉ ví</li>
                <li>• Khi gây quỹ thành công, số tiền sẽ được chuyển vào ví của bạn</li>
                <li>• Lãi suất và điều khoản không thể thay đổi sau khi tạo đề xuất</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onViewProposal?.(proposal)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>Xem trong khoản vay của tôi</span>
          </button>
          
          <button
            onClick={onCreateAnother}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Tạo khoản vay khác
          </button>
          
          <button
            onClick={onClose}
            className="sm:w-auto px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoanProposalSuccess;
