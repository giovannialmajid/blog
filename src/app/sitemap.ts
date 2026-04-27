import { createClient } from '@/utils/supabase/server'

export default async function sitemap() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const postEntries = (posts ?? []).map((post) => ({
    url: `https://blog.neksti.com.br/post/${post.slug}`,
    lastModified: post.updated_at || post.published_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://blog.neksti.com.br',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://blog.neksti.com.br/sobre',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...postEntries,
  ]
}
