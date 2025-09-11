import React, { useState } from 'react'
import { useAuth, usePrices, useTransactions, useNotifications } from '../contexts/DatabaseContext'
import { TransactionService, NotificationService, PriceService } from '../services/database'

const DatabaseDemo: React.FC = () => {
  const auth = useAuth()
  const prices = usePrices()
  const transactions = useTransactions()
  const notifications = useNotifications()
  const [testWallet] = useState('0x1234567890abcdef1234567890abcdef12345678')

  const handleLogin = async () => {
    try {
      await auth.signInWithWallet(testWallet)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleCreateTestTransaction = async () => {
    if (!auth.userProfile) return

    try {
      await TransactionService.createTransaction({
        user_id: auth.userProfile.id,
        transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        transaction_type: 'buy',
        amount: 1.5,
        token_symbol: 'PenGx',
        price_at_time: 2400.50,
        gas_fee: 0.005,
        status: 'confirmed',
        metadata: { test: true }
      })
      await transactions.refreshTransactions()
    } catch (error) {
      console.error('Failed to create transaction:', error)
    }
  }

  const handleCreateTestNotification = async () => {
    if (!auth.userProfile) return

    try {
      await NotificationService.createNotification({
        user_id: auth.userProfile.id,
        title: 'Test Notification',
        message: 'This is a test notification from database demo',
        type: 'info'
      })
      await notifications.refreshNotifications()
    } catch (error) {
      console.error('Failed to create notification:', error)
    }
  }

  const handleUpdatePrice = async () => {
    try {
      await PriceService.addPriceRecord({
        token_symbol: 'PenGx',
        price_usd: Math.random() * 100 + 2300,
        price_vnd: Math.random() * 2500000 + 57000000,
        volume_24h: Math.random() * 1000000,
        market_cap: Math.random() * 1000000000 + 2000000000,
        source: 'demo'
      })
      await prices.refreshPrices()
    } catch (error) {
      console.error('Failed to update price:', error)
    }
  }

  if (auth.loading) {
    return <div className="p-4">Loading auth...</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Demo</h1>

      {/* Auth Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        {auth.isAuthenticated ? (
          <div>
            <p className="text-green-600 mb-2">✅ Authenticated</p>
            <p><strong>User ID:</strong> {auth.user?.id}</p>
            <p><strong>Wallet:</strong> {auth.userProfile?.wallet_address}</p>
            <p><strong>KYC Status:</strong> {auth.userProfile?.kyc_status}</p>
            <button
              onClick={auth.signOut}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p className="text-red-600 mb-2">❌ Not authenticated</p>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sign In with Test Wallet
            </button>
          </div>
        )}
        {auth.error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            {auth.error}
          </div>
        )}
      </div>

      {/* Prices Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Prices</h2>
          <button
            onClick={handleUpdatePrice}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Add Random Price
          </button>
        </div>
        {prices.loading ? (
          <p>Loading prices...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(prices.latestPrices).map(([symbol, price]) => (
              <div key={symbol} className="border rounded p-3">
                <h3 className="font-semibold">{symbol}</h3>
                <p>${price.price_usd.toFixed(2)}</p>
                <p>₫{price.price_vnd.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  {new Date(price.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {auth.isAuthenticated && (
        <>
          {/* Transactions Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Transactions</h2>
              <button
                onClick={handleCreateTestTransaction}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Create Test Transaction
              </button>
            </div>
            {transactions.loading ? (
              <p>Loading transactions...</p>
            ) : transactions.transactions.length === 0 ? (
              <p>No transactions found</p>
            ) : (
              <div className="space-y-2">
                {transactions.transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="border rounded p-3 flex justify-between">
                    <div>
                      <p className="font-semibold">{tx.transaction_type.toUpperCase()}</p>
                      <p>{tx.amount} {tx.token_symbol}</p>
                      <p className="text-sm text-gray-500">{tx.transaction_hash.substring(0, 20)}...</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-sm ${
                        tx.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Notifications ({notifications.unreadCount} unread)
              </h2>
              <div className="space-x-2">
                <button
                  onClick={handleCreateTestNotification}
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                >
                  Create Test Notification
                </button>
                {notifications.unreadCount > 0 && (
                  <button
                    onClick={notifications.markAllAsRead}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                  >
                    Mark All Read
                  </button>
                )}
              </div>
            </div>
            {notifications.loading ? (
              <p>Loading notifications...</p>
            ) : notifications.notifications.length === 0 ? (
              <p>No notifications found</p>
            ) : (
              <div className="space-y-2">
                {notifications.notifications.slice(0, 5).map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`border rounded p-3 ${!notif.is_read ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{notif.title}</h3>
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notif.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <button
                          onClick={() => notifications.markAsRead(notif.id)}
                          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DatabaseDemo
