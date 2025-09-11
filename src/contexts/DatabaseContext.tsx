import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { useRealtimeData } from '../hooks/useRealtimeData'
import type { User, Session } from '@supabase/supabase-js'
import type { DbUser, DbPriceHistory, DbTransaction, DbNotification } from '../services/database'

interface DatabaseContextType {
  // Auth data
  user: User | null
  session: Session | null
  userProfile: DbUser | null
  authLoading: boolean
  authError: string | null
  
  // Realtime data
  prices: DbPriceHistory[]
  transactions: DbTransaction[]
  notifications: DbNotification[]
  unreadCount: number
  dataLoading: boolean
  dataError: string | null
  
  // Auth methods
  signInWithWallet: (walletAddress: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<DbUser>) => Promise<void>
  clearAuthError: () => void
  
  // Data methods
  refreshPrices: () => Promise<void>
  refreshTransactions: () => Promise<void>
  refreshNotifications: () => Promise<void>
  markNotificationAsRead: (id: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

interface DatabaseProviderProps {
  children: ReactNode
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const {
    user,
    session,
    userProfile,
    loading: authLoading,
    error: authError,
    signInWithWallet,
    signOut,
    updateProfile,
    clearError: clearAuthError
  } = useSupabaseAuth()

  const {
    prices,
    transactions,
    notifications,
    unreadCount,
    loading: dataLoading,
    error: dataError,
    refreshPrices,
    refreshTransactions,
    refreshNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useRealtimeData(userProfile?.id)

  // Log connection status for debugging
  useEffect(() => {
    if (user && userProfile) {
      console.log('User authenticated:', {
        userId: user.id,
        walletAddress: userProfile.wallet_address,
        kycStatus: userProfile.kyc_status
      })
    }
  }, [user, userProfile])

  const contextValue: DatabaseContextType = {
    // Auth data
    user,
    session,
    userProfile,
    authLoading,
    authError,
    
    // Realtime data
    prices,
    transactions,
    notifications,
    unreadCount,
    dataLoading,
    dataError,
    
    // Auth methods
    signInWithWallet,
    signOut,
    updateProfile,
    clearAuthError,
    
    // Data methods
    refreshPrices,
    refreshTransactions,
    refreshNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  }

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  )
}

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext)
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return context
}

// Helper hooks for specific data
export const useAuth = () => {
  const { 
    user, 
    session, 
    userProfile, 
    authLoading, 
    authError, 
    signInWithWallet, 
    signOut, 
    updateProfile, 
    clearAuthError 
  } = useDatabase()
  
  return {
    user,
    session,
    userProfile,
    loading: authLoading,
    error: authError,
    isAuthenticated: !!user && !!userProfile,
    isKycApproved: userProfile?.kyc_status === 'approved',
    signInWithWallet,
    signOut,
    updateProfile,
    clearError: clearAuthError
  }
}

export const usePrices = () => {
  const { prices, dataLoading, refreshPrices } = useDatabase()
  
  // Get latest price for each token
  const latestPrices = prices.reduce((acc, price) => {
    if (!acc[price.token_symbol] || new Date(price.timestamp) > new Date(acc[price.token_symbol].timestamp)) {
      acc[price.token_symbol] = price
    }
    return acc
  }, {} as Record<string, DbPriceHistory>)
  
  return {
    prices,
    latestPrices,
    loading: dataLoading,
    refreshPrices,
    getPriceBySymbol: (symbol: string) => latestPrices[symbol],
    getPriceHistory: (symbol: string) => prices.filter(p => p.token_symbol === symbol)
  }
}

export const useTransactions = () => {
  const { transactions, dataLoading, refreshTransactions } = useDatabase()
  
  return {
    transactions,
    loading: dataLoading,
    refreshTransactions,
    getTransactionsByType: (type: string) => transactions.filter(tx => tx.transaction_type === type),
    getPendingTransactions: () => transactions.filter(tx => tx.status === 'pending'),
    getConfirmedTransactions: () => transactions.filter(tx => tx.status === 'confirmed')
  }
}

export const useNotifications = () => {
  const { 
    notifications, 
    unreadCount, 
    dataLoading, 
    refreshNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useDatabase()
  
  return {
    notifications,
    unreadCount,
    loading: dataLoading,
    refreshNotifications,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    getUnreadNotifications: () => notifications.filter(n => !n.is_read),
    getNotificationsByType: (type: string) => notifications.filter(n => n.type === type)
  }
}
