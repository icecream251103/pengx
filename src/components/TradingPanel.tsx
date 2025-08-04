import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Settings, AlertTriangle, CheckCircle, Loader, DollarSign, Coins, RefreshCw, TestTube } from 'lucide-react';
import { useGoldPrice } from '../hooks/useGoldPrice';
import { useSandbox, INITIAL_VIRTUAL_USD } from '../contexts/SandboxContext';
import { useWalletBalances } from '../hooks/useWalletBalances';
import { 
  estimateGasPrice, 
  estimateTransactionCost, 
  calculateMinimumReceived, 
  calculatePriceImpact,
  formatCurrency,
  formatPercentage,
  validateSlippage
} from '../utils/calculations';

type TradeType = 'mint' | 'redeem';

const TradingPanel: React.FC = () => {
  const { currentData } = useGoldPrice();
  const { isSandboxMode, sandboxBalance, executeSandboxTrade, resetSandboxBalance } = useSandbox();
  const { ethBalance, pengxBalance, usdBalance } = useWalletBalances();
  const [tradeType, setTradeType] = useState<TradeType>('mint');
  const [amount, setAmount] = useState('');
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [gasPrice, setGasPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get current balance based on mode
  const getCurrentBalance = () => {
    if (isSandboxMode) {
      return {
        eth: ethBalance,
        pengx: sandboxBalance.virtualTokens,
        usd: sandboxBalance.virtualUSD
      };
    }
    return {
      eth: ethBalance,
      pengx: pengxBalance,
      usd: usdBalance
    };
  };

  useEffect(() => {
    estimateGasPrice().then(setGasPrice);
  }, []);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError(null);
  };

  const handleMaxClick = () => {
    const balance = getCurrentBalance();
    if (tradeType === 'mint') {
      // For minting, set the max USD amount user can spend
      setAmount(balance.usd.toString());
    } else {
      // For redeeming, set the max PenGx tokens user can redeem
      setAmount(balance.pengx.toString());
    }
  };

  const handleTradeTypeSwitch = () => {
    setTradeType(prev => prev === 'mint' ? 'redeem' : 'mint');
    setAmount('');
    setError(null);
  };

  const validateTransaction = (): string | null => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return 'Please enter a valid amount';
    }

    const balance = getCurrentBalance();

    if (tradeType === 'mint') {
      // For minting, numAmount is the USD amount the user wants to spend
      if (numAmount > balance.usd) {
        return `Insufficient ${isSandboxMode ? 'virtual ' : ''}USD balance`;
      }
    } else {
      // For redeeming, numAmount is the PenGx tokens the user wants to redeem
      if (numAmount > balance.pengx) {
        return `Insufficient ${isSandboxMode ? 'virtual ' : ''}PenGx balance`;
      }
    }

    const slippageError = validateSlippage(slippageTolerance);
    if (slippageError) return slippageError;

    return null;
  };

  const handleTrade = async () => {
    const validationError = validateTransaction();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const numAmount = parseFloat(amount);
      
      if (isSandboxMode) {
        // Handle sandbox trade
        const usdAmount = tradeType === 'mint' ? numAmount : numAmount * currentData.price;
        const tokenAmount = tradeType === 'mint' ? numAmount / currentData.price : numAmount;
        
        const success = executeSandboxTrade(
          tradeType === 'mint' ? 'buy' : 'sell',
          usdAmount,
          tokenAmount
        );
        
        if (!success) {
          setError('Insufficient virtual balance');
          return;
        }
        
        setSuccessMessage(`Virtual ${tradeType === 'mint' ? 'mint' : 'redeem'} successful!`);
      } else {
        // Handle real trade (simulate)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSuccessMessage(`${tradeType === 'mint' ? 'Mint' : 'Redeem'} transaction successful!`);
      }
      
      // Reset form on success
      setAmount('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const outputAmount = tradeType === 'mint' 
    ? numAmount / currentData.price // USD amount divided by price gives PenGx tokens
    : numAmount * currentData.price; // PenGx tokens multiplied by price gives USD
  const priceImpact = calculatePriceImpact(numAmount * currentData.price, 10000000); // $10M liquidity
  const transactionCost = estimateTransactionCost(gasPrice);
  
  const minReceived = tradeType === 'mint' 
    ? calculateMinimumReceived(outputAmount, slippageTolerance) // Min PenGx tokens received
    : calculateMinimumReceived(outputAmount, slippageTolerance); // Min USD received

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">Giao dịch PenGx</h2>
          {isSandboxMode && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
              <TestTube className="h-3 w-3 flex-shrink-0" />
              <span>Sandbox</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {isSandboxMode && (
            <button
              onClick={resetSandboxBalance}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Reset Virtual Balance"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Balance Section - Enhanced stable layout */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold ${
            isSandboxMode 
              ? 'text-amber-800 dark:text-amber-400' 
              : 'text-blue-800 dark:text-blue-400'
          }`}>
            {isSandboxMode ? 'Danh mục Ảo' : 'Danh mục Tài sản'}
          </h3>
          <span className={`text-xs whitespace-nowrap ${
            isSandboxMode 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-blue-600 dark:text-blue-400'
          }`}>
            {isSandboxMode ? 'Tài sản ảo' : 'Tài sản thật'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 min-w-0">
            <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {isSandboxMode ? 'Virtual USD' : 'USD Balance'}
              </div>
              <div className="font-bold text-gray-900 dark:text-white truncate">
                {isSandboxMode 
                  ? formatCurrency(sandboxBalance.virtualUSD)
                  : formatCurrency(usdBalance)
                }
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 min-w-0">
            <Coins className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {isSandboxMode ? 'Virtual PenGx' : 'PenGx Balance'}
              </div>
              <div className="font-bold text-gray-900 dark:text-white truncate">
                {isSandboxMode 
                  ? sandboxBalance.virtualTokens.toFixed(6)
                  : pengxBalance.toFixed(6)
                }
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Portfolio Performance Summary (Sandbox Only) - Enhanced stable layout */}
      {isSandboxMode && sandboxBalance.virtualTokens > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-3">
            📊 Hiệu suất Danh mục
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="min-w-0">
              <div className="text-xs text-amber-600 dark:text-amber-400 mb-1 truncate">Tổng đầu tư</div>
              <div className="font-semibold text-amber-900 dark:text-amber-300 truncate">
                {formatCurrency(INITIAL_VIRTUAL_USD - sandboxBalance.virtualUSD)}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-amber-600 dark:text-amber-400 mb-1 truncate">Giá trị hiện tại</div>
              <div className="font-semibold text-amber-900 dark:text-amber-300 truncate">
                {formatCurrency(sandboxBalance.virtualTokens * currentData.price + sandboxBalance.virtualUSD)}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-amber-600 dark:text-amber-400 mb-1 truncate">Lãi/Lỗ tổng</div>
              <div className={`font-semibold truncate ${
                (sandboxBalance.virtualTokens * currentData.price + sandboxBalance.virtualUSD - INITIAL_VIRTUAL_USD) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {(() => {
                  const totalValue = sandboxBalance.virtualTokens * currentData.price + sandboxBalance.virtualUSD;
                  const totalPL = totalValue - INITIAL_VIRTUAL_USD;
                  const totalPLPercentage = ((totalValue - INITIAL_VIRTUAL_USD) / INITIAL_VIRTUAL_USD) * 100;
                  return `${formatCurrency(totalPL)} (${totalPL >= 0 ? '+' : ''}${totalPLPercentage.toFixed(2)}%)`;
                })()}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-amber-600 dark:text-amber-400 mb-1 truncate">Giá mua TB</div>
              <div className="font-semibold text-amber-900 dark:text-amber-300 truncate">
                {(() => {
                  const totalInvested = INITIAL_VIRTUAL_USD - sandboxBalance.virtualUSD;
                  const avgPrice = sandboxBalance.virtualTokens > 0 ? totalInvested / sandboxBalance.virtualTokens : 0;
                  return formatCurrency(avgPrice);
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel - Enhanced stable layout */}
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 min-w-0">
              Dung sai trượt giá
            </label>
            <span className="text-sm text-gray-500 whitespace-nowrap ml-2">{slippageTolerance}%</span>
          </div>
          <div className="flex space-x-2 mb-3">
            {[0.1, 0.5, 1.0].map((value) => (
              <button
                key={value}
                onClick={() => setSlippageTolerance(value)}
                className={`px-3 py-1 rounded text-sm ${
                  slippageTolerance === value
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                {value}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={slippageTolerance}
            onChange={(e) => setSlippageTolerance(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}

      {/* Trade Type Selector - Enhanced stable layout */}
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4 sm:mb-6">
        <button
          onClick={() => setTradeType('mint')}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            tradeType === 'mint'
              ? 'bg-amber-600 text-white'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          Mua PenGx
        </button>
        <button
          onClick={() => setTradeType('redeem')}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            tradeType === 'redeem'
              ? 'bg-amber-600 text-white'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          Bán PenGx
        </button>
      </div>

      {/* Input Section - Enhanced responsive and stable layout */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tradeType === 'mint' ? 'Bạn trả' : 'Bạn bán'}
            </label>
            <span className="text-sm text-gray-500 truncate">
              {isSandboxMode ? 'Virtual ' : ''}Balance: {(() => {
                const balance = getCurrentBalance();
                return tradeType === 'mint' 
                  ? formatCurrency(balance.usd) 
                  : `${balance.pengx.toFixed(6)} PenGx`;
              })()}
            </span>
          </div>
          
          <div className="flex items-center">
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-2xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 border-none outline-none min-w-0 pr-3"
            />
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
                {tradeType === 'mint' ? (
                  <DollarSign className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <Coins className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="font-medium whitespace-nowrap">
                  {tradeType === 'mint' ? 'USD' : 'PenGx'}
                </span>
              </div>
              <button
                onClick={handleMaxClick}
                className="px-2 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 transition-colors whitespace-nowrap flex-shrink-0"
              >
                MAX
              </button>
            </div>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center">
          <button
            onClick={handleTradeTypeSwitch}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowUpDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Output Section - Enhanced responsive and stable layout */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tradeType === 'mint' ? 'Bạn nhận' : 'Bạn được'}
            </label>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Tỷ giá: {formatCurrency(currentData.price)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white min-w-0 flex-1 truncate">
              {outputAmount.toFixed(6)}
            </div>
            <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 flex-shrink-0 ml-3">
              {tradeType === 'mint' ? (
                <Coins className="h-5 w-5 flex-shrink-0" />
              ) : (
                <DollarSign className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="font-medium whitespace-nowrap">
                {tradeType === 'mint' ? 'PenGx' : 'USD'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      {numAmount > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 space-y-2">
          {/* Profit/Loss for redeeming PenGx to USD */}
          {tradeType === 'redeem' && isSandboxMode && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Giá trị hiện tại</span>
                <span className="text-gray-900 dark:text-white">
                  {formatCurrency(outputAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Giá mua trung bình</span>
                <span className="text-gray-900 dark:text-white">
                  {(() => {
                    const totalInvested = INITIAL_VIRTUAL_USD - sandboxBalance.virtualUSD;
                    const avgPrice = sandboxBalance.virtualTokens > 0 ? totalInvested / sandboxBalance.virtualTokens : currentData.price;
                    return formatCurrency(avgPrice);
                  })()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                  <span>Lãi/Lỗ</span>
                  {(() => {
                    const totalInvested = INITIAL_VIRTUAL_USD - sandboxBalance.virtualUSD;
                    const avgPrice = sandboxBalance.virtualTokens > 0 ? totalInvested / sandboxBalance.virtualTokens : currentData.price;
                    const profitLoss = (currentData.price - avgPrice) * numAmount;
                    return profitLoss >= 0 ? (
                      <span className="ml-1 text-green-500">📈</span>
                    ) : (
                      <span className="ml-1 text-red-500">📉</span>
                    );
                  })()}
                </span>
                <span className={(() => {
                  const totalInvested = INITIAL_VIRTUAL_USD - sandboxBalance.virtualUSD;
                  const avgPrice = sandboxBalance.virtualTokens > 0 ? totalInvested / sandboxBalance.virtualTokens : currentData.price;
                  const profitLoss = (currentData.price - avgPrice) * numAmount;
                  return profitLoss >= 0 ? 'text-green-600' : 'text-red-600';
                })()}>
                  {(() => {
                    const totalInvested = INITIAL_VIRTUAL_USD - sandboxBalance.virtualUSD;
                    const avgPrice = sandboxBalance.virtualTokens > 0 ? totalInvested / sandboxBalance.virtualTokens : currentData.price;
                    const profitLoss = (currentData.price - avgPrice) * numAmount;
                    const profitLossPercentage = avgPrice > 0 ? ((currentData.price - avgPrice) / avgPrice) * 100 : 0;
                    return `${formatCurrency(profitLoss)} (${profitLoss >= 0 ? '+' : ''}${profitLossPercentage.toFixed(2)}%)`;
                  })()}
                </span>
              </div>
              <hr className="border-gray-300 dark:border-gray-600" />
            </>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tác động giá</span>
            <span className={`${priceImpact > 1 ? 'text-red-600' : 'text-green-600'}`}>
              {formatPercentage(priceImpact)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tối thiểu nhận được</span>
            <span className="text-gray-900 dark:text-white">
              {minReceived.toFixed(6)} {tradeType === 'mint' ? 'PenGx' : 'USD'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Phí mạng</span>
            <span className="text-gray-900 dark:text-white">
              ~{transactionCost.toFixed(6)} ETH (${gasPrice} gwei)
            </span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-700 dark:text-green-400 text-sm">{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
        </div>
      )}

      {/* Trade Button */}
      <button
        onClick={handleTrade}
        disabled={isLoading || !amount || !!validateTransaction()}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader className="animate-spin h-5 w-5 mr-2" />
            {isSandboxMode ? 'Processing Virtual Trade...' : 'Processing...'}
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5 mr-2" />
            {isSandboxMode ? 'Giả lập ' : ''}{tradeType === 'mint' ? 'Mua PenGx' : 'Bán PenGx'}
          </>
        )}
      </button>

      {/* Disclaimer */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Giao dịch có thể bị ảnh hưởng bởi tắc nghẽn mạng và phí gas. 
        Luôn xác minh chi tiết giao dịch trước khi xác nhận.
      </div>
    </div>
  );
};

export default TradingPanel;