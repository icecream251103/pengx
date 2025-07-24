import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  User, 
  FileText, 
  Camera, 
  Shield, 
  CheckCircle, 
  Upload,
  AlertCircle,
  ArrowLeft,
  Loader
} from 'lucide-react';

const KYC: React.FC = () => {
  const { account, isConnected } = useWeb3();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    idType: 'passport',
    idNumber: '',
    idFrontImage: null as File | null,
    idBackImage: null as File | null,
    selfieImage: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));
    // Clear error when user uploads file
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) stepErrors.firstName = 'Tên là bắt buộc';
        if (!formData.lastName.trim()) stepErrors.lastName = 'Họ là bắt buộc';
        if (!formData.dateOfBirth) stepErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
        if (!formData.nationality.trim()) stepErrors.nationality = 'Quốc tịch là bắt buộc';
        if (!formData.phoneNumber.trim()) stepErrors.phoneNumber = 'Số điện thoại là bắt buộc';
        break;
      case 2:
        if (!formData.address.trim()) stepErrors.address = 'Địa chỉ là bắt buộc';
        if (!formData.city.trim()) stepErrors.city = 'Thành phố là bắt buộc';
        if (!formData.postalCode.trim()) stepErrors.postalCode = 'Mã bưu điện là bắt buộc';
        if (!formData.country) stepErrors.country = 'Quốc gia là bắt buộc';
        break;
      case 3:
        if (!formData.idNumber.trim()) stepErrors.idNumber = 'Số CMND/CCCD là bắt buộc';
        if (!formData.idFrontImage) stepErrors.idFrontImage = 'Ảnh mặt trước CMND/CCCD là bắt buộc';
        if (!formData.idBackImage) stepErrors.idBackImage = 'Ảnh mặt sau CMND/CCCD là bắt buộc';
        if (!formData.selfieImage) stepErrors.selfieImage = 'Ảnh selfie cầm CMND/CCCD là bắt buộc';
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate all steps before submission
    const allStepsValid = [1, 2, 3].every(step => validateStep(step));
    
    if (!allStepsValid) {
      // If validation fails, go to first step with errors
      for (let step = 1; step <= 3; step++) {
        if (!validateStep(step)) {
          setCurrentStep(step);
          return;
        }
      }
      return;
    }

    if (!account) {
      setErrors({ general: 'Vui lòng kết nối ví trước' });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate KYC submission - instant approval for demo
      await new Promise(resolve => setTimeout(resolve, 1));
      
      // Automatically approve KYC for demo purposes
      localStorage.setItem(`kyc_${account?.toLowerCase()}`, 'approved');
      
      // Show success message briefly before redirect
      setErrors({ general: '' });
      
      // Navigate to dashboard immediately
      navigate('/dashboard');
    } catch (error) {
      console.error('KYC submission failed:', error);
      setErrors({ general: 'Gửi KYC thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Thông tin cá nhân', icon: User },
    { number: 2, title: 'Thông tin địa chỉ', icon: FileText },
    { number: 3, title: 'Xác minh danh tính', icon: Camera },
    { number: 4, title: 'Xem lại & Gửi', icon: Shield }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  required
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Họ *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  required
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ngày sinh *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  required
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quốc tịch *
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.nationality ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  required
                >
                  <option value="">Chọn quốc tịch</option>
                  <option value="VN">Việt Nam</option>
                  <option value="US">Hoa Kỳ</option>
                  <option value="CA">Canada</option>
                  <option value="GB">Vương quốc Anh</option>
                  <option value="JP">Nhật Bản</option>
                  <option value="SG">Singapore</option>
                  <option value="AU">Úc</option>
                  <option value="DE">Đức</option>
                  <option value="FR">Pháp</option>
                  <option value="CH">Thụy Sĩ</option>
                  <option value="NL">Hà Lan</option>
                  <option value="other">Khác</option>
                </select>
                {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  required
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin địa chỉ
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  required
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thành phố *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    required
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mã bưu điện *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    required
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quốc gia *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    required
                >
                  <option value="">Chọn quốc tịch</option>
                  <option value="VN">Việt Nam</option>
                  <option value="US">Hoa Kỳ</option>
                  <option value="CA">Canada</option>
                  <option value="GB">Vương quốc Anh</option>
                  <option value="JP">Nhật Bản</option>
                  <option value="SG">Singapore</option>
                  <option value="AU">Úc</option>
                  <option value="DE">Đức</option>
                  <option value="FR">Pháp</option>
                  <option value="CH">Thụy Sĩ</option>
                  <option value="NL">Hà Lan</option>
                  <option value="other">Khác</option>
                </select>
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Xác minh danh tính
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loại giấy tờ *
                </label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="passport">Hộ chiếu</option>
                  <option value="drivers_license">Bằng lái xe</option>
                  <option value="national_id">CMND/CCCD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số CMND/CCCD *
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.idNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  required
                />
                {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ảnh mặt trước CMND/CCCD *
                  </label>
                  <div className={`border-2 border-dashed ${errors.idFrontImage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg p-6 text-center`}>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'idFrontImage')}
                      className="hidden"
                      id="idFront"
                    />
                    <label htmlFor="idFront" className="cursor-pointer text-amber-600 hover:text-amber-700">
                      {formData.idFrontImage ? formData.idFrontImage.name : 'Tải lên ảnh mặt trước'}
                    </label>
                  </div>
                  {errors.idFrontImage && <p className="text-red-500 text-sm mt-1">{errors.idFrontImage}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ảnh mặt sau CMND/CCCD *
                  </label>
                  <div className={`border-2 border-dashed ${errors.idBackImage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg p-6 text-center`}>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'idBackImage')}
                      className="hidden"
                      id="idBack"
                    />
                    <label htmlFor="idBack" className="cursor-pointer text-amber-600 hover:text-amber-700">
                      {formData.idBackImage ? formData.idBackImage.name : 'Tải lên ảnh mặt sau'}
                    </label>
                  </div>
                  {errors.idBackImage && <p className="text-red-500 text-sm mt-1">{errors.idBackImage}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ảnh selfie cầm CMND/CCCD *
                </label>
                <div className={`border-2 border-dashed ${errors.selfieImage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg p-6 text-center`}>
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'selfieImage')}
                    className="hidden"
                    id="selfie"
                  />
                  <label htmlFor="selfie" className="cursor-pointer text-amber-600 hover:text-amber-700">
                    {formData.selfieImage ? formData.selfieImage.name : 'Tải lên ảnh selfie cầm CMND/CCCD'}
                  </label>
                </div>
                {errors.selfieImage && <p className="text-red-500 text-sm mt-1">{errors.selfieImage}</p>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Xem lại & Gửi
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Thông tin cá nhân</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.firstName} {formData.lastName} • {formData.nationality}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Địa chỉ</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.address}, {formData.city}, {formData.country} {formData.postalCode}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Xác minh danh tính</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.idType.replace('_', ' ').toUpperCase()} • {formData.idNumber}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Tài liệu đã tải lên</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  ✓ Ảnh mặt trước • ✓ Ảnh mặt sau • ✓ Ảnh selfie với CMND/CCCD
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Thông báo quan trọng</p>
                  <p>
                    Bằng việc gửi đơn xin KYC này, bạn xác nhận rằng tất cả thông tin được cung cấp là chính xác 
                    và đầy đủ. Thông tin sai sự thật có thể dẫn đến việc đình chỉ tài khoản.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Wallet Connection Check */}
        {!isConnected && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <p className="text-red-700 text-sm font-medium">Ví chưa được kết nối</p>
              <p className="text-red-700 text-sm">Vui lòng kết nối ví trước khi tiến hành xác minh KYC.</p>
              <button
                onClick={() => navigate('/')}
                className="text-red-600 hover:text-red-800 text-sm underline mt-1"
              >
                Quay lại để kết nối ví
              </button>
            </div>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về trang chủ
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Định danh Khách hàng (KYC)

          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vui lòng hoàn thành việc xác minh danh tính để có thể truy cập nền tảng PentaGold.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted 
                      ? 'bg-green-600 text-white' 
                      : isActive 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-amber-600' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Step {step.number}
                    </p>
                    <p className={`text-xs ${
                      isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => {
                  if (validateStep(currentStep)) {
                    setCurrentStep(Math.min(4, currentStep + 1));
                  }
                }}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                Sau
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi đơn xin KYC'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYC;