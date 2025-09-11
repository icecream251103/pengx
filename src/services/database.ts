import { supabase, TABLES, Database } from '../lib/supabase'
import type { PostgrestError } from '@supabase/supabase-js'

export type DbUser = Database['public']['Tables']['users']['Row']
export type DbTransaction = Database['public']['Tables']['transactions']['Row']
export type DbDcaStrategy = Database['public']['Tables']['dca_strategies']['Row']
export type DbPriceHistory = Database['public']['Tables']['price_history']['Row']
export type DbUserPortfolio = Database['public']['Tables']['user_portfolios']['Row']
export type DbNotification = Database['public']['Tables']['notifications']['Row']
export type DbKycData = Database['public']['Tables']['kyc_data']['Row']
export type DbLendingPosition = Database['public']['Tables']['lending_positions']['Row']
export type DbBorrowingPosition = Database['public']['Tables']['borrowing_positions']['Row']

// User management
export class UserService {
  static async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert(userData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserByWallet(walletAddress: string) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateLastLogin(userId: string) {
    const { error } = await supabase
      .from(TABLES.USERS)
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId)

    if (error) throw error
  }
}

// Transaction management
export class TransactionService {
  static async createTransaction(transactionData: Database['public']['Tables']['transactions']['Insert']) {
    const { data, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .insert(transactionData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserTransactions(userId: string, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data
  }

  static async updateTransactionStatus(transactionId: string, status: 'pending' | 'confirmed' | 'failed') {
    const { data, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .update({ status })
      .eq('id', transactionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getTransactionByHash(hash: string) {
    const { data, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .select('*')
      .eq('transaction_hash', hash)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}

// DCA Strategy management
export class DcaService {
  static async createStrategy(strategyData: Database['public']['Tables']['dca_strategies']['Insert']) {
    const { data, error } = await supabase
      .from(TABLES.DCA_STRATEGIES)
      .insert(strategyData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserStrategies(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.DCA_STRATEGIES)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async updateStrategy(strategyId: string, updates: Database['public']['Tables']['dca_strategies']['Update']) {
    const { data, error } = await supabase
      .from(TABLES.DCA_STRATEGIES)
      .update(updates)
      .eq('id', strategyId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getActiveStrategies() {
    const { data, error } = await supabase
      .from(TABLES.DCA_STRATEGIES)
      .select('*')
      .eq('is_active', true)
      .lte('next_execution', new Date().toISOString())

    if (error) throw error
    return data
  }

  static async deleteStrategy(strategyId: string) {
    const { error } = await supabase
      .from(TABLES.DCA_STRATEGIES)
      .delete()
      .eq('id', strategyId)

    if (error) throw error
  }
}

// Price History management
export class PriceService {
  static async addPriceRecord(priceData: Database['public']['Tables']['price_history']['Insert']) {
    const { data, error } = await supabase
      .from(TABLES.PRICE_HISTORY)
      .insert(priceData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getLatestPrice(tokenSymbol: string) {
    const { data, error } = await supabase
      .from(TABLES.PRICE_HISTORY)
      .select('*')
      .eq('token_symbol', tokenSymbol)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async getPriceHistory(tokenSymbol: string, hours = 24) {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
    
    const { data, error } = await supabase
      .from(TABLES.PRICE_HISTORY)
      .select('*')
      .eq('token_symbol', tokenSymbol)
      .gte('timestamp', startTime)
      .order('timestamp', { ascending: true })

    if (error) throw error
    return data
  }

  static async getAllTokenPrices() {
    const { data, error } = await supabase
      .from(TABLES.PRICE_HISTORY)
      .select('*')
      .in('token_symbol', ['PenGx', 'PenSx', 'PenPx'])
      .order('timestamp', { ascending: false })

    if (error) throw error
    return data
  }
}

// Portfolio management
export class PortfolioService {
  static async getUserPortfolio(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.USER_PORTFOLIOS)
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }

  static async updatePortfolio(portfolioData: Database['public']['Tables']['user_portfolios']['Insert']) {
    const { data, error } = await supabase
      .from(TABLES.USER_PORTFOLIOS)
      .upsert(portfolioData, { onConflict: 'user_id,token_symbol' })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getTokenBalance(userId: string, tokenSymbol: string) {
    const { data, error } = await supabase
      .from(TABLES.USER_PORTFOLIOS)
      .select('*')
      .eq('user_id', userId)
      .eq('token_symbol', tokenSymbol)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}

// Notification management
export class NotificationService {
  static async createNotification(notificationData: Database['public']['Tables']['notifications']['Insert']) {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .insert(notificationData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserNotifications(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  static async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error
  }

  static async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
  }

  static async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return count || 0
  }
}

// KYC management
export class KycService {
  static async submitKyc(kycData: Database['public']['Tables']['kyc_data']['Insert']) {
    const { data, error } = await supabase
      .from(TABLES.KYC_DATA)
      .insert(kycData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserKyc(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.KYC_DATA)
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async updateKycStatus(
    kycId: string, 
    status: 'pending' | 'approved' | 'rejected',
    rejectionReason?: string,
    reviewerId?: string
  ) {
    const updates: any = {
      status,
      reviewed_at: new Date().toISOString()
    }

    if (rejectionReason) updates.rejection_reason = rejectionReason
    if (reviewerId) updates.reviewer_id = reviewerId

    const { data, error } = await supabase
      .from(TABLES.KYC_DATA)
      .update(updates)
      .eq('id', kycId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Lending service
export class LendingService {
  static async createLendingPosition(positionData: Database['public']['Tables']['lending_positions']['Insert']) {
    const { data, error } = await supabase
      .from(TABLES.LENDING_POSITIONS)
      .insert(positionData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserLendingPositions(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.LENDING_POSITIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async updateLendingPosition(positionId: string, updates: Database['public']['Tables']['lending_positions']['Update']) {
    const { data, error } = await supabase
      .from(TABLES.LENDING_POSITIONS)
      .update(updates)
      .eq('id', positionId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Borrowing service
export class BorrowingService {
  static async createBorrowingPosition(positionData: Database['public']['Tables']['borrowing_positions']['Insert']) {
    const { data, error } = await supabase
      .from(TABLES.BORROWING_POSITIONS)
      .insert(positionData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserBorrowingPositions(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.BORROWING_POSITIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async updateBorrowingPosition(positionId: string, updates: Database['public']['Tables']['borrowing_positions']['Update']) {
    const { data, error } = await supabase
      .from(TABLES.BORROWING_POSITIONS)
      .update(updates)
      .eq('id', positionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getPositionsNearLiquidation(threshold = 1.2) {
    const { data, error } = await supabase
      .from(TABLES.BORROWING_POSITIONS)
      .select('*')
      .eq('status', 'active')
      .lte('health_factor', threshold)

    if (error) throw error
    return data
  }
}

// Error handling utilities
export const handleSupabaseError = (error: PostgrestError) => {
  console.error('Supabase error:', error)
  
  switch (error.code) {
    case 'PGRST116':
      return 'Không tìm thấy dữ liệu'
    case '23505':
      return 'Dữ liệu đã tồn tại'
    case '23503':
      return 'Dữ liệu tham chiếu không hợp lệ'
    case '42501':
      return 'Không có quyền truy cập'
    default:
      return error.message || 'Đã xảy ra lỗi không xác định'
  }
}

// Real-time subscriptions
export class RealtimeService {
  static subscribeToUserTransactions(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-transactions-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.TRANSACTIONS,
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  static subscribeToPriceUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('price-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: TABLES.PRICE_HISTORY
        },
        callback
      )
      .subscribe()
  }

  static subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: TABLES.NOTIFICATIONS,
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }
}
