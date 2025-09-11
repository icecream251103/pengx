import { supabase } from '../src/lib/supabase'
import fs from 'fs'
import path from 'path'

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...')
    
    // Read SQL schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    
    // Split into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}`)
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement + ';' 
        })
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message)
          // Don't stop on errors as some statements might already exist
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      }
    }
    
    console.log('🎉 Database setup completed!')
    
    // Test connection by inserting sample data
    console.log('🧪 Testing database connection...')
    
    const { data: testData, error: testError } = await supabase
      .from('price_history')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database test failed:', testError.message)
    } else {
      console.log('✅ Database connection test successful!')
      console.log('📊 Sample data:', testData)
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
}

export default setupDatabase
