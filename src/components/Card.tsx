import Link from 'next/link'
import Image from 'next/image'

interface CardProps {
  title: string
  summary: string
  imageUrl?: string
  slug: string
  date: string
}

export function Card({ title, summary, imageUrl, slug, date }: CardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
      <Link href={`/post/${slug}`} className="block">
        <div className="aspect-[16/9] w-full relative bg-slate-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              Sem Imagem
            </div>
          )}
        </div>
        <div className="p-5">
          <time className="text-xs font-medium text-slate-500 mb-2 block">
            {new Date(date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </time>
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-3">
            {summary}
          </p>
        </div>
      </Link>
    </div>
  )
}
