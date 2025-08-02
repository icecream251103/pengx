// Định nghĩa các tooltip cho các chỉ số tài chính
export const metricTooltips = {
  // Chỉ số cơ bản
  currentPrice: {
    title: "Giá hiện tại",
    description: "Giá giao dịch hiện tại của token PenGx trên thị trường. Đây là giá mà bạn có thể mua hoặc bán token ngay lập tức.",
    example: "Nếu giá hiện tại là $45.67, có nghĩa là bạn cần $45.67 để mua 1 PenGx token."
  },
  
  change24h: {
    title: "Thay đổi 24h",
    description: "Mức thay đổi giá trị tuyệt đối trong 24 giờ qua. Giúp bạn theo dõi biến động giá ngắn hạn của token.",
    formula: "Giá hiện tại - Giá 24h trước",
    example: "Nếu hiển thị +$2.34, có nghĩa là giá đã tăng $2.34 so với 24h trước."
  },
  
  changePercent24h: {
    title: "% Thay đổi 24h",
    description: "Tỷ lệ phần trăm thay đổi giá trong 24 giờ qua. Chỉ số này giúp đánh giá mức độ biến động tương đối.",
    formula: "((Giá hiện tại - Giá 24h trước) / Giá 24h trước) × 100%",
    example: "Nếu hiển thị +5.2%, có nghĩa là giá đã tăng 5.2% so với 24h trước."
  },
  
  marketCap: {
    title: "Vốn hóa thị trường",
    description: "Tổng giá trị của tất cả token PenGx đang lưu hành trên thị trường. Đây là chỉ số quan trọng để đánh giá quy mô của dự án.",
    formula: "Giá hiện tại × Tổng nguồn cung lưu hành",
    example: "Nếu có 1 triệu token lưu hành với giá $45, vốn hóa sẽ là $45 triệu."
  },
  
  totalSupply: {
    title: "Tổng nguồn cung",
    description: "Tổng số lượng token PenGx đã được tạo ra và có thể lưu hành trên thị trường. Bao gồm cả những token chưa được phát hành.",
    example: "1,000,000 PenGx có nghĩa là tối đa chỉ có thể có 1 triệu token trên thị trường."
  },
  
  volume24h: {
    title: "Khối lượng giao dịch 24h",
    description: "Tổng giá trị của tất cả các giao dịch PenGx trong 24 giờ qua. Chỉ số này phản ánh mức độ hoạt động giao dịch.",
    example: "Khối lượng $500K có nghĩa là đã có $500,000 worth PenGx được giao dịch trong 24h."
  },
  
  backingRatio: {
    title: "Tỷ lệ ủng hộ",
    description: "Tỷ lệ phần trăm token được bảo chứng bởi vàng thật. Chỉ số này đảm bảo giá trị nội tại của token.",
    formula: "Lượng vàng dự trữ / Tổng giá trị token × 100%",
    example: "85% có nghĩa là 85% giá trị token được bảo chứng bởi vàng thật."
  },
  
  // Chỉ số chuyên gia
  volatilityIndex: {
    title: "Chỉ số biến động",
    description: "Đo lường mức độ biến động giá của token trong một khoảng thời gian. Giá trị cao có nghĩa là giá biến động mạnh.",
    formula: "Độ lệch chuẩn của giá trong khoảng thời gian nhất định",
    example: "Chỉ số 15% có nghĩa là giá thường biến động trong khoảng ±15% so với giá trung bình."
  },
  
  liquidityRatio: {
    title: "Tỷ lệ thanh khoản",
    description: "Đo lường khả năng mua bán token mà không ảnh hưởng đáng kể đến giá. Tỷ lệ cao có nghĩa là dễ giao dịch.",
    formula: "Khối lượng giao dịch / Vốn hóa thị trường",
    example: "Tỷ lệ 12% có nghĩa là thanh khoản tốt, dễ dàng mua bán."
  },
  
  rsi: {
    title: "RSI (Relative Strength Index)",
    description: "Chỉ số sức mạnh tương đối, đo lường momentum của giá. Giá trị từ 0-100, trên 70 là quá mua, dưới 30 là quá bán.",
    formula: "100 - (100 / (1 + RS)) với RS = Trung bình tăng / Trung bình giảm",
    example: "RSI = 75 có nghĩa là token có thể bị quá mua và giá có thể giảm."
  },
  
  macd: {
    title: "MACD",
    description: "Moving Average Convergence Divergence - chỉ báo momentum dựa trên sự hội tụ/phân kỳ của đường trung bình động.",
    formula: "EMA(12) - EMA(26), Signal Line = EMA(9) của MACD",
    example: "MACD > Signal Line thường báo hiệu xu hướng tăng."
  },
  
  priceToBook: {
    title: "Tỷ lệ P/B",
    description: "Price-to-Book ratio - so sánh giá thị trường với giá trị sổ sách (được bảo chứng bởi vàng).",
    formula: "Giá thị trường / Giá trị sổ sách",
    example: "P/B = 1.2 có nghĩa là thị trường định giá cao hơn 20% so với giá trị vàng bảo chứng."
  },
  
  sharpeRatio: {
    title: "Tỷ lệ Sharpe",
    description: "Đo lường hiệu suất đầu tư điều chỉnh theo rủi ro. Giá trị cao hơn có nghĩa là lợi nhuận tốt hơn so với rủi ro.",
    formula: "(Lợi nhuận - Lãi suất phi rủi ro) / Độ lệch chuẩn lợi nhuận",
    example: "Sharpe ratio 1.5 có nghĩa là lợi nhuận vượt trội tốt so với rủi ro."
  },
  
  beta: {
    title: "Beta",
    description: "Đo lường độ nhạy cảm của giá token so với thị trường vàng tổng thể. Beta > 1 có nghĩa là biến động mạnh hơn thị trường.",
    formula: "Covariance(Token, Market) / Variance(Market)",
    example: "Beta = 1.3 có nghĩa là khi thị trường vàng tăng 1%, token có thể tăng 1.3%."
  },
  
  tradingVolume: {
    title: "Khối lượng giao dịch",
    description: "Tổng số lượng token được giao dịch trong một khoảng thời gian cụ thể.",
    example: "50,000 token được giao dịch trong ngày."
  },
  
  averageHolding: {
    title: "Thời gian nắm giữ trung bình",
    description: "Thời gian trung bình mà nhà đầu tư nắm giữ token trước khi bán. Thời gian dài cho thấy sự tin tưởng.",
    example: "30 ngày có nghĩa là nhà đầu tư thường nắm giữ token khoảng 1 tháng."
  },
  
  burnRate: {
    title: "Tỷ lệ đốt token",
    description: "Tỷ lệ token bị đốt (loại bỏ khỏi lưu thông) để giảm nguồn cung và có thể tăng giá trị.",
    formula: "Số token bị đốt / Tổng nguồn cung × 100%",
    example: "0.1%/tháng có nghĩa là 0.1% tổng nguồn cung bị đốt mỗi tháng."
  },
  
  stakingRatio: {
    title: "Tỷ lệ staking",
    description: "Tỷ lệ token đang được staking (khóa để nhận thưởng). Tỷ lệ cao cho thấy sự tin tưởng của cộng đồng.",
    formula: "Token đang staking / Tổng nguồn cung lưu hành × 100%",
    example: "45% có nghĩa là 45% token đang được staking, giảm nguồn cung trên thị trường."
  },

  // Thêm các chỉ số kỹ thuật bổ sung
  sma: {
    title: "SMA (Simple Moving Average)",
    description: "Đường trung bình động đơn giản - giá trung bình của token trong một khoảng thời gian cụ thể. Giúp xác định xu hướng giá.",
    formula: "Tổng giá trong N ngày / N",
    example: "SMA 20 ngày = $45.5 có nghĩa là giá trung bình của 20 ngày qua là $45.5."
  },

  ema: {
    title: "EMA (Exponential Moving Average)",
    description: "Đường trung bình động hàm mũ - tương tự SMA nhưng ưu tiên giá gần đây hơn. Phản ứng nhanh hơn với thay đổi giá.",
    formula: "EMA = (Giá hôm nay × 2/(N+1)) + (EMA hôm qua × (1-2/(N+1)))",
    example: "EMA 12 ngày phản ứng nhanh hơn SMA với biến động giá mới."
  },

  supportResistance: {
    title: "Hỗ trợ & Kháng cự",
    description: "Mức hỗ trợ là giá mà token khó giảm xuống dưới. Mức kháng cự là giá mà token khó vượt lên trên.",
    example: "Nếu giá luôn tăng từ $40 thì $40 là mức hỗ trợ. Nếu giá khó vượt $50 thì $50 là mức kháng cự."
  }
};

export type MetricKey = keyof typeof metricTooltips;
