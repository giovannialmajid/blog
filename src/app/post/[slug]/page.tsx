import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { AffiliateCTA } from '@/components/AffiliateCTA'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { Calendar, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content_md, featured_image')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) return { title: 'Post não encontrado' }

  const { data: meta } = await supabase
    .from('metadata')
    .select('seo_title, seo_description, og_image, tags')
    .eq('post_id', post.id)
    .single()

  const title = meta?.seo_title || post.title
  const description = meta?.seo_description || post.content_md?.substring(0, 160).replace(/[#*_\[\]]/g, '') || ''
  const ogImage = meta?.og_image || post.featured_image

  return {
    title: `${title} | Neksti Reviews`,
    description,
    keywords: meta?.tags?.join(', '),
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'pt_BR',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  const { data: meta } = await supabase
    .from('metadata')
    .select('*')
    .eq('post_id', post.id)
    .single()

  const { data: affiliateLinks } = await supabase
    .from('affiliate_links')
    .select('*')
    .eq('post_id', post.id)

  const readingTime = Math.ceil((post.content_md?.split(/\s+/).length ?? 0) / 200)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta?.seo_title || post.title,
    description: meta?.seo_description || post.content_md?.substring(0, 160) || '',
    image: post.featured_image || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Neksti Reviews',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Neksti Reviews',
      url: 'https://blog.neksti.com.br',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://blog.neksti.com.br/post/${slug}`,
    },
    inLanguage: 'pt-BR',
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: 'https://blog.neksti.com.br',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.title,
        item: `https://blog.neksti.com.br/post/${slug}`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: post.title }]} />

        {/* Tags */}
        {meta?.tags && meta.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {meta.tags.map((tag: string) => (
              <span key={tag} className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-4">
          {post.title}
        </h1>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readingTime} min de leitura
          </span>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <AffiliateDisclosure />

        {/* Content */}
        <div className="prose-content">
          <ReactMarkdown>{post.content_md || ''}</ReactMarkdown>
        </div>

        {/* Affiliate Links */}
        {affiliateLinks && affiliateLinks.length > 0 && (
          <div className="mt-10 space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Onde Comprar</h3>
            {affiliateLinks.map((link) => (
              <AffiliateCTA
                key={link.id}
                href={link.affiliate_url}
                displayText={link.display_text || `🛒 ${link.product_name} no Mercado Livre`}
                linkId={link.id}
              />
            ))}
          </div>
        )}
      </article>
    </>
  )
}
