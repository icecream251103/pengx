#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocvabtyyhczgupqhvsmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdmFidHl5aGN6Z3VwcWh2c21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODc4ODEsImV4cCI6MjA3MTc2Mzg4MX0.cBsnx5SzwtRC8HH7LvTkw6fP2-j0QSirXsKn3ZUcYfE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedData() {
  console.log('🌱 Seeding database with sample data...\n')
  
  try {
    // Tạo sample users
    console.log('👤 Creating sample users...')
    const { data: users, error: userError } = await supabase
      .from('users')
      .upsert([
        {
          wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
          email: 'user1@pentagold.com',
          kyc_status: 'approved',
          kyc_level: 2
        },
        {
          wallet_address: '0xabcdef1234567890abcdef1234567890abcdef12',
          email: 'user2@pentagold.com',
          kyc_status: 'pending',
          kyc_level: 0
        }
      ], { 
        onConflict: 'wallet_address',
        ignoreDuplicates: false 
      })
      .select()
    
    if (userError) {
      console.log(`   ❌ User creation failed: ${userError.message}`)
      return
    }
    console.log(`   ✅ Created ${users?.length || 0} users`)
    
    // Tạo sample price history (public table, should work)
    console.log('💰 Creating sample price data...')
    const { data: prices, error: priceError } = await supabase
      .from('price_history')
      .upsert([
        {
          token_symbol: 'PenGx',
          price_usd: 2400.50,
          price_vnd: 59000000,
          volume_24h: 1000000,
          market_cap: 2400000000,
          source: 'oracle'
        },
        {
          token_symbol: 'PenSx', 
          price_usd: 28.75,
          price_vnd: 700000,
          volume_24h: 500000,
          market_cap: 28750000,
          source: 'oracle'
        },
        {
          token_symbol: 'PenPx',
          price_usd: 950.25,
          price_vnd: 23500000,
          volume_24h: 200000,
          market_cap: 950250000,
          source: 'oracle'
        }
      ], { 
        onConflict: 'id',
        ignoreDuplicates: true 
      })
      .select()
    
    if (priceError) {
      console.log(`   ❌ Price creation failed: ${priceError.message}`)
    } else {
      console.log(`   ✅ Created/updated ${prices?.length || 0} price records`)
    }
    
    // Test reading data
    console.log('\n📊 Testing data retrieval...')
    
    const { data: allUsers, error: readUserError } = await supabase
      .from('users')
      .select('wallet_address, kyc_status, created_at')
    
    if (readUserError) {
      console.log(`   ❌ Reading users failed: ${readUserError.message}`)
    } else {
      console.log(`   ✅ Found ${allUsers?.length || 0} users in database`)
      allUsers?.forEach(user => {
        console.log(`      - ${user.wallet_address} (${user.kyc_status})`)
      })
    }
    
    const { data: allPrices, error: readPriceError } = await supabase
      .from('price_history')
      .select('token_symbol, price_usd, timestamp')
      .order('timestamp', { ascending: false })
      .limit(5)
    
    if (readPriceError) {
      console.log(`   ❌ Reading prices failed: ${readPriceError.message}`)
    } else {
      console.log(`   ✅ Found ${allPrices?.length || 0} recent price records`)
      allPrices?.forEach(price => {
        console.log(`      - ${price.token_symbol}: $${price.price_usd}`)
      })
    }
    
    console.log('\n🎉 Database seeding completed!')
    console.log('\n📱 Next steps:')
    console.log('1. Visit http://localhost:5174/db-demo to test the full application')
    console.log('2. Try signing in with: 0x1234567890abcdef1234567890abcdef12345678')
    console.log('3. Test creating transactions and notifications')
    
  } catch (err) {
    console.error('❌ Seeding failed:', err.message)
  }
}

seedData()
