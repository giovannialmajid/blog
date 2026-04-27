import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="text-6xl font-extrabold text-slate-200 mb-4">404</div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Página não encontrada</h1>
      <p className="text-slate-500 mb-6">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
      >
        Voltar ao Início
      </Link>
    </div>
  )
}
