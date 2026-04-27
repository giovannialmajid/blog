'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Save, Eye, EyeOff, Send, Trash2, ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface AffiliateLink {
  id?: string
  product_name: string
  affiliate_url: string
  display_text: string
  merchant: string
}

export default function PostEditorPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const isNew = postId === 'new'
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [contentMd, setContentMd] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Generate slug from title
  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }, [])

  // Load existing post
  useEffect(() => {
    if (isNew) return

    async function loadPost() {
      const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (!post) {
        router.push('/admin')
        return
      }

      setTitle(post.title)
      setSlug(post.slug)
      setContentMd(post.content_md || '')
      setFeaturedImage(post.featured_image || '')
      setStatus(post.status as 'draft' | 'published')

      const { data: meta } = await supabase
        .from('metadata')
        .select('*')
        .eq('post_id', postId)
        .single()

      if (meta) {
        setSeoTitle(meta.seo_title || '')
        setSeoDescription(meta.seo_description || '')
        setTags(meta.tags || [])
      }

      const { data: links } = await supabase
        .from('affiliate_links')
        .select('*')
        .eq('post_id', postId)

      if (links) {
        setAffiliateLinks(
          links.map((l) => ({
            id: l.id,
            product_name: l.product_name,
            affiliate_url: l.affiliate_url,
            display_text: l.display_text || '',
            merchant: l.merchant,
          }))
        )
      }
    }

    loadPost()
  }, [postId, isNew, router, supabase])

  // Save post
  async function handleSave(publishNow = false) {
    setSaving(true)
    setMessage('')

    try {
      const postData = {
        title,
        slug: slug || generateSlug(title),
        content_md: contentMd,
        featured_image: featuredImage || null,
        status: publishNow ? 'published' : status,
        published_at: publishNow ? new Date().toISOString() : undefined,
      }

      let savedPostId = postId

      if (isNew) {
        const { data, error } = await supabase
          .from('posts')
          .insert(postData)
          .select('id')
          .single()

        if (error) throw error
        savedPostId = data.id
      } else {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postId)

        if (error) throw error
      }

      // Upsert metadata
      await supabase.from('metadata').upsert({
        post_id: savedPostId,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        tags,
      })

      // Handle affiliate links
      if (!isNew) {
        // Delete existing links then re-insert
        await supabase.from('affiliate_links').delete().eq('post_id', savedPostId)
      }

      if (affiliateLinks.length > 0) {
        await supabase.from('affiliate_links').insert(
          affiliateLinks.map((link) => ({
            post_id: savedPostId,
            product_name: link.product_name,
            affiliate_url: link.affiliate_url,
            display_text: link.display_text || null,
            merchant: link.merchant || 'mercadolivre',
          }))
        )
      }

      setMessage(publishNow ? '✅ Post publicado!' : '✅ Salvo com sucesso!')

      if (isNew) {
        router.push(`/admin/post/${savedPostId}`)
      }

      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setMessage(`❌ Erro: ${errorMessage}`)
    } finally {
      setSaving(false)
    }
  }

  // Delete post
  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este post?')) return

    await supabase.from('posts').delete().eq('id', postId)
    router.push('/admin')
    router.refresh()
  }

  // Add tag
  function addTag() {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setTagInput('')
  }

  // Add affiliate link
  function addAffiliateLink() {
    setAffiliateLinks([
      ...affiliateLinks,
      { product_name: '', affiliate_url: '', display_text: '', merchant: 'mercadolivre' },
    ])
  }

  function updateAffiliateLink(index: number, field: string, value: string) {
    const updated = [...affiliateLinks]
    updated[index] = { ...updated[index], [field]: value }
    setAffiliateLinks(updated)
  }

  function removeAffiliateLink(index: number) {
    setAffiliateLinks(affiliateLinks.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-2">
          {message && (
            <span className="text-sm font-medium mr-2">{message}</span>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Editor' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Salvar
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Publicar
          </button>
          {!isNew && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (isNew) setSlug(generateSlug(e.target.value))
            }}
            placeholder="Título do Post"
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-xl font-bold text-slate-900 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-colors"
          />

          {/* Slug */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>blog.neksti.com.br/post/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-yellow-400"
              placeholder="url-do-post"
            />
          </div>

          {/* Content */}
          {showPreview ? (
            <div className="min-h-[500px] rounded-xl border border-slate-200 bg-white p-6 prose-content">
              <ReactMarkdown>{contentMd}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={contentMd}
              onChange={(e) => setContentMd(e.target.value)}
              placeholder="Escreva o conteúdo em Markdown..."
              className="editor-textarea min-h-[500px] w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 resize-y transition-colors"
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* SEO Section */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">SEO & Metadados</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Título para SEO'}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-400"
                />
                <p className="text-xs text-slate-400 mt-1">{(seoTitle || title).length}/60</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Meta Description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  placeholder="Descrição para mecanismos de busca"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-400 resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">{seoDescription.length}/160</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Featured Image URL</label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Nova tag"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-yellow-400"
              />
              <button
                onClick={addTag}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Affiliate Links */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Links de Afiliado</h3>
              <button
                onClick={addAffiliateLink}
                className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 hover:text-yellow-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar
              </button>
            </div>
            <div className="space-y-4">
              {affiliateLinks.map((link, i) => (
                <div key={i} className="rounded-lg bg-slate-50 p-3 space-y-2 relative">
                  <button
                    onClick={() => removeAffiliateLink(i)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="text"
                    value={link.product_name}
                    onChange={(e) => updateAffiliateLink(i, 'product_name', e.target.value)}
                    placeholder="Nome do Produto"
                    className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-yellow-400"
                  />
                  <input
                    type="url"
                    value={link.affiliate_url}
                    onChange={(e) => updateAffiliateLink(i, 'affiliate_url', e.target.value)}
                    placeholder="URL de Afiliado (Mercado Livre)"
                    className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-yellow-400"
                  />
                  <input
                    type="text"
                    value={link.display_text}
                    onChange={(e) => updateAffiliateLink(i, 'display_text', e.target.value)}
                    placeholder="Texto do Botão (ex: 🛒 Ver Preço)"
                    className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-yellow-400"
                  />
                </div>
              ))}
              {affiliateLinks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">Nenhum link adicionado</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
