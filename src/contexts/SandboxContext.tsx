import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SandboxBalance {
  virtualUSD: number;
  virtualTokens: number;
  virtualVND: number; // Track VNĐ trực tiếp để tránh conversion error
}

interface VirtualDCAPlan {
  id: string;
  amount: number;
  frequency: string;
  startDate: string;
  endDate: string;
  totalInvested: number;
  tokensAccumulated: number;
  executionHistory: Array<{
    date: string;
    usdAmount: number;
    tokensReceived: number;
    priceAtExecution: number;
  }>;
  isActive: boolean;
}

export type { VirtualDCAPlan };

interface SandboxContextType {
  isSandboxMode: boolean;
  sandboxBalance: SandboxBalance;
  virtualDCAPlans: VirtualDCAPlan[];
  toggleSandboxMode: () => void;
  updateSandboxBalance: (usdAmount: number, tokenAmount: number) => void;
  resetSandboxBalance: () => void;
  executeSandboxTrade: (tradeType: 'buy' | 'sell', usdAmount: number, tokenAmount: number) => boolean;
  executeSandboxTradeVND: (tradeType: 'buy' | 'sell', vndAmount: number, tokenAmount: number) => boolean;
  createVirtualDCAPlan: (plan: Omit<VirtualDCAPlan, 'id' | 'totalInvested' | 'tokensAccumulated' | 'executionHistory' | 'isActive'>) => string;
  pauseVirtualDCAPlan: (planId: string) => void;
  resumeVirtualDCAPlan: (planId: string) => void;
  deleteVirtualDCAPlan: (planId: string) => void;
  executeVirtualDCA: (planId: string, currentPrice: number) => boolean;
}

const SandboxContext = createContext<SandboxContextType | undefined>(undefined);

interface SandboxProviderProps {
  children: ReactNode;
}

// Đảm bảo có đúng 200 triệu VNĐ tròn
// Tính ngược từ 200M VNĐ để tránh rounding error
const TARGET_VND = 200000000; // 200 triệu VNĐ
const INITIAL_VIRTUAL_USD = Math.ceil(TARGET_VND / 26199 * 100) / 100; // Làm tròn lên để đảm bảo đủ VNĐ
const INITIAL_VIRTUAL_TOKENS = 0;

export { INITIAL_VIRTUAL_USD };

export const SandboxProvider: React.FC<SandboxProviderProps> = ({ children }) => {
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [sandboxBalance, setSandboxBalance] = useState<SandboxBalance>({
    virtualUSD: INITIAL_VIRTUAL_USD,
    virtualTokens: INITIAL_VIRTUAL_TOKENS,
    virtualVND: TARGET_VND, // Đúng 200 triệu VNĐ
  });
  const [virtualDCAPlans, setVirtualDCAPlans] = useState<VirtualDCAPlan[]>([]);

  useEffect(() => {
    // Load sandbox mode state from localStorage
    const savedSandboxMode = localStorage.getItem('sandboxMode');
    const savedBalance = localStorage.getItem('sandboxBalance');
    const savedDCAPlans = localStorage.getItem('virtualDCAPlans');

    if (savedSandboxMode === 'true') {
      setIsSandboxMode(true);
    }

    if (savedBalance) {
      try {
        const parsedBalance = JSON.parse(savedBalance);
        // Migration: add virtualVND if missing
        if (!parsedBalance.virtualVND) {
          parsedBalance.virtualVND = parsedBalance.virtualUSD * 26199;
        }
        setSandboxBalance(parsedBalance);
      } catch (error) {
        console.error('Error parsing saved sandbox balance:', error);
        resetSandboxBalance();
      }
    }

    if (savedDCAPlans) {
      try {
        const parsedPlans = JSON.parse(savedDCAPlans);
        setVirtualDCAPlans(parsedPlans);
      } catch (error) {
        console.error('Error parsing saved virtual DCA plans:', error);
        setVirtualDCAPlans([]);
      }
    }
  }, []);

  const toggleSandboxMode = () => {
    const newMode = !isSandboxMode;
    setIsSandboxMode(newMode);
    localStorage.setItem('sandboxMode', newMode.toString());

    // Reset balance when entering sandbox mode
    if (newMode) {
      resetSandboxBalance();
    }
  };

  const updateSandboxBalance = (usdAmount: number, tokenAmount: number) => {
    const newBalance = {
      virtualUSD: usdAmount,
      virtualTokens: tokenAmount,
      virtualVND: usdAmount * 26199, // Sync VNĐ với USD
    };
    setSandboxBalance(newBalance);
    localStorage.setItem('sandboxBalance', JSON.stringify(newBalance));
  };

  const resetSandboxBalance = () => {
    const initialBalance = {
      virtualUSD: INITIAL_VIRTUAL_USD,
      virtualTokens: INITIAL_VIRTUAL_TOKENS,
      virtualVND: TARGET_VND,
    };
    setSandboxBalance(initialBalance);
    localStorage.setItem('sandboxBalance', JSON.stringify(initialBalance));
  };

  const executeSandboxTrade = (tradeType: 'buy' | 'sell', usdAmount: number, tokenAmount: number): boolean => {
    if (tradeType === 'buy') {
      // Check if user has enough virtual USD
      if (sandboxBalance.virtualUSD < usdAmount) {
        return false; // Insufficient funds
      }
      
      // Execute buy trade
      updateSandboxBalance(
        sandboxBalance.virtualUSD - usdAmount,
        sandboxBalance.virtualTokens + tokenAmount
      );
      return true;
    } else {
      // Check if user has enough virtual tokens
      if (sandboxBalance.virtualTokens < tokenAmount) {
        return false; // Insufficient tokens
      }
      
      // Execute sell trade
      updateSandboxBalance(
        sandboxBalance.virtualUSD + usdAmount,
        sandboxBalance.virtualTokens - tokenAmount
      );
      return true;
    }
  };

  const executeSandboxTradeVND = (tradeType: 'buy' | 'sell', vndAmount: number, tokenAmount: number): boolean => {
    if (tradeType === 'buy') {
      // Check if user has enough virtual VND
      if (sandboxBalance.virtualVND < vndAmount) {
        return false; // Insufficient funds
      }
      
      // Execute buy trade - update both VND and USD
      const newVND = sandboxBalance.virtualVND - vndAmount;
      const newUSD = newVND / 26199; // Convert VND to USD for internal tracking
      const newTokens = sandboxBalance.virtualTokens + tokenAmount;
      
      setSandboxBalance({
        virtualVND: newVND,
        virtualUSD: newUSD,
        virtualTokens: newTokens
      });
      
      return true;
    } else {
      // Check if user has enough virtual tokens
      if (sandboxBalance.virtualTokens < tokenAmount) {
        return false; // Insufficient tokens
      }
      
      // Execute sell trade
      const newVND = sandboxBalance.virtualVND + vndAmount;
      const newUSD = newVND / 26199;
      const newTokens = sandboxBalance.virtualTokens - tokenAmount;
      
      setSandboxBalance({
        virtualVND: newVND,
        virtualUSD: newUSD,
        virtualTokens: newTokens
      });
      
      return true;
    }
  };

  // Virtual DCA Functions
  const createVirtualDCAPlan = (plan: Omit<VirtualDCAPlan, 'id' | 'totalInvested' | 'tokensAccumulated' | 'executionHistory' | 'isActive'>): string => {
    const planId = `dca_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPlan: VirtualDCAPlan = {
      ...plan,
      id: planId,
      totalInvested: 0,
      tokensAccumulated: 0,
      executionHistory: [],
      isActive: true,
    };
    
    setVirtualDCAPlans(prev => [...prev, newPlan]);
    localStorage.setItem('virtualDCAPlans', JSON.stringify([...virtualDCAPlans, newPlan]));
    return planId;
  };

  const pauseVirtualDCAPlan = (planId: string) => {
    setVirtualDCAPlans(prev => {
      const updated = prev.map(plan => 
        plan.id === planId ? { ...plan, isActive: false } : plan
      );
      localStorage.setItem('virtualDCAPlans', JSON.stringify(updated));
      return updated;
    });
  };

  const resumeVirtualDCAPlan = (planId: string) => {
    setVirtualDCAPlans(prev => {
      const updated = prev.map(plan => 
        plan.id === planId ? { ...plan, isActive: true } : plan
      );
      localStorage.setItem('virtualDCAPlans', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteVirtualDCAPlan = (planId: string) => {
    setVirtualDCAPlans(prev => {
      const updated = prev.filter(plan => plan.id !== planId);
      localStorage.setItem('virtualDCAPlans', JSON.stringify(updated));
      return updated;
    });
  };

  const executeVirtualDCA = (planId: string, currentPrice: number): boolean => {
    const plan = virtualDCAPlans.find(p => p.id === planId);
    if (!plan || !plan.isActive) return false;

    // Check if user has enough virtual USD
    if (sandboxBalance.virtualUSD < plan.amount) {
      return false; // Insufficient funds
    }

    const tokensReceived = plan.amount / currentPrice;

    // Update sandbox balance
    updateSandboxBalance(
      sandboxBalance.virtualUSD - plan.amount,
      sandboxBalance.virtualTokens + tokensReceived
    );

    // Update DCA plan
    setVirtualDCAPlans(prev => {
      const updated = prev.map(p => {
        if (p.id === planId) {
          const updatedPlan = {
            ...p,
            totalInvested: p.totalInvested + plan.amount,
            tokensAccumulated: p.tokensAccumulated + tokensReceived,
            executionHistory: [
              ...p.executionHistory,
              {
                date: new Date().toISOString(),
                usdAmount: plan.amount,
                tokensReceived,
                priceAtExecution: currentPrice,
              }
            ]
          };
          return updatedPlan;
        }
        return p;
      });
      localStorage.setItem('virtualDCAPlans', JSON.stringify(updated));
      return updated;
    });

    return true;
  };

  const value: SandboxContextType = {
    isSandboxMode,
    sandboxBalance,
    virtualDCAPlans,
    toggleSandboxMode,
    updateSandboxBalance,
    resetSandboxBalance,
    executeSandboxTrade,
    executeSandboxTradeVND,
    createVirtualDCAPlan,
    pauseVirtualDCAPlan,
    resumeVirtualDCAPlan,
    deleteVirtualDCAPlan,
    executeVirtualDCA,
  };

  return (
    <SandboxContext.Provider value={value}>
      {children}
    </SandboxContext.Provider>
  );
};

export const useSandbox = (): SandboxContextType => {
  const context = useContext(SandboxContext);
  if (context === undefined) {
    throw new Error('useSandbox must be used within a SandboxProvider');
  }
  return context;
};

export default SandboxContext;
