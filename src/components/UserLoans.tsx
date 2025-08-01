import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Eye,
  RefreshCw,
  AlertCircle,
  Target,
  Trash2,
  X
} from 'lucide-react';
import { LoanProposal } from '../types/LoanTypes';
import Toast from './Toast';

interface UserLoansProps {
  userLoans: LoanProposal[];
  onViewLoan: (loan: LoanProposal) => void;
  onDeleteLoan?: (loanId: string) => void;
  onRefresh?: () => void;
}

const UserLoans: React.FC<UserLoansProps> = ({ userLoans, onViewLoan, onDeleteLoan, onRefresh }) => {
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'funding' | 'funded' | 'completed'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // ID of loan to delete
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // ID of loan being deleted
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isVisible: false,
    message: '',
    type: 'info'
  });

  // Filter and sort loans
  const filteredLoans = userLoans
    .filter(loan => filterStatus === 'all' || loan.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return b.id.localeCompare(a.id); // Sort by ID (newer first)
      }
    });

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'funding':
        return {
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          border: 'border-blue-200 dark:border-blue-800',
          icon: Clock,
          label: 'Đang gây quỹ'
        };
      case 'funded':
        return {
          color: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-100 dark:bg-green-900/30',
          border: 'border-green-200 dark:border-green-800',
          icon: CheckCircle,
          label: 'Đã gây quỹ'
        };
      case 'completed':
        return {
          color: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          border: 'border-gray-200 dark:border-gray-800',
          icon: CheckCircle,
          label: 'Hoàn thành'
        };
      case 'active':
        return {
          color: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          border: 'border-purple-200 dark:border-purple-800',
          icon: TrendingUp,
          label: 'Đang trả'
        };
      default:
        return {
          color: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          border: 'border-gray-200 dark:border-gray-800',
          icon: AlertTriangle,
          label: status
        };
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

  const calculateFundingProgress = (loan: LoanProposal) => {
    return Math.min(100, (loan.fundedAmount / loan.amount) * 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500 dark:bg-green-400';
    if (progress >= 75) return 'bg-blue-500 dark:bg-blue-400';
    if (progress >= 50) return 'bg-yellow-500 dark:bg-yellow-400';
    return 'bg-orange-500 dark:bg-orange-400';
  };

  const getTotalStats = () => {
    const total = userLoans.length;
    const funding = userLoans.filter(l => l.status === 'funding').length;
    const funded = userLoans.filter(l => l.status === 'funded').length;
    const completed = userLoans.filter(l => l.status === 'completed').length;
    const active = userLoans.filter(l => l.status === 'active').length;
    const totalAmount = userLoans.reduce((sum, loan) => {
      // Convert all to USD for total calculation
      const usdAmount = loan.currency === 'USD' ? loan.amount 
        : loan.currency === 'ETH' ? loan.amount * 3830.31
        : loan.currency === 'BTC' ? loan.amount * 118416.70
        : loan.currency === 'PenGx' ? loan.amount * 3294.04 / 31.1035
        : loan.amount; // USDC
      return sum + usdAmount;
    }, 0);

    return { total, funding, funded, completed, active, totalAmount };
  };

  const stats = getTotalStats();

  // Handle delete loan
  const handleDeleteLoan = async (loanId: string) => {
    console.log('handleDeleteLoan called with loanId:', loanId);
    console.log('onDeleteLoan callback exists:', !!onDeleteLoan);
    
    if (!onDeleteLoan) {
      console.error('onDeleteLoan callback is not provided');
      setToast({
        isVisible: true,
        message: 'Lỗi: Không thể xóa khoản vay!',
        type: 'error'
      });
      return;
    }
    
    try {
      console.log('Starting delete process for loan:', loanId);
      setIsDeleting(loanId);
      
      // Simulate async delete operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Calling onDeleteLoan for:', loanId);
      // Call the delete function
      onDeleteLoan(loanId);
      
      console.log('Delete completed, resetting states');
      // Reset states
      setDeleteConfirm(null);
      setIsDeleting(null);
      
      // Show success toast
      setToast({
        isVisible: true,
        message: 'Xóa khoản vay thành công!',
        type: 'success'
      });
      
      console.log('Toast shown, delete process complete');
    } catch (error) {
      console.error('Error deleting loan:', error);
      setIsDeleting(null);
      setDeleteConfirm(null);
      setToast({
        isVisible: true,
        message: 'Có lỗi xảy ra khi xóa khoản vay!',
        type: 'error'
      });
    }
  };

  // Confirm delete
  const confirmDelete = (loanId: string) => {
    setDeleteConfirm(loanId);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Close toast
  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  if (userLoans.length === 0) {
    return (
      <div className="space-y-6">
        {/* Empty State */}
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <DollarSign className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Chưa có khoản vay nào
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Bạn chưa tạo khoản vay nào. Hãy bắt đầu bằng cách tạo đề xuất vay đầu tiên.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  Tạo khoản vay đầu tiên
                </h4>
                <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                  <li>• Điền thông tin cá nhân và mục đích vay</li>
                  <li>• Hệ thống AI sẽ đánh giá tín dụng tự động</li>
                  <li>• Đề xuất được tạo và đưa vào hệ thống gây quỹ</li>
                  <li>• Theo dõi tiến độ và nhận tiền khi hoàn tất</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Tổng khoản</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.funding}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Đang gây quỹ</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.funded}</div>
          <div className="text-sm text-green-700 dark:text-green-300">Đã gây quỹ</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.active}</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Đang trả</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.completed}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Hoàn thành</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            ${Math.round(stats.totalAmount).toLocaleString()}
          </div>
          <div className="text-sm text-yellow-700 dark:text-yellow-300">Tổng giá trị</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="funding">Đang gây quỹ</option>
            <option value="funded">Đã gây quỹ</option>
            <option value="active">Đang trả</option>
            <option value="completed">Hoàn thành</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="date">Sắp xếp theo ngày</option>
            <option value="amount">Sắp xếp theo số tiền</option>
            <option value="status">Sắp xếp theo trạng thái</option>
          </select>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm mới</span>
          </button>
        )}
      </div>

      {/* Loans List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredLoans.map((loan, index) => {
            const statusConfig = getStatusConfig(loan.status);
            const progress = calculateFundingProgress(loan);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isDeleting === loan.id ? 0.5 : 1, 
                  y: 0,
                  scale: isDeleting === loan.id ? 0.95 : 1 
                }}
                exit={{ 
                  opacity: 0, 
                  y: -20, 
                  scale: 0.95,
                  transition: { duration: 0.3 }
                }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: isDeleting === loan.id ? 0.95 : 1.02 }}
                className={`bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all ${
                  isDeleting === loan.id ? 'pointer-events-none' : ''
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                        {loan.id}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCreditGradeColor(loan.creditGrade)}`}>
                        {loan.creditGrade}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(loan.amount, loan.currency)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {loan.purpose}
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}>
                    <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                    <span className={`text-sm font-semibold ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Lãi suất:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {loan.interestRate}%/năm
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Kỳ hạn:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {loan.term} tháng
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Điểm tín dụng:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {loan.creditScore}
                    </span>
                  </div>
                </div>

                {/* Progress Bar (for funding status) */}
                {loan.status === 'funding' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Tiến độ gây quỹ</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                        style={{ width: `${Math.min(100, progress)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{formatCurrency(loan.fundedAmount, loan.currency)} đã gây quỹ</span>
                      <span>Còn {formatCurrency(loan.amount - loan.fundedAmount, loan.currency)}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {deleteConfirm === loan.id ? (
                    // Delete confirmation with animation
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                          Xóa khoản vay này?
                        </span>
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-400 mb-3">
                        Thao tác này không thể hoàn tác. Khoản vay sẽ bị xóa vĩnh viễn.
                      </p>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDeleteLoan(loan.id)}
                          disabled={isDeleting === loan.id}
                          className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white py-2 px-3 rounded text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
                        >
                          {isDeleting === loan.id ? (
                            <>
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="rounded-full h-3 w-3 border-b-2 border-white"
                              />
                              <span>Đang xóa...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3" />
                              <span>Xóa</span>
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => cancelDelete()}
                          disabled={isDeleting === loan.id}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
                        >
                          <X className="w-3 h-3" />
                          <span>Hủy</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    // Normal action buttons
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onViewLoan(loan)}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Xem chi tiết</span>
                      </button>
                      
                      {onDeleteLoan && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => confirmDelete(loan.id)}
                          className="px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
                          title="Xóa khoản vay"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredLoans.length === 0 && userLoans.length > 0 && (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Không tìm thấy khoản vay
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Không có khoản vay nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      )}
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
};

export default UserLoans;
