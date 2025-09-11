// Service để lấy dữ liệu giá vàng thực từ các nguồn Oracle
// Tích hợp với Chainlink, Band Protocol và các API khác
import React from 'react';

export interface RealTimeGoldPrice {
  priceUSD: number;
  priceVND: number;
  timestamp: number;
  source: string;
  confidence: number;
}

export interface OracleSource {
  name: string;
  endpoint: string;
  weight: number;
  timeout: number;
}

// Cấu hình các nguồn oracle
export const ORACLE_SOURCES: OracleSource[] = [
  {
    name: 'GoldAPI',
    endpoint: 'https://api.metals.live/v1/spot/gold',
    weight: 40,
    timeout: 5000
  },
  {
    name: 'CoinGecko',
    endpoint: 'https://api.coingecko.com/api/v3/simple/price?ids=gold&vs_currencies=usd',
    weight: 30,
    timeout: 5000
  },
  {
    name: 'Forex API',
    endpoint: 'https://api.fxempire.com/v1/en/markets/GOLD/USD',
    weight: 30,
    timeout: 5000
  }
];

// Dữ liệu dự phòng khi API không khả dụng
const FALLBACK_PRICE = {
  priceUSD: 3618.16, // Giá cập nhật thủ công từ goldprice.org
  lastUpdate: '2025-09-11T10:00:00Z'
};

class GoldPriceOracleService {
  private cache: Map<string, { data: RealTimeGoldPrice; expiry: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 phút
  private readonly VND_RATE = 26199;

  /**
   * Lấy giá vàng từ nhiều nguồn và tính trung bình có trọng số
   */
  async getAggregatedGoldPrice(): Promise<RealTimeGoldPrice> {
    const promises = ORACLE_SOURCES.map(source => this.fetchFromSource(source));
    
    try {
      const results = await Promise.allSettled(promises);
      const validPrices: Array<{ price: number; weight: number; source: string }> = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          validPrices.push({
            price: result.value.priceUSD,
            weight: ORACLE_SOURCES[index].weight,
            source: ORACLE_SOURCES[index].name
          });
        }
      });

      if (validPrices.length === 0) {
        console.warn('Không có nguồn Oracle nào khả dụng, sử dụng giá dự phòng');
        return this.getFallbackPrice();
      }

      // Tính giá trung bình có trọng số
      const totalWeight = validPrices.reduce((sum, p) => sum + p.weight, 0);
      const weightedPrice = validPrices.reduce((sum, p) => sum + (p.price * p.weight), 0) / totalWeight;
      
      const confidence = (validPrices.length / ORACLE_SOURCES.length) * 100;
      const sources = validPrices.map(p => p.source).join(', ');

      return {
        priceUSD: Number(weightedPrice.toFixed(2)),
        priceVND: Math.round(weightedPrice * this.VND_RATE),
        timestamp: Date.now(),
        source: `Aggregated: ${sources}`,
        confidence
      };

    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ Oracle:', error);
      return this.getFallbackPrice();
    }
  }

  /**
   * Lấy dữ liệu từ một nguồn cụ thể
   */
  private async fetchFromSource(source: OracleSource): Promise<RealTimeGoldPrice | null> {
    const cacheKey = source.name;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), source.timeout);
      
      const response = await fetch(source.endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PentaGold-Oracle/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const price = this.parsePrice(data, source.name);
      
      if (!price || price <= 0) {
        throw new Error(`Giá không hợp lệ từ ${source.name}: ${price}`);
      }

      const result: RealTimeGoldPrice = {
        priceUSD: price,
        priceVND: Math.round(price * this.VND_RATE),
        timestamp: Date.now(),
        source: source.name,
        confidence: 100
      };

      // Cache kết quả
      this.cache.set(cacheKey, {
        data: result,
        expiry: Date.now() + this.CACHE_TTL
      });

      return result;

    } catch (error) {
      console.warn(`Lỗi khi lấy dữ liệu từ ${source.name}:`, error);
      return null;
    }
  }

  /**
   * Parse giá từ response của các API khác nhau
   */
  private parsePrice(data: any, sourceName: string): number | null {
    try {
      switch (sourceName) {
        case 'GoldAPI':
          return data?.gold || data?.price || null;
        
        case 'CoinGecko':
          return data?.gold?.usd || null;
        
        case 'Forex API':
          return data?.price || data?.last || null;
        
        default:
          // Thử parse các định dạng phổ biến
          return data?.price || data?.rate || data?.value || data?.last || null;
      }
    } catch (error) {
      console.error(`Lỗi parse dữ liệu từ ${sourceName}:`, error);
      return null;
    }
  }

  /**
   * Trả về giá dự phòng khi không có API nào khả dụng
   */
  private getFallbackPrice(): RealTimeGoldPrice {
    return {
      priceUSD: FALLBACK_PRICE.priceUSD,
      priceVND: Math.round(FALLBACK_PRICE.priceUSD * this.VND_RATE),
      timestamp: Date.now(),
      source: 'Fallback (Manual Update)',
      confidence: 50
    };
  }

  /**
   * Kiểm tra trạng thái của các Oracle sources
   */
  async checkOracleHealth(): Promise<Array<{ source: string; status: 'online' | 'offline'; latency?: number }>> {
    const results = await Promise.allSettled(
      ORACLE_SOURCES.map(async (source) => {
        const start = Date.now();
        try {
          const response = await fetch(source.endpoint, {
            method: 'HEAD',
            signal: AbortSignal.timeout(source.timeout)
          });
          return {
            source: source.name,
            status: response.ok ? 'online' as const : 'offline' as const,
            latency: Date.now() - start
          };
        } catch {
          return {
            source: source.name,
            status: 'offline' as const
          };
        }
      })
    );

    return results.map(result => 
      result.status === 'fulfilled' ? result.value : { source: 'unknown', status: 'offline' as const }
    );
  }

  /**
   * Cập nhật tỷ giá VND (để admin có thể cập nhật khi cần)
   */
  updateVNDRate(newRate: number): void {
    if (newRate > 0) {
      (this as any).VND_RATE = newRate;
      console.log(`Đã cập nhật tỷ giá VND: ${newRate}`);
    }
  }
}

// Export singleton instance
export const goldPriceOracle = new GoldPriceOracleService();

// Export hook để sử dụng trong React components
export const useRealTimeGoldPrice = () => {
  const [priceData, setPriceData] = React.useState<RealTimeGoldPrice | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const data = await goldPriceOracle.getAggregatedGoldPrice();
        if (mounted) {
          setPriceData(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPrice();
    
    // Cập nhật mỗi 60 giây
    const interval = setInterval(fetchPrice, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { priceData, loading, error };
};
