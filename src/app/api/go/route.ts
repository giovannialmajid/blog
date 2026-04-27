import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const supabase = await createClient()

  // Find the affiliate link
  const { data: link, error } = await supabase
    .from('affiliate_links')
    .select('affiliate_url, click_count')
    .eq('id', id)
    .single()

  if (error || !link) {
    console.error('Affiliate link not found:', id)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Increment click count (in background)
  // Need to bypass RLS or use a secure rpc if RLS prevents update
  // For now, we will attempt to update directly
  await supabase
    .from('affiliate_links')
    .update({ click_count: link.click_count + 1 })
    .eq('id', id)

  // Redirect to the affiliate URL
  // Append wid parameter if required for Mercado Livre tracking, assuming it's done during link creation
  return NextResponse.redirect(link.affiliate_url)
}
