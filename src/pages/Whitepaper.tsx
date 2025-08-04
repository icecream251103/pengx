import React, { useState, useRef, useEffect } from 'react';
import { FileText, Menu, ChevronRight, ChevronDown, ArrowUp, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import WhitepaperContent from '../components/WhitepaperContent';

interface Section {
  id: string;
  title: string;
  level: number;
  subsections?: Section[];
}

const Whitepaper: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'introduction', 'problem-analysis', 'solution', 'benefits', 'growth-plan', 
    'impact', 'foundation', 'risk-management', 'appendix'
  ]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const sections: Section[] = [
    { id: 'summary', title: 'Tóm Tắt (Executive Summary)', level: 1 },
    { 
      id: 'introduction', 
      title: 'Giới Thiệu: Tái Định Hình Thị Trường Vàng Việt Nam', 
      level: 1,
      subsections: [
        { id: 'background', title: 'Bối cảnh: Vàng - Tài Sản Bất Biến trong Tâm Thức Người Việt', level: 2 },
        { id: 'pain-points', title: '"Nỗi Đau" Thầm Lặng của Nhà Đầu Tư Vàng Truyền Thống', level: 2 },
        { id: 'mission', title: 'Sứ Mệnh của PentaGold: Dân Chủ Hóa và Hiện Đại Hóa Đầu Tư Vàng', level: 2 },
        { id: 'roadmap-overview', title: 'Lộ trình của Whitepaper', level: 2 }
      ]
    },
    {
      id: 'problem-analysis',
      title: 'Phân Tích Sâu Về Vấn Đề: Những Rào Cản Vô Hình của Vàng Vật Chất',
      level: 1,
      subsections: [
        { id: 'storage-costs', title: 'Chi Phí Chìm và Rủi Ro Lưu Trữ, Bảo Quản', level: 2 },
        { id: 'liquidity', title: 'Tính Thanh Khoản Kém và Ma Sát Giao Dịch', level: 2 },
        { id: 'transparency', title: 'Thiếu Minh Bạch và Rủi Ro Hệ Thống', level: 2 }
      ]
    },
    {
      id: 'solution',
      title: 'Giải Pháp PentaGold: Một Hệ Sinh Thái Tài Chính Toàn Diện',
      level: 1,
      subsections: [
        { id: 'pengx-core', title: 'PenGx: Cốt Lõi của Hệ Sinh Thái - Token Hóa Chỉ Số Giá Vàng', level: 2 },
        { id: 'ecosystem', title: 'Hệ Sinh Thái Dịch Vụ Giá Trị Gia Tăng: Vượt Ra Ngoài Giới Hạn Tích Trữ', level: 2 }
      ]
    },
    {
      id: 'benefits',
      title: 'Lợi Ích và Ứng Dụng Thực Tiễn',
      level: 1,
      subsections: [
        { id: 'value-proposition', title: 'Giá Trị Hữu Hình cho Nhà Đầu Tư và Người Dùng', level: 2 },
        { id: 'case-studies', title: 'Tình Huống Nghiên Cứu (Case Studies)', level: 2 }
      ]
    },
    {
      id: 'growth-plan',
      title: 'Kế Hoạch Tăng Trưởng và Mở Rộng Thị Trường',
      level: 1,
      subsections: [
        { id: 'phase1', title: 'Giai đoạn 1 (Năm 1-1.5): Củng cố thị trường Việt Nam', level: 2 },
        { id: 'phase2', title: 'Giai đoạn 2 (Năm 1.5-3): Mở rộng Hệ sinh thái và Thâm nhập Đông Nam Á', level: 2 },
        { id: 'phase3', title: 'Giai đoạn 3 (Năm 3-5): Đa dạng hóa Tài sản và Mở rộng Toàn cầu', level: 2 }
      ]
    },
    {
      id: 'impact',
      title: 'Tác Động Kinh Tế và Xã Hội',
      level: 1,
      subsections: [
        { id: 'financial-inclusion', title: 'Thúc Đẩy Phổ Cập Tài Chính (Financial Inclusion)', level: 2 },
        { id: 'market-efficiency', title: 'Tăng Cường Hiệu Quả và Minh Bạch cho Thị Trường Vốn', level: 2 },
        { id: 'innovation', title: 'Tạo Ra Làn Sóng Đổi Mới trong Ngành Fintech Việt Nam', level: 2 }
      ]
    },
    {
      id: 'foundation',
      title: 'Nền Tảng Vững Chắc của Dự Án',
      level: 1,
      subsections: [
        { id: 'technical-feasibility', title: 'Tính Khả Thi Kỹ Thuật: Từ Ý Tưởng đến Hiện Thực', level: 2 },
        { id: 'business-model', title: 'Mô Hình Kinh Doanh và Tài Chính Bền Vững', level: 2 },
        { id: 'team', title: 'Đội Ngũ Sáng Lập và Cố Vấn (Dự kiến)', level: 2 },
        { id: 'funding', title: 'Kế Hoạch Huy Động Vốn Chi Tiết', level: 2 }
      ]
    },
    {
      id: 'risk-management',
      title: 'Quản Trị Rủi Ro và Tuân Thủ Pháp Lý',
      level: 1,
      subsections: [
        { id: 'risk-analysis', title: 'Phân Tích Rủi Ro Toàn Diện và Giải Pháp Giảm Thiểu', level: 2 }
      ]
    },
    { id: 'conclusion', title: 'Kết Luận và Tầm Nhìn Tương Lai', level: 1 },
    {
      id: 'appendix',
      title: 'Phụ Lục',
      level: 1,
      subsections: [
        { id: 'about-us', title: 'Giới Thiệu Về Công Ty (About Us)', level: 2 },
        { id: 'cta', title: 'Kêu Gọi Hành Động (Call to Action - CTA)', level: 2 },
        { id: 'references', title: 'Tài Liệu Tham Khảo (References)', level: 2 }
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      
      // Update active section based on scroll position
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }));

      const currentSection = sectionElements.find(({ element }) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsSidebarOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSidebar = () => (
    <div className={`
      fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
      transform transition-transform duration-300 z-50 overflow-y-auto shadow-xl
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:static lg:z-auto lg:shadow-none
    `}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-amber-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mục lục</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg"
          >
            ✕
          </button>
        </div>
        
        <nav className="space-y-1">
          {sections.map((section) => (
            <div key={section.id}>
              <div className="flex items-center">
                {section.subsections && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeSection === section.id 
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-l-2 border-amber-500' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}
                  `}
                >
                  {section.title}
                </button>
              </div>
              
              {section.subsections && expandedSections.includes(section.id) && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-4">
                  {section.subsections.map((subsection) => (
                    <button
                      key={subsection.id}
                      onClick={() => scrollToSection(subsection.id)}
                      className={`
                        block w-full text-left px-3 py-1.5 rounded-md text-xs transition-all duration-200
                        ${activeSection === subsection.id 
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-300'}
                      `}
                    >
                      • {subsection.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        
        {/* Whitepaper info */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div className="font-medium">PentaGold Inc.</div>
            <div>Phiên bản: Tháng 8, 2025</div>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Đang cập nhật</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <FileText className="h-8 w-8 text-amber-500 mr-3" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  PentaGold Whitepaper
                </h1>
              </div>
            </div>
            
            <div className="flex items-center">
              <Link 
                to="/"
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay về trang chủ
              </Link>
              <button className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium">
                <Download className="h-4 w-4 mr-2" />
                Tải PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {renderSidebar()}
        
        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={contentRef}>
            {/* Document Title */}
            <div className="mb-12 text-center border-b border-gray-200 dark:border-gray-700 pb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                PentaGold: Tái Định Hình Tương Lai Đầu Tư Vàng tại Việt Nam
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                Một Hệ Sinh Thái Tài Chính Phi Tập Trung Toàn Diện
              </p>
              <div className="inline-flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="font-semibold text-gray-700 dark:text-gray-300">Whitepaper Chính Thức</div>
                  <div>PentaGold Inc.</div>
                </div>
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                <div className="text-center">
                  <div className="font-semibold text-gray-700 dark:text-gray-300">Phiên bản</div>
                  <div>Tháng 8, 2025</div>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <section id="summary" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
                Tóm Tắt (Executive Summary)
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Thị trường vàng vật chất tại Việt Nam, với nhu cầu đầu tư và tích trữ khổng lồ được minh chứng qua việc người dân mua ròng hơn <strong>55 tấn vàng trong năm 2024</strong>, đang phải đối mặt với những rào cản cố hữu làm suy giảm hiệu quả và hạn chế khả năng tiếp cận của đại đa số nhà đầu tư.
                </p>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-6 my-6">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3">Các vấn đề chính của thị trường vàng truyền thống:</h3>
                  <ul className="space-y-2 text-amber-700 dark:text-amber-300">
                    <li>• Chi phí lưu trữ và bảo hiểm cao</li>
                    <li>• Chênh lệch giá mua-bán lớn bất hợp lý (có thời điểm lên tới 8 triệu VNĐ/lượng)</li>
                    <li>• Tính thanh khoản thấp do phụ thuộc vào giao dịch vật lý</li>
                    <li>• Rủi ro tiềm ẩn về pháp lý và nguồn gốc sản phẩm</li>
                  </ul>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Để giải quyết triệt để những thách thức trên, <strong>PentaGold</strong> giới thiệu một hệ sinh thái tài chính phi tập trung (DeFi) đột phá, được xây dựng trên nền tảng token <strong>PenGx</strong>. PenGx là một tài sản số được thiết kế để bám sát chỉ số giá vàng quốc tế theo thời gian thực thông qua một hệ thống Oracle phi tập trung, đảm bảo tính minh bạch, chính xác và khả năng chống thao túng tuyệt đối.
                </p>

                <div className="grid md:grid-cols-3 gap-6 my-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">PentaLend</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Nền tảng cho vay P2P với hệ thống xếp hạng tín nhiệm AI</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">PentaInvest</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">Công cụ đầu tư thông minh với DCA tự động</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">PentaPay</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Đưa PenGx vào giao dịch hàng ngày</p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Bằng cách kết hợp sự ổn định của vàng với các dịch vụ DeFi tiên tiến, PentaGold mang đến một giải pháp đầu tư <strong>an toàn, minh bạch, thanh khoản cao và chi phí cực thấp</strong>. Dự án không chỉ dân chủ hóa cơ hội đầu tư vàng mà còn thúc đẩy phổ cập tài chính, cho phép người dùng biến một tài sản tĩnh thành một tài sản sản xuất, tạo ra lợi nhuận.
                </p>
              </div>
            </section>

            {/* Introduction */}
            <section id="introduction" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
                Giới Thiệu: Tái Định Hình Thị Trường Vàng Việt Nam
              </h2>
              
              <div id="background" className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Bối cảnh: Vàng - Tài Sản Bất Biến trong Tâm Thức Người Việt
                </h3>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Trong suốt chiều dài lịch sử và văn hóa Việt Nam, vàng không chỉ đơn thuần là một kim loại quý mà đã trở thành một biểu tượng của sự giàu có, ổn định và an toàn. Đối với nhiều thế hệ, vàng là công cụ tích trữ giá trị tối thượng, một "kênh trú ẩn" an toàn để bảo vệ tài sản trước những biến động kinh tế và lạm phát.
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mb-4">
                    <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                       <strong>Thống kê năm 2024:</strong> Người dân Việt Nam mua ròng hơn 55 tấn vàng, cao nhất trong khu vực Đông Nam Á
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Những con số này là minh chứng rõ ràng cho thấy sức hấp dẫn không thể phủ nhận và vai trò không thể thay thế của vàng trong danh mục đầu tư của người Việt.
                  </p>
                </div>
              </div>

              <div id="pain-points" className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  "Nỗi Đau" Thầm Lặng của Nhà Đầu Tư Vàng Truyền Thống
                </h3>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Tuy nhiên, đằng sau sự lấp lánh của kim loại quý này là một nghịch lý: một tài sản được ưa chuộng rộng rãi lại đi kèm với những rào cản, chi phí và sự bất tiện đáng kể, đặc biệt đối với các nhà đầu tư cá nhân và nhỏ lẻ.
                  </p>
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-6">
                    <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">Những "nỗi đau" chính:</h4>
                    <ul className="space-y-2 text-red-700 dark:text-red-300">
                      <li>• Chi phí lưu trữ và bảo hiểm cao</li>
                      <li>• Rủi ro an ninh khi cất giữ tại nhà</li>
                      <li>• Chênh lệch giá mua-bán khổng lồ</li>
                      <li>• Tính thanh khoản thấp</li>
                      <li>• Bất tiện trong giao dịch</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div id="mission" className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Sứ Mệnh của PentaGold: Dân Chủ Hóa và Hiện Đại Hóa Đầu Tư Vàng
                </h3>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-8 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-amber-800 dark:text-amber-200 text-lg font-medium mb-4">
                      🎯 <strong>Sứ mệnh của PentaGold:</strong>
                    </p>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                      Phá vỡ những rào cản cố hữu của thị trường vàng truyền thống, mang lại sự công bằng, minh bạch và hiệu quả cho mọi nhà đầu tư. Chúng tôi tin rằng mọi người, bất kể quy mô vốn hay kinh nghiệm, đều xứng đáng có được cơ hội tiếp cận kênh đầu tư vàng một cách an toàn, chi phí thấp và linh hoạt nhất.
                    </p>
                  </div>
                </div>
              </div>

              <div id="roadmap-overview" className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Lộ trình của Whitepaper
                </h3>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Tài liệu này sẽ dẫn dắt người đọc qua một hành trình khám phá toàn diện về dự án PentaGold:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Phân tích vấn đề</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Những vấn đề cốt lõi của thị trường vàng vật chất</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Giải pháp công nghệ</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Hệ sinh thái tài chính mà PentaGold cung cấp</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Lợi ích cụ thể</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Kế hoạch phát triển và tác động sâu rộng</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Nền tảng vững chắc</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tính khả thi, đội ngũ và quản trị rủi ro</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Continue with more sections... */}
            <WhitepaperContent />

            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Nội dung đầy đủ đang được tải...
              </p>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                Whitepaper này chứa hơn 15,000 từ với phân tích chi tiết về thị trường, công nghệ, và kế hoạch phát triển.
              </div>
            </div>

            {/* Back to top button */}
            {showBackToTop && (
              <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-30"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Whitepaper;
