import React, { useState } from 'react';
import { DollarSign, Calendar, Clock, Target, ArrowRight, TestTube } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSandbox } from '../contexts/SandboxContext';

interface DCAPlan {
  amount: number;
  frequency: string;
  startDate: string;
  endDate: string;
}

const DCAForm: React.FC<{ onCreate: (plan: DCAPlan) => void }> = ({ onCreate }) => {
  const { isSandboxMode, createVirtualDCAPlan, sandboxBalance } = useSandbox();
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !startDate) return;
    
    const numAmount = parseFloat(amount);
    setError(null);

    // Validate amount for sandbox mode
    if (isSandboxMode && numAmount > sandboxBalance.virtualUSD) {
      setError(`Không đủ USD ảo. Số dư hiện tại: $${sandboxBalance.virtualUSD.toFixed(2)}`);
      return;
    }

    const plan = {
      amount: numAmount,
      frequency,
      startDate,
      endDate,
    };

    if (isSandboxMode) {
      // Create virtual DCA plan
      createVirtualDCAPlan(plan);
    } else {
      // Create real DCA plan (existing logic)
      onCreate(plan);
    }

    // Reset form
    setAmount('');
    setStartDate('');
    setEndDate('');
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Hàng ngày', icon: '📅' },
    { value: 'weekly', label: 'Hàng tuần', icon: '📆' },
    { value: 'monthly', label: 'Hàng tháng', icon: '🗓️' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className={`p-2 rounded-lg ${isSandboxMode ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-amber-500 to-amber-600'}`}>
            {isSandboxMode ? <TestTube className="h-6 w-6 text-white" /> : <Target className="h-6 w-6 text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isSandboxMode ? 'Thiết lập DCA Ảo' : 'Thiết lập kế hoạch DCA'}
          </h2>
          {isSandboxMode && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
              <TestTube className="h-3 w-3" />
              <span>Virtual</span>
            </div>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {isSandboxMode 
            ? 'Tạo chiến lược DCA ảo để thử nghiệm không rủi ro với vốn ảo'
            : 'Tạo chiến lược đầu tư vàng tự động phù hợp với mục tiêu của bạn'
          }
        </p>
        {isSandboxMode && (
          <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
            <DollarSign className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Số dư ảo: ${sandboxBalance.virtualUSD.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Amount Input */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <DollarSign className="h-4 w-4 inline mr-2" />
            Số tiền đầu tư mỗi lần
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-4 pl-12 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/20 outline-none transition-all text-lg font-medium text-gray-900 dark:text-white"
              placeholder="Nhập số tiền USD"
              required
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <span className="text-lg font-bold text-amber-600">$</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {isSandboxMode 
              ? 'Số tiền ảo này sẽ được đầu tư định kỳ theo tần suất bạn chọn'
              : 'Số tiền này sẽ được đầu tư định kỳ theo tần suất bạn chọn'
            }
          </p>
        </div>

        {/* Frequency Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <Clock className="h-4 w-4 inline mr-2" />
            Tần suất đầu tư
          </label>
          <div className="grid grid-cols-3 gap-3">
            {frequencyOptions.map((option) => (
              <label
                key={option.value}
                className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  frequency === option.value
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-600'
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  checked={frequency === option.value}
                  onChange={e => setFrequency(e.target.value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className={`text-sm font-medium ${
                    frequency === option.value
                      ? 'text-amber-700 dark:text-amber-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {option.label}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <Calendar className="h-4 w-4 inline mr-2" />
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/20 outline-none transition-all text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <Calendar className="h-4 w-4 inline mr-2" />
              Ngày kết thúc (tùy chọn)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/20 outline-none transition-all text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Để trống nếu muốn đầu tư vô thời hạn
            </p>
          </div>
        </div>

        {/* Summary Card */}
        {amount && startDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 border border-amber-200 dark:border-amber-700"
          >
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-3">
              Tóm tắt kế hoạch
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-700 dark:text-amber-400">Số tiền mỗi lần:</span>
                <span className="font-semibold text-amber-800 dark:text-amber-200">${amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700 dark:text-amber-400">Tần suất:</span>
                <span className="font-semibold text-amber-800 dark:text-amber-200">
                  {frequencyOptions.find(f => f.value === frequency)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700 dark:text-amber-400">Bắt đầu:</span>
                <span className="font-semibold text-amber-800 dark:text-amber-200">
                  {new Date(startDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {endDate && (
                <div className="flex justify-between">
                  <span className="text-amber-700 dark:text-amber-400">Kết thúc:</span>
                  <span className="font-semibold text-amber-800 dark:text-amber-200">
                    {new Date(endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-lg"
        >
          <span>{isSandboxMode ? 'Tạo kế hoạch DCA Ảo' : 'Tạo kế hoạch DCA'}</span>
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DCAForm;
