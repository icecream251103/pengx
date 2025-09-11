# Supabase Database Setup Guide

## Thiết lập Supabase cho PentaGold

### 1. Tạo dự án Supabase

1. Đăng nhập vào [Supabase](https://supabase.com)
2. Tạo dự án mới
3. Chọn region gần nhất (Singapore cho Việt Nam)
4. Đặt tên dự án: `pentagold-production` hoặc `pentagold-development`

### 2. Cấu hình Database

1. Trong Supabase Dashboard, vào **SQL Editor**
2. Copy và paste nội dung từ file `database/schema.sql`
3. Chạy SQL script để tạo tables và policies

### 3. Cấu hình Environment Variables

1. Trong Supabase Dashboard, vào **Settings** > **API**
2. Copy `Project URL` và `anon public` key
3. Cập nhật file `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=development
```

### 4. Cấu hình Row Level Security (RLS)

Database đã được cấu hình với RLS policies để:
- Users chỉ có thể xem và cập nhật dữ liệu của họ
- Price history là public (read-only)
- Notifications và transactions được bảo vệ

### 5. Authentication

Hiện tại project sử dụng mock authentication với wallet address. Trong production:

1. Tích hợp với wallet providers (MetaMask, WalletConnect, etc.)
2. Sử dụng Supabase Auth hoặc custom JWT
3. Implement proper signature verification

### 6. Storage (Optional)

Nếu cần upload files (KYC documents, avatars):

1. Vào **Storage** trong Supabase Dashboard
2. Tạo bucket: `kyc-documents`, `avatars`
3. Cấu hình storage policies

## Database Schema

### Tables

1. **users** - Thông tin người dùng
2. **transactions** - Lịch sử giao dịch
3. **dca_strategies** - Chiến lược DCA
4. **price_history** - Lịch sử giá
5. **user_portfolios** - Portfolio của users
6. **notifications** - Thông báo
7. **kyc_data** - Dữ liệu KYC
8. **lending_positions** - Vị thế cho vay
9. **borrowing_positions** - Vị thế vay

### Relationships

- Users có nhiều transactions, DCA strategies, notifications
- Price history độc lập (không liên quan đến user)
- Portfolio liên kết với user và token
- KYC data 1-1 với user

## API Usage Examples

### Authentication

```typescript
import { useAuth } from './contexts/DatabaseContext'

const { signInWithWallet, signOut, userProfile, isAuthenticated } = useAuth()

// Sign in
await signInWithWallet('0x...')

// Sign out
await signOut()
```

### Prices

```typescript
import { usePrices } from './contexts/DatabaseContext'

const { latestPrices, getPriceBySymbol } = usePrices()

// Get latest price
const penGxPrice = getPriceBySymbol('PenGx')
```

### Transactions

```typescript
import { TransactionService } from './services/database'

// Create transaction
await TransactionService.createTransaction({
  user_id: userId,
  transaction_hash: '0x...',
  transaction_type: 'buy',
  amount: 1.5,
  token_symbol: 'PenGx',
  price_at_time: 2400.50
})
```

### Real-time Updates

Database context tự động subscribe tới:
- Price updates
- User transactions
- User notifications

## Performance Optimization

### Indexes

Database đã được tạo với các indexes:
- `users.wallet_address`
- `transactions.user_id, transaction_hash, created_at`
- `price_history.token_symbol, timestamp`
- Và nhiều indexes khác

### Caching

Implement caching cho:
- Price data (5-15 giây)
- User portfolios (30 giây)
- Static data (5 phút)

### Pagination

Sử dụng Supabase range queries:

```typescript
.range(offset, offset + limit - 1)
```

## Security

### Row Level Security

- Enabled cho tất cả user tables
- Policies dựa trên JWT claims
- Price history public read-only

### Data Validation

- Input validation ở client và server
- TypeScript types cho type safety
- Database constraints

## Monitoring

### Supabase Dashboard

- Monitor API usage
- Check database performance
- View real-time metrics

### Error Handling

```typescript
import { handleSupabaseError } from './services/database'

try {
  // Database operation
} catch (error) {
  const errorMessage = handleSupabaseError(error)
  // Show user-friendly error
}
```

## Testing

Sử dụng `DatabaseDemo` component để test:

```typescript
import DatabaseDemo from './components/DatabaseDemo'

// Add to your routes for testing
<Route path="/db-demo" element={<DatabaseDemo />} />
```

## Deployment

### Environment Variables

Production environment cần:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- JWT secret cho RLS

### Backup Strategy

1. Automated daily backups (Supabase Pro)
2. Export important data periodically
3. Monitor database size và performance

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Check JWT claims format
2. **Connection Issues**: Verify environment variables
3. **Performance**: Check indexes và query patterns

### Debug Mode

Enable debug logging:

```typescript
// In development
localStorage.setItem('supabase.debug', 'true')
```

## Migration Guide

Khi cần update schema:

1. Create migration file
2. Test trên development
3. Apply production với downtime minimal
4. Update TypeScript types

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Project Discord/Slack channel]
