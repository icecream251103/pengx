import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    env: import.meta.env.MODE
  });
  
  // In development, provide helpful error message
  if (import.meta.env.DEV) {
    throw new Error(`
Missing Supabase environment variables:
- VITE_SUPABASE_URL: ${supabaseUrl ? '✓' : '✗'}
- VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✓' : '✗'}

Please check your .env file and ensure these variables are set.
See .env.example for reference.
    `);
  }
  
  // In production, throw a simpler error
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Graceful fallback for when Supabase is not configured
export const withSupabaseCheck = (fn: Function) => {
  return (...args: any[]) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping operation');
      return Promise.resolve(null);
    }
    return fn(...args);
  };
};

// Database table names
export const TABLES = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  DCA_STRATEGIES: 'dca_strategies',
  PRICE_HISTORY: 'price_history',
  USER_PORTFOLIOS: 'user_portfolios',
  NOTIFICATIONS: 'notifications',
  KYC_DATA: 'kyc_data',
  LENDING_POSITIONS: 'lending_positions',
  BORROWING_POSITIONS: 'borrowing_positions'
} as const

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          email?: string
          created_at: string
          updated_at: string
          kyc_status: 'pending' | 'approved' | 'rejected'
          kyc_level: number
          is_active: boolean
          last_login?: string
          profile_data?: any
        }
        Insert: {
          id?: string
          wallet_address: string
          email?: string
          created_at?: string
          updated_at?: string
          kyc_status?: 'pending' | 'approved' | 'rejected'
          kyc_level?: number
          is_active?: boolean
          last_login?: string
          profile_data?: any
        }
        Update: {
          id?: string
          wallet_address?: string
          email?: string
          created_at?: string
          updated_at?: string
          kyc_status?: 'pending' | 'approved' | 'rejected'
          kyc_level?: number
          is_active?: boolean
          last_login?: string
          profile_data?: any
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          transaction_hash: string
          transaction_type: 'buy' | 'sell' | 'transfer' | 'dca' | 'lending' | 'borrowing'
          amount: number
          token_symbol: string
          price_at_time: number
          gas_fee: number
          status: 'pending' | 'confirmed' | 'failed'
          created_at: string
          updated_at: string
          metadata?: any
        }
        Insert: {
          id?: string
          user_id: string
          transaction_hash: string
          transaction_type: 'buy' | 'sell' | 'transfer' | 'dca' | 'lending' | 'borrowing'
          amount: number
          token_symbol: string
          price_at_time: number
          gas_fee?: number
          status?: 'pending' | 'confirmed' | 'failed'
          created_at?: string
          updated_at?: string
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          transaction_hash?: string
          transaction_type?: 'buy' | 'sell' | 'transfer' | 'dca' | 'lending' | 'borrowing'
          amount?: number
          token_symbol?: string
          price_at_time?: number
          gas_fee?: number
          status?: 'pending' | 'confirmed' | 'failed'
          created_at?: string
          updated_at?: string
          metadata?: any
        }
      }
      dca_strategies: {
        Row: {
          id: string
          user_id: string
          token_symbol: string
          amount_per_period: number
          frequency: 'daily' | 'weekly' | 'monthly'
          is_active: boolean
          next_execution: string
          total_invested: number
          total_tokens_acquired: number
          created_at: string
          updated_at: string
          metadata?: any
        }
        Insert: {
          id?: string
          user_id: string
          token_symbol: string
          amount_per_period: number
          frequency: 'daily' | 'weekly' | 'monthly'
          is_active?: boolean
          next_execution: string
          total_invested?: number
          total_tokens_acquired?: number
          created_at?: string
          updated_at?: string
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          token_symbol?: string
          amount_per_period?: number
          frequency?: 'daily' | 'weekly' | 'monthly'
          is_active?: boolean
          next_execution?: string
          total_invested?: number
          total_tokens_acquired?: number
          created_at?: string
          updated_at?: string
          metadata?: any
        }
      }
      price_history: {
        Row: {
          id: string
          token_symbol: string
          price_usd: number
          price_vnd: number
          volume_24h: number
          market_cap: number
          timestamp: string
          source: string
        }
        Insert: {
          id?: string
          token_symbol: string
          price_usd: number
          price_vnd: number
          volume_24h?: number
          market_cap?: number
          timestamp?: string
          source: string
        }
        Update: {
          id?: string
          token_symbol?: string
          price_usd?: number
          price_vnd?: number
          volume_24h?: number
          market_cap?: number
          timestamp?: string
          source?: string
        }
      }
      user_portfolios: {
        Row: {
          id: string
          user_id: string
          token_symbol: string
          balance: number
          locked_balance: number
          average_cost: number
          total_invested: number
          unrealized_pnl: number
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          token_symbol: string
          balance: number
          locked_balance?: number
          average_cost?: number
          total_invested?: number
          unrealized_pnl?: number
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          token_symbol?: string
          balance?: number
          locked_balance?: number
          average_cost?: number
          total_invested?: number
          unrealized_pnl?: number
          last_updated?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'error' | 'success'
          is_read: boolean
          created_at: string
          metadata?: any
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'error' | 'success'
          is_read?: boolean
          created_at?: string
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'error' | 'success'
          is_read?: boolean
          created_at?: string
          metadata?: any
        }
      }
      kyc_data: {
        Row: {
          id: string
          user_id: string
          full_name: string
          id_number: string
          phone_number: string
          address: string
          id_front_image: string
          id_back_image: string
          selfie_image: string
          status: 'pending' | 'approved' | 'rejected'
          rejection_reason?: string
          submitted_at: string
          reviewed_at?: string
          reviewer_id?: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          id_number: string
          phone_number: string
          address: string
          id_front_image: string
          id_back_image: string
          selfie_image: string
          status?: 'pending' | 'approved' | 'rejected'
          rejection_reason?: string
          submitted_at?: string
          reviewed_at?: string
          reviewer_id?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          id_number?: string
          phone_number?: string
          address?: string
          id_front_image?: string
          id_back_image?: string
          selfie_image?: string
          status?: 'pending' | 'approved' | 'rejected'
          rejection_reason?: string
          submitted_at?: string
          reviewed_at?: string
          reviewer_id?: string
        }
      }
      lending_positions: {
        Row: {
          id: string
          user_id: string
          token_symbol: string
          amount: number
          annual_rate: number
          start_date: string
          end_date?: string
          status: 'active' | 'completed' | 'cancelled'
          earned_interest: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token_symbol: string
          amount: number
          annual_rate: number
          start_date: string
          end_date?: string
          status?: 'active' | 'completed' | 'cancelled'
          earned_interest?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token_symbol?: string
          amount?: number
          annual_rate?: number
          start_date?: string
          end_date?: string
          status?: 'active' | 'completed' | 'cancelled'
          earned_interest?: number
          created_at?: string
          updated_at?: string
        }
      }
      borrowing_positions: {
        Row: {
          id: string
          user_id: string
          collateral_token: string
          collateral_amount: number
          borrowed_token: string
          borrowed_amount: number
          interest_rate: number
          liquidation_threshold: number
          health_factor: number
          start_date: string
          due_date: string
          status: 'active' | 'repaid' | 'liquidated'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          collateral_token: string
          collateral_amount: number
          borrowed_token: string
          borrowed_amount: number
          interest_rate: number
          liquidation_threshold: number
          health_factor: number
          start_date: string
          due_date: string
          status?: 'active' | 'repaid' | 'liquidated'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          collateral_token?: string
          collateral_amount?: number
          borrowed_token?: string
          borrowed_amount?: number
          interest_rate?: number
          liquidation_threshold?: number
          health_factor?: number
          start_date?: string
          due_date?: string
          status?: 'active' | 'repaid' | 'liquidated'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
