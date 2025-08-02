import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Coins, BarChart3, Shield, Clock, RefreshCw } from 'lucide-react';
import { useGoldPrice } from '../hooks/useGoldPrice';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/calculations';
import MetricTooltip from './MetricTooltip';
import { metricTooltips } from '../utils/metricTooltips';

const MetricsPanel: React.FC = () => {
  const { currentData, isLoading, refresh } = useGoldPrice();

  const metrics = [
    {
      title: 'Giá hiện tại',
      value: formatCurrency(currentData.price),
      change: currentData.changePercent24h,
      icon: DollarSign,
      color: 'amber',
      tooltipKey: 'currentPrice'
    },
    {
      title: 'Thay đổi 24h',
      value: formatCurrency(Math.abs(currentData.change24h)),
      change: currentData.changePercent24h,
      icon: currentData.changePercent24h >= 0 ? TrendingUp : TrendingDown,
      color: currentData.changePercent24h >= 0 ? 'green' : 'red',
      tooltipKey: 'change24h'
    },
    {
      title: 'Vốn hóa thị trường',
      value: `$${formatNumber(currentData.marketCap)}`,
      change: currentData.changePercent24h,
      icon: BarChart3,
      color: 'blue',
      tooltipKey: 'marketCap'
    },
    {
      title: 'Tổng nguồn cung',
      value: formatNumber(currentData.totalSupply),
      change: 0,
      icon: Coins,
      color: 'purple',
      tooltipKey: 'totalSupply'
    },
    {
      title: 'Khối lượng 24h',
      value: `$${formatNumber(currentData.volume24h)}`,
      change: Math.random() * 20 - 10, // Simulated volume change
      icon: BarChart3,
      color: 'indigo',
      tooltipKey: 'volume24h'
    },
    {
      title: 'Tỷ lệ ủng hộ',
      value: `${currentData.backingRatio.toFixed(1)}%`,
      change: 0,
      icon: Shield,
      color: 'emerald',
      tooltipKey: 'backingRatio'
    }
  ];

  const getColorClasses = (color: string, isBackground: boolean = false) => {
    const prefix = isBackground ? 'bg' : 'text';
    const colorMap: Record<string, string> = {
      amber: `${prefix}-amber-600`,
      green: `${prefix}-green-600`,
      red: `${prefix}-red-600`,
      blue: `${prefix}-blue-600`,
      purple: `${prefix}-purple-600`,
      indigo: `${prefix}-indigo-600`,
      emerald: `${prefix}-emerald-600`
    };
    return colorMap[color] || `${prefix}-gray-600`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tổng quan thị trường</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>Cập nhật cuối: {new Date(currentData.timestamp).toLocaleTimeString()}</span>
          </div>
          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-amber-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;
          const tooltipData = metricTooltips[metric.tooltipKey as keyof typeof metricTooltips];
          
          return (
            <MetricTooltip
              key={index}
              title={tooltipData.title}
              description={tooltipData.description}
              formula={'formula' in tooltipData ? tooltipData.formula : undefined}
              example={'example' in tooltipData ? tooltipData.example : undefined}
            >
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-help">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${getColorClasses(metric.color, true)} bg-opacity-10`}>
                    <Icon className={`h-5 w-5 ${getColorClasses(metric.color)}`} />
                  </div>
                  {metric.change !== 0 && (
                    <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      <span>{formatPercentage(Math.abs(metric.change))}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {metric.title}
                </div>
                
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </div>
              </div>
            </MetricTooltip>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricTooltip
          title="Cao nhất 24h"
          description="Mức giá cao nhất mà token PenGx đạt được trong 24 giờ qua. Đây là điểm kháng cự quan trọng để theo dõi."
          example="Nếu cao nhất 24h là $48.50, có nghĩa là trong ngày qua giá không vượt quá mức này."
        >
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-4 cursor-help">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cao nhất 24h</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(currentData.high24h)}
            </div>
          </div>
        </MetricTooltip>

        <MetricTooltip
          title="Thấp nhất 24h"
          description="Mức giá thấp nhất mà token PenGx đạt được trong 24 giờ qua. Đây là điểm hỗ trợ quan trọng để theo dõi."
          example="Nếu thấp nhất 24h là $42.30, có nghĩa là trong ngày qua giá không giảm xuống dưới mức này."
        >
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4 cursor-help">
            <div className="flex items-center mb-2">
              <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Thấp nhất 24h</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(currentData.low24h)}
            </div>
          </div>
        </MetricTooltip>
      </div>
    </div>
  );
};

export default MetricsPanel;