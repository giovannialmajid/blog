import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre | Neksti Reviews',
  description: 'Conheça o Neksti Reviews — análises honestas e diretas de produtos para ajudar você a tomar melhores decisões de compra.',
}

export default function SobrePage() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-6">
        Sobre o Neksti Reviews
      </h1>

      <div className="prose-content">
        <p>
          Bem-vindo ao <strong>Neksti Reviews</strong>! Somos um blog dedicado a
          análises honestas e detalhadas dos melhores produtos disponíveis no
          mercado brasileiro.
        </p>

        <h2>Nossa Missão</h2>
        <p>
          Acreditamos que todo consumidor merece informações claras e confiáveis
          antes de fazer uma compra. Por isso, nosso compromisso é oferecer
          reviews imparciais, com prós e contras reais, especificações técnicas
          e comparações que realmente ajudam na decisão.
        </p>

        <h2>Como Funcionam Nossos Reviews</h2>
        <p>
          Cada review publicado aqui passa por um processo cuidadoso de pesquisa
          e análise. Avaliamos:
        </p>
        <ul>
          <li><strong>Qualidade e construção</strong> do produto</li>
          <li><strong>Custo-benefício</strong> comparado com concorrentes</li>
          <li><strong>Experiência do usuário</strong> baseada em feedbacks reais</li>
          <li><strong>Disponibilidade e preço</strong> no mercado brasileiro</li>
        </ul>

        <h2>Transparência</h2>
        <p>
          Este site contém links de afiliado para o Mercado Livre. Isso significa
          que, quando você clica em um dos nossos links e realiza uma compra, nós
          podemos receber uma pequena comissão — sem nenhum custo adicional para
          você. Essa receita nos ajuda a manter o site funcionando e a continuar
          produzindo conteúdo de qualidade.
        </p>

        <blockquote>
          Nosso compromisso é sempre com a honestidade. Nunca recomendamos um
          produto apenas porque ele gera comissão.
        </blockquote>

        <h2>Contato</h2>
        <p>
          Tem alguma sugestão de produto para analisarmos? Encontrou algum erro?
          Entre em contato conosco pelo email{' '}
          <a href="mailto:contato@neksti.com.br">contato@neksti.com.br</a>.
        </p>
      </div>
    </article>
  )
}
