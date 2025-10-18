import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data, error } = await supabase.from('users').select('*').limit(1)

  if (error) {
    return Response.json({ status: 'error', error })
  }

  return Response.json({ status: 'success', data })
}
