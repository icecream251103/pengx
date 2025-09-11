import React from 'react';
import { Info, CheckCircle } from 'lucide-react';

interface VNDComplianceBannerProps {
  onDismiss?: () => void;
}

const VNDComplianceBanner: React.FC<VNDComplianceBannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            🇻🇳 Tuân thủ Luật pháp Việt Nam
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <p>
              Theo quy định mới của Nhà nước Việt Nam, tất cả giao dịch tài sản số chỉ được thực hiện bằng đồng Việt Nam (VNĐ).
            </p>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>
                Nền tảng PentaGold đã cập nhật để hiển thị tất cả giá cả và giao dịch bằng VNĐ
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>
                Tỷ giá USD/VNĐ được cập nhật tự động: 1 USD = 26,199 VNĐ
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>
                Mọi tính năng vẫn hoạt động bình thường với đơn vị VNĐ
              </span>
            </div>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex-shrink-0"
          >
            Đã hiểu
          </button>
        )}
      </div>
    </div>
  );
};

export default VNDComplianceBanner;
