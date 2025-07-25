import React, { useState, useRef, useCallback } from 'react';
import { Camera, Check, X, RefreshCw, Shield, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BiometricAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
  mode?: 'setup' | 'login';
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({ 
  onSuccess, 
  onCancel, 
  mode = 'login' 
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'camera' | 'preview' | 'processing'>('camera');
  const [retryCount, setRetryCount] = useState(0);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    // Prevent multiple simultaneous initialization attempts
    if (isInitializing) {
      console.log('Camera initialization already in progress, skipping...');
      return;
    }

    setIsInitializing(true);
    
    // Stop any existing stream first to prevent conflicts
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }

    try {
      setError(null);
      setCameraLoading(true);
      
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }

      // Add delay to ensure previous camera resources are released
      await new Promise(resolve => setTimeout(resolve, 300));

      // Check camera permissions first
      try {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (permission.state === 'denied') {
          throw new Error('Camera permission denied');
        }
      } catch (permErr) {
        // Permissions API might not be supported, continue anyway
        console.warn('Permissions API not supported:', permErr);
      }

      // Try different camera configurations for better compatibility
      let mediaStream: MediaStream | null = null;
      
      const constraints = [
        // Try front camera with optimal settings
        { 
          video: { 
            width: { ideal: 640, min: 320 },
            height: { ideal: 480, min: 240 },
            facingMode: 'user',
            frameRate: { ideal: 30, max: 30 }
          },
          audio: false
        },
        // Fallback: any camera with basic settings
        { 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30 }
          },
          audio: false
        },
        // Simpler constraints
        { 
          video: {
            width: 640,
            height: 480
          },
          audio: false
        },
        // Last resort: basic video
        { 
          video: true,
          audio: false
        }
      ];

      for (let i = 0; i < constraints.length; i++) {
        try {
          console.log(`Attempting camera constraint ${i + 1}:`, constraints[i]);
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints[i]);
          console.log('Camera stream acquired successfully');
          break;
        } catch (err: any) {
          console.warn(`Failed constraint ${i + 1}:`, err);
          // Add small delay between attempts
          if (i < constraints.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }

      if (!mediaStream) {
        throw new Error('Unable to access camera with any configuration');
      }

      // Verify stream is active
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (!videoTrack || videoTrack.readyState !== 'live') {
        mediaStream.getTracks().forEach(track => track.stop());
        throw new Error('Camera stream is not active');
      }

      // Store in both ref and state
      streamRef.current = mediaStream;
      setStream(mediaStream);
      
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Clear any existing source first
        video.srcObject = null;
        
        // Set the new stream
        video.srcObject = mediaStream;
        
        // Create promise-based video loading with timeout
        const videoReady = new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            cleanup();
            reject(new Error('Camera loading timeout'));
          }, 8000); // 8 second timeout

          const handleLoadedMetadata = () => {
            console.log('Video metadata loaded');
            cleanup();
            resolve();
          };

          const handleError = (event: Event) => {
            console.error('Video loading error:', event);
            cleanup();
            reject(new Error('Video loading failed'));
          };

          const cleanup = () => {
            clearTimeout(timeout);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('error', handleError);
          };

          video.addEventListener('loadedmetadata', handleLoadedMetadata);
          video.addEventListener('error', handleError);
        });

        try {
          await videoReady;
          
          // Attempt to play the video
          const playPromise = video.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
          
          setCameraLoading(false);
          console.log('Camera initialized and playing successfully');
          
        } catch (playErr: any) {
          console.error('Error starting video playback:', playErr);
          throw new Error(`Video playback failed: ${playErr.message}`);
        }
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setCameraLoading(false);
      
      // Clean up any partial streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setStream(null);
      }
      
      let errorMessage = 'Không thể truy cập camera. ';
      
      if (err.name === 'NotAllowedError' || err.message.includes('permission')) {
        errorMessage += 'Vui lòng cấp quyền truy cập camera trong cài đặt trình duyệt.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'Không tìm thấy camera. Vui lòng kết nối camera.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Trình duyệt không hỗ trợ camera.';
      } else if (err.name === 'NotReadableError' || err.message.includes('not active')) {
        errorMessage += 'Camera đang được sử dụng bởi ứng dụng khác hoặc không hoạt động.';
      } else if (err.message.includes('timeout')) {
        errorMessage += 'Camera khởi động quá lâu. Vui lòng thử lại.';
      } else if (err.message.includes('playback')) {
        errorMessage += 'Không thể phát video từ camera. Vui lòng thử lại.';
      } else {
        errorMessage += `Lỗi: ${err.message}. Vui lòng thử lại hoặc sử dụng trình duyệt khác.`;
      }
      
      setError(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  }, []); // Remove all dependencies to prevent loops

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []); // Remove dependencies to prevent loops

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    setStep('preview');
    stopCamera();
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setStep('camera');
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(async () => {
    if (!capturedImage) return;

    setStep('processing');

    try {
      // Simulate biometric processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, always approve
      if (mode === 'setup') {
        // Store biometric data (in real app, this would be encrypted)
        localStorage.setItem('biometric_data', JSON.stringify({
          imageData: capturedImage,
          timestamp: Date.now(),
          userId: 'demo_user'
        }));
      }

      onSuccess();
    } catch (err) {
      console.error('Biometric authentication failed:', err);
      setError('Xác thực sinh trắc học thất bại. Vui lòng thử lại.');
      setStep('preview');
    }
  }, [capturedImage, mode, onSuccess]);

  const retryCamera = useCallback(async () => {
    console.log('Retrying camera connection...');
    setError(null);
    setCameraLoading(true);
    setRetryCount(prev => prev + 1);
    setIsInitializing(false); // Reset initialization state
    
    // Stop current camera properly
    stopCamera();
    
    // Wait longer before retrying to ensure resources are released
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Start camera again
    startCamera();
  }, []); // Remove dependencies to prevent loops

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      setStep('preview');
    };
    reader.readAsDataURL(file);
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const handleStepChange = async () => {
      if (step === 'camera' && isMounted) {
        // Reset states and prevent rapid re-triggers
        setIsInitializing(false);
        timeoutId = setTimeout(() => {
          if (isMounted && !isInitializing) {
            console.log('Starting camera for step change');
            startCamera();
          }
        }, 200); // Slightly longer delay to prevent loops
      } else {
        // Stop camera when not on camera step
        console.log('Stopping camera for step change');
        setIsInitializing(false);
        stopCamera();
      }
    };
    
    handleStepChange();
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsInitializing(false);
      stopCamera();
    };
  }, [step]); // Only depend on step

  const renderCameraView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === 'setup' ? 'Thiết lập Sinh trắc học' : 'Xác thực Khuôn mặt'}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {mode === 'setup' 
            ? 'Chụp ảnh khuôn mặt để thiết lập xác thực sinh trắc học'
            : 'Nhìn vào camera và chụp ảnh để xác thực danh tính'
          }
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-400 text-sm mb-3">{error}</p>
              
              {/* Troubleshooting steps */}
              <div className="text-xs text-red-600 dark:text-red-400 mb-3">
                <p className="font-medium mb-1">Cách khắc phục:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Kiểm tra quyền truy cập camera trong trình duyệt</li>
                  <li>Đảm bảo camera không bị ứng dụng khác sử dụng</li>
                  <li>Thử làm mới trang hoặc khởi động lại trình duyệt</li>
                  <li>Sử dụng HTTPS (camera yêu cầu kết nối bảo mật)</li>
                </ul>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={retryCamera}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors flex items-center space-x-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Thử lại {retryCount > 0 ? `(${retryCount})` : ''}</span>
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                >
                  Làm mới trang
                </button>
                <button
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded transition-colors"
                >
                  Tải ảnh lên
                </button>
              </div>
              
              {/* File Upload Option */}
              {showFileUpload && (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-amber-800 dark:text-amber-300 text-xs mb-2">
                    Thay vì sử dụng camera, bạn có thể tải lên một ảnh selfie:
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-amber-700 dark:text-amber-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-gray-900 rounded-xl overflow-hidden">
        {/* Connection Status Indicator */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
            stream && !cameraLoading 
              ? 'bg-amber-500 text-white' 
              : cameraLoading 
                ? 'bg-yellow-500 text-white'
                : 'bg-red-500 text-white'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              stream && !cameraLoading 
                ? 'bg-white animate-pulse' 
                : cameraLoading 
                  ? 'bg-white animate-spin'
                  : 'bg-white'
            }`}></div>
            <span>
              {stream && !cameraLoading ? 'Đã kết nối' : cameraLoading ? 'Đang kết nối' : 'Chưa kết nối'}
            </span>
          </div>
        </div>

        <video
          ref={videoRef}
          className={`w-full h-80 object-cover transition-opacity duration-300 ${
            stream && !cameraLoading ? 'opacity-100' : 'opacity-50'
          }`}
          autoPlay
          muted
          playsInline
          onLoadedMetadata={() => console.log('Video metadata loaded')}
          onCanPlay={() => console.log('Video can play')}
          onPlay={() => console.log('Video playing')}
          onError={(e) => console.error('Video error:', e)}
        />
        
        {/* Face detection overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {cameraLoading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-white text-sm font-medium">Đang khởi động camera...</p>
              {retryCount > 0 && (
                <p className="text-amber-300 text-xs mt-1">Lần thử: {retryCount + 1}</p>
              )}
            </div>
          ) : stream ? (
            <div className="w-64 h-64 border-4 border-amber-500 rounded-full opacity-50 animate-pulse">
              <div className="w-full h-full border-4 border-transparent border-t-amber-300 rounded-full animate-spin"></div>
            </div>
          ) : null}
        </div>
        
        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/60 text-white px-4 py-2 rounded-lg text-sm">
            {cameraLoading ? 'Vui lòng chờ...' : 'Đặt khuôn mặt vào vòng tròn'}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Hủy</span>
        </button>
        <button
          onClick={capturePhoto}
          disabled={cameraLoading || !!error}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Camera className="h-4 w-4" />
          <span>{cameraLoading ? 'Đang tải...' : 'Chụp ảnh'}</span>
        </button>
      </div>

      {/* Debug Information Panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Debug Info:</h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>Stream: {stream ? 'Active' : 'None'}</div>
            <div>Loading: {cameraLoading ? 'Yes' : 'No'}</div>
            <div>Retry Count: {retryCount}</div>
            <div>Video Element: {videoRef.current ? 'Ready' : 'Not Ready'}</div>
            {stream && (
              <div>Tracks: {stream.getVideoTracks().length} video, {stream.getAudioTracks().length} audio</div>
            )}
            {error && <div className="text-red-500">Error: {error}</div>}
          </div>
        </div>
      )}
    </div>
  );

  const renderPreviewView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full">
            <User className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Xem lại ảnh
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Kiểm tra ảnh và xác nhận để tiếp tục
        </p>
      </div>

      {capturedImage && (
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured face"
              className="w-80 h-80 object-cover rounded-xl border-4 border-gray-200 dark:border-gray-600"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={retakePhoto}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Chụp lại</span>
        </button>
        <button
          onClick={confirmPhoto}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Check className="h-4 w-4" />
          <span>Xác nhận</span>
        </button>
      </div>
    </div>
  );

  const renderProcessingView = () => (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-center space-x-2 mb-3">
        <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full animate-pulse">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Đang xử lý...
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Đang phân tích đặc điểm sinh trắc học
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span>Phát hiện khuôn mặt</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span>Trích xuất đặc điểm</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span>Xác thực danh tính</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'camera' && (
              <motion.div
                key="camera"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {renderCameraView()}
              </motion.div>
            )}
            
            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {renderPreviewView()}
              </motion.div>
            )}
            
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
              >
                {renderProcessingView()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default BiometricAuth;
