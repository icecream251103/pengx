import React from 'react';
import { X, Coins } from 'lucide-react';

interface SandboxUpdateNoticeProps {
  onClose: () => void;
}

const SandboxUpdateNotice: React.FC<SandboxUpdateNoticeProps> = ({ onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg shadow-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Coins className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-amber-800">
              🎉 Cập nhật Sandbox
            </h3>
            <button
              onClick={onClose}
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 text-sm text-amber-700">
            <p className="mb-2">
              <strong>Số dư ảo mới:</strong> 200 triệu VNĐ
            </p>
            <p className="text-xs text-amber-600">
              Bạn có thể thử nghiệm giao dịch với số tiền ảo lớn hơn để trải nghiệm đầy đủ tính năng của platform.
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-amber-600">
              Tương đương ~$7,634 USD
            </span>
            <button
              onClick={onClose}
              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandboxUpdateNotice;
