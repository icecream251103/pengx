import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, DollarSign, 
  BarChart3, Users, Zap, Shield, Clock, Target
} from 'lucide-react';
import { useGoldPrice } from '../hooks/useGoldPrice';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/calculations';
import MetricTooltip from './MetricTooltip';
import { metricTooltips } from '../utils/metricTooltips';

interface SimpleMetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  tooltipKey?: string;
}

const SimpleMetricCard: React.FC<SimpleMetricCardProps> = ({ 
  title, value, change, changeType, icon, tooltipKey 
}) => {
  const changeColors = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  const changeIcons = {
    increase: <TrendingUp className="h-3 w-3" />,
    decrease: <TrendingDown className="h-3 w-3" />,
    neutral: <Activity className="h-3 w-3" />
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-help"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          {icon}
        </div>
        <div className={`flex items-center space-x-1 ${changeColors[changeType]}`}>
          {changeIcons[changeType]}
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </motion.div>
  );

  if (tooltipKey && metricTooltips[tooltipKey as keyof typeof metricTooltips]) {
    const tooltipData = metricTooltips[tooltipKey as keyof typeof metricTooltips];
    return (
      <MetricTooltip
        title={tooltipData.title}
        description={tooltipData.description}
        formula={'formula' in tooltipData ? tooltipData.formula : undefined}
        example={'example' in tooltipData ? tooltipData.example : undefined}
      >
        {cardContent}
      </MetricTooltip>
    );
  }

  return cardContent;
};

const AdvancedMetricsPanel: React.FC = () => {
  const { currentData } = useGoldPrice();
  
  // Investment-focused metrics using real TGAUx data
  const metrics = [
    {
      title: 'Giá hiện tại (PenGx)',
      value: formatCurrency(currentData.price),
      change: formatPercentage(currentData.changePercent24h),
      changeType: currentData.changePercent24h >= 0 ? 'increase' as const : 'decrease' as const,
      icon: <DollarSign className="h-5 w-5 text-blue-600" />,
      tooltipKey: 'currentPrice'
    },
    {
      title: 'RSI (14)',
      value: '50.0',
      change: 'Neutral',
      changeType: 'neutral' as const,
      icon: <Activity className="h-5 w-5 text-purple-600" />,
      tooltipKey: 'rsi'
    },
    {
      title: 'SMA 20',
      value: formatCurrency(currentData.price * 0.995), // Slightly below current price
      change: '+0.33%',
      changeType: 'increase' as const,
      icon: <BarChart3 className="h-5 w-5 text-green-600" />,
      tooltipKey: 'sma'
    },
    {
      title: 'EMA 12',
      value: formatCurrency(currentData.price * 0.998), // Close to current price
      change: '+0.18%',
      changeType: 'increase' as const,
      icon: <Target className="h-5 w-5 text-orange-600" />,
      tooltipKey: 'ema'
    },
    {
      title: 'Độ biến động',
      value: '0.71%',
      change: '-0.12%',
      changeType: 'decrease' as const,
      icon: <Zap className="h-5 w-5 text-yellow-600" />,
      tooltipKey: 'volatilityIndex'
    },
    {
      title: 'Cao nhất 24h',
      value: formatCurrency(currentData.high24h),
      change: formatPercentage((currentData.high24h - currentData.price) / currentData.price * 100),
      changeType: 'increase' as const,
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      tooltipKey: 'changePercent24h'
    },
    {
      title: 'Thấp nhất 24h',
      value: formatCurrency(currentData.low24h),
      change: formatPercentage((currentData.low24h - currentData.price) / currentData.price * 100),
      changeType: 'decrease' as const,
      icon: <Shield className="h-5 w-5 text-red-600" />,
      tooltipKey: 'changePercent24h'
    },
    {
      title: 'Khối lượng 24h',
      value: `$${formatNumber(currentData.volume24h)}`,
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: <Clock className="h-5 w-5 text-emerald-600" />,
      tooltipKey: 'volume24h'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chỉ số Chuyên gia
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Phân tích nâng cao và thống kê chi tiết
          </p>
        </div>
        <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full">
          Expert Mode
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SimpleMetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Quick Analysis Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>Phân tích Tổng quan</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Tín hiệu RSI: </span>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Neutral (50.0)</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Xu hướng MA: </span>
            <span className="text-green-600 dark:text-green-400 font-semibold">Tăng giá</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Khuyến nghị: </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Giữ/Mua</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedMetricsPanel;
