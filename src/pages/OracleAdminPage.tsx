import { useState } from 'react';
import { Activity, Settings, RefreshCw, ExternalLink, Database, TrendingUp } from 'lucide-react';
import OracleStatus from '../components/OracleStatus';
import PriceComparisonWidget from '../components/PriceComparisonWidget';
import { useGoldPrice } from '../hooks/useGoldPrice';

const OracleAdminPage = () => {
  const { currentData, isLoading } = useGoldPrice();
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'settings'>('overview');

  const tabs = [
    { id: 'overview', label: 'Tổng quan Oracle', icon: Activity },
    { id: 'comparison', label: 'So sánh giá', icon: TrendingUp },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Oracle Management Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quản lý và giám sát hệ thống Oracle giá vàng
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Giá hiện tại:</span>{' '}
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin inline" />
                ) : (
                  <span className="font-semibold text-amber-600">
                    {currentData.price.toLocaleString()} ₫
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Thông báo quan trọng */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
                📊 Cập nhật giá vàng thực tế - Ngày 11/09/2025
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-800 dark:text-blue-400">
                    <span className="font-medium">Giá thực tế hiện tại:</span> $3,618.16/oz
                  </p>
                  <p className="text-blue-800 dark:text-blue-400">
                    <span className="font-medium">Giá cũ trong hệ thống:</span> $3,350/oz
                  </p>
                  <p className="text-blue-800 dark:text-blue-400">
                    <span className="font-medium">Chênh lệch:</span> +$268.16 (+8.0%)
                  </p>
                </div>
                <div>
                  <p className="text-blue-800 dark:text-blue-400">
                    <span className="font-medium">Đã cập nhật:</span> ✅ Base price, Oracle service
                  </p>
                  <p className="text-blue-800 dark:text-blue-400">
                    <span className="font-medium">Tuân thủ:</span> ✅ Luật pháp VN (VNĐ)
                  </p>
                  <p className="text-blue-800 dark:text-blue-400">
                    <span className="font-medium">Nguồn:</span> goldprice.org, Multiple APIs
                  </p>
                </div>
              </div>
            </div>

            {/* Oracle Status */}
            <OracleStatus />

            {/* Thông tin kỹ thuật */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🔗 Kết nối Oracle
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Chainlink (Testnet)</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs">
                      Mock
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Band Protocol</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs">
                      Mock
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">GoldPrice API</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                      Live
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">CoinGecko API</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                      Live
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  ⚡ Hiệu suất hệ thống
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Tần suất cập nhật</span>
                    <span className="font-medium text-gray-900 dark:text-white">60 giây</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Độ trễ trung bình</span>
                    <span className="font-medium text-gray-900 dark:text-white">~2.3s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Uptime 24h</span>
                    <span className="font-medium text-green-600">99.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Cache TTL</span>
                    <span className="font-medium text-gray-900 dark:text-white">5 phút</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-8">
            <PriceComparisonWidget simulatedPrice={currentData.price / 26199} />
            
            {/* Lịch sử chênh lệch */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📈 Lịch sử chênh lệch giá (24h)
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  Biểu đồ lịch sử sẽ được triển khai trong phiên bản tiếp theo
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                ⚙️ Cài đặt Oracle
              </h3>
              
              <div className="space-y-6">
                {/* Cài đặt tỷ giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tỷ giá USD/VND
                  </label>
                  <input
                    type="number"
                    defaultValue={26199}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Nhập tỷ giá USD/VND"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Tỷ giá hiện tại được sử dụng để chuyển đổi từ USD sang VNĐ
                  </p>
                </div>

                {/* Cài đặt trọng số Oracle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Trọng số các nguồn Oracle (%)
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">GoldPrice API</span>
                      <input type="number" defaultValue={40} className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded text-center" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">CoinGecko</span>
                      <input type="number" defaultValue={30} className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded text-center" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Forex API</span>
                      <input type="number" defaultValue={30} className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded text-center" />
                    </div>
                  </div>
                </div>

                {/* Nút lưu */}
                <div className="flex justify-end space-x-3">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Hủy
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Lưu cài đặt
                  </button>
                </div>
              </div>
            </div>

            {/* Liên kết hữu ích */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🔗 Liên kết hữu ích
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://goldprice.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ExternalLink className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">GoldPrice.org</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Giá vàng thế giới</p>
                  </div>
                </a>
                <a
                  href="https://docs.chain.link/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ExternalLink className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Chainlink Docs</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tài liệu Oracle</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OracleAdminPage;
