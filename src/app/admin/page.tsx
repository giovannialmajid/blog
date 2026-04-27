import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, Link2, Settings, LogOut } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, status, published_at, created_at')
    .order('created_at', { ascending: false })

  const { count: publishedCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: draftCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft')

  const { count: linkCount } = await supabase
    .from('affiliate_links')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel Admin</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/post/new"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Post
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{publishedCount ?? 0}</p>
              <p className="text-xs text-slate-500">Publicados</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{draftCount ?? 0}</p>
              <p className="text-xs text-slate-500">Rascunhos</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{linkCount ?? 0}</p>
              <p className="text-xs text-slate-500">Links de Afiliado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Posts</h2>
        </div>
        {posts && posts.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/post/${post.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 truncate">{post.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    /{post.slug} · {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span
                  className={`ml-4 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    post.status === 'published'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-slate-500">
            Nenhum post criado ainda.{' '}
            <Link href="/admin/post/new" className="text-yellow-600 font-medium hover:underline">
              Crie o primeiro!
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
