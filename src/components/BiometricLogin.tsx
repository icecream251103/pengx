import React, { useState, useEffect } from 'react';
import { Scan, User, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import BiometricAuth from './BiometricAuth';

interface BiometricLoginProps {
  onSuccess: () => void;
  onBack: () => void;
  userAccount?: string;
}

const BiometricLogin: React.FC<BiometricLoginProps> = ({ 
  onSuccess, 
  onBack, 
  userAccount 
}) => {
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);
  const [hasBiometricData, setHasBiometricData] = useState(false);

  useEffect(() => {
    // Check if user has biometric data set up
    const biometricData = localStorage.getItem('biometric_data');
    setHasBiometricData(!!biometricData);
  }, []);

  const handleBiometricSuccess = () => {
    setShowBiometricAuth(false);
    onSuccess();
  };

  if (!hasBiometricData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scan className="h-8 w-8 text-gray-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Chưa thiết lập sinh trắc học
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bạn chưa thiết lập xác thực sinh trắc học. Vui lòng hoàn thành KYC trước để sử dụng tính năng này.
          </p>
          
          <button
            onClick={onBack}
            className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-indigo-100 dark:from-amber-900/20 dark:to-indigo-800/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-br from-amber-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Scan className="h-10 w-10 text-white" />
        </motion.div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Xác thực Sinh trắc học
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sử dụng khuôn mặt để đăng nhập nhanh chóng và bảo mật
        </p>

        {/* User Info */}
        {userAccount && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">Đăng nhập với</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {userAccount.slice(0, 6)}...{userAccount.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security Features */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Bảo mật cao
            </span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Xác thực sinh trắc học được mã hóa và bảo vệ bằng công nghệ tiên tiến
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={() => setShowBiometricAuth(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-lg font-medium"
          >
            <Scan className="h-5 w-5" />
            <span>Bắt đầu xác thực</span>
          </motion.button>
          
          <button
            onClick={onBack}
            className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Sử dụng phương thức khác</span>
          </button>
        </div>
      </motion.div>

      {/* Biometric Auth Modal */}
      {showBiometricAuth && (
        <BiometricAuth
          mode="login"
          onSuccess={handleBiometricSuccess}
          onCancel={() => setShowBiometricAuth(false)}
        />
      )}
    </div>
  );
};

export default BiometricLogin;
