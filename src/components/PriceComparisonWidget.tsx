import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, DollarSign } from 'lucide-react';
import { useRealTimeGoldPrice } from '../services/goldPriceOracle';
import { formatVND, convertUSDToVND } from '../config/currency';

interface PriceComparison {
  currentReal: number;
  currentSimulated: number;
  differenceUSD: number;
  differencePercent: number;
  differenceVND: number;
}

interface PriceComparisonWidgetProps {
  simulatedPrice?: number;
}

const PriceComparisonWidget = ({ simulatedPrice = 3618.16 }: PriceComparisonWidgetProps) => {
  const { priceData, loading, error } = useRealTimeGoldPrice();
  const [comparison, setComparison] = useState<PriceComparison | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (priceData) {
      const realPrice = priceData.priceUSD;
      const diff = realPrice - simulatedPrice;
      const diffPercent = (diff / simulatedPrice) * 100;
      
      setComparison({
        currentReal: realPrice,
        currentSimulated: simulatedPrice,
        differenceUSD: diff,
        differencePercent: diffPercent,
        differenceVND: convertUSDToVND(Math.abs(diff))
      });
      
      setLastUpdate(new Date(priceData.timestamp));
    }
  }, [priceData, simulatedPrice]);

  const getTrendIcon = (diff: number) => {
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (diff < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <DollarSign className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (diff: number) => {
    if (diff > 0) return 'text-green-600';
    if (diff < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getAccuracyLevel = (diffPercent: number) => {
    const absPercent = Math.abs(diffPercent);
    if (absPercent <= 1) return { level: 'Rất chính xác', color: 'text-green-600', bg: 'bg-green-50 border-green-200' };
    if (absPercent <= 3) return { level: 'Chính xác', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (absPercent <= 5) return { level: 'Chấp nhận được', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' };
    return { level: 'Cần điều chỉnh', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600 dark:text-gray-300">Đang tải dữ liệu Oracle...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-red-200 dark:border-red-700">
        <div className="flex items-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="font-medium">Lỗi kết nối Oracle</span>
        </div>
        <p className="text-sm text-red-500 mt-2">{error}</p>
      </div>
    );
  }

  if (!comparison) {
    return null;
  }

  const accuracy = getAccuracyLevel(comparison.differencePercent);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          So sánh giá Oracle vs Simulation
        </h3>
        {lastUpdate && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {lastUpdate.toLocaleTimeString('vi-VN')}
          </span>
        )}
      </div>

      {/* Giá hiện tại */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">Giá thực (Oracle)</h4>
          <div className="space-y-1">
            <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
              ${comparison.currentReal.toLocaleString()}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {formatVND(convertUSDToVND(comparison.currentReal))}
            </p>
            {priceData && (
              <p className="text-xs text-blue-600 dark:text-blue-500">
                Độ tin cậy: {priceData.confidence.toFixed(0)}%
              </p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2">Giá mô phỏng (App)</h4>
          <div className="space-y-1">
            <p className="text-xl font-bold text-amber-900 dark:text-amber-300">
              ${comparison.currentSimulated.toLocaleString()}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              {formatVND(convertUSDToVND(comparison.currentSimulated))}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Dữ liệu nội bộ
            </p>
          </div>
        </div>
      </div>

      {/* Chênh lệch */}
      <div className={`rounded-lg p-4 border ${accuracy.bg} dark:bg-gray-700 dark:border-gray-600 mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Chênh lệch giá</h4>
          <span className={`text-xs px-2 py-1 rounded-full ${accuracy.color} font-medium`}>
            {accuracy.level}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`flex items-center justify-center mb-1 ${getTrendColor(comparison.differenceUSD)}`}>
              {getTrendIcon(comparison.differenceUSD)}
              <span className="ml-1 font-bold">
                ${Math.abs(comparison.differenceUSD).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">USD</p>
          </div>
          
          <div>
            <div className={`flex items-center justify-center mb-1 ${getTrendColor(comparison.differencePercent)}`}>
              <span className="font-bold">
                {comparison.differencePercent >= 0 ? '+' : ''}{comparison.differencePercent.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Phần trăm</p>
          </div>
          
          <div>
            <div className={`flex items-center justify-center mb-1 ${getTrendColor(comparison.differenceUSD)}`}>
              <span className="font-bold text-xs">
                {formatVND(comparison.differenceVND)}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">VNĐ</p>
          </div>
        </div>
      </div>

      {/* Khuyến nghị */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">💡 Khuyến nghị</h4>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {Math.abs(comparison.differencePercent) <= 1 ? (
            <p>✅ Giá mô phỏng rất chính xác so với thị trường thực.</p>
          ) : Math.abs(comparison.differencePercent) <= 3 ? (
            <p>✓ Giá mô phỏng có độ chính xác tốt, chênh lệch trong ngưỡng chấp nhận được.</p>
          ) : (
            <div>
              <p>⚠️ Có chênh lệch đáng kể so với giá thực:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Cân nhắc cập nhật thuật toán tính giá</li>
                <li>Kiểm tra kết nối Oracle</li>
                <li>Điều chỉnh tần suất cập nhật dữ liệu</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceComparisonWidget;
