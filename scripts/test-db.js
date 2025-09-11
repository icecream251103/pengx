#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocvabtyyhczgupqhvsmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdmFidHl5aGN6Z3VwcWh2c21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODc4ODEsImV4cCI6MjA3MTc2Mzg4MX0.cBsnx5SzwtRC8HH7LvTkw6fP2-j0QSirXsKn3ZUcYfE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...')
    
    // Test basic connection with a simple query
    const { data, error } = await supabase
      .rpc('version')
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      
      // Try alternative test
      console.log('🔄 Trying alternative connection test...')
      const { data: authData, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        console.error('❌ Auth test also failed:', authError.message)
        return false
      } else {
        console.log('✅ Alternative connection successful!')
        return true
      }
    }
    
    console.log('✅ Connection successful!')
    console.log('📋 Database version:', data)
    
    return true
  } catch (err) {
    console.error('❌ Connection error:', err.message)
    
    // Final test - just try to create client
    try {
      console.log('🔄 Testing basic client creation...')
      const testClient = createClient(supabaseUrl, supabaseKey)
      console.log('✅ Client created successfully!')
      console.log('🔗 Supabase URL:', supabaseUrl)
      console.log('🔑 API Key length:', supabaseKey.length)
      return true
    } catch (clientError) {
      console.error('❌ Client creation failed:', clientError.message)
      return false
    }
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Database is ready! You can now:')
    console.log('1. Go to http://localhost:5174/db-demo to test the database')
    console.log('2. Copy the SQL from database/schema.sql and run it in Supabase SQL Editor')
    console.log('3. Visit your Supabase dashboard: https://app.supabase.com/project/ocvabtyyhczgupqhvsmp')
  } else {
    console.log('\n❌ Please check your Supabase credentials and try again')
  }
})
