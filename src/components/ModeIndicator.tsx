import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, BarChart3, Target } from 'lucide-react';

interface ModeIndicatorProps {
  isExpertMode: boolean;
}

const ModeIndicator: React.FC<ModeIndicatorProps> = ({ isExpertMode }) => {
  if (!isExpertMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
      >
        <div className="flex items-center space-x-3">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              Chế độ Thường
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Giao diện đơn giản, phù hợp cho người mới bắt đầu
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-amber-50 dark:from-amber-900/20 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Zap className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              Chế độ Chuyên gia đã được kích hoạt
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Phân tích nâng cao với đầy đủ công cụ chuyên nghiệp
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-2 py-1">
            <BarChart3 className="h-3 w-3 text-amber-600" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
              8 Chỉ số
            </span>
          </div>
          <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-2 py-1">
            <Target className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              Biểu đồ Live
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModeIndicator;
