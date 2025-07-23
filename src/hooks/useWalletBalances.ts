import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';

interface WalletBalances {
  ethBalance: number;
  pengxBalance: number;
  usdBalance: number;
  isLoading: boolean;
  error: string | null;
}

// ERC-20 Token ABI (minimal)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

// Mock contract addresses - replace with real ones
const PENGX_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';
const USDC_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';

export const useWalletBalances = (): WalletBalances => {
  const { account, provider, balance: ethBalanceString } = useWeb3();
  const [pengxBalance, setPengxBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ethBalance = parseFloat(ethBalanceString) || 0;

  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (!account || !provider) {
        setPengxBalance(0);
        setUsdBalance(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch PenGx token balance
        try {
          const pengxContract = new ethers.Contract(PENGX_TOKEN_ADDRESS, ERC20_ABI, provider);
          const pengxBalanceRaw = await pengxContract.balanceOf(account);
          const pengxDecimals = await pengxContract.decimals();
          const pengxBalanceFormatted = parseFloat(ethers.formatUnits(pengxBalanceRaw, pengxDecimals));
          setPengxBalance(pengxBalanceFormatted);
        } catch (err) {
          console.warn('PenGx contract not found or error fetching balance, using mock data');
          // For development, start with 0 PenGx tokens
          setPengxBalance(0);
        }

        // Fetch USD/USDC balance
        try {
          const usdcContract = new ethers.Contract(USDC_TOKEN_ADDRESS, ERC20_ABI, provider);
          const usdcBalanceRaw = await usdcContract.balanceOf(account);
          const usdcDecimals = await usdcContract.decimals();
          const usdcBalanceFormatted = parseFloat(ethers.formatUnits(usdcBalanceRaw, usdcDecimals));
          setUsdBalance(usdcBalanceFormatted);
        } catch (err) {
          console.warn('USDC contract not found, estimating USD value from ETH');
          // Estimate USD value from ETH balance (mock ETH price)
          const ethPriceUSD = 2500; // Mock ETH price
          setUsdBalance(ethBalance * ethPriceUSD);
        }
      } catch (err) {
        console.error('Error fetching token balances:', err);
        setError('Failed to fetch wallet balances');
        // Set fallback values
        setPengxBalance(0);
        setUsdBalance(ethBalance * 2500); // Fallback ETH to USD conversion
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenBalances();
  }, [account, provider, ethBalance]);

  return {
    ethBalance,
    pengxBalance,
    usdBalance,
    isLoading,
    error,
  };
};

export default useWalletBalances;
