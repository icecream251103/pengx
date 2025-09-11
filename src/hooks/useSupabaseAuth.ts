import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { UserService, NotificationService, handleSupabaseError } from '../services/database'
import type { User, Session } from '@supabase/supabase-js'
import type { DbUser } from '../services/database'

interface UseSupabaseAuthReturn {
  user: User | null
  session: Session | null
  userProfile: DbUser | null
  loading: boolean
  error: string | null
  signInWithWallet: (walletAddress: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<DbUser>) => Promise<void>
  clearError: () => void
}

export const useSupabaseAuth = (): UseSupabaseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<DbUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await UserService.getUserByWallet(userId)
      setUserProfile(profile)
    } catch (err: any) {
      console.error('Error loading user profile:', err)
      setError(handleSupabaseError(err))
    }
  }

  const signInWithWallet = useCallback(async (walletAddress: string) => {
    try {
      setLoading(true)
      setError(null)

      // Check if user exists
      let userProfile = await UserService.getUserByWallet(walletAddress)

      // Create user if doesn't exist
      if (!userProfile) {
        userProfile = await UserService.createUser({
          wallet_address: walletAddress,
          kyc_status: 'pending',
          kyc_level: 0,
          is_active: true
        })

        // Create welcome notification
        await NotificationService.createNotification({
          user_id: userProfile.id,
          title: 'Chào mừng đến với PentaGold!',
          message: 'Tài khoản của bạn đã được tạo thành công. Hãy hoàn thành quá trình KYC để sử dụng đầy đủ tính năng.',
          type: 'info'
        })
      }

      // Update last login
      await UserService.updateLastLogin(userProfile.id)

      // For development, we'll simulate auth by setting user data
      // In production, you would integrate with your wallet authentication
      const mockSession = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        refresh_token: 'mock-refresh',
        user: {
          id: userProfile.id,
          aud: 'authenticated',
          role: 'authenticated',
          email: userProfile.email || '',
          created_at: userProfile.created_at,
          confirmed_at: userProfile.created_at,
          user_metadata: {
            wallet_address: walletAddress
          },
          app_metadata: {}
        }
      }

      // Set session and user
      setSession(mockSession as any)
      setUser(mockSession.user as any)
      setUserProfile(userProfile)

    } catch (err: any) {
      console.error('Error signing in:', err)
      setError(handleSupabaseError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // In production, use: await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      setUserProfile(null)

    } catch (err: any) {
      console.error('Error signing out:', err)
      setError(handleSupabaseError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<DbUser>) => {
    if (!userProfile) return

    try {
      setError(null)
      const updatedProfile = await UserService.updateUser(userProfile.id, updates)
      setUserProfile(updatedProfile)
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(handleSupabaseError(err))
    }
  }, [userProfile])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    session,
    userProfile,
    loading,
    error,
    signInWithWallet,
    signOut,
    updateProfile,
    clearError
  }
}
