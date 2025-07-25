import React, { useState } from 'react';
import { Shield, Fingerprint, Eye, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BiometricAuth from './BiometricAuth';

interface BiometricSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

const BiometricSetup: React.FC<BiometricSetupProps> = ({ onComplete, onSkip }) => {
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const handleSetupSuccess = () => {
    setIsSetupComplete(true);
    setShowBiometricAuth(false);
    // Redirect directly to dashboard without delay
    onComplete();
  };

  const benefits = [
    {
      icon: Shield,
      title: 'Bảo mật cao',
      description: 'Xác thực sinh trắc học cung cấp lớp bảo mật mạnh mẽ cho tài khoản của bạn'
    },
    {
      icon: Eye,
      title: 'Truy cập nhanh',
      description: 'Đăng nhập chỉ trong vài giây mà không cần nhập mật khẩu'
    },
    {
      icon: Fingerprint,
      title: 'Duy nhất',
      description: 'Đặc điểm sinh trắc học của bạn là duy nhất và không thể bị sao chép'
    }
  ];

  if (isSetupComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="h-10 w-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Thiết lập thành công!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sinh trắc học khuôn mặt đã được thiết lập. Từ giờ bạn có thể đăng nhập nhanh chóng và bảo mật.
          </p>
          
          <div className="text-sm text-amber-600 dark:text-amber-400">
            Đang chuyển hướng đến dashboard...
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-indigo-100 dark:from-amber-900/20 dark:to-indigo-800/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-amber-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Shield className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thiết lập Sinh trắc học
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400">
            Bảo vệ tài khoản với xác thực khuôn mặt tiên tiến
          </p>
        </div>

        {/* Benefits */}
        <div className="grid gap-6 mb-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
            >
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <benefit.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                Bảo mật & Riêng tư
              </p>
              <p className="text-amber-700 dark:text-amber-400">
                Dữ liệu sinh trắc học được mã hóa và lưu trữ an toàn trên thiết bị của bạn. 
                Chúng tôi không có quyền truy cập vào thông tin này.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onSkip}
            className="flex-1 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-xl transition-colors"
          >
            Bỏ qua
          </button>
          
          <motion.button
            onClick={() => setShowBiometricAuth(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <span>Thiết lập ngay</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Biometric Auth Modal */}
      {showBiometricAuth && (
        <BiometricAuth
          mode="setup"
          onSuccess={handleSetupSuccess}
          onCancel={() => setShowBiometricAuth(false)}
        />
      )}
    </div>
  );
};

export default BiometricSetup;
