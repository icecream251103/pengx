import React, { useState, useMemo } from 'react';
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
import { Clock, TrendingUp, TrendingDown, BarChart3, Maximize2 } from 'lucide-react';
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

interface EnhancedChartProps {
  isCompact?: boolean;
}

const EnhancedChart: React.FC<EnhancedChartProps> = ({ isCompact = false }) => {
  const { currentData, getHistoryForTimeframe, isLoading } = useGoldPrice();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timeframes: { key: Timeframe; label: string }[] = [
    { key: '1H', label: '1H' },
    { key: '4H', label: '4H' },
    { key: '1D', label: '1D' },
    { key: '1W', label: '1W' },
    { key: '1M', label: '1M' }
  ];

  const chartData = useMemo(() => {
    const history = getHistoryForTimeframe(selectedTimeframe);
    
    // Debug: Log để kiểm tra data
    if (history.length > 0) {
      const prices = history.map(point => point.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      console.log(`Chart data range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}, Points: ${history.length}`);
    }
    
    return {
      labels: history.map(point => {
        const date = new Date(point.timestamp);
        switch (selectedTimeframe) {
          case '1H':
          case '4H':
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          case '1D':
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          case '1W':
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
          case '1M':
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
          default:
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      }),
      datasets: [
        {
          label: 'PenGx Price',
          data: history.map(point => point.price),
          borderColor: '#d97706',
          backgroundColor: 'rgba(217, 119, 6, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: '#d97706',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }
      ]
    };
  }, [getHistoryForTimeframe, selectedTimeframe]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#d1d5db',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return `Thời gian: ${tooltipItems[0].label}`;
          },
          label: (context) => {
            const value = context.parsed.y;
            return `Giá: ${formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => formatCurrency(value as number),
          font: {
            size: isCompact ? 10 : 11
          },
          color: '#6b7280',
          maxTicksLimit: isCompact ? 5 : 8,
          padding: 8
        },
        border: {
          display: false
        },
        // Tự động scale với buffer 5% trên dưới
        grace: '5%'
      },
      x: {
        type: 'category',
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: isCompact ? 6 : 8,
          font: {
            size: isCompact ? 10 : 11
          },
          color: '#6b7280'
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverBorderWidth: 3
      }
    }
  };

  const priceChange = currentData.changePercent24h;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className={`${isCompact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              <h2 className={`text-lg sm:text-xl font-bold text-gray-900 ${isCompact ? 'text-base' : ''}`}>
                {isCompact ? 'PenGx Live Chart' : 'Biểu đồ giá PenGx'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`text-xl sm:text-2xl font-bold text-gray-900 ${isCompact ? 'text-lg' : ''}`}>
                {formatCurrency(currentData.price)}
              </div>
              <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                )}
                <span>{formatPercentage(Math.abs(priceChange))}</span>
              </div>
            </div>
          </div>

          {!isCompact && (
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.key}
                onClick={() => setSelectedTimeframe(timeframe.key)}
                className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe.key
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>

          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span>Real-time</span>
          </div>
        </div>

        {/* Chart */}
        <div className={`${isFullscreen ? 'h-96' : isCompact ? 'h-48 sm:h-64' : 'h-64 sm:h-80'} relative overflow-hidden`}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="w-full h-full">
              <Line options={chartOptions} data={chartData} />
            </div>
          )}
        </div>

        {/* Chart Stats */}
        {!isCompact && (
          <div className="mt-4 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-500">Cao nhất 24h</div>
              <div className="text-sm sm:text-lg font-semibold text-green-600">
                {formatCurrency(currentData.high24h)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-500">Thấp nhất 24h</div>
              <div className="text-sm sm:text-lg font-semibold text-red-600">
                {formatCurrency(currentData.low24h)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-500">Tổng giao dịch 24h</div>
              <div className="text-sm sm:text-lg font-semibold text-gray-900">
                ${(currentData.volume24h / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-500">Vốn hóa thị trường</div>
              <div className="text-sm sm:text-lg font-semibold text-gray-900">
                ${(currentData.marketCap / 1000000).toFixed(2)}M
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedChart;