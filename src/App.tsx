import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Shield, BarChart3, Coins, Globe, Github, Twitter, Lock, Zap, Network, Bell, Newspaper, ExternalLink, Building2, Wallet, Database, Boxes, AlertTriangle, Scan } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from './contexts/Web3Context';
import EnhancedChart from './components/EnhancedChart';
import BiometricLogin from './components/BiometricLogin';
import { motion } from 'framer-motion';



function PentaGoldLogo({ size = 220, rotate = false }) {
  // size in px, default 220px for big logo
  return rotate ? (
    <motion.img
      src={"/pentagold-logo.png"}
      alt="PentaGold Logo"
      className="object-contain"
      draggable={false}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
    />
  ) : (
    <img
      src={"/pentagold-logo.png"}
      alt="PentaGold Logo"
      className="object-contain"
      draggable={false}
      style={{ width: size, height: size }}
    />
  );
}

function App() {
  const { isConnected, connectWallet, loading, error, clearError } = useWeb3();
  const navigate = useNavigate();
  const [showBiometricLogin, setShowBiometricLogin] = useState(false);
  const [hasBiometricData, setHasBiometricData] = useState(false);

  // Check for biometric data on component mount
  useEffect(() => {
    const biometricData = localStorage.getItem('biometric_data');
    setHasBiometricData(!!biometricData);
  }, []);

  const handleGetStarted = async () => {
    if (!isConnected) {
      await connectWallet();
    } else {
      navigate('/kyc');
    }
  };

  const handleBiometricLoginSuccess = () => {
    setShowBiometricLogin(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#10131a] text-white">
      {/* Navigation */}
      <nav className="w-full px-8 py-4 flex justify-between items-center bg-[#10131a] border-b border-[#23263a]">
        <div className="flex items-center space-x-3">
              <span className="h-10 w-10 rounded-full border border-amber-400 bg-white flex items-center justify-center shadow-md p-0.5">
              <PentaGoldLogo size={40} />
          </span>
          <span className="text-2xl font-bold tracking-wide text-white">PentaGold</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#about" className="text-gray-300 hover:text-amber-400 transition-colors">Giới thiệu</a>
          <a href="#tokenomics" className="text-gray-300 hover:text-amber-400 transition-colors">Tokenomics</a>
          <Link to="/whitepaper" className="text-gray-300 hover:text-amber-400 transition-colors">Whitepaper</Link>
          {isConnected ? (
            <Link 
              to="/dashboard" 
              className="bg-amber-400 text-[#10131a] px-6 py-2 rounded-lg font-bold hover:bg-amber-500 transition-colors shadow-lg"
            >
              Bảng điều khiển
            </Link>
          ) : (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-amber-400 text-[#10131a] px-6 py-2 rounded-lg font-bold hover:bg-amber-500 transition-colors shadow-lg disabled:opacity-50"
            >
              {loading ? 'Đang kết nối...' : 'Kết nối ví'}
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-[#10131a]">
        <motion.div
          className="md:w-1/2 flex flex-col items-start"
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 text-sm underline mt-1"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
          )}

          <motion.h1
            className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Tương lai của <span className="text-amber-400">Tài sản số theo chỉ số vàng</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            PentaGold (PenGx) là một token cách mạng theo dõi giá vàng thời gian thực thông qua oracle phi tập trung, mang lại tính ổn định của thị trường vàng cho DeFi.
          </motion.p>
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={handleGetStarted}
              disabled={loading}
              className="bg-amber-400 hover:bg-amber-500 text-[#10131a] px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                'Đang kết nối...'
              ) : !isConnected ? (
                <>Kết nối ví <Wallet className="ml-2 h-5 w-5" /></>
              ) : (
                <>Bắt đầu <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </button>
            <a href="#about" className="border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-[#10131a] px-8 py-3 rounded-lg font-bold text-lg transition-colors flex items-center">
              Tìm hiểu thêm <ChevronDown className="ml-2 h-5 w-5" />
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          className="md:w-1/2 flex justify-center mt-12 md:mt-0"
          initial={{ x: 80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            className="w-full max-w-4xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <EnhancedChart isCompact={true} />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full bg-white py-20 px-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-12">
          <motion.div
            className="h-64 w-64 rounded-full border-4 border-amber-400 bg-white shadow-xl mb-6 flex items-center justify-center"
            style={{ position: 'relative', overflow: 'visible' }}
          >
            <PentaGoldLogo size={400} rotate={true} />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#10131a] mb-4 text-center">Tương lai của PentaGold</h2>
          <p className="text-lg text-gray-700 max-w-2xl text-center">
            Mô hình token theo chỉ số vàng của chúng tôi cung cấp theo dõi giá chính xác, bảo mật và minh bạch trong thế giới tài sản số biến động.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">
          {[1,2,3].map((i) => (
            <motion.div
              key={i}
              className="bg-amber-50 p-8 rounded-xl shadow-md flex flex-col items-center"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 * i }}
            >
              <span className="text-amber-400 text-4xl font-extrabold mb-4">{i}</span>
              <h3 className="text-xl font-bold text-[#10131a] mb-3">
                {i === 1 ? 'Thanh toán tức thì' : i === 2 ? 'Không chi phí lưu trữ' : 'Theo dõi giá thuật toán'}
              </h3>
              <p className="text-gray-700 text-center">
                {i === 1 ? 'Giao dịch vàng 24/7 với thanh toán ngay lập tức. Không cần chờ đợi vận hành kho hoặc chuyển giao bảo quản.' : i === 2 ? 'Loại bỏ phí kho, chi phí bảo hiểm và mối quan tâm về lưu trữ. Tiếp xúc giá thuần túy mà không có chi phí bảo quản vật lý.' : 'Tổng hợp oracle đa nguồn đảm bảo theo dõi giá vàng thời gian thực chính xác mà không có rủi ro bảo quản tập trung.'}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tại sao chọn PentaGold?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Mô hình token theo chỉ số vàng của chúng tôi cung cấp theo dõi giá chính xác, bảo mật và minh bạch trong thế giới tài sản số biến động.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[0,1,2,3,4,5].map((i) => (
              <motion.div
                key={i}
                className="bg-amber-50 p-8 rounded-xl"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 * i }}
              >
                {i === 0 && <Zap className="h-12 w-12 text-amber-600 mb-6" />}
                {i === 1 && <Coins className="h-12 w-12 text-amber-600 mb-6" />}
                {i === 2 && <BarChart3 className="h-12 w-12 text-amber-600 mb-6" />}
                {i === 3 && <Shield className="h-12 w-12 text-amber-600 mb-6" />}
                {i === 4 && <Network className="h-12 w-12 text-amber-600 mb-6" />}
                {i === 5 && <Lock className="h-12 w-12 text-amber-600 mb-6" />}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {i === 0 && 'Thanh toán tức thì'}
                  {i === 1 && 'Chi phí lưu trữ bằng không'}
                  {i === 2 && 'Theo dõi giá thuật toán'}
                  {i === 3 && 'Hiệu quả vốn'}
                  {i === 4 && 'Minh bạch hoàn toàn'}
                  {i === 5 && 'Bảo mật phi tập trung'}
                </h3>
                <p className="text-gray-700">
                  {i === 0 && 'Giao dịch vàng 24/7 với thanh toán ngay lập tức. Không cần chờ đợi vận hành kho hoặc chuyển giao bảo quản.'}
                  {i === 1 && 'Loại bỏ phí kho, chi phí bảo hiểm và mối quan tâm về lưu trữ. Tiếp xúc giá thuần túy mà không có chi phí bảo quản vật lý.'}
                  {i === 2 && 'Tổng hợp oracle đa nguồn đảm bảo theo dõi giá vàng thời gian thực chính xác mà không có rủi ro bảo quản tập trung.'}
                  {i === 3 && 'Thiết kế tổng hợp loại bỏ yêu cầu ủng hộ vật lý 1:1, cho phép mở rộng quy mô hiệu quả và giảm rủi ro đối tác.'}
                  {i === 4 && 'Tất cả nguồn cấp giá, giao dịch và hoạt động hợp đồng thông minh đều có thể kiểm toán đầy đủ trên blockchain.'}
                  {i === 5 && 'Bảo mật đa lớp với cầu dao ngắt mạch, quản trị timelock và giám sát liên tục loại bỏ điểm lỗi đơn lẻ.'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tokenomics</h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Hiểu về mô hình kinh tế đằng sau PentaGold
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nguồn cung và phân phối Token</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4 mt-1">
                    <div className="bg-amber-600 h-3 w-3 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Nguồn cung động</h4>
                    <p className="text-gray-700">Nguồn cung token điều chỉnh dựa trên nhu cầu thị trường và hoạt động giao dịch</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4 mt-1">
                    <div className="bg-amber-600 h-3 w-3 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Theo dõi giá</h4>
                    <p className="text-gray-700">Giá trị token theo dõi giá thị trường vàng thời gian thực qua mạng oracle</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4 mt-1">
                    <div className="bg-amber-600 h-3 w-3 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Phí giao dịch</h4>
                    <p className="text-gray-700">Phí tối thiểu để đảm bảo tính bền vững và tính thanh khoản</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Oracle và cơ chế giá</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4 mt-1">
                    <div className="bg-amber-600 h-3 w-3 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Oracle phi tập trung</h4>
                    <p className="text-gray-700">Nhiều nguồn dữ liệu đáng tin cậy đảm bảo theo dõi giá vàng chính xác</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4 mt-1">
                    <div className="bg-amber-600 h-3 w-3 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Cập nhật giá</h4>
                    <p className="text-gray-700">Cập nhật giá thời gian thực liên tục phản ánh điều kiện thị trường vàng hiện tại</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4 mt-1">
                    <div className="bg-amber-600 h-3 w-3 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Cơ chế an toàn</h4>
                    <p className="text-gray-700">Nhiều hệ thống sao lưu đảm bảo độ tin cậy liên tục của nguồn cấp giá</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partners & Integrations Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Đối tác & Tích hợp</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Kết nối với các nền tảng và giao thức hàng đầu
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Partner Card 1 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="h-20 flex items-center justify-center mb-4">
                <Building2 className="h-16 w-16 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sàn giao dịch lớn</h3>
              <p className="text-gray-600 text-sm">Niêm yết trên các sàn giao dịch tiền điện tử hàng đầu để có tính thanh khoản tối đa</p>
            </div>

            {/* Partner Card 2 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="h-20 flex items-center justify-center mb-4">
                <Boxes className="h-16 w-16 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Giao thức tài chính</h3>
              <p className="text-gray-600 text-sm">Tích hợp với các nền tảng tài chính hàng đầu để tạo lợi nhuận</p>
            </div>

            {/* Partner Card 3 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="h-20 flex items-center justify-center mb-4">
                <Database className="h-16 w-16 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mạng Oracle</h3>
              <p className="text-gray-600 text-sm">Được hỗ trợ bởi các giải pháp oracle phi tập trung hàng đầu trong ngành</p>
            </div>

            {/* Partner Card 4 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="h-20 flex items-center justify-center mb-4">
                <Wallet className="h-16 w-16 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Giải pháp giám sát</h3>
              <p className="text-gray-600 text-sm">Tương thích với các giải pháp giám sát và ngân hàng lớn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cập nhật mới nhất</h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Cập nhật thông tin về phát triển và tăng trưởng hệ sinh thái PentaGold
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Update Card 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-amber-50 p-8">
                <Bell className="h-24 w-24 text-amber-600 mx-auto" />
              </div>
              <div className="p-6">
                <div className="flex items-center text-amber-600 text-sm mb-2">
                  <Bell className="h-4 w-4 mr-2" />
                  <span>Thông báo</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nâng cấp mạng Oracle</h3>
                <p className="text-gray-600 mb-4">Nâng cấp cơ sở hạ tầng nguồn cấp giá với nhiều nguồn dữ liệu để cải thiện độ chính xác.</p>
                <a href="#" className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
                  Đọc thêm <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Update Card 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-amber-50 p-8">
                <Newspaper className="h-24 w-24 text-amber-600 mx-auto" />
              </div>
              <div className="p-6">
                <div className="flex items-center text-amber-600 text-sm mb-2">
                  <Newspaper className="h-4 w-4 mr-2" />
                  <span>Đối tác</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Niêm yết sàn giao dịch mới</h3>
                <p className="text-gray-600 mb-4">PentaGold hiện đã có mặt trên một sàn giao dịch tiền điện tử lớn khác.</p>
                <a href="#" className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
                  Đọc thêm <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Update Card 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-amber-50 p-8">
                <Zap className="h-24 w-24 text-amber-600 mx-auto" />
              </div>
              <div className="p-6">
                <div className="flex items-center text-amber-600 text-sm mb-2">
                  <Zap className="h-4 w-4 mr-2" />
                  <span>Phát triển</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ứng dụng di động Beta</h3>
                <p className="text-gray-600 mb-4">Ứng dụng ví di động của chúng tôi bước vào giai đoạn thử nghiệm beta công khai.</p>
                <a href="#" className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
                  Đọc thêm <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="whitepaper" className="py-20 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng tham gia tương lai của thị trường vàng?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Tải xuống whitepaper toàn diện của chúng tôi để tìm hiểu thêm về mạng oracle, tokenomics và tầm nhìn của PentaGold.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/whitepaper" className="bg-white text-amber-700 hover:bg-amber-100 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center">
              Xem Whitepaper <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button
              onClick={handleGetStarted}
              disabled={loading}
              className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Đang kết nối...' : 'Khởi chạy ứng dụng'} <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <span className="h-10 w-10 rounded-full border border-amber-400 bg-white flex items-center justify-center shadow-md p-0.5">
                  <PentaGoldLogo size={40} />
                </span>
                <span className="text-2xl font-bold">PentaGold</span>
              </div>
              <p className="text-gray-400 mb-6">
                Tương lai của tài sản kỹ thuật số được chỉ mục vàng, kết hợp theo dõi giá vàng thời gian thực với tính linh hoạt của công nghệ tài chính hiện đại.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Globe className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">Liên kết nhanh</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-amber-500 transition-colors">Trang chủ</Link></li>
                <li><a href="#about" className="text-gray-400 hover:text-amber-500 transition-colors">Giới thiệu</a></li>
                <li><a href="#tokenomics" className="text-gray-400 hover:text-amber-500 transition-colors">Tokenomics</a></li>
                <li><Link to="/whitepaper" className="text-gray-400 hover:text-amber-500 transition-colors">Whitepaper</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-amber-500 transition-colors">Bảng điều khiển</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">Tài nguyên</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Tài liệu</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Mạng Oracle</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Bảo mật</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">Liên hệ</h3>
              <ul className="space-y-3">
                <li className="text-gray-400">info@pentagold.io</li>
                <li className="text-gray-400">Hỗ trợ: support@pentagold.io</li>
                <li className="text-gray-400">Đối tác: partners@pentagold.io</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2025 PentaGold. Tất cả quyền được bảo lưu.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Chính sách bảo mật</a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Điều khoản dịch vụ</a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">Pháp lý</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Biometric Login Modal */}
      {showBiometricLogin && (
        <BiometricLogin
          onSuccess={handleBiometricLoginSuccess}
          onBack={() => setShowBiometricLogin(false)}
        />
      )}
    </div>
  );
}

export default App;
