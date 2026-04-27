import { createClient } from '@/utils/supabase/server'
import { unstable_cache } from 'next/cache'
import { Card } from '@/components/Card'
import { TrendingUp, Star, Zap } from 'lucide-react'

const getPublishedPosts = unstable_cache(
  async () => {
    const supabase = await createClient()
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, featured_image, content_md, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(12)
    return data ?? []
  },
  ['published-posts'],
  { tags: ['posts'], revalidate: 60 }
)

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const posts = await getPublishedPosts()

  return (
    <>
      {/* Hero */}
      <section className="mb-12 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Reviews que ajudam você a{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              comprar melhor
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Análises honestas e diretas dos melhores produtos disponíveis no
            Mercado Livre. Sem enrolação, só o que importa.
          </p>
        </div>
      </section>

      {/* Features strip */}
      <section className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Análises Detalhadas</p>
            <p className="text-xs text-slate-500">Prós, contras e especificações</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Melhores Preços</p>
            <p className="text-xs text-slate-500">Links diretos do Mercado Livre</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Sempre Atualizado</p>
            <p className="text-xs text-slate-500">Conteúdo revisado regularmente</p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Últimos Reviews</h2>
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post.id}
                title={post.title}
                slug={post.slug}
                imageUrl={post.featured_image ?? undefined}
                date={post.published_at ?? ''}
                summary={
                  post.content_md
                    ? post.content_md.substring(0, 150).replace(/[#*_\[\]]/g, '') + '...'
                    : ''
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
            <div className="mb-4 rounded-full bg-yellow-100 p-4">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              Nenhum review publicado ainda
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Os primeiros reviews estão sendo preparados. Volte em breve!
            </p>
          </div>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Neksti Reviews',
            url: 'https://blog.neksti.com.br',
            description: 'Análises honestas dos melhores produtos do Mercado Livre.',
            inLanguage: 'pt-BR',
          }),
        }}
      />
    </>
  )
}
