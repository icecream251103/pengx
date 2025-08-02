# Hướng dẫn sử dụng tính năng Tooltip cho Dashboard Metrics

## Tính năng vừa được thêm vào:

### 1. **MetricTooltip Component**
- Component tooltip thông minh với khả năng tự động điều chỉnh vị trí
- Hiển thị thông tin chi tiết khi hover vào các chỉ số
- Hỗ trợ cả chế độ sáng và tối
- Responsive design cho mọi kích thước màn hình

### 2. **Tooltip Content Database**
- Thêm file `metricTooltips.ts` chứa định nghĩa chi tiết cho tất cả chỉ số
- Bao gồm: Tiêu đề, mô tả, công thức tính, và ví dụ thực tế
- Hỗ trợ cả chỉ số cơ bản và chuyên gia

### 3. **Dashboard Metrics với Tooltip**

#### **Chế độ thường (MetricsPanel):**
- ✅ Giá hiện tại - Giải thích giá giao dịch real-time
- ✅ Thay đổi 24h - Công thức tính mức thay đổi
- ✅ Vốn hóa thị trường - Cách tính và ý nghĩa
- ✅ Tổng nguồn cung - Khái niệm tokenomics
- ✅ Khối lượng 24h - Thanh khoản và hoạt động giao dịch
- ✅ Tỷ lệ ủng hộ - Bảo chứng vàng thật
- ✅ Cao nhất/Thấp nhất 24h - Mức hỗ trợ/kháng cự

#### **Chế độ chuyên gia (SimpleAdvancedMetrics):**
- ✅ RSI (14) - Chỉ báo momentum với công thức chi tiết
- ✅ SMA 20 - Đường trung bình động đơn giản
- ✅ EMA 12 - Đường trung bình động hàm mũ
- ✅ Độ biến động - Volatility index và rủi ro
- ✅ Các chỉ số kỹ thuật khác

### 4. **Smart Positioning**
- Tooltip tự động điều chỉnh vị trí (phải, trái, trên, dưới)
- Tránh bị tràn khỏi viewport
- Arrow pointer thông minh theo vị trí

## Cách sử dụng:

### **Người dùng:**
1. Vào trang Dashboard
2. Chuyển đổi giữa chế độ "Thường" và "Chuyên gia"
3. Di chuyển chuột qua bất kỳ khung chỉ số nào
4. Tooltip sẽ xuất hiện với thông tin chi tiết
5. Di chuyển chuột ra khỏi khung để ẩn tooltip

### **Thông tin hiển thị trong tooltip:**
- **Tiêu đề:** Tên đầy đủ của chỉ số
- **Mô tả:** Giải thích ý nghĩa và mục đích
- **Công thức:** Cách tính toán (nếu có)
- **Ví dụ:** Trường hợp thực tế để hiểu rõ hơn

## Technical Implementation:

### **Files được tạo/chỉnh sửa:**
- `src/components/MetricTooltip.tsx` - Tooltip component chính
- `src/utils/metricTooltips.ts` - Database chứa nội dung tooltip
- `src/components/MetricsPanel.tsx` - Thêm tooltip cho chế độ thường
- `src/components/SimpleAdvancedMetrics.tsx` - Thêm tooltip cho chế độ chuyên gia

### **Features:**
- TypeScript support với type safety
- Dark/Light theme compatibility  
- Responsive design
- Smart positioning system
- Performance optimized với useRef và useEffect

### **CSS Classes:**
- `cursor-help` - Con trỏ chuột thay đổi khi hover
- `transition-shadow` - Smooth hover effects
- Smart positioning với Tailwind CSS utilities

## Testing:

1. **Chế độ thường:**
   - Hover vào "Giá hiện tại" → Thấy giải thích về giá real-time
   - Hover vào "Vốn hóa thị trường" → Thấy công thức tính
   - Hover vào "Tỷ lệ ủng hộ" → Thấy giải thích về bảo chứng vàng

2. **Chế độ chuyên gia:**
   - Hover vào "RSI (14)" → Thấy giải thích momentum indicator
   - Hover vào "SMA 20" → Thấy công thức moving average
   - Hover vào "Độ biến động" → Thấy giải thích volatility

3. **Smart positioning:**
   - Test ở các vị trí khác nhau trên màn hình
   - Test trên mobile và desktop
   - Kiểm tra tooltip không bị tràn khỏi viewport

Tính năng này giúp người dùng hiểu rõ hơn về các chỉ số tài chính mà không cần rời khỏi trang dashboard!
