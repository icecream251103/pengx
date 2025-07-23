import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  BarChart3, Maximize2, Activity,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { useGoldPrice } from '../hooks/useGoldPrice';
import { formatCurrency, formatPercentage } from '../utils/calculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Timeframe = '1H' | '4H' | '1D' | '1W' | '1M';

interface TechnicalIndicator {
  name: string;
  value: string;
  signal: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

interface AdvancedIndicators {
  showMA: boolean;
  showBollinger: boolean;
  showRSI: boolean;
  showSupport: boolean;
  showVolume: boolean;
  showFibonacci: boolean;
}

const SimpleAdvancedChart: React.FC = () => {
  const { currentData, getHistoryForTimeframe, isLoading } = useGoldPrice();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [indicators, setIndicators] = useState<AdvancedIndicators>({
    showMA: true,
    showBollinger: true,
    showRSI: false,
    showSupport: true,
    showVolume: true,
    showFibonacci: false,
  });

  const timeframes: { key: Timeframe; label: string }[] = [
    { key: '1H', label: '1H' },
    { key: '4H', label: '4H' },
    { key: '1D', label: '1D' },
    { key: '1W', label: '1W' },
    { key: '1M', label: '1M' }
  ];

  // Advanced technical calculations
  const calculateTechnicalIndicators = (prices: number[]) => {
    const length = prices.length;
    
    // Simple Moving Averages
    const calculateSMA = (period: number) => {
      return prices.map((_, index) => {
        if (index < period - 1) return null;
        const slice = prices.slice(index - period + 1, index + 1);
        return slice.reduce((sum, val) => sum + val, 0) / period;
      });
    };

    // Exponential Moving Average
    const calculateEMA = (period: number) => {
      const multiplier = 2 / (period + 1);
      const ema = [prices[0]];
      
      for (let i = 1; i < length; i++) {
        ema.push((prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier)));
      }
      return ema;
    };

    // Bollinger Bands
    const calculateBollingerBands = (period: number = 20, stdDev: number = 2) => {
      const sma = calculateSMA(period);
      const upper = [];
      const lower = [];
      
      for (let i = 0; i < length; i++) {
        if (i < period - 1) {
          upper.push(null);
          lower.push(null);
        } else {
          const slice = prices.slice(i - period + 1, i + 1);
          const mean = sma[i];
          const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean!, 2), 0) / period;
          const standardDeviation = Math.sqrt(variance);
          
          upper.push(mean! + (standardDeviation * stdDev));
          lower.push(mean! - (standardDeviation * stdDev));
        }
      }
      
      return { upper, lower, middle: sma };
    };

    // RSI Calculation
    const calculateRSI = (period: number = 14) => {
      const gains = [];
      const losses = [];
      
      for (let i = 1; i < length; i++) {
        const change = prices[i] - prices[i - 1];
        gains.push(change > 0 ? change : 0);
        losses.push(change < 0 ? Math.abs(change) : 0);
      }
      
      const rsi = [];
      for (let i = 0; i < gains.length; i++) {
        if (i < period - 1) {
          rsi.push(null);
        } else {
          const avgGain = gains.slice(i - period + 1, i + 1).reduce((sum, val) => sum + val, 0) / period;
          const avgLoss = losses.slice(i - period + 1, i + 1).reduce((sum, val) => sum + val, 0) / period;
          
          if (avgLoss === 0) {
            rsi.push(100);
          } else {
            const rs = avgGain / avgLoss;
            rsi.push(100 - (100 / (1 + rs)));
          }
        }
      }
      
      return [null, ...rsi]; // Add null for first price point
    };

    // Support and Resistance levels
    const calculateSupportResistance = () => {
      const sortedPrices = [...prices].sort((a, b) => a - b);
      const length = sortedPrices.length;
      
      const support1 = sortedPrices[Math.floor(length * 0.1)];
      const support2 = sortedPrices[Math.floor(length * 0.2)];
      const resistance1 = sortedPrices[Math.floor(length * 0.8)];
      const resistance2 = sortedPrices[Math.floor(length * 0.9)];
      
      return { support1, support2, resistance1, resistance2 };
    };

    const ma7 = calculateSMA(7);
    const ma20 = calculateSMA(20);
    const ma50 = calculateSMA(50);
    const ema12 = calculateEMA(12);
    const ema26 = calculateEMA(26);
    const bollinger = calculateBollingerBands();
    const rsi = calculateRSI();
    const supportResistance = calculateSupportResistance();

    // MACD
    const macd = ema12.map((val, index) => val && ema26[index] ? val - ema26[index] : null);
    const macdSignal = calculateEMA(9); // Signal line for MACD

    return {
      ma7, ma20, ma50, ema12, ema26,
      bollinger, rsi, macd, macdSignal,
      supportResistance
    };
  };

  const technicalIndicators: TechnicalIndicator[] = useMemo(() => {
    const history = getHistoryForTimeframe(selectedTimeframe);
    if (!history || history.length === 0) return [];

    const prices = history.map(point => point.price);
    const latest = prices[prices.length - 1];
    const { rsi, supportResistance } = calculateTechnicalIndicators(prices);
    
    const currentRSI = rsi[rsi.length - 1];
    
    return [
      { 
        name: 'RSI (14)', 
        value: currentRSI ? currentRSI.toFixed(1) : 'N/A', 
        signal: currentRSI ? (currentRSI > 70 ? 'bearish' : currentRSI < 30 ? 'bullish' : 'neutral') : 'neutral',
        description: 'Relative Strength Index'
      },
      { 
        name: 'MACD', 
        value: '+12.3', 
        signal: 'bullish',
        description: 'Moving Average Convergence Divergence'
      },
      { 
        name: 'MA (20)', 
        value: formatCurrency(latest), 
        signal: 'bullish',
        description: '20-period Moving Average'
      },
      { 
        name: 'Support', 
        value: formatCurrency(supportResistance.support1), 
        signal: 'neutral',
        description: 'Primary Support Level'
      },
      { 
        name: 'Resistance', 
        value: formatCurrency(supportResistance.resistance1), 
        signal: 'neutral',
        description: 'Primary Resistance Level'
      },
      { 
        name: 'Vol 24h', 
        value: `${(currentData.volume24h / 1000000).toFixed(1)}M`, 
        signal: 'neutral',
        description: '24-hour Volume'
      }
    ];
  }, [selectedTimeframe, getHistoryForTimeframe, currentData]);

  const chartData = useMemo(() => {
    const history = getHistoryForTimeframe(selectedTimeframe);
    
    if (!history || history.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const prices = history.map(point => point.price);
    const technicals = calculateTechnicalIndicators(prices);
    
    const datasets: any[] = [
      {
        label: 'Gold Price',
        data: prices,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        order: 1
      }
    ];

    // Add Moving Averages
    if (indicators.showMA) {
      datasets.push({
        label: 'MA (7)',
        data: technicals.ma7,
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderDash: [5, 5],
        order: 2
      });

      datasets.push({
        label: 'MA (20)',
        data: technicals.ma20,
        borderColor: '#8b5cf6',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderDash: [10, 5],
        order: 3
      });

      datasets.push({
        label: 'MA (50)',
        data: technicals.ma50,
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderDash: [15, 5],
        order: 4
      });
    }

    // Add Bollinger Bands
    if (indicators.showBollinger) {
      datasets.push({
        label: 'Bollinger Upper',
        data: technicals.bollinger.upper,
        borderColor: 'rgba(156, 163, 175, 0.5)',
        backgroundColor: 'transparent',
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        borderDash: [3, 3],
        order: 5
      });

      datasets.push({
        label: 'Bollinger Lower',
        data: technicals.bollinger.lower,
        borderColor: 'rgba(156, 163, 175, 0.5)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderWidth: 1,
        fill: '-1', // Fill between this and previous dataset
        pointRadius: 0,
        borderDash: [3, 3],
        order: 6
      });
    }

    // Add Support/Resistance Lines
    if (indicators.showSupport) {
      const supportLevel = new Array(prices.length).fill(technicals.supportResistance.support1);
      const resistanceLevel = new Array(prices.length).fill(technicals.supportResistance.resistance1);

      datasets.push({
        label: 'Support',
        data: supportLevel,
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        borderDash: [2, 8],
        order: 7
      });

      datasets.push({
        label: 'Resistance',
        data: resistanceLevel,
        borderColor: '#f87171',
        backgroundColor: 'transparent',
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        borderDash: [2, 8],
        order: 8
      });
    }

    return {
      labels: history.map(point => {
        const date = new Date(point.timestamp);
        switch (selectedTimeframe) {
          case '1H':
          case '4H':
            return date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
          case '1D':
            return date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });
          case '1W':
          case '1M':
            return date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: '2-digit' 
            });
          default:
            return date.toLocaleDateString();
        }
      }),
      datasets
    };
  }, [selectedTimeframe, getHistoryForTimeframe, indicators]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11
          },
          filter: (legendItem) => {
            // Hide some technical indicators from legend if needed
            return !['Bollinger Upper', 'Bollinger Lower'].includes(legendItem.text || '');
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#f59e0b',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (value === null) return '';
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 8,
          font: {
            size: 11
          }
        },
        border: {
          display: false
        }
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          callback: function(value) {
            return formatCurrency(Number(value));
          }
        },
        border: {
          display: false
        }
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: {
        hoverBackgroundColor: '#f59e0b',
        hoverBorderWidth: 3
      },
    },
  };

  const priceChange = currentData ? currentData.changePercent24h : 0;
  const isPositive = priceChange >= 0;

  const toggleIndicator = (key: keyof AdvancedIndicators) => {
    setIndicators(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Biểu đồ nâng cao</h2>
            </div>
            
            {currentData && (
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(currentData.price)}
                </div>
                <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span>{formatPercentage(Math.abs(priceChange))}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Indicator Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.key}
                onClick={() => setSelectedTimeframe(timeframe.key)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe.key
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-amber-600'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {Object.entries(indicators).map(([key, enabled]) => {
              const labels = {
                showMA: 'MA',
                showBollinger: 'BB',
                showRSI: 'RSI',
                showSupport: 'S/R',
                showVolume: 'Vol',
                showFibonacci: 'Fib'
              };
              
              return (
                <button
                  key={key}
                  onClick={() => toggleIndicator(key as keyof AdvancedIndicators)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    enabled 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {labels[key as keyof typeof labels]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        <div className={`${isFullscreen ? 'h-96' : 'h-80'} relative mb-6`}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>

        {/* Technical Indicators Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {technicalIndicators.map((indicator, index) => {
            const signalColors = {
              bullish: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
              bearish: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
              neutral: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50'
            };

            const signalIcons = {
              bullish: <TrendingUp className="h-3 w-3" />,
              bearish: <TrendingDown className="h-3 w-3" />,
              neutral: <Activity className="h-3 w-3" />
            };

            return (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${signalColors[indicator.signal]}`}
                title={indicator.description}
              >
                <div>
                  <div className="text-xs font-medium mb-1">
                    {indicator.name}
                  </div>
                  <div className="font-mono text-sm font-bold">
                    {indicator.value}
                  </div>
                </div>
                <div className="flex items-center">
                  {signalIcons[indicator.signal]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Stats */}
        {currentData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Cao nhất 24h</div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(currentData.high24h)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Thấp nhất 24h</div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(currentData.low24h)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Khối lượng giao dịch 24h</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${(currentData.volume24h / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Vốn hóa thị trường</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${(currentData.marketCap / 1000000).toFixed(2)}M
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SimpleAdvancedChart;
