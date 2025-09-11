import { useState, useEffect, useCallback } from 'react'
import { RealtimeService, PriceService, TransactionService, NotificationService } from '../services/database'
import type { DbPriceHistory, DbTransaction, DbNotification } from '../services/database'

interface UseRealtimeDataReturn {
  prices: DbPriceHistory[]
  transactions: DbTransaction[]
  notifications: DbNotification[]
  unreadCount: number
  loading: boolean
  error: string | null
  refreshPrices: () => Promise<void>
  refreshTransactions: () => Promise<void>
  refreshNotifications: () => Promise<void>
  markNotificationAsRead: (id: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
}

export const useRealtimeData = (userId?: string): UseRealtimeDataReturn => {
  const [prices, setPrices] = useState<DbPriceHistory[]>([])
  const [transactions, setTransactions] = useState<DbTransaction[]>([])
  const [notifications, setNotifications] = useState<DbNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        
        // Load price data
        const priceData = await PriceService.getAllTokenPrices()
        setPrices(priceData)

        // Load user-specific data if userId is provided
        if (userId) {
          const [transactionData, notificationData, unreadCountData] = await Promise.all([
            TransactionService.getUserTransactions(userId, 20),
            NotificationService.getUserNotifications(userId, 20),
            NotificationService.getUnreadCount(userId)
          ])

          setTransactions(transactionData)
          setNotifications(notificationData)
          setUnreadCount(unreadCountData)
        }

      } catch (err: any) {
        console.error('Error loading initial data:', err)
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [userId])

  // Set up real-time subscriptions
  useEffect(() => {
    const subscriptions: any[] = []

    // Subscribe to price updates
    const priceSubscription = RealtimeService.subscribeToPriceUpdates((payload) => {
      console.log('Price update received:', payload)
      if (payload.new) {
        setPrices(prev => [payload.new, ...prev.slice(0, 99)]) // Keep last 100 records
      }
    })
    subscriptions.push(priceSubscription)

    // Subscribe to user-specific data if userId is provided
    if (userId) {
      // Subscribe to user transactions
      const transactionSubscription = RealtimeService.subscribeToUserTransactions(userId, (payload) => {
        console.log('Transaction update received:', payload)
        if (payload.eventType === 'INSERT' && payload.new) {
          setTransactions(prev => [payload.new, ...prev.slice(0, 19)]) // Keep last 20 records
        } else if (payload.eventType === 'UPDATE' && payload.new) {
          setTransactions(prev => prev.map(tx => 
            tx.id === payload.new.id ? payload.new : tx
          ))
        }
      })
      subscriptions.push(transactionSubscription)

      // Subscribe to notifications
      const notificationSubscription = RealtimeService.subscribeToNotifications(userId, (payload) => {
        console.log('Notification received:', payload)
        if (payload.new) {
          setNotifications(prev => [payload.new, ...prev.slice(0, 19)]) // Keep last 20 records
          setUnreadCount(prev => prev + 1)
        }
      })
      subscriptions.push(notificationSubscription)
    }

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach(subscription => {
        if (subscription && typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe()
        }
      })
    }
  }, [userId])

  const refreshPrices = useCallback(async () => {
    try {
      const priceData = await PriceService.getAllTokenPrices()
      setPrices(priceData)
    } catch (err: any) {
      console.error('Error refreshing prices:', err)
      setError(err.message || 'Failed to refresh prices')
    }
  }, [])

  const refreshTransactions = useCallback(async () => {
    if (!userId) return

    try {
      const transactionData = await TransactionService.getUserTransactions(userId, 20)
      setTransactions(transactionData)
    } catch (err: any) {
      console.error('Error refreshing transactions:', err)
      setError(err.message || 'Failed to refresh transactions')
    }
  }, [userId])

  const refreshNotifications = useCallback(async () => {
    if (!userId) return

    try {
      const [notificationData, unreadCountData] = await Promise.all([
        NotificationService.getUserNotifications(userId, 20),
        NotificationService.getUnreadCount(userId)
      ])
      setNotifications(notificationData)
      setUnreadCount(unreadCountData)
    } catch (err: any) {
      console.error('Error refreshing notifications:', err)
      setError(err.message || 'Failed to refresh notifications')
    }
  }, [userId])

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId)
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err: any) {
      console.error('Error marking notification as read:', err)
      setError(err.message || 'Failed to mark notification as read')
    }
  }, [])

  const markAllNotificationsAsRead = useCallback(async () => {
    if (!userId) return

    try {
      await NotificationService.markAllAsRead(userId)
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
      setUnreadCount(0)
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err)
      setError(err.message || 'Failed to mark all notifications as read')
    }
  }, [userId])

  return {
    prices,
    transactions,
    notifications,
    unreadCount,
    loading,
    error,
    refreshPrices,
    refreshTransactions,
    refreshNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  }
}
