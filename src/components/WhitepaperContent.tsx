import React from 'react';

const WhitepaperContent: React.FC = () => {
  return (
    <>
      {/* Problem Analysis */}
      <section id="problem-analysis" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Phân Tích Sâu Về Vấn Đề: Những Rào Cản Vô Hình của Vàng Vật Chất
        </h2>
        
        <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Các vấn đề của thị trường vàng vật chất không phải là những phiền toái riêng lẻ. Chúng liên kết với nhau, tạo thành một hệ thống khép kín, kém hiệu quả, làm xói mòn tài sản của nhà đầu tư một cách có hệ thống.
          </p>
        </div>

        <div id="storage-costs" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Chi Phí Chìm và Rủi Ro Lưu Trữ, Bảo Quản
          </h3>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Rào cản đầu tiên và hữu hình nhất đối với nhà đầu tư vàng vật chất là chi phí và rủi ro liên quan đến việc bảo quản. Việc cất giữ vàng tại nhà tiềm ẩn rủi ro lớn về an ninh như trộm cắp hoặc mất mát do các sự cố không lường trước.
            </p>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">💰 Chi phí lưu trữ tại ngân hàng:</h4>
              <ul className="space-y-2 text-red-700 dark:text-red-300">
                <li>• 1.000-2.000 VNĐ/chỉ/tháng phí giữ hộ</li>
                <li>• Chi phí thuê két sắt bổ sung</li>
                <li>• Với 10 lượng vàng: 1.2-2.4 triệu VNĐ/năm chỉ để lưu trữ</li>
              </ul>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Đây là một chi phí chìm đáng kể, đặc biệt khi vàng là một tài sản không tự sinh ra thu nhập định kỳ như cổ tức hay lãi suất. Về bản chất, nhà đầu tư đang phải trả tiền để giữ một tài sản "chết".
            </p>
          </div>
        </div>

        <div id="liquidity" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Tính Thanh Khoản Kém và Ma Sát Giao Dịch
          </h3>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Rào cản thứ hai là sự thiếu linh hoạt và ma sát lớn trong quá trình giao dịch. Giao dịch vàng vật chất bị giới hạn nghiêm ngặt trong giờ hành chính và tại các địa điểm kinh doanh vật lý.
            </p>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">📊 Chênh lệch giá mua-bán (spread) năm 2024:</h4>
              <div className="grid md:grid-cols-3 gap-4 text-orange-700 dark:text-orange-300">
                <div className="text-center">
                  <div className="text-2xl font-bold">3-4 triệu</div>
                  <div className="text-sm">VNĐ/lượng (thường xuyên)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">8 triệu</div>
                  <div className="text-sm">VNĐ/lượng (đỉnh điểm)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">3-5%</div>
                  <div className="text-sm">Lỗ ngay khi mua</div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Mức ma sát khổng lồ này khiến các chiến lược đầu tư ngắn hạn hoặc "lướt sóng" gần như bất khả thi và buộc nhà đầu tư phải nắm giữ trong thời gian rất dài chỉ để hòa vốn chi phí giao dịch ban đầu.
            </p>
          </div>
        </div>

        <div id="transparency" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Thiếu Minh Bạch và Rủi Ro Hệ Thống
          </h3>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Rào cản cuối cùng, và cũng là rủi ro tiềm ẩn lớn nhất, là sự thiếu minh bạch và các vấn đề mang tính hệ thống. Nhà đầu tư cá nhân thường đối mặt với rủi ro về chất lượng và nguồn gốc vàng không rõ ràng.
            </p>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">⚠️ Rủi ro hệ thống:</h4>
              <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
                <li>• Chênh lệch với giá vàng thế giới lên đến 19 triệu đồng/lượng</li>
                <li>• Thị trường bị cô lập, không phản ánh cung cầu thực tế</li>
                <li>• Thiếu vắng các công cụ phái sinh hiện đại</li>
                <li>• Không có hợp đồng tương lai hay quyền chọn</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-10">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Bảng 1: So sánh Vàng Truyền Thống vs PentaGold
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                    Tiêu Chí
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                    Vàng Vật Chất Truyền Thống
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                    PentaGold (PenGx)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">
                    Phí Lưu Trữ/Bảo Quản
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                    <span className="text-red-600 dark:text-red-400">1.000-2.000 VNĐ/chỉ/tháng + Rủi ro an ninh</span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 dark:text-green-400">0 (Không có chi phí lưu trữ)</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">
                    Chênh Lệch Mua-Bán
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                    <span className="text-red-600 dark:text-red-400">Rất cao, 3-8% (3-8 triệu VNĐ/lượng)</span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 dark:text-green-400">Rất thấp, ~0.1-0.2% (phí giao dịch)</span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">
                    Thời Gian Giao Dịch
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                    <span className="text-red-600 dark:text-red-400">Giờ hành chính, các ngày trong tuần</span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 dark:text-green-400">24/7/365, toàn cầu</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">
                    Khả Năng Sinh Lời
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                    <span className="text-red-600 dark:text-red-400">Chỉ từ tăng giá, không có thu nhập thụ động</span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 dark:text-green-400">Tăng giá + Thu nhập từ cho vay (PentaLend)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Giải Pháp PentaGold: Một Hệ Sinh Thái Tài Chính Toàn Diện
        </h2>
        
        <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            PentaGold không chỉ là một giải pháp đơn lẻ để giải quyết các vấn đề của vàng vật chất. Đây là một sự thay đổi mô hình, một bước nhảy vọt về chiến lược so với các đối thủ. Thay vì chỉ đơn thuần số hóa quyền sở hữu vàng, PentaGold đang sử dụng vàng làm lớp tài sản cơ sở để xây dựng một hệ thống tài chính song song.
          </p>
        </div>

        <div id="pengx-core" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            PenGx: Cốt Lõi của Hệ Sinh Thái - Token Hóa Chỉ Số Giá Vàng
          </h3>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Trái tim của hệ sinh thái PentaGold là <strong>PenGx</strong>, một tài sản số được xây dựng trên nền tảng blockchain công khai Ethereum.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-6 mb-6">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🔧 Cơ chế hoạt động:</h4>
              <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                <li>• <strong>Tài sản số tổng hợp (synthetic asset)</strong> - không cần lưu trữ vàng vật chất</li>
                <li>• <strong>Bám sát chỉ số giá vàng quốc tế</strong> theo thời gian thực</li>
                <li>• <strong>Hệ thống Oracle phi tập trung</strong> (Chainlink/Band Protocol)</li>
                <li>• <strong>Minh bạch tuyệt đối</strong> - chống thao túng từ nguồn đơn lẻ</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">🔒 Circuit Breaker</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Tự động tạm dừng giao dịch khi phát hiện biến động bất thường</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">⏰ Timelock</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">Thay đổi quan trọng phải trải qua thời gian chờ để cộng đồng xem xét</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">🔄 Upgradeable Proxy</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">Cho phép nâng cấp hợp đồng mà không gián đoạn hệ thống</p>
              </div>
            </div>
          </div>
        </div>

        <div id="ecosystem" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Hệ Sinh Thái Dịch Vụ Giá Trị Gia Tăng: Vượt Ra Ngoài Giới Hạn Tích Trữ
          </h3>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Giá trị thực sự của PentaGold nằm ở việc biến vàng từ một tài sản chỉ để tích trữ thành một công cụ tài chính năng động.
            </p>

            {/* PentaLend */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800 mb-8">
              <h4 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                🏦 PentaLend - Thị trường vốn P2P thế hệ mới
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Cho vay:</h5>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    Người nắm giữ PenGx có thể cho vay tài sản để nhận lãi suất hấp dẫn, tạo thu nhập thụ động.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Đi vay:</h5>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    Thế chấp PenGx để vay các tài sản khác, phục vụ nhu cầu vốn lưu động.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🤖 Điểm khác biệt cốt lõi - Hệ thống xếp hạng tín nhiệm AI:</h5>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Sử dụng AI/ML phân tích dữ liệu on-chain và off-chain để tạo điểm tín dụng minh bạch, khách quan cho mỗi người dùng.
                </p>
              </div>
            </div>

            {/* PentaInvest */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800 mb-8">
              <h4 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">
                📈 PentaInvest - Công cụ đầu tư thông minh
              </h4>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Được thiết kế để đơn giản hóa và tối ưu hóa quá trình đầu tư cho người dùng.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-100 dark:bg-green-900/40 rounded-lg">
                  <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2">💰 DCA Tự động</h5>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Thiết lập đầu tư định kỳ tự động, giảm thiểu tác động từ biến động giá ngắn hạn.
                  </p>
                </div>
                <div className="p-4 bg-green-100 dark:bg-green-900/40 rounded-lg">
                  <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2">🎯 Quỹ đầu tư</h5>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Tương lai sẽ mở rộng sang các quỹ đầu tư được quản lý chuyên nghiệp.
                  </p>
                </div>
              </div>
            </div>

            {/* PentaPay */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-xl border border-purple-200 dark:border-purple-800 mb-8">
              <h4 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">
                💳 PentaPay - Đưa Vàng vào Giao Dịch Hàng Ngày
              </h4>
              <p className="text-purple-700 dark:text-purple-300 mb-4">
                Tầm nhìn của chúng tôi là mở rộng tiện ích của PenGx vượt ra ngoài phạm vi đầu tư.
              </p>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  PentaPay sẽ phát triển cổng thanh toán, cho phép sử dụng PenGx cho hàng hóa và dịch vụ hàng ngày, tạo vòng lặp giá trị và thúc đẩy sự chấp nhận rộng rãi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Lợi Ích và Ứng Dụng Thực Tiễn
        </h2>

        <div id="value-proposition" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Giá Trị Hữu Hình cho Nhà Đầu Tư và Người Dùng
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">💰 Tiết kiệm chi phí tối đa</h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Loại bỏ hoàn toàn chi phí lưu trữ vật lý, bảo hiểm và vận chuyển. Phí giao dịch chỉ 0.1-0.2% so với 3-8% của vàng vật chất.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">📈 Tối đa hóa lợi nhuận</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                PenGx không phải là tài sản "chết". Thông qua PentaLend, có thể cho vay để kiếm thu nhập thụ động từ lãi suất.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">⚖️ Quản lý rủi ro hiệu quả</h4>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Công cụ DCA tự động giúp áp dụng chiến lược đầu tư kỷ luật, giảm thiểu rủi ro mua vào ở đỉnh giá.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3">🔒 An toàn và minh bạch</h4>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                Mọi giao dịch ghi lại trên blockchain, giá được xác định bởi Oracle phi tập trung, loại bỏ rủi ro vàng giả.
              </p>
            </div>
          </div>
        </div>

        <div id="case-studies" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Tình Huống Nghiên Cứu (Case Studies)
          </h3>
          
          {/* Case Study 1 */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-8 rounded-xl border border-pink-200 dark:border-pink-800 mb-8">
            <h4 className="text-xl font-bold text-pink-800 dark:text-pink-200 mb-4">
              👩‍💼 Persona 1: Chị An - Nhân viên văn phòng (30 tuổi)
            </h4>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
                <h5 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">🎯 Vấn đề</h5>
                <p className="text-pink-700 dark:text-pink-300 text-sm">
                  Muốn tích lũy vàng hàng tháng nhưng bận rộn công việc, lo ngại việc cất giữ vàng tại nhà.
                </p>
              </div>
              
              <div className="p-4 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
                <h5 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">💡 Giải pháp</h5>
                <p className="text-pink-700 dark:text-pink-300 text-sm">
                  Sử dụng PentaInvest thiết lập DCA tự động: mua 0.5 chỉ PenGx vào ngày 5 hàng tháng.
                </p>
              </div>
              
              <div className="p-4 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
                <h5 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">🎉 Kết quả</h5>
                <p className="text-pink-700 dark:text-pink-300 text-sm">
                  Sau 1 năm: tích lũy 6 chỉ vàng, sử dụng 4 chỉ cho vay trên PentaLend để kiếm thu nhập thụ động.
                </p>
              </div>
            </div>
          </div>

          {/* Case Study 2 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800 mb-8">
            <h4 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              👨‍🏪 Persona 2: Anh Bình - Chủ cửa hàng bán lẻ (45 tuổi)
            </h4>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Vấn đề</h5>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Cần 100 triệu VNĐ vốn lưu động trong 3 tháng, có vàng nhưng không muốn bán vì tin giá sẽ tăng.
                </p>
              </div>
              
              <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Giải pháp</h5>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Thế chấp PenGx trị giá 150 triệu trên PentaLend, nhận điểm tín dụng tốt nhờ AI system.
                </p>
              </div>
              
              <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎉 Kết quả</h5>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Vay được 100 triệu trong vài phút, giải quyết nhu cầu vốn mà không bỏ lỡ cơ hội tăng giá vàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Plan Section */}
      <section id="growth-plan" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Kế Hoạch Tăng Trưởng và Mở Rộng Thị Trường
        </h2>
        
        <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            PentaGold không chỉ có một sản phẩm đột phá mà còn có một kế hoạch tăng trưởng và mở rộng thị trường bài bản, được thiết kế theo từng giai đoạn để đảm bảo sự phát triển bền vững. Chiến lược của chúng tôi là sự kết hợp giữa <strong>Tăng trưởng dựa vào Sản phẩm (Product-Led Growth)</strong> và <strong>Tăng trưởng dựa vào Cộng đồng (Community-Led Growth)</strong>.
          </p>
        </div>

        <div id="phase1" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Giai đoạn 1 (Năm 1-1.5): Củng cố thị trường Việt Nam và Hoàn thiện Sản phẩm Cốt lõi
          </h3>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">🎯 Mục tiêu</h4>
                <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                  <li>• 30,000 người dùng hoạt động</li>
                  <li>• 50 triệu USD khối lượng giao dịch PenGx</li>
                  <li>• 5 triệu USD cho vay trên PentaLend</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">🛠️ Sản phẩm</h4>
                <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                  <li>• Ra mắt PenGx trên Ethereum mainnet</li>
                  <li>• MVP PentaLend với AI credit scoring</li>
                  <li>• PentaInvest với DCA tự động</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">📈 Chiến lược</h4>
                <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                  <li>• Content Marketing chuyên sâu</li>
                  <li>• Hợp tác KOLs/KOCs tài chính</li>
                  <li>• Niêm yết trên sàn crypto Việt Nam</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div id="phase2" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Giai đoạn 2 (Năm 1.5-3): Mở rộng Hệ sinh thái và Thâm nhập Đông Nam Á
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800 mb-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-green-800 dark:text-green-200 mb-3">🎯 Mục tiêu</h4>
                <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                  <li>• 100,000 người dùng hoạt động</li>
                  <li>• 500 triệu USD khối lượng giao dịch</li>
                  <li>• 50 triệu USD cho vay trên PentaLend</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-green-800 dark:text-green-200 mb-3">🛠️ Sản phẩm</h4>
                <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                  <li>• PentaPay và đối tác thanh toán</li>
                  <li>• Token hóa kim loại khác (PenSx, PenPx)</li>
                  <li>• Nâng cấp AI/ML credit system</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-green-800 dark:text-green-200 mb-3">📈 Chiến lược</h4>
                <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                  <li>• Mở rộng sang Indonesia, Thái Lan</li>
                  <li>• Đối tác chiến lược khu vực</li>
                  <li>• Niêm yết sàn quốc tế</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div id="phase3" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Giai đoạn 3 (Năm 3-5): Đa dạng hóa Tài sản và Mở rộng Toàn cầu
          </h3>
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-8 rounded-xl border border-purple-200 dark:border-purple-800 mb-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-3">🎯 Mục tiêu</h4>
                <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
                  <li>• 1 triệu người dùng</li>
                  <li>• Hàng tỷ USD khối lượng giao dịch</li>
                  <li>• Nền tảng RWA hàng đầu</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-3">🛠️ Sản phẩm</h4>
                <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
                  <li>• Token hóa RWA (bất động sản, nghệ thuật)</li>
                  <li>• DeFi derivatives phức tạp</li>
                  <li>• ZK-proofs cho privacy</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-3">📈 Chiến lược</h4>
                <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
                  <li>• Thâm nhập Châu Âu, Bắc Mỹ</li>
                  <li>• Văn phòng đại diện toàn cầu</li>
                  <li>• Top platform RWA & lending</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Tác Động Kinh Tế và Xã Hội
        </h2>

        <div id="financial-inclusion" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Thúc Đẩy Phổ Cập Tài Chính (Financial Inclusion)
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <h4 className="text-lg font-semibold text-cyan-800 dark:text-cyan-200 mb-3">🏛️ Dân chủ hóa đầu tư</h4>
              <p className="text-cyan-700 dark:text-cyan-300 text-sm leading-relaxed">
                Hạ thấp rào cản gia nhập thị trường vàng, loại bỏ yêu cầu vốn lớn và thủ tục phức tạp. Cho phép người thu nhập khiêm tốn, nhà đầu tư nhỏ lẻ và thế hệ trẻ dễ dàng tiếp cận kênh đầu tư an toàn.
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-6 rounded-lg border border-teal-200 dark:border-teal-800">
              <h4 className="text-lg font-semibold text-teal-800 dark:text-teal-200 mb-3">💰 Mở rộng khả năng tiếp cận vốn</h4>
              <p className="text-teal-700 dark:text-teal-300 text-sm leading-relaxed">
                PentaLend với cơ chế xếp hạng tín nhiệm phi truyền thống dựa trên dữ liệu, tạo kênh tiếp cận vốn mới, công bằng và minh bạch cho những đối tượng bị hệ thống ngân hàng truyền thống bỏ qua.
              </p>
            </div>
          </div>
        </div>

        <div id="market-efficiency" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Tăng Cường Hiệu Quả và Minh Bạch cho Thị Trường Vốn
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">🌊 Tăng tính thanh khoản</h4>
              <p className="text-orange-700 dark:text-orange-300 text-sm leading-relaxed">
                Số hóa vàng và giao dịch 24/7 giải phóng lượng vốn khổng lồ đang nằm im dưới dạng tài sản vật chất. Tăng đáng kể tính thanh khoản, giúp vốn lưu thông hiệu quả hơn.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <h4 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-3">🔍 Thúc đẩy minh bạch</h4>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                Blockchain và Oracle phi tập trung đảm bảo mọi giao dịch và thông tin giá cả công khai, minh bạch. Giúp giảm thiểu hoạt động phi pháp và tạo sân chơi công bằng.
              </p>
            </div>
          </div>
        </div>

        <div id="innovation" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Tạo Ra Làn Sóng Đổi Mới trong Ngành Fintech Việt Nam
          </h3>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">⚡ Chất xúc tác chuyển đổi số</h4>
                <p className="text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed mb-4">
                  Minh chứng sống động cho tiềm năng blockchain và token hóa tài sản. Tạo áp lực cạnh tranh, thúc đẩy các tổ chức tài chính truyền thống đổi mới và hợp tác với Fintech.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">🏗️ Phát triển hệ sinh thái phụ trợ</h4>
                <p className="text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">
                  Kéo theo sự ra đời của ví điện tử chuyên dụng, công ty phân tích dữ liệu on-chain, nền tảng bảo hiểm tài sản số. Tạo nhiều cơ hội kinh doanh và việc làm mới.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation Section */}
      <section id="foundation" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Nền Tảng Vững Chắc của Dự Án
        </h2>

        <div id="technical-feasibility" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Tính Khả Thi Kỹ Thuật: Từ Ý Tưởng đến Hiện Thực
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800 mb-6">
            <h4 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">
              ✅ Minh chứng thực tế: Demo/Prototype hoạt động
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Đã triển khai:</h5>
                <ul className="text-green-600 dark:text-green-400 text-sm space-y-1">
                  <li>• Giao diện Landing Page & Dashboard</li>
                  <li>• Biểu đồ giá vàng thời gian thực</li>
                  <li>• Quy trình KYC mô phỏng</li>
                  <li>• Chức năng giao dịch PenGx</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Công nghệ nền tảng:</h5>
                <ul className="text-green-600 dark:text-green-400 text-sm space-y-1">
                  <li>• Blockchain Ethereum</li>
                  <li>• Oracle protocols (Chainlink)</li>
                  <li>• AI/ML frameworks</li>
                  <li>• Xác thực sinh trắc học</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div id="business-model" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Mô Hình Kinh Doanh và Tài Chính Bền Vững
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">💰 Nguồn doanh thu đa dạng</h4>
              <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
                <li>• <strong>Phí giao dịch PenGx:</strong> 0.1-0.2%</li>
                <li>• <strong>PentaLend:</strong> Phí khởi tạo vay + spread lãi suất</li>
                <li>• <strong>PentaInvest:</strong> Phí quản lý + phí hiệu suất</li>
                <li>• <strong>Phí niêm yết:</strong> Token hóa tài sản mới</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">📊 Tính bền vững</h4>
              <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-2">
                <li>• Không phụ thuộc nguồn thu duy nhất</li>
                <li>• Tăng trưởng theo quy mô người dùng</li>
                <li>• Chi phí vận hành tối ưu</li>
                <li>• Khả năng mở rộng toàn cầu</li>
              </ul>
            </div>
          </div>
        </div>

        <div id="team" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Đội Ngũ Sáng Lập và Cố Vấn (Dự kiến)
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">👨‍💼 CEO - Giám đốc Điều hành</h4>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  Chuyên gia với kinh nghiệm sâu rộng trong tài chính-ngân hàng, am hiểu giao dịch vàng và tín dụng, có tầm nhìn chiến lược về blockchain và DeFi.
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">👨‍💻 CTO - Giám đốc Công nghệ</h4>
                <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                  Kiến trúc sư blockchain với kinh nghiệm thực chiến xây dựng các dự án DeFi thành công, đặc biệt là giao thức cho vay và oracle.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">🤖 AI/Data Science Expert</h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Năng lực cốt lõi trong xây dựng và tối ưu hóa mô hình xếp hạng tín nhiệm, trái tim của PentaLend.
                </p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-lg border border-rose-200 dark:border-rose-800">
                <h4 className="font-semibold text-rose-800 dark:text-rose-200 mb-2">👥 Các chuyên gia khác</h4>
                <p className="text-rose-700 dark:text-rose-300 text-sm">
                  Giám đốc Marketing, chuyên gia UI/UX, chuyên gia pháp lý am hiểu Fintech và luật blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="funding" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Kế Hoạch Huy Động Vốn Chi Tiết
          </h3>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Vòng Seed: $500,000 - $1,500,000 USD
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                      Hạng Mục
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                      Tỷ Lệ (%)
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                      Mục Đích Sử Dụng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">
                      R&D
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                      45%
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                      Hoàn thiện MVP PenGx, phát triển alpha/beta PentaLend, kiểm toán smart contracts
                    </td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Marketing
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                      20%
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                      Chiến dịch truyền thông, nội dung giáo dục, sự kiện ra mắt, thu hút người dùng
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Pháp lý & Tuân thủ
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                      15%
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                      Tham vấn luật sư, đăng ký kinh doanh, xây dựng khung KYC/AML
                    </td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Vận hành
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                      10%
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                      Lương đội ngũ cốt lõi, chi phí hạ tầng IT, văn phòng
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Dự phòng
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">
                      10%
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                      Chi phí phát sinh và cơ hội đột xuất
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Management Section */}
      <section id="risk-management" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Quản Trị Rủi Ro và Tuân Thủ Pháp Lý
        </h2>

        <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Trong một lĩnh vực mới và năng động như Fintech và blockchain, việc nhận diện, đánh giá và xây dựng kế hoạch đối phó với rủi ro là yếu tố sống còn. Cách tiếp cận của PentaGold đối với rủi ro không phải là né tránh, mà là <strong>đối mặt một cách thẳng thắn và minh bạch</strong>.
          </p>
        </div>

        <div id="risk-analysis" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Phân Tích Rủi Ro Toàn Diện và Giải Pháp Giảm Thiểu
          </h3>
          
          <div className="space-y-8">
            {/* Legal Risk */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-8 rounded-xl border border-red-200 dark:border-red-800">
              <h4 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">⚖️ Rủi ro Pháp lý</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2">Vấn đề:</h5>
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Khung pháp lý cho tài sản số và cho vay P2P tại Việt Nam vẫn đang trong quá trình hoàn thiện, có thể dẫn đến thay đổi chính sách.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2">Giải pháp:</h5>
                  <ul className="text-red-600 dark:text-red-400 text-sm space-y-1">
                    <li>• Hợp tác với công ty luật hàng đầu chuyên Fintech</li>
                    <li>• Xây dựng khung KYC/AML theo tiêu chuẩn quốc tế</li>
                    <li>• Đối thoại với cơ quan quản lý nhà nước</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technology Risk */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-8 rounded-xl border border-orange-200 dark:border-orange-800">
              <h4 className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-4">🔒 Rủi ro Công nghệ và Bảo mật</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Vấn đề:</h5>
                  <p className="text-orange-600 dark:text-orange-400 text-sm">
                    Nền tảng tài chính số là mục tiêu của tấn công mạng. Lỗi trong smart contracts hoặc thuật toán AI/ML có thể gây thiệt hại.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Giải pháp:</h5>
                  <ul className="text-orange-600 dark:text-orange-400 text-sm space-y-1">
                    <li>• Kiểm toán smart contracts định kỳ</li>
                    <li>• Chương trình bug bounty</li>
                    <li>• Giám sát an ninh 24/7</li>
                    <li>• Kế hoạch phản ứng sự cố chi tiết</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Market Risk */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">📈 Rủi ro Thị trường</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Vấn đề:</h5>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    Thị trường vàng và crypto có biến động khó lường. Cạnh tranh từ đối thủ mới và mất cân bằng cung-cầu trên PentaLend.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Giải pháp:</h5>
                  <ul className="text-blue-600 dark:text-blue-400 text-sm space-y-1">
                    <li>• Mô hình kinh doanh linh hoạt</li>
                    <li>• Đa dạng hóa sang kim loại khác</li>
                    <li>• DCA giúp giảm tác động biến động</li>
                    <li>• Cơ chế lãi suất linh hoạt</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Operational Risk */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-8 rounded-xl border border-purple-200 dark:border-purple-800">
              <h4 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">⚙️ Rủi ro Vận hành</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Vấn đề:</h5>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">
                    Sai sót trong quy trình vận hành, quản lý dữ liệu, hoặc xử lý tranh chấp trên nền tảng cho vay có thể ảnh hưởng uy tín.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Giải pháp:</h5>
                  <ul className="text-purple-600 dark:text-purple-400 text-sm space-y-1">
                    <li>• Quy trình vận hành chuẩn (SOPs)</li>
                    <li>• Tự động hóa tối đa các tác vụ</li>
                    <li>• Đào tạo chuyên nghiệp đội ngũ</li>
                    <li>• Cơ chế giải quyết tranh chấp minh bạch</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section id="conclusion" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Kết Luận và Tầm Nhìn Tương Lai
        </h2>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Thị trường vàng Việt Nam, dù sôi động, vẫn đang bị kìm hãm bởi những rào cản của một hệ thống truyền thống: <strong>chi phí cao, thanh khoản thấp, và thiếu minh bạch</strong>. Những rào cản này không chỉ là sự bất tiện, chúng là những ma sát hệ thống làm xói mòn tài sản và hạn chế cơ hội của hàng triệu nhà đầu tư.
          </p>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-8 rounded-xl border border-amber-200 dark:border-amber-800 mb-8">
            <p className="text-amber-800 dark:text-amber-200 text-lg font-medium mb-4">
              🌟 <strong>PentaGold không chỉ ra đời để giải quyết những vấn đề này. Chúng tôi mang đến một sự thay đổi mô hình toàn diện.</strong>
            </p>
            <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
              Giải pháp của chúng tôi không dừng lại ở việc tạo ra một token bám sát giá vàng. Chúng tôi kiến tạo một hệ sinh thái tài chính phi tập trung toàn diện, nơi vàng được biến đổi từ một tài sản tích trữ tĩnh thành một công cụ tài chính năng động và sản xuất.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
              <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">PenGx</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">Cốt lõi hệ sinh thái</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 text-center">
              <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">PentaLend</h4>
              <p className="text-green-700 dark:text-green-300 text-sm">Cho vay P2P với AI</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
              <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">PentaInvest + PentaPay</h4>
              <p className="text-purple-700 dark:text-purple-300 text-sm">Đầu tư thông minh + Thanh toán</p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            <strong>Tầm nhìn của chúng tôi vượt ra ngoài giới hạn của vàng hay kim loại quý.</strong> PentaGold đặt mục tiêu trở thành nền tảng hàng đầu cho việc token hóa mọi loại tài sản trong thế giới thực (Real World Assets - RWA) tại Việt Nam và vươn ra khu vực. Chúng tôi đang xây dựng một cây cầu vững chắc kết nối thế giới tài chính truyền thống (TradFi) và tài chính phi tập trung (DeFi).
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-xl border border-indigo-200 dark:border-indigo-800 text-center">
            <p className="text-indigo-800 dark:text-indigo-200 text-xl font-bold mb-4">
              🚀 Lời mời tham gia cuộc cách mạng
            </p>
            <p className="text-indigo-700 dark:text-indigo-300 leading-relaxed">
              PentaGold không chỉ là một cơ hội đầu tư vào một dự án công nghệ tài chính tiềm năng. Đây là một lời mời gọi tham gia vào một cuộc cách mạng nhằm định hình lại cách chúng ta tương tác với tài sản, phá vỡ các rào cản cũ kỹ, và cùng nhau xây dựng một tương lai tài chính công bằng, dễ tiếp cận và hiệu quả hơn cho tất cả mọi người.
            </p>
          </div>
        </div>
      </section>

      {/* Appendix Section */}
      <section id="appendix" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Phụ Lục
        </h2>

        <div id="about-us" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Giới Thiệu Về Công Ty (About Us)
          </h3>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              <strong>PentaGold Inc.</strong> là một công ty công nghệ tài chính (Fintech) được thành lập với sứ mệnh cách mạng hóa cách thức đầu tư và quản lý tài sản tại Việt Nam và khu vực Đông Nam Á. Chúng tôi tin vào sức mạnh của công nghệ blockchain trong việc tạo ra một hệ thống tài chính minh bạch, công bằng và hiệu quả hơn.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              <strong>Tầm nhìn:</strong> Trở thành nền tảng hàng đầu về token hóa tài sản, xây dựng cầu nối vững chắc giữa tài sản thực và thế giới tài chính phi tập trung.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Website</h4>
                <p className="text-blue-600 dark:text-blue-400 text-sm">https://pentagold.com (dự kiến)</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Email</h4>
                <p className="text-green-600 dark:text-green-400 text-sm">contact@pentagold.com (dự kiến)</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Mạng xã hội</h4>
                <p className="text-purple-600 dark:text-purple-400 text-sm">Đang cập nhật</p>
              </div>
            </div>
          </div>
        </div>

        <div id="cta" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Kêu Gọi Hành Động (Call to Action - CTA)
          </h3>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
            <h4 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-4">
              🤝 Tham gia cùng chúng tôi
            </h4>
            <p className="text-amber-700 dark:text-amber-300 leading-relaxed mb-6">
              PentaGold đang tìm kiếm các nhà đầu tư và đối tác chiến lược có cùng tầm nhìn để cùng chúng tôi hiện thực hóa sứ mệnh này.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">💰 Nhà đầu tư</h5>
                <p className="text-amber-700 dark:text-amber-300 text-sm mb-3">
                  Tìm hiểu cơ hội đầu tư vào dự án tiềm năng
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-mono">
                  investors@pentagold.com
                </p>
              </div>
              <div className="p-6 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">🤝 Đối tác</h5>
                <p className="text-amber-700 dark:text-amber-300 text-sm mb-3">
                  Hợp tác chiến lược cùng phát triển
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-mono">
                  partners@pentagold.com
                </p>
              </div>
            </div>
            <p className="text-amber-600 dark:text-amber-400 text-sm mt-6">
              Hãy tham gia cộng đồng của chúng tôi để cập nhật thông tin mới nhất và trở thành một phần của cuộc cách mạng tài chính.
            </p>
          </div>
        </div>

        <div id="references" className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Tài Liệu Tham Khảo (References)
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Whitepaper này được biên soạn dựa trên nghiên cứu thị trường, phân tích dữ liệu và tham khảo các nguồn thông tin uy tín về:
            </p>
            <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2">
              <li>• Thị trường vàng Việt Nam và khu vực Đông Nam Á</li>
              <li>• Công nghệ blockchain và DeFi protocols</li>
              <li>• Khung pháp lý tài chính số tại Việt Nam</li>
              <li>• Nghiên cứu về Oracle networks và synthetic assets</li>
              <li>• Phân tích các dự án token hóa tài sản thành công</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhitepaperContent;
