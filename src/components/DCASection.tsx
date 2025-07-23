import React, { useState } from 'react';
import { Plus, TrendingUp, Calendar, DollarSign, Target, Sparkles, TestTube, Play, Pause, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DCAForm from './DCAForm';
import { useSandbox } from '../contexts/SandboxContext';

interface DCAPlan {
  amount: number;
  frequency: string;
  startDate: string;
  endDate: string;
}

const DCASection: React.FC = () => {
  const { isSandboxMode, virtualDCAPlans, pauseVirtualDCAPlan, resumeVirtualDCAPlan, deleteVirtualDCAPlan } = useSandbox();
  const [plans, setPlans] = useState<DCAPlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (plan: DCAPlan) => {
    if (!isSandboxMode) {
      setPlans([...plans, plan]);
    }
    // Virtual DCA plans are handled in the DCAForm component via createVirtualDCAPlan
    setShowForm(false);
    setError(null);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  
  const getFrequencyText = (frequency: string) => {
    const map: Record<string, string> = {
      daily: 'Hàng ngày',
      weekly: 'Hàng tuần', 
      monthly: 'Hàng tháng'
    };
    return map[frequency] || frequency;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${isSandboxMode ? 'bg-amber-500' : 'bg-amber-500'}`}>
              {isSandboxMode ? <TestTube className="h-6 w-6 text-white" /> : <TrendingUp className="h-6 w-6 text-white" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isSandboxMode ? 'DCA Ảo' : 'Đầu tư định kỳ DCA'}
                </h2>
                {isSandboxMode && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                    <TestTube className="h-3 w-3" />
                    <span>Virtual</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                {isSandboxMode 
                  ? 'Thử nghiệm chiến lược DCA với vốn ảo không rủi ro'
                  : 'Tự động hóa chiến lược đầu tư vàng của bạn với DCA thông minh'
                }
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-5 w-5" />
            <span>Tạo kế hoạch mới</span>
          </motion.button>
        </div>
      </div>
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 mb-4 flex items-center"
          >
            <span className="mr-2">⚠️</span> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {((isSandboxMode && virtualDCAPlans.length === 0) || (!isSandboxMode && plans.length === 0)) && !showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {isSandboxMode ? 'Chưa có kế hoạch DCA ảo nào' : 'Chưa có kế hoạch DCA nào'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
              {isSandboxMode 
                ? 'Tạo kế hoạch DCA ảo đầu tiên để thử nghiệm chiến lược đầu tư không rủi ro với vốn ảo.'
                : 'Tạo kế hoạch DCA đầu tiên để bắt đầu tự động hóa việc đầu tư vàng của bạn một cách thông minh và hiệu quả.'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-5 w-5" />
              <span>{isSandboxMode ? 'Tạo kế hoạch ảo đầu tiên' : 'Tạo kế hoạch đầu tiên'}</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* DCA Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <DCAForm onCreate={handleCreate} />
            <div className="mt-4 text-center">
              <button 
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors"
                onClick={() => setShowForm(false)}
              >
                Hủy bỏ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Virtual DCA Plans Display */}
      {isSandboxMode && virtualDCAPlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <TestTube className="h-5 w-5 text-amber-600" />
            <span>Kế hoạch DCA Ảo ({virtualDCAPlans.length})</span>
          </h3>
          
          {virtualDCAPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-200 dark:border-amber-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${plan.isActive ? 'bg-green-500' : 'bg-gray-400'}`}>
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(plan.amount)} • {getFrequencyText(plan.frequency)}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {plan.isActive ? '🟢 Đang hoạt động' : '⏸️ Đã tạm dừng'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => plan.isActive ? pauseVirtualDCAPlan(plan.id) : resumeVirtualDCAPlan(plan.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      plan.isActive 
                        ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' 
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                    title={plan.isActive ? 'Tạm dừng' : 'Tiếp tục'}
                  >
                    {plan.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => deleteVirtualDCAPlan(plan.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    title="Xóa kế hoạch"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">Tổng đầu tư</div>
                  <div className="font-semibold text-amber-800 dark:text-amber-300">
                    {formatCurrency(plan.totalInvested)}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-xs text-green-600 dark:text-green-400 mb-1">Tokens tích lũy</div>
                  <div className="font-semibold text-green-800 dark:text-green-300">
                    {plan.tokensAccumulated.toFixed(6)}
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Số lần DCA</div>
                  <div className="font-semibold text-blue-800 dark:text-blue-300">
                    {plan.executionHistory.length}
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Giá TB</div>
                  <div className="font-semibold text-purple-800 dark:text-purple-300">
                    {plan.tokensAccumulated > 0 ? formatCurrency(plan.totalInvested / plan.tokensAccumulated) : '$0.00'}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>Bắt đầu: {new Date(plan.startDate).toLocaleDateString('vi-VN')}</span>
                {plan.endDate && (
                  <span className="ml-4">Kết thúc: {new Date(plan.endDate).toLocaleDateString('vi-VN')}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Regular DCA Plans Display (Non-Sandbox) */}
      {!isSandboxMode && plans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-amber-600" />
            <span>Kế hoạch DCA ({plans.length})</span>
          </h3>
          
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(plan.amount)} • {getFrequencyText(plan.frequency)}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Bắt đầu: {new Date(plan.startDate).toLocaleDateString('vi-VN')}
                      {plan.endDate && (
                        <span className="ml-4">Kết thúc: {new Date(plan.endDate).toLocaleDateString('vi-VN')}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Educational Benefits Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tại sao nên sử dụng DCA?
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
            <div className="p-2 bg-green-500 rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">Giảm rủi ro biến động</h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Đầu tư đều đặn giúp giảm thiểu tác động của biến động giá vàng
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
            <div className="p-2 bg-blue-500 rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Tự động hóa đầu tư</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Không cần theo dõi thị trường liên tục, hệ thống tự động thực hiện
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
            <div className="p-2 bg-purple-500 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-1">Tích lũy tài sản</h4>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Xây dựng tài sản vàng một cách ổn định theo thời gian
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">Không cần timing thị trường</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Loại bỏ áp lực phải dự đoán thời điểm tốt nhất để mua vàng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DCASection;
