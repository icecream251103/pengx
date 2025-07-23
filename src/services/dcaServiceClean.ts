import { ethers } from 'ethers';

// Contract addresses
const DCA_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_DCA_MANAGER_ADDRESS || '';
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || '';
const PENGX_ADDRESS = process.env.NEXT_PUBLIC_PENGX_ADDRESS || '';

// Simplified ABIs
const DCAManagerABI = [
  "function createDCAStrategy(address,address,uint256,uint256,uint256,uint256) external returns (uint256)",
  "function getUserStrategies(address) external view returns (uint256[])",
  "function pauseDCAStrategy(uint256) external",
  "function resumeDCAStrategy(uint256) external",
  "function cancelDCAStrategy(uint256) external",
  "event DCAStrategyCreated(uint256 indexed strategyId, address indexed user, address paymentToken, address targetToken, uint256 amount, uint256 frequency, uint256 startTime, uint256 endTime)"
];

const ERC20ABI = [
  "function balanceOf(address) external view returns (uint256)",
  "function allowance(address,address) external view returns (uint256)",
  "function approve(address,uint256) external returns (bool)"
];

interface DCAParams {
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate?: string;
}

interface CreateStrategyResult {
  strategyId: string;
  txHash: string;
}

export class DCAService {
  private signer: ethers.Signer;
  private dcaManager: ethers.Contract;
  private usdcToken: ethers.Contract;

  constructor(signer: ethers.Signer) {
    this.signer = signer;
    this.dcaManager = new ethers.Contract(DCA_MANAGER_ADDRESS, DCAManagerABI, signer);
    this.usdcToken = new ethers.Contract(USDC_ADDRESS, ERC20ABI, signer);
  }

  async createDCAStrategy(params: DCAParams): Promise<CreateStrategyResult> {
    try {
      const { amount, frequency, startDate, endDate } = params;

      const startTime = Math.floor(new Date(startDate).getTime() / 1000);
      const endTime = endDate ? Math.floor(new Date(endDate).getTime() / 1000) : 0;

      const frequencyMap = {
        'daily': 24 * 60 * 60,
        'weekly': 7 * 24 * 60 * 60,
        'monthly': 30 * 24 * 60 * 60
      };
      const frequencySeconds = frequencyMap[frequency];

      const amountWei = ethers.parseUnits(amount.toString(), 6);
      const userAddress = await this.signer.getAddress();
      const currentAllowance = await this.usdcToken.allowance(userAddress, DCA_MANAGER_ADDRESS);

      if (currentAllowance < amountWei) {
        const approveTx = await this.usdcToken.approve(DCA_MANAGER_ADDRESS, ethers.MaxUint256);
        await approveTx.wait();
      }

      const tx = await this.dcaManager.createDCAStrategy(
        USDC_ADDRESS,
        PENGX_ADDRESS,
        amountWei,
        frequencySeconds,
        startTime,
        endTime
      );

      const receipt = await tx.wait();
      
      return {
        strategyId: '1',
        txHash: receipt.hash
      };
    } catch (error) {
      console.error('Error creating DCA strategy:', error);
      throw new Error('Không thể tạo chiến lược DCA');
    }
  }

  async getUserStrategies(userAddress: string): Promise<string[]> {
    try {
      const strategyIds = await this.dcaManager.getUserStrategies(userAddress);
      return strategyIds.map((id: any) => id.toString());
    } catch (error) {
      console.error('Error fetching user strategies:', error);
      return [];
    }
  }

  async pauseStrategy(strategyId: string): Promise<string> {
    try {
      const tx = await this.dcaManager.pauseDCAStrategy(strategyId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error pausing strategy:', error);
      throw new Error('Không thể tạm dừng chiến lược');
    }
  }

  async resumeStrategy(strategyId: string): Promise<string> {
    try {
      const tx = await this.dcaManager.resumeDCAStrategy(strategyId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error resuming strategy:', error);
      throw new Error('Không thể tiếp tục chiến lược');
    }
  }

  async cancelStrategy(strategyId: string): Promise<string> {
    try {
      const tx = await this.dcaManager.cancelDCAStrategy(strategyId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error canceling strategy:', error);
      throw new Error('Không thể hủy chiến lược');
    }
  }

  async getUSDCBalance(userAddress: string): Promise<string> {
    try {
      const balance = await this.usdcToken.balanceOf(userAddress);
      return ethers.formatUnits(balance, 6);
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      return '0';
    }
  }
}

export const createDCAService = (signer: ethers.Signer): DCAService => {
  return new DCAService(signer);
};
