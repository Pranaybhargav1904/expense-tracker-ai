/**
 * Test script to verify database operations
 * Run with: npx tsx --env-file=.env.local test-database.ts
 */

import { completeWorkflowExample } from './src/app/lib/db/examples';

async function runTests() {
  console.log('🚀 Starting database test...\n');
  
  try {
    const user = await completeWorkflowExample();
    console.log('\n✅ Test completed successfully!');
    console.log('👤 Created user:', user);
    console.log('\n💡 Check your Supabase dashboard to see the data!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();

