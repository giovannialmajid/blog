import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Neksti Reviews | Análises Sinceras e Diretas',
  description: 'Os melhores reviews de produtos, focado em ajudar você a escolher a melhor compra.',
  metadataBase: new URL('https://blog.neksti.com.br'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Neksti<span className="text-yellow-500">.</span>Reviews
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-yellow-600 transition-colors">Início</Link>
              <Link href="/sobre" className="hover:text-yellow-600 transition-colors">Sobre</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t bg-white py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Neksti Reviews. Todos os direitos reservados.</p>
            <p className="mt-2 text-xs">Aviso: Como afiliado, recebemos comissões por compras qualificadas realizadas através de links neste site.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
