import { ShoppingCart } from 'lucide-react'

interface AffiliateCTAProps {
  href: string
  displayText?: string
  linkId?: string
}

export function AffiliateCTA({ href, displayText, linkId }: AffiliateCTAProps) {
  const url = linkId ? `/api/go?id=${linkId}` : href

  return (
    <div className="my-6 flex flex-col items-center gap-3 rounded-2xl border-2 border-yellow-300 bg-gradient-to-b from-yellow-50 to-yellow-100/50 p-6 text-center">
      <a
        href={url}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="inline-flex items-center gap-2.5 rounded-full bg-[#FFE600] px-8 py-3.5 text-base font-bold text-slate-900 shadow-md transition-all hover:bg-yellow-400 hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]"
      >
        <ShoppingCart className="h-5 w-5" />
        {displayText || '🛒 Ver Preço no Mercado Livre'}
      </a>
      <span className="text-xs text-slate-500">
        Você será redirecionado para o site do vendedor
      </span>
    </div>
  )
}
