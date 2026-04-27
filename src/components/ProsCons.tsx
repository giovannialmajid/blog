import { CircleCheck, CircleX } from 'lucide-react'

interface ProsConsProps {
  pros: string[]
  cons: string[]
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 my-8">
      <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-5">
        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-700 mb-4">
          <CircleCheck className="h-5 w-5" />
          Prós
        </h4>
        <ul className="space-y-2">
          {pros.map((pro, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-0.5 text-emerald-500 font-bold">+</span>
              {pro}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-5">
        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-700 mb-4">
          <CircleX className="h-5 w-5" />
          Contras
        </h4>
        <ul className="space-y-2">
          {cons.map((con, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-0.5 text-red-500 font-bold">−</span>
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
