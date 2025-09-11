#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocvabtyyhczgupqhvsmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdmFidHl5aGN6Z3VwcWh2c21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODc4ODEsImV4cCI6MjA3MTc2Mzg4MX0.cBsnx5SzwtRC8HH7LvTkw6fP2-j0QSirXsKn3ZUcYfE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testTables() {
  console.log('🔍 Testing database tables...\n')
  
  const expectedTables = [
    'users',
    'transactions', 
    'dca_strategies',
    'price_history',
    'user_portfolios',
    'notifications',
    'kyc_data',
    'lending_positions',
    'borrowing_positions'
  ]
  
  for (const tableName of expectedTables) {
    try {
      console.log(`📋 Testing table: ${tableName}`)
      
      // Test if table exists by trying to select from it
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .limit(1)
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`)
      } else {
        console.log(`   ✅ Table exists (${count || 0} rows)`)
      }
    } catch (err) {
      console.log(`   ❌ Exception: ${err.message}`)
    }
  }
  
  console.log('\n🧪 Testing basic operations...')
  
  // Test insert into price_history (should be allowed)
  try {
    const { data, error } = await supabase
      .from('price_history')
      .insert({
        token_symbol: 'TEST',
        price_usd: 1.0,
        price_vnd: 25000,
        source: 'test'
      })
      .select()
    
    if (error) {
      console.log(`   ❌ Insert test failed: ${error.message}`)
    } else {
      console.log(`   ✅ Insert test successful`)
      
      // Clean up test data
      if (data && data[0]) {
        await supabase
          .from('price_history')
          .delete()
          .eq('id', data[0].id)
      }
    }
  } catch (err) {
    console.log(`   ❌ Insert test exception: ${err.message}`)
  }
  
  console.log('\n🎉 Database test completed!')
}

testTables()
