import React, { useState, useEffect } from 'react';
import { Sun, Moon, User, LogOut, HelpCircle, Coins, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useWeb3 } from '../contexts/Web3Context';
import PentaLendComponent from '../components/PentaLendComplete';
import PentaLendOnboarding from '../components/PentaLendOnboarding';

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

type AssetType = 'PenGx' | 'PenSx' | 'PenPx';

const PentaLendPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { account, disconnectWallet } = useWeb3();
  const [selectedAsset, setSelectedAsset] = useState<AssetType>('PenGx');
  const [toolbarMinimized, setToolbarMinimized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Hiển thị onboarding cho lần đầu tiên
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('pentalend_onboarding_completed');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-sidebar') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('pentalend_onboarding_completed', 'true');
  };

  const handleSignOut = async () => {
    try {
      disconnectWallet();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

  // Asset Toolbar Component - Exact copy from Dashboard
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
        logo: '/pentagold-logo.png'
      },
      {
        symbol: 'PenPx',
        name: 'Platinum Token',
        color: 'slate',
        status: 'coming-soon',
        description: 'Tokenized Platinum',
        logo: '/pentagold-logo.png'
      }
    ];

    const modules = [
      {
        id: 'penta-lend',
        name: 'Penta Lend',
        description: 'Lending & Borrowing',
        icon: '🏦',
        status: 'active',
        color: 'blue',
        badge: 'Thử Nghiệm'
      },
      {
        id: 'penta-invest',
        name: 'Penta Invest',
        description: 'Investment Pools',
        icon: '📈',
        status: 'coming-soon',
        color: 'green',
        badge: undefined
      },
      {
        id: 'penta-pay',
        name: 'Penta Pay',
        description: 'Payment Gateway',
        icon: '💳',
        status: 'coming-soon',
        color: 'purple',
        badge: undefined
      }
    ];

    return (
      <>
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 min-h-screen fixed left-0 top-0 z-30 overflow-y-auto mobile-sidebar
          ${toolbarMinimized ? 'w-16' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
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
                  onClick={() => {
                    setSelectedAsset(asset.symbol as AssetType);
                    if (asset.symbol === 'PenGx') {
                      navigate('/dashboard');
                    }
                  }}
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
                  onClick={() => {
                    setSelectedAsset(asset.symbol as AssetType);
                    if (asset.symbol === 'PenGx') {
                      navigate('/dashboard');
                    }
                  }}
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
          
          <div className="space-y-3">
            {modules.map((module) => (
              <div
                key={module.id}
                onClick={() => {
                  if (module.status !== 'coming-soon' && module.id === 'penta-lend') {
                    navigate('/pentalend');
                  }
                }}
                className={`w-full rounded-lg transition-all duration-200 ${
                  module.status === 'coming-soon'
                    ? 'bg-gray-50 dark:bg-gray-700/50 opacity-70 cursor-not-allowed'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'
                }`}
              >
                {/* Module Header */}
                <div className="p-3">
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
                        {module.badge && (
                          <span className="px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            {module.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Module Details */}
                <div className={`px-3 pb-3 pt-1 rounded-b-lg ${
                  module.id === 'penta-lend' 
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : module.id === 'penta-invest'
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-purple-50 dark:bg-purple-900/20'
                }`}>
                  <p className={`text-xs ${
                    module.id === 'penta-lend'
                      ? 'text-blue-700 dark:text-blue-400'
                      : module.id === 'penta-invest'
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-purple-700 dark:text-purple-400'
                  }`}>
                    {module.id === 'penta-lend' && 'Cho vay và vay mượn tài sản được token hóa với lãi suất cạnh tranh.'}
                    {module.id === 'penta-invest' && 'Quỹ đầu tư tự động vào các kim loại quý với chiến lược đa dạng hóa.'}
                    {module.id === 'penta-pay' && 'Cổng thanh toán bằng token kim loại quý cho thương mại điện tử.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
          </>
        )}
        </div>
      </>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Left Sidebar - Asset Toolbar */}
      <AssetToolbar />
      
      {/* Main Content Area */}
      <div className={`flex flex-col transition-all duration-300 ${
        toolbarMinimized ? 'md:ml-16' : 'md:ml-64'
      }`}>
        {/* Top Navigation - matching Dashboard exactly */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4">
            <div className="flex justify-between items-center h-16">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mobile-menu-button"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <PentaGoldLogo />
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PentaGold Ecosystem</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hệ sinh thái kim loại quý blockchain</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
                <button 
                  onClick={() => setShowOnboarding(true)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Hướng dẫn sử dụng PentaLend"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center" title={account || 'Người dùng'}>
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

        {/* Main Content */}
        <main className="flex-1">
          <PentaLendComponent />
        </main>
      </div>

      {/* Onboarding Modal */}
      <PentaLendOnboarding 
        isOpen={showOnboarding} 
        onClose={handleOnboardingClose} 
      />
    </div>
  );
};

export default PentaLendPage;
