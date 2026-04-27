interface SpecsTableProps {
  specs: { label: string; value: string }[]
}

export function SpecsTable({ specs }: SpecsTableProps) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="px-5 py-3 text-left font-semibold text-slate-700">
              Especificação
            </th>
            <th className="px-5 py-3 text-left font-semibold text-slate-700">
              Detalhe
            </th>
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
            >
              <td className="px-5 py-3 font-medium text-slate-800 whitespace-nowrap">
                {spec.label}
              </td>
              <td className="px-5 py-3 text-slate-600">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
