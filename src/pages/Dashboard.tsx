import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, HelpCircle, LogOut, User, TrendingUp, BarChart3, Coins } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useWeb3 } from '../contexts/Web3Context';
import { useSandbox } from '../contexts/SandboxContext';
import MetricsPanel from '../components/MetricsPanel';
import EnhancedChart from '../components/EnhancedChart';
import TradingPanel from '../components/TradingPanel';
import OnboardingFlow from '../components/OnboardingFlow';
import NotificationCenter from '../components/NotificationCenter';
import DCASection from '../components/DCASection';
import SimpleAdvancedMetrics from '../components/SimpleAdvancedMetrics';
import SimpleAdvancedChart from '../components/SimpleAdvancedChart';
import ModeIndicator from '../components/ModeIndicator';

function PentaGoldLogo({ size = 40 }) {
  return (
    <span className="h-10 w-10 rounded-full border border-amber-400 bg-white flex items-center justify-center shadow-md p-0.5">
      <img
        src={"/pentagold-logo.png"}
        alt="PentaGold Logo"
        style={{ width: size, height: size }}
        className="object-contain"
        draggable={false}
      />
    </span>
  );
}

type TabType = 'overview' | 'trading' | 'dca';
type AssetType = 'PenGx' | 'PenSx' | 'PenPx';

const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { account, disconnectWallet } = useWeb3();
  const { isSandboxMode, toggleSandboxMode } = useSandbox();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedAsset, setSelectedAsset] = useState<AssetType>('PenGx');
  const [toolbarMinimized, setToolbarMinimized] = useState(false);

  const getAssetLogoStyle = (symbol: string, isComingSoon: boolean) => {
    if (isComingSoon) return { filter: 'grayscale(1) opacity(0.6)' };
    
    switch (symbol) {
      case 'PenSx':
        return { filter: 'brightness(1.1) contrast(0.9) sepia(0.2)' }; // Silver tint
      case 'PenPx':
        return { filter: 'brightness(0.95) contrast(1.05)' }; // Platinum tint
      default:
        return {}; // Gold (original)
    }
  };

  useEffect(() => {
    // Check if user is new or wants onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const expertMode = localStorage.getItem('expertMode');
    
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    if (expertMode === 'true') {
      setIsExpertMode(true);
    }
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const toggleExpertMode = () => {
    const newMode = !isExpertMode;
    setIsExpertMode(newMode);
    localStorage.setItem('expertMode', newMode.toString());
  };

  const handleSignOut = async () => {
    try {
      disconnectWallet();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderTabContent = () => {
    // Show coming soon message for non-PenGx assets
    if (selectedAsset !== 'PenGx') {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
              <img
                src="/pentagold-logo.png"
                alt={`${selectedAsset} Logo`}
                className="w-16 h-16 object-contain"
                style={getAssetLogoStyle(selectedAsset, true)}
                draggable={false}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedAsset === 'PenSx' ? 'PenSx - Silver Token' : 'PenPx - Platinum Token'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedAsset === 'PenSx' 
                ? 'Token hóa bạc đang trong quá trình phát triển. Chúng tôi sẽ sớm ra mắt sản phẩm này để mở rộng hệ sinh thái kim loại quý của PentaGold.'
                : 'Token hóa bạch kim đang trong quá trình phát triển. Đây sẽ là cơ hội đầu tư vào kim loại quý cao cấp nhất trong hệ sinh thái PentaGold.'
              }
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg">
              <span className="text-sm font-medium">Sắp ra mắt - Theo dõi để cập nhật</span>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <ModeIndicator isExpertMode={isExpertMode} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {isExpertMode ? (
                  <>
                    <SimpleAdvancedMetrics />
                    <SimpleAdvancedChart />
                  </>
                ) : (
                  <>
                    <MetricsPanel />
                    <EnhancedChart />
                  </>
                )}
              </div>
              <div className="lg:col-span-1 space-y-8">
                <TradingPanel />
              </div>
            </div>

            {!isExpertMode && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Trạng thái Oracle
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Chainlink</span>
                      <span className="text-sm text-green-600">Hoạt động</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Band Protocol</span>
                      <span className="text-sm text-green-600">Hoạt động</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cập nhật cuối</span>
                      <span className="text-sm text-gray-900 dark:text-white">2 phút trước</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Thống kê mạng
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Giá Gas</span>
                      <span className="text-sm text-gray-900 dark:text-white">25 gwei</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Thời gian Block</span>
                      <span className="text-sm text-gray-900 dark:text-white">12.5s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Mạng</span>
                      <span className="text-sm text-green-600">Ethereum</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Bảo mật
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Smart Contract</span>
                      <span className="text-sm text-green-600">Đã kiểm toán</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Timelock</span>
                      <span className="text-sm text-green-600">48h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cầu dao ngắt mạch</span>
                      <span className="text-sm text-green-600">Hoạt động</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      case 'trading':
        return (
          <>
            <ModeIndicator isExpertMode={isExpertMode} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {isExpertMode ? <SimpleAdvancedChart /> : <EnhancedChart />}
              </div>
              <div className="lg:col-span-1">
                <TradingPanel />
              </div>
            </div>
          </>
        );
      case 'dca':
        return <DCASection />;
      default:
        return null;
    }
  };

  const AssetToolbar = () => {
    const assets = [
      {
        symbol: 'PenGx',
        name: 'Gold Token',
        color: 'amber',
        status: 'active',
        description: 'Tokenized Gold',
        logo: '/pentagold-logo.png'
      },
      {
        symbol: 'PenSx',
        name: 'Silver Token',
        color: 'gray',
        status: 'coming-soon',
        description: 'Tokenized Silver',
        logo: '/pentagold-logo.png' // Will be replaced with silver variant
      },
      {
        symbol: 'PenPx',
        name: 'Platinum Token',
        color: 'slate',
        status: 'coming-soon',
        description: 'Tokenized Platinum',
        logo: '/pentagold-logo.png' // Will be replaced with platinum variant
      }
    ];

    const modules = [
      {
        id: 'penta-lend',
        name: 'Penta Lend',
        description: 'Lending & Borrowing',
        icon: '🏦',
        status: 'coming-soon',
        color: 'blue'
      },
      {
        id: 'penta-invest',
        name: 'Penta Invest',
        description: 'Investment Pools',
        icon: '📈',
        status: 'coming-soon',
        color: 'green'
      },
      {
        id: 'penta-pay',
        name: 'Penta Pay',
        description: 'Payment Gateway',
        icon: '💳',
        status: 'coming-soon',
        color: 'purple'
      }
    ];

    return (
      <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 min-h-screen ${
        toolbarMinimized ? 'w-16' : 'w-64'
      }`}>
        <div className="p-4">
          {/* Header with minimize/maximize buttons */}
          <div className="flex items-center justify-between mb-4">
            {!toolbarMinimized && (
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                <Coins className="h-4 w-4 mr-2 text-amber-600" />
                Tài sản
              </h3>
            )}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setToolbarMinimized(!toolbarMinimized)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={toolbarMinimized ? "Mở rộng" : "Thu gọn"}
              >
                {toolbarMinimized ? (
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Assets Section */}
          {toolbarMinimized ? (
            // Minimized view - just icons
            <div className="space-y-2">
              {assets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset.symbol as AssetType)}
                  disabled={asset.status === 'coming-soon'}
                  className={`w-full p-2 rounded-lg transition-all duration-200 group relative ${
                    selectedAsset === asset.symbol
                      ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700'
                      : asset.status === 'coming-soon'
                      ? 'bg-gray-50 dark:bg-gray-700/50 opacity-60 cursor-not-allowed'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent'
                  }`}
                  title={`${asset.symbol} - ${asset.description}`}
                >
                  <div className="flex justify-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
                      asset.status === 'coming-soon' 
                        ? 'bg-gray-200 dark:bg-gray-600 opacity-60' 
                        : selectedAsset === asset.symbol
                        ? 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600'
                    }`}>
                      <img
                        src={asset.logo}
                        alt={`${asset.symbol} Logo`}
                        className="w-6 h-6 object-contain"
                        style={getAssetLogoStyle(asset.symbol, asset.status === 'coming-soon')}
                        draggable={false}
                      />
                    </div>
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {asset.symbol} - {asset.description}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // Full view
            <div className="space-y-2">
              {assets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset.symbol as AssetType)}
                  disabled={asset.status === 'coming-soon'}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                    selectedAsset === asset.symbol
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500'
                      : asset.status === 'coming-soon'
                      ? 'bg-gray-50 dark:bg-gray-700/50 opacity-60 cursor-not-allowed'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                      asset.status === 'coming-soon' 
                        ? 'bg-gray-200 dark:bg-gray-600 opacity-60' 
                        : selectedAsset === asset.symbol
                        ? 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600'
                    }`}>
                      <img
                        src={asset.logo}
                        alt={`${asset.symbol} Logo`}
                        className="w-8 h-8 object-contain"
                        style={getAssetLogoStyle(asset.symbol, asset.status === 'coming-soon')}
                        draggable={false}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${
                          selectedAsset === asset.symbol 
                            ? 'text-amber-700 dark:text-amber-300' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {asset.symbol}
                        </span>
                        {asset.status === 'coming-soon' && (
                          <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            Sắp ra mắt
                          </span>
                        )}
                        {asset.status === 'active' && selectedAsset === asset.symbol && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {asset.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Asset Stats and Modules - Only show in full view */}
        {!toolbarMinimized && (
          <>
            
          {/* Coming Soon Info */}
          {(selectedAsset === 'PenSx' || selectedAsset === 'PenPx') && (
            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {selectedAsset === 'PenSx' ? 'PenSx - Silver Token' : 'PenPx - Platinum Token'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {selectedAsset === 'PenSx' 
                  ? 'Token hóa bạc sẽ sớm được ra mắt. Theo dõi để cập nhật thông tin mới nhất.'
                  : 'Token hóa bạch kim sẽ sớm được ra mắt. Cơ hội đầu tư vào kim loại quý cao cấp.'
                }
              </p>
            </div>
          )}
          
          {/* Ecosystem Modules Section */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-4 h-4 mr-2 text-purple-600">🏛️</div>
              Hệ sinh thái PentaGold
            </h3>
          
          <div className="space-y-2">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`w-full p-3 rounded-lg transition-all duration-200 ${
                  module.status === 'coming-soon'
                    ? 'bg-gray-50 dark:bg-gray-700/50 opacity-70 cursor-not-allowed'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    module.status === 'coming-soon' 
                      ? 'bg-gray-200 dark:bg-gray-600' 
                      : `bg-${module.color}-100 dark:bg-${module.color}-900/30`
                  }`}>
                    {module.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {module.name}
                      </span>
                      {module.status === 'coming-soon' && (
                        <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          Sắp ra mắt
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {module.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Module Info Cards */}
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                🏦 Penta Lend
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Cho vay và vay mượn tài sản được token hóa với lãi suất cạnh tranh.
              </p>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                📈 Penta Invest
              </h4>
              <p className="text-xs text-green-700 dark:text-green-400">
                Quỹ đầu tư tự động vào các kim loại quý với chiến lược đa dạng hóa.
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2 flex items-center">
                💳 Penta Pay
              </h4>
              <p className="text-xs text-purple-700 dark:text-purple-400">
                Cổng thanh toán bằng token kim loại quý cho thương mại điện tử.
              </p>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex">
      {/* Left Asset Sidebar */}
      <AssetToolbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-3">
                <PentaGoldLogo size={32} />
                <span className="text-xl font-bold text-gray-900 dark:text-white">PentaGold</span>
              </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSandboxMode}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isSandboxMode
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Sandbox Mode
              </button>

              <button
                onClick={toggleExpertMode}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  isExpertMode
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Chế độ Chuyên gia</span>
              </button>

              <NotificationCenter />
              <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-amber-600 transition-colors">
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <button 
                onClick={() => setShowOnboarding(true)}
                className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
              >
                <HelpCircle className="h-5 w-5" />
              </button>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center" title={account || 'Người dùng'}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
                <button onClick={handleSignOut} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
        {/* Header with Tabs */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bảng điều khiển</h1>
                  {isExpertMode && (
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                      Chế độ Chuyên gia
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Chào mừng trở lại, {account?.slice(0, 6)}...{account?.slice(-4)}
                  {isExpertMode && " • Phân tích nâng cao đã được kích hoạt"}
                  {selectedAsset !== 'PenGx' && ` • Đang xem ${selectedAsset}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(['overview', 'trading', 'dca'] as TabType[]).map(tab => {
                  const tabLabels = {
                    overview: 'Tổng quan',
                    trading: 'Giao dịch',
                    dca: 'DCA'
                  };
                  
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        activeTab === tab
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>{tabLabels[tab]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-8 flex-1">
          {renderTabContent()}
        </main>

        <OnboardingFlow isOpen={showOnboarding} onClose={handleOnboardingClose} />
      </div>
    </div>
  );
};

export default Dashboard;