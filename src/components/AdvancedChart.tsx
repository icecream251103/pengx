import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart3, Activity, Maximize2, 
  Volume2, Zap, Target, Clock, PieChart, LineChart
} from 'lucide-react';

interface ChartData {
  time: string;
  price: number;
  volume: number;
  ma7: number;
  ma25: number;
  ma99: number;
  rsi: number;
  macd: number;
  bollinger_upper: number;
  bollinger_lower: number;
  support: number;
  resistance: number;
}

interface TechnicalIndicator {
  name: string;
  value: string;
  signal: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

const AdvancedChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1D');
  const [activeIndicators, setActiveIndicators] = useState({
    volume: true,
    ma: true,
    rsi: true,
    macd: true,
    bollinger: true,
    support_resistance: true
  });
  const [chartType, setChartType] = useState('candlestick');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock advanced chart data
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentPrice] = useState(2045.67);
  const [priceChange] = useState(+23.45);
  const [percentChange] = useState(+1.16);

  // Technical indicators
  const technicalIndicators: TechnicalIndicator[] = useMemo(() => [
    {
      name: 'RSI (14)',
      value: '67.3',
      signal: 'neutral',
      description: 'Không quá mua hay quá bán'
    },
    {
      name: 'MACD',
      value: '+12.45',
      signal: 'bullish',
      description: 'Tín hiệu tăng giá mạnh'
    },
    {
      name: 'Bollinger Bands',
      value: 'Giữa',
      signal: 'neutral',
      description: 'Giá ở giữa dải Bollinger'
    },
    {
      name: 'MA 7/25',
      value: 'Golden Cross',
      signal: 'bullish',
      description: 'MA ngắn hạn cắt lên MA dài hạn'
    },
    {
      name: 'Support/Resistance',
      value: '$2,040',
      signal: 'bullish',
      description: 'Giá trên vùng hỗ trợ mạnh'
    },
    {
      name: 'Volume Profile',
      value: 'Tăng',
      signal: 'bullish',
      description: 'Khối lượng tăng theo giá'
    }
  ], []);

  // Generate mock data
  useEffect(() => {
    const generateData = () => {
      const data: ChartData[] = [];
      let basePrice = 2000;
      
      for (let i = 0; i < 100; i++) {
        const variation = (Math.random() - 0.5) * 40;
        basePrice += variation;
        
        data.push({
          time: new Date(Date.now() - (99 - i) * 24 * 60 * 60 * 1000).toISOString(),
          price: Math.max(1800, Math.min(2200, basePrice)),
          volume: Math.random() * 1000000 + 500000,
          ma7: basePrice + Math.sin(i / 7) * 10,
          ma25: basePrice + Math.sin(i / 25) * 20,
          ma99: basePrice + Math.sin(i / 99) * 30,
          rsi: Math.random() * 40 + 30,
          macd: Math.sin(i / 12) * 15,
          bollinger_upper: basePrice + 50,
          bollinger_lower: basePrice - 50,
          support: Math.max(1900, basePrice - 100),
          resistance: Math.min(2100, basePrice + 100)
        });
      }
      
      setChartData(data);
    };

    generateData();
    const interval = setInterval(generateData, 10000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const timeframes = ['5M', '15M', '1H', '4H', '1D', '1W', '1M'];
  const chartTypes = [
    { id: 'candlestick', name: 'Nến', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'line', name: 'Đường', icon: <LineChart className="h-4 w-4" /> },
    { id: 'area', name: 'Vùng', icon: <Activity className="h-4 w-4" /> }
  ];

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish': return 'text-green-600 dark:text-green-400';
      case 'bearish': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSignalBg = (signal: string) => {
    switch (signal) {
      case 'bullish': return 'bg-green-100 dark:bg-green-900/30';
      case 'bearish': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
    >
      {/* Chart Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Gold Price (XAU/USD)
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${currentPrice.toLocaleString()}
                </span>
                <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
                  priceChange >= 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />}
                  <span>${Math.abs(priceChange)} ({percentChange > 0 ? '+' : ''}{percentChange}%)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Chart Type Selector */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {chartTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    chartType === type.id
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {type.icon}
                  <span>{type.name}</span>
                </button>
              ))}
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeframe === tf
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Main Chart Area */}
        <div className="flex-1 p-6">
          <div className="h-96 lg:h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Mock Chart Visualization */}
            <div className="absolute inset-0 p-6">
              <svg width="100%" height="100%" className="text-gray-400">
                {/* Grid Lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Mock Candlesticks */}
                {chartData.slice(-20).map((data, index) => {
                  const x = (index / 19) * 100;
                  const high = 80 - (data.price - 1800) / 400 * 60;
                  const low = high + 10;
                  const open = high + 3;
                  const close = high + 7;
                  
                  return (
                    <g key={index}>
                      <line
                        x1={`${x}%`}
                        y1={`${high}%`}
                        x2={`${x}%`}
                        y2={`${low}%`}
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity="0.6"
                      />
                      <rect
                        x={`${x - 1}%`}
                        y={`${Math.min(open, close)}%`}
                        width="2%"
                        height={`${Math.abs(close - open)}%`}
                        fill={close > open ? "#10b981" : "#ef4444"}
                        opacity="0.8"
                      />
                    </g>
                  );
                })}
                
                {/* Moving Averages */}
                <polyline
                  points={chartData.slice(-20).map((_, index) => {
                    const x = (index / 19) * 100;
                    const y = 40 + Math.sin(index / 3) * 10;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  opacity="0.7"
                />
                <polyline
                  points={chartData.slice(-20).map((_, index) => {
                    const x = (index / 19) * 100;
                    const y = 45 + Math.sin(index / 5) * 8;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  opacity="0.7"
                />
              </svg>

              {/* Chart Legend */}
              <div className="absolute top-4 left-4 space-y-1">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">MA 7</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-0.5 bg-yellow-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">MA 25</span>
                </div>
              </div>
            </div>

            {/* Chart Loading Overlay */}
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Advanced Chart</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Chế độ Chuyên gia</p>
              </div>
            </div>
          </div>

          {/* Indicator Toggles */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(activeIndicators).map(([key, active]) => (
              <button
                key={key}
                onClick={() => setActiveIndicators(prev => ({ ...prev, [key]: !active }))}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {key.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Analysis Panel */}
        <div className="lg:w-80 border-l border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Phân tích Kỹ thuật</span>
            </h3>
            
            <div className="space-y-3">
              {technicalIndicators.map((indicator, index) => (
                <motion.div
                  key={indicator.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {indicator.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSignalBg(indicator.signal)} ${getSignalColor(indicator.signal)}`}>
                      {indicator.value}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {indicator.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Market Sentiment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Tâm lý Thị trường</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tăng giá</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">73%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Giảm giá</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '27%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">27%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Thống kê Nhanh</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <Volume2 className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Volume 24h</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">$2.1M</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <Zap className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Volatility</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">23.1%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedChart;
