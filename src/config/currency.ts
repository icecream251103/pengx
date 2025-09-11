// Cấu hình tỷ giá và chuyển đổi tiền tệ
// Theo luật pháp Việt Nam, giao dịch tài sản số chỉ được phép bằng VNĐ

export const EXCHANGE_RATES = {
  USD_TO_VND: 26199, // Tỷ giá USD sang VNĐ (cập nhật định kỳ)
  GOLD_PRICE_VND: 94835384, // Giá vàng tính bằng VNĐ/oz (3618.16 USD * 26199) - cập nhật 11/09/2025
} as const;

export const CURRENCY_CONFIG = {
  primary: 'VND',
  symbol: '₫',
  locale: 'vi-VN',
  name: 'Đồng Việt Nam'
} as const;

// Chuyển đổi từ USD sang VNĐ
export const convertUSDToVND = (usdAmount: number): number => {
  return Math.round(usdAmount * EXCHANGE_RATES.USD_TO_VND);
};

// Chuyển đổi từ VNĐ sang USD (cho tính toán nội bộ)
export const convertVNDToUSD = (vndAmount: number): number => {
  return Number((vndAmount / EXCHANGE_RATES.USD_TO_VND).toFixed(2));
};

// Format VNĐ theo chuẩn Việt Nam
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format số tiền với đơn vị rút gọn (triệu, tỷ)
export const formatVNDShort = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} tỷ VNĐ`;
  } else if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)} triệu VNĐ`;
  } else if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)} nghìn VNĐ`;
  }
  return formatVND(amount);
};

// Chuyển đổi giá vàng từ USD/oz sang VNĐ/oz
export const convertGoldPriceToVND = (usdPricePerOz: number): number => {
  return Math.round(usdPricePerOz * EXCHANGE_RATES.USD_TO_VND);
};

// Hàm utility để hiển thị cả VNĐ và USD (tham khảo)
export const formatDualCurrency = (vndAmount: number, showUSD: boolean = false): string => {
  const vndFormatted = formatVND(vndAmount);
  if (!showUSD) return vndFormatted;
  
  const usdAmount = convertVNDToUSD(vndAmount);
  return `${vndFormatted} (~$${usdAmount.toLocaleString()})`;
};
