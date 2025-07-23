import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, DollarSign, 
  BarChart3, PieChart, Target, Zap, Shield, 
  Clock, Users, Globe, AlertTriangle, CheckCircle
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  description?: string;
  gradient: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, value, change, changeType, icon, description, gradient 
}) => {
  const changeColor = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  const changeIcon = {
    increase: <TrendingUp className="h-4 w-4" />,
    decrease: <TrendingDown className="h-4 w-4" />,
    neutral: <Activity className="h-4 w-4" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm ${changeColor[changeType]}`}>
          {changeIcon[changeType]}
          <span>{change}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-xs opacity-75">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

const AdvancedMetricsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalSupply: '1,234,567',
    circulatingSupply: '987,654',
    marketCap: '$45.2M',
    volume24h: '$2.1M',
    holders: '8,432',
    avgHoldingPeriod: '127 ngày',
    liquidityRatio: '94.2%',
    stakingRatio: '67.8%',
    burnRate: '0.05%',
    yieldAPY: '12.3%',
    priceVolatility: '23.1%',
    sharpeRatio: '1.87',
    maxDrawdown: '15.2%',
    recoveryTime: '18 ngày',
    correlationBTC: '0.73',
    correlationETH: '0.81',
    onChainActivity: '156 giao dịch/h',
    gasEfficiency: '98.7%',
    networkHealth: '99.2%',
    securityScore: '9.4/10'
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        volume24h: `$${(Math.random() * 3 + 1.5).toFixed(1)}M`,
        onChainActivity: `${Math.floor(Math.random() * 50 + 130)} giao dịch/h`,
        priceVolatility: `${(Math.random() * 10 + 20).toFixed(1)}%`
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const advancedMetrics = [
    {
      title: 'Tổng cung',
      value: metrics.totalSupply,
      change: '+0.01%',
      changeType: 'increase' as const,
      icon: <PieChart className="h-6 w-6" />,
      description: 'Tổng số token được phát hành',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Cung lưu thông',
      value: metrics.circulatingSupply,
      change: '+0.15%',
      changeType: 'increase' as const,
      icon: <Activity className="h-6 w-6" />,
      description: 'Token đang lưu thông trên thị trường',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Vốn hóa thị trường',
      value: metrics.marketCap,
      change: '+2.3%',
      changeType: 'increase' as const,
      icon: <DollarSign className="h-6 w-6" />,
      description: 'Giá trị thị trường hiện tại',
      gradient: 'from-amber-500 to-amber-600'
    },
    {
      title: 'Khối lượng 24h',
      value: metrics.volume24h,
      change: '+5.7%',
      changeType: 'increase' as const,
      icon: <BarChart3 className="h-6 w-6" />,
      description: 'Khối lượng giao dịch 24 giờ qua',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Số người nắm giữ',
      value: metrics.holders,
      change: '+12',
      changeType: 'increase' as const,
      icon: <Users className="h-6 w-6" />,
      description: 'Tổng số địa chỉ nắm giữ token',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Thời gian nắm giữ TB',
      value: metrics.avgHoldingPeriod,
      change: '+3 ngày',
      changeType: 'increase' as const,
      icon: <Clock className="h-6 w-6" />,
      description: 'Thời gian nắm giữ trung bình',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Tỷ lệ thanh khoản',
      value: metrics.liquidityRatio,
      change: '+1.2%',
      changeType: 'increase' as const,
      icon: <Target className="h-6 w-6" />,
      description: 'Tỷ lệ thanh khoản trên DEX',
      gradient: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Tỷ lệ Staking',
      value: metrics.stakingRatio,
      change: '+0.8%',
      changeType: 'increase' as const,
      icon: <Shield className="h-6 w-6" />,
      description: 'Token đang được stake',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Tỷ lệ đốt token',
      value: metrics.burnRate,
      change: '0%',
      changeType: 'neutral' as const,
      icon: <Zap className="h-6 w-6" />,
      description: 'Tỷ lệ token bị đốt hàng tháng',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      title: 'APY Staking',
      value: metrics.yieldAPY,
      change: '-0.3%',
      changeType: 'decrease' as const,
      icon: <TrendingUp className="h-6 w-6" />,
      description: 'Lãi suất staking hàng năm',
      gradient: 'from-rose-500 to-rose-600'
    },
    {
      title: 'Biến động giá',
      value: metrics.priceVolatility,
      change: '-1.5%',
      changeType: 'decrease' as const,
      icon: <Activity className="h-6 w-6" />,
      description: 'Độ biến động giá 30 ngày',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Sharpe Ratio',
      value: metrics.sharpeRatio,
      change: '+0.12',
      changeType: 'increase' as const,
      icon: <BarChart3 className="h-6 w-6" />,
      description: 'Tỷ lệ rủi ro/lợi nhuận',
      gradient: 'from-violet-500 to-violet-600'
    },
    {
      title: 'Max Drawdown',
      value: metrics.maxDrawdown,
      change: '-2.1%',
      changeType: 'decrease' as const,
      icon: <TrendingDown className="h-6 w-6" />,
      description: 'Mức giảm tối đa từ đỉnh',
      gradient: 'from-red-500 to-red-600'
    },
    {
      title: 'Thời gian phục hồi',
      value: metrics.recoveryTime,
      change: '-5 ngày',
      changeType: 'decrease' as const,
      icon: <Clock className="h-6 w-6" />,
      description: 'Thời gian phục hồi trung bình',
      gradient: 'from-slate-500 to-slate-600'
    },
    {
      title: 'Tương quan BTC',
      value: metrics.correlationBTC,
      change: '+0.05',
      changeType: 'increase' as const,
      icon: <Globe className="h-6 w-6" />,
      description: 'Hệ số tương quan với Bitcoin',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Hoạt động On-chain',
      value: metrics.onChainActivity,
      change: '+12%',
      changeType: 'increase' as const,
      icon: <Activity className="h-6 w-6" />,
      description: 'Số giao dịch trung bình mỗi giờ',
      gradient: 'from-lime-500 to-lime-600'
    },
    {
      title: 'Hiệu quả Gas',
      value: metrics.gasEfficiency,
      change: '+0.1%',
      changeType: 'increase' as const,
      icon: <Zap className="h-6 w-6" />,
      description: 'Tỷ lệ giao dịch thành công',
      gradient: 'from-sky-500 to-sky-600'
    },
    {
      title: 'Sức khỏe mạng',
      value: metrics.networkHealth,
      change: '0%',
      changeType: 'neutral' as const,
      icon: <CheckCircle className="h-6 w-6" />,
      description: 'Tình trạng hoạt động của mạng',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Điểm bảo mật',
      value: metrics.securityScore,
      change: '+0.1',
      changeType: 'increase' as const,
      icon: <Shield className="h-6 w-6" />,
      description: 'Đánh giá bảo mật tổng thể',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chỉ số Nâng cao
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Phân tích chuyên sâu về hiệu suất và rủi ro
          </p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
          <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
            Expert Mode
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {advancedMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Quick Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tóm tắt Chuyên gia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Đánh giá Tổng thể</h4>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-medium">Tích cực</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Các chỉ số cho thấy xu hướng tăng trưởng ổn định và sức khỏe mạng tốt.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Rủi ro</h4>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">Trung bình</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Biến động giá ở mức trung bình, cần theo dõi tương quan với BTC.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Khuyến nghị</h4>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="text-blue-600 dark:text-blue-400 font-medium">Mua và Giữ</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Phù hợp cho chiến lược đầu tư dài hạn với DCA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMetricsPanel;
