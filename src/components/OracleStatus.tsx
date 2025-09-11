import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, DollarSign, Globe } from 'lucide-react';
import { goldPriceOracle, useRealTimeGoldPrice } from '../services/goldPriceOracle';
import { formatVND } from '../config/currency';

const OracleStatus = () => {
  const { priceData, loading, error } = useRealTimeGoldPrice();
  const [oracleHealth, setOracleHealth] = useState<Array<{ source: string; status: 'online' | 'offline'; latency?: number }>>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await goldPriceOracle.checkOracleHealth();
        setOracleHealth(health);
      } catch (error) {
        console.error('Lỗi kiểm tra Oracle health:', error);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Kiểm tra mỗi 30 giây

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (priceData) {
      setLastUpdate(new Date(priceData.timestamp));
    }
  }, [priceData]);

  const getStatusColor = (status: 'online' | 'offline') => {
    return status === 'online' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: 'online' | 'offline') => {
    return status === 'online' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Trạng thái Oracle & Giá thực tế
        </h3>
        {lastUpdate && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            Cập nhật: {lastUpdate.toLocaleTimeString('vi-VN')}
          </div>
        )}
      </div>

      {/* Giá hiện tại */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Giá vàng (USD)</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">
                {loading ? 'Đang tải...' : priceData ? `$${priceData.priceUSD.toLocaleString()}` : 'N/A'}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Giá vàng (VNĐ)</p>
              <p className="text-xl font-bold text-green-900 dark:text-green-300">
                {loading ? 'Đang tải...' : priceData ? formatVND(priceData.priceVND) : 'N/A'}
              </p>
            </div>
            <Globe className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Độ tin cậy</p>
              <p className={`text-2xl font-bold ${priceData ? getConfidenceColor(priceData.confidence) : 'text-gray-500'}`}>
                {loading ? '...' : priceData ? `${priceData.confidence.toFixed(0)}%` : 'N/A'}
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Thông tin nguồn dữ liệu */}
      {priceData && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Nguồn dữ liệu:</span> {priceData.source}
          </p>
        </div>
      )}

      {/* Trạng thái các Oracle */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
          Trạng thái các nguồn Oracle
        </h4>
        <div className="space-y-2">
          {oracleHealth.map((oracle, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <span className={getStatusColor(oracle.status)}>
                  {getStatusIcon(oracle.status)}
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {oracle.source}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  oracle.status === 'online' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {oracle.status === 'online' ? 'Hoạt động' : 'Offline'}
                </span>
                {oracle.latency && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {oracle.latency}ms
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-700 dark:text-red-400 font-medium">Lỗi Oracle:</p>
          </div>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Ghi chú */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-blue-800 dark:text-blue-300 text-sm">
          <span className="font-medium">📊 Ghi chú:</span> Giá vàng được cập nhật từ nhiều nguồn Oracle để đảm bảo độ chính xác cao nhất. 
          Dữ liệu được cập nhật mỗi 60 giây và tuân thủ các quy định của Việt Nam về giao dịch tài sản số.
        </p>
      </div>
    </div>
  );
};

export default OracleStatus;
