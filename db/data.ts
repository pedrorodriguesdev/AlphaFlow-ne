import type { Asset, NewsItem, AIKnowledgeCategory } from "./types"

export const mockAssets: Asset[] = [
  {
    id: "btc",
    ticker: "BTC",
    name: "Bitcoin",
    category: "Cripto",
    price: 325000,
    basePrice: 320000,
    change24h: 1.56,
    volume24h: 45000000000,
    marketCap: 1200000000000,
  },
  {
    id: "eth",
    ticker: "ETH",
    name: "Ethereum",
    category: "Cripto",
    price: 12500,
    basePrice: 12200,
    change24h: 2.46,
    volume24h: 18000000000,
    marketCap: 450000000000,
  },
  {
    id: "sol",
    ticker: "SOL",
    name: "Solana",
    category: "Cripto",
    price: 850,
    basePrice: 820,
    change24h: 3.66,
    volume24h: 3500000000,
    marketCap: 65000000000,
  },
  {
    id: "bnb",
    ticker: "BNB",
    name: "Binance Coin",
    category: "Cripto",
    price: 2100,
    basePrice: 2050,
    change24h: 2.44,
    volume24h: 1200000000,
    marketCap: 78000000000,
  },
  {
    id: "ada",
    ticker: "ADA",
    name: "Cardano",
    category: "Cripto",
    price: 2.85,
    basePrice: 2.75,
    change24h: 3.64,
    volume24h: 850000000,
    marketCap: 32000000000,
  },
  {
    id: "xrp",
    ticker: "XRP",
    name: "Ripple",
    category: "Cripto",
    price: 3.20,
    basePrice: 3.10,
    change24h: 3.23,
    volume24h: 2100000000,
    marketCap: 45000000000,
  },
  {
    id: "petr4",
    ticker: "PETR4",
    name: "Petrobras",
    category: "Ações",
    price: 38.50,
    basePrice: 37.80,
    change24h: 1.85,
    volume24h: 1500000000,
    marketCap: 480000000000,
  },
  {
    id: "vale3",
    ticker: "VALE3",
    name: "Vale S.A.",
    category: "Ações",
    price: 72.30,
    basePrice: 71.50,
    change24h: 1.12,
    volume24h: 980000000,
    marketCap: 320000000000,
  },
  {
    id: "itub4",
    ticker: "ITUB4",
    name: "Itaú Unibanco",
    category: "Ações",
    price: 32.80,
    basePrice: 32.40,
    change24h: 1.23,
    volume24h: 720000000,
    marketCap: 280000000000,
  },
  {
    id: "bbdc4",
    ticker: "BBDC4",
    name: "Bradesco",
    category: "Ações",
    price: 15.20,
    basePrice: 15.00,
    change24h: 1.33,
    volume24h: 450000000,
    marketCap: 180000000000,
  },
  {
    id: "wege3",
    ticker: "WEGE3",
    name: "WEG S.A.",
    category: "Ações",
    price: 42.50,
    basePrice: 41.80,
    change24h: 1.67,
    volume24h: 320000000,
    marketCap: 210000000000,
  },
  {
    id: "gold",
    ticker: "GOLD",
    name: "Ouro",
    category: "Commodities",
    price: 11200,
    basePrice: 11100,
    change24h: 0.90,
    volume24h: 125000000000,
    marketCap: 12000000000000,
  },
  {
    id: "silver",
    ticker: "SILVER",
    name: "Prata",
    category: "Commodities",
    price: 145,
    basePrice: 143,
    change24h: 1.40,
    volume24h: 18000000000,
    marketCap: 1400000000000,
  },
  {
    id: "oil",
    ticker: "BRENT",
    name: "Petróleo Brent",
    category: "Commodities",
    price: 420,
    basePrice: 415,
    change24h: 1.20,
    volume24h: 85000000000,
    marketCap: 3200000000000,
  },
]

export const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "Bitcoin atinge nova máxima histórica após aprovação de ETFs",
    summary:
      "O Bitcoin superou a marca de R$ 325.000 após a aprovação de novos ETFs nos Estados Unidos.",
    body: "O mercado de criptomoedas vive um momento de euforia com o Bitcoin atingindo novos recordes históricos. A aprovação de ETFs spot nos Estados Unidos trouxe um fluxo massivo de investimentos institucionais, elevando o preço do ativo para níveis nunca antes vistos. Analistas preveem que o movimento de alta pode continuar nos próximos meses, especialmente com a aproximação do halving.",
    category: "Cripto",
    ticker: "BTC",
    timestamp: "2h atrás",
    source: "CryptoNews Brasil",
  },
  {
    id: 2,
    title: "Petrobras anuncia dividendos recordes para 2026",
    summary:
      "Estatal brasileira divulga pagamento de dividendos acima das expectativas do mercado.",
    body: "A Petrobras surpreendeu o mercado ao anunciar um pagamento de dividendos extraordinários no valor de R$ 50 bilhões. A decisão reflete os resultados expressivos da companhia no último trimestre, impulsionados pelo aumento da produção de petróleo e gás natural. As ações da empresa reagiram positivamente ao anúncio, com alta de quase 2% no pregão.",
    category: "Ações",
    ticker: "PETR4",
    timestamp: "4h atrás",
    source: "InfoMoney",
  },
  {
    id: 3,
    title: "Ethereum 2.0 completa atualização com sucesso",
    summary:
      "Rede Ethereum finaliza migração para proof-of-stake com melhorias de escalabilidade.",
    body: "A rede Ethereum completou com sucesso sua mais recente atualização, trazendo melhorias significativas na escalabilidade e redução de custos de transação. A atualização, conhecida como 'Shanghai 2.0', permite que os validadores retirem seus ETH em stake, o que gerou um aumento de interesse no staking da plataforma.",
    category: "Cripto",
    ticker: "ETH",
    timestamp: "6h atrás",
    source: "CoinDesk",
  },
  {
    id: 4,
    title: "Ouro atinge maior valor em 5 anos com incertezas globais",
    summary:
      "Metal precioso se beneficia de cenário de incertezas geopolíticas e inflação elevada.",
    body: "O ouro continua sua trajetória de alta, atingindo o maior valor dos últimos 5 anos. Investidores buscam refúgio no metal precioso em meio a incertezas geopolíticas e pressões inflacionárias persistentes nas principais economias do mundo. Analistas recomendam manter exposição ao ativo como hedge contra volatilidade.",
    category: "Commodities",
    ticker: "GOLD",
    timestamp: "8h atrás",
    source: "Bloomberg Brasil",
  },
  {
    id: 5,
    title: "Vale reporta produção recorde de minério de ferro",
    summary:
      "Mineradora brasileira supera expectativas com volume de produção no último trimestre.",
    body: "A Vale S.A. anunciou que sua produção de minério de ferro atingiu níveis recordes no último trimestre, superando as projeções mais otimistas dos analistas. O aumento da demanda chinesa e a recuperação dos preços internacionais do minério contribuíram para o resultado positivo da companhia.",
    category: "Ações",
    ticker: "VALE3",
    timestamp: "10h atrás",
    source: "Valor Econômico",
  },
  {
    id: 6,
    title: "Solana ultrapassa Cardano em valor de mercado",
    summary:
      "Blockchain focada em velocidade ganha terreno no ranking de criptomoedas.",
    body: "A Solana consolidou sua posição no mercado cripto ao ultrapassar a Cardano em capitalização de mercado. A alta performance da rede e o crescimento do ecossistema DeFi na plataforma atraíram novos desenvolvedores e investidores, impulsionando o preço do token SOL para novos patamares.",
    category: "Cripto",
    ticker: "SOL",
    timestamp: "12h atrás",
    source: "The Block",
  },
]

// Base de conhecimento da IA organizada por categorias (60+ perguntas)
export const aiKnowledgeCategories: AIKnowledgeCategory[] = [
  {
    id: "primeiros-passos",
    name: "Primeiros Passos",
    icon: "rocket",
    questions: [
      {
        keys: ["comecar", "iniciar", "primeiro", "investir", "iniciante", "como investir"],
        question: "Como começar a investir?",
        response: `Para começar a investir de forma inteligente, siga estes passos:

**1. Conheça seu perfil:** Antes de tudo, entenda sua tolerância ao risco
**2. Monte sua reserva de emergência:** Tenha 6-12 meses de despesas guardados
**3. Defina seus objetivos:** Curto, médio ou longo prazo?
**4. Comece aos poucos:** Invista valores que não comprometam suas finanças
**5. Diversifique:** Nunca coloque todo o dinheiro em um único ativo
**6. Estude sempre:** O conhecimento é seu maior aliado

Dica: Comece com ativos mais conservadores e vá aumentando a exposição ao risco conforme ganha experiência.`
      },
      {
        keys: ["reserva", "emergencia", "emergência", "guardar"],
        question: "O que é reserva de emergência?",
        response: `**Reserva de Emergência** é o dinheiro guardado para imprevistos.

**Quanto guardar:**
- Funcionário CLT: 6 meses de despesas
- Autônomo/Empresário: 12 meses de despesas

**Onde deixar:**
- Conta com liquidez imediata
- Investimentos de baixo risco
- Nunca em renda variável

**Por que é importante:**
- Evita vender investimentos na baixa
- Protege contra demissão ou doença
- Dá tranquilidade para investir melhor

Nunca invista em renda variável sem ter sua reserva completa primeiro!`
      },
      {
        keys: ["perfil", "investidor", "conservador", "moderado", "agressivo"],
        question: "Qual é meu perfil de investidor?",
        response: `O perfil de investidor é uma classificação que ajuda a adequar investimentos à sua tolerância ao risco.

**Conservador:**
- Prioriza preservação do capital
- Prefere previsibilidade dos retornos
- Desconforto significativo com oscilações
- Alocação típica: 70-90% renda fixa, 10-30% variável

**Moderado:**
- Aceita oscilações em troca de retorno potencialmente maior
- Busca equilíbrio entre segurança e crescimento
- Horizonte tipicamente de médio/longo prazo
- Alocação típica: 40-60% renda fixa, 40-60% variável

**Agressivo:**
- Alta tolerância a variações patrimoniais
- Prioriza potencial de retorno sobre estabilidade
- Geralmente associado a horizontes mais longos
- Alocação típica: 10-30% renda fixa, 70-90% variável

**Importante:** Os percentuais acima são referências da literatura financeira, não regras absolutas. Seu perfil pode evoluir com experiência e mudanças de vida. Uma avaliação formal com profissional certificado (CPA-10, CPA-20, CEA) pode ajudar a definir seu perfil com mais precisão.`
      },
      {
        keys: ["quanto", "minimo", "mínimo", "pouco", "dinheiro"],
        question: "Quanto preciso para começar a investir?",
        response: `Boa notícia: você pode começar com **qualquer valor**!

**Na prática:**
- Tesouro Direto: A partir de R$ 30
- Ações fracionárias: A partir de R$ 1
- Fundos: A partir de R$ 100
- Criptomoedas: A partir de R$ 1

**O mais importante:**
- Não é quanto você investe, é a **consistência**
- Investir R$ 100/mês é melhor que R$ 1.000 uma vez
- Os juros compostos trabalham a seu favor no longo prazo

Exemplo: R$ 200/mês a 10% ao ano = R$ 153.000 em 20 anos!`
      },
      {
        keys: ["erro", "erros", "evitar", "cuidado"],
        question: "Quais erros devo evitar ao investir?",
        response: `Os **erros mais comuns** que você deve evitar:

**1. Investir sem reserva de emergência**
Você pode precisar vender na baixa

**2. Seguir dicas de desconhecidos**
Faça sua própria análise

**3. Não diversificar**
Colocar tudo em um ativo é muito arriscado

**4. Agir por emoção**
Pânico e euforia são inimigos do investidor

**5. Esperar o "momento perfeito"**
Tempo no mercado > timing do mercado

**6. Não ter objetivos claros**
Sem meta, qualquer caminho serve

**7. Ignorar taxas e custos**
Eles corroem sua rentabilidade no longo prazo`
      },
    ]
  },
  {
    id: "risco",
    name: "Gestão de Risco",
    icon: "shield",
    questions: [
      {
        keys: ["risco", "perder", "prejuizo", "prejuízo"],
        question: "O que é risco nos investimentos?",
        response: `**Risco** representa a incerteza sobre os retornos futuros de um investimento.

**Tipos de risco identificados na literatura:**
- **Risco de mercado:** Variações de preço por fatores macroeconômicos
- **Risco de crédito:** Possibilidade de inadimplência do emissor
- **Risco de liquidez:** Dificuldade de converter o ativo em dinheiro
- **Risco sistêmico:** Eventos que afetam todo o sistema financeiro
- **Risco específico:** Fatores relacionados a um ativo ou setor

**Princípio do risco x retorno:**
Na teoria financeira, ativos com maior risco tendem a oferecer maior retorno esperado para compensar essa incerteza. Porém, isso não é garantia — maior risco também significa maior probabilidade de perdas.

**Abordagens de gestão de risco:**
- Diversificação entre classes de ativos
- Definição de limites de perda (stop loss)
- Adequação da exposição à tolerância pessoal
- Manutenção de reserva de emergência em ativos líquidos

**Nota:** Nenhuma estratégia elimina completamente o risco. O objetivo é gerenciá-lo de forma consciente.`
      },
      {
        keys: ["stop", "loss", "stop loss", "proteger"],
        question: "O que é stop loss e como usar?",
        response: `**Stop Loss** é uma ordem automática de venda para limitar prejuízos.

**Como funciona:**
- Você define um preço limite
- Se o ativo cair até esse preço, é vendido automaticamente
- Protege você de perdas maiores

**Exemplo prático:**
- Comprou ação a R$ 100
- Stop loss em R$ 95 (-5%)
- Se cair a R$ 95, vende automaticamente

**Regras de ouro:**
- Sempre use stop loss
- Máximo 2% do capital por operação
- Coloque abaixo de suportes importantes
- Não coloque em números "redondos"`
      },
      {
        keys: ["diversificar", "diversificacao", "diversificação", "carteira", "portfolio", "portfólio"],
        question: "Como diversificar minha carteira?",
        response: `**Diversificação** é não colocar todos os ovos na mesma cesta.

**Modelo sugerido para iniciantes:**
- 40% Renda Fixa (Tesouro, CDBs)
- 30% Ações de empresas sólidas
- 15% Criptomoedas (BTC, ETH)
- 10% Commodities (Ouro)
- 5% Ativos especulativos

**Por que diversificar:**
- Reduz o risco total da carteira
- Se um ativo cai, outros compensam
- Aproveita oportunidades em setores diferentes

**Dica:** Diversifique entre:
- Classes de ativos (ações, cripto, renda fixa)
- Setores (tecnologia, bancos, commodities)
- Geografias (Brasil, EUA, global)`
      },
      {
        keys: ["volatilidade", "volatil", "volátil", "oscila", "sobe e desce"],
        question: "O que é volatilidade?",
        response: `**Volatilidade** mede o quanto um ativo sobe e desce de preço.

**Alta volatilidade:**
- Cripto: pode variar 10-20% em um dia
- Ações pequenas: variações de 5-10%
- Maior risco, mas maior potencial de ganho

**Baixa volatilidade:**
- Tesouro Direto: variação mínima
- Ações de grandes empresas: 1-3%
- Menor risco, menor retorno

**Como lidar:**
- Se você se assusta com quedas, prefira baixa volatilidade
- Se busca ganhos maiores, aceite a volatilidade
- No longo prazo, a volatilidade tende a se suavizar`
      },
      {
        keys: ["perda", "perdendo", "caiu", "queda", "despencou"],
        question: "O que fazer quando meus investimentos caem?",
        response: `Quando seus investimentos caem, **mantenha a calma**:

**O que NÃO fazer:**
- Vender por pânico
- Tomar decisões emocionais
- Olhar a carteira toda hora

**O que fazer:**
1. Avalie se algo mudou nos fundamentos
2. Se nada mudou, pode ser oportunidade de compra
3. Reveja sua alocação de risco
4. Lembre-se do seu horizonte de tempo

**Perspectiva:**
- Quedas são normais e esperadas
- O mercado sempre se recuperou historicamente
- Quem vendeu no pânico perdeu as recuperações

Se você não aguenta ver -30%, não deveria estar 100% em renda variável.`
      },
    ]
  },
  {
    id: "renda-fixa",
    name: "Renda Fixa",
    icon: "landmark",
    questions: [
      {
        keys: ["renda fixa", "tesouro", "cdb", "lci", "lca"],
        question: "O que é renda fixa?",
        response: `**Renda Fixa** são investimentos com retorno previsível.

**Principais tipos:**
- **Tesouro Direto:** Títulos do governo
- **CDB:** Títulos de bancos
- **LCI/LCA:** Crédito imobiliário/agro (isentos de IR)
- **Debêntures:** Títulos de empresas

**Vantagens:**
- Previsibilidade de retorno
- Menor risco que renda variável
- Ideal para reserva de emergência

**Quando usar:**
- Objetivos de curto prazo
- Parte conservadora da carteira
- Reserva de emergência`
      },
      {
        keys: ["tesouro direto", "selic", "ipca", "prefixado"],
        question: "Como funciona o Tesouro Direto?",
        response: `**Tesouro Direto** é emprestar dinheiro ao governo.

**Tipos de títulos:**
- **Tesouro Selic:** Segue a taxa Selic, ideal para reserva
- **Tesouro IPCA+:** Protege da inflação + juros fixos
- **Tesouro Prefixado:** Taxa fixa até o vencimento

**Vantagens:**
- Investimento mais seguro do Brasil
- A partir de R$ 30
- Liquidez diária

**Impostos:**
- IR regressivo: de 22,5% a 15%
- IOF nos primeiros 30 dias

**Dica:** Use Tesouro Selic para reserva de emergência e IPCA+ para aposentadoria.`
      },
      {
        keys: ["cdi", "selic", "taxa", "juros"],
        question: "O que é CDI e taxa Selic?",
        response: `**Selic** e **CDI** são as principais taxas de juros do Brasil.

**Taxa Selic:**
- Definida pelo Banco Central
- Base para todos os juros da economia
- Atualmente referência para investimentos

**CDI:**
- Taxa entre bancos (muito próxima da Selic)
- Benchmark da renda fixa privada
- "Render 100% do CDI" = render igual à Selic

**Na prática:**
- Selic = 12% ao ano
- CDB 100% CDI = ~12% ao ano
- CDB 120% CDI = ~14,4% ao ano

Quanto maior o % do CDI, melhor o investimento.`
      },
      {
        keys: ["inflacao", "inflação", "ipca", "proteger"],
        question: "Como proteger meu dinheiro da inflação?",
        response: `**Inflação** corrói o poder de compra do seu dinheiro.

**Investimentos que protegem:**
- **Tesouro IPCA+:** Rende inflação + juros reais
- **Ações:** Empresas repassam inflação nos preços
- **Imóveis:** Aluguéis são reajustados
- **Ouro:** Reserva de valor histórica

**Investimentos que perdem para inflação:**
- Poupança (rende menos que IPCA)
- Dinheiro parado na conta
- CDBs com taxas muito baixas

**Regra:** Seu investimento deve render **acima da inflação** para você ganhar dinheiro de verdade.`
      },
    ]
  },
  {
    id: "renda-variavel",
    name: "Renda Variável",
    icon: "trending-up",
    questions: [
      {
        keys: ["acao", "ação", "acoes", "ações", "bolsa"],
        question: "O que são ações?",
        response: `**Ações** são pequenas partes de uma empresa.

**Ao comprar ações, você:**
- Vira sócio da empresa (mesmo com pouco)
- Participa dos lucros (dividendos)
- Pode ganhar com a valorização

**Tipos de ações:**
- **ON (3):** Ordinárias - direito a voto
- **PN (4):** Preferenciais - prioridade em dividendos

**Como ganhar:**
1. **Valorização:** Comprar barato, vender caro
2. **Dividendos:** Receber parte dos lucros

**Riscos:**
- Empresa pode ter prejuízo
- Preço pode cair significativamente
- Longo prazo reduz riscos`
      },
      {
        keys: ["dividendo", "dividendos", "proventos", "jscp"],
        question: "O que são dividendos?",
        response: `**Dividendos** são parte do lucro distribuído aos acionistas.

**Como funciona:**
- Empresa tem lucro
- Parte é reinvestida
- Parte é distribuída aos acionistas

**Tipos:**
- **Dividendos:** Distribuição de lucro (isento de IR)
- **JCP:** Juros sobre capital próprio (IR 15%)

**Dividend Yield:**
- Mede quanto a empresa paga em relação ao preço
- DY de 6% = recebe R$ 6 por cada R$ 100 investidos
- Boas pagadoras: acima de 5% ao ano

**Dica:** Empresas maduras pagam mais dividendos (bancos, energia, saneamento).`
      },
      {
        keys: ["bitcoin", "btc", "cripto", "criptomoeda"],
        question: "O que é Bitcoin?",
        response: `**Bitcoin (BTC)** é a primeira e maior criptomoeda por capitalização de mercado.

**Características observadas:**
- Criado em 2009 por pseudônimo Satoshi Nakamoto
- Rede descentralizada sem autoridade central
- Oferta limitada: máximo de 21 milhões de unidades
- Halving (redução de emissão) a cada ~4 anos

**Argumentos favoráveis:**
- Escassez programada no protocolo
- Correlação histórica negativa com inflação em alguns períodos
- Crescente adoção por instituições financeiras

**Riscos identificados:**
- Alta volatilidade: quedas de 50-80% ocorreram historicamente
- Ambiente regulatório em evolução
- Riscos tecnológicos e de custódia

**Observação:** Historicamente, o Bitcoin apresentou ciclos de alta correlacionados com halvings, porém padrões passados não garantem comportamento futuro.

**Consideração de alocação:** Analistas frequentemente sugerem 5-15% do patrimônio para investidores que aceitam alta volatilidade. Esta é uma referência educacional, não recomendação.`
      },
      {
        keys: ["ethereum", "eth", "smart contract"],
        question: "O que é Ethereum?",
        response: `**Ethereum (ETH)** é muito mais que uma criptomoeda.

**O que faz:**
- Plataforma para aplicativos descentralizados
- Permite criar "contratos inteligentes"
- Base para DeFi, NFTs e tokens

**Diferença do Bitcoin:**
- BTC = "Ouro digital" (reserva de valor)
- ETH = "Petróleo digital" (combustível para apps)

**Staking:**
- Você pode "travar" ETH e ganhar rendimentos
- Atualmente ~4-5% ao ano
- Contribui para a segurança da rede

**Riscos:**
- Concorrência de outras blockchains
- Taxas ainda podem ser altas
- Complexidade técnica`
      },
      {
        keys: ["altcoin", "solana", "cardano", "outras cripto"],
        question: "Vale investir em outras criptomoedas?",
        response: `**Altcoins** são todas as criptos além do Bitcoin.

**Categorias:**
- **Layer 1:** Solana, Cardano, Avalanche
- **DeFi:** Aave, Uniswap, Compound
- **Memecoins:** Doge, Shib (muito arriscadas)

**Riscos maiores:**
- Podem perder 90%+ do valor
- Projetos podem falir
- Menos liquidez que BTC/ETH

**Se for investir:**
- Máximo 5% da carteira
- Apenas projetos consolidados
- Nunca invista o que não pode perder

**Recomendação:** Comece com BTC e ETH. Só depois explore altcoins.`
      },
    ]
  },
  {
    id: "psicologia",
    name: "Psicologia Financeira",
    icon: "brain",
    questions: [
      {
        keys: ["medo", "ansiedade", "preocupado", "nervoso"],
        question: "Como lidar com o medo de investir?",
        response: `**O medo de investir é normal**, especialmente no início.

**De onde vem:**
- Medo de perder dinheiro
- Falta de conhecimento
- Histórias de pessoas que perderam

**Como superar:**
1. **Estude:** Conhecimento reduz medo
2. **Comece pequeno:** Invista valores que não te assustam
3. **Aceite oscilações:** Fazem parte do processo
4. **Foque no longo prazo:** Ignore ruídos do dia a dia
5. **Tenha um plano:** Decisões planejadas reduzem ansiedade

**Lembre-se:** O maior risco é não investir e perder para a inflação.`
      },
      {
        keys: ["paciencia", "paciência", "longo prazo", "tempo"],
        question: "Por que paciência é importante?",
        response: `**Paciência** é a virtude mais importante do investidor.

**Por que funciona:**
- Juros compostos precisam de tempo
- Mercado sempre se recupera no longo prazo
- Trading frequente gera custos e erros

**Dados reais:**
- Quem ficou investido nos últimos 20 anos: +300%
- Quem perdeu os 10 melhores dias: +50%
- Quem tentou "acertar o timing": perdeu dinheiro

**Mentalidade correta:**
- Pense em décadas, não em dias
- Ignore notícias alarmistas
- Invista regularmente, independente do mercado

Warren Buffett: "O mercado transfere dinheiro dos impacientes para os pacientes."`
      },
      {
        keys: ["fomo", "perdi", "subiu", "arrependido"],
        question: "O que é FOMO e como evitar?",
        response: `**FOMO** = Fear Of Missing Out (medo de ficar de fora).

**Sinais de FOMO:**
- Comprar porque "todo mundo está comprando"
- Entrar após grande alta
- Medo de "perder a oportunidade"

**Por que é perigoso:**
- Compra no topo, vende no fundo
- Decisões emocionais, não racionais
- Ignora análise e fundamentos

**Como evitar:**
1. Tenha uma estratégia definida
2. Invista regularmente (preço médio)
3. Lembre-se: sempre haverá novas oportunidades
4. Se subiu muito, provavelmente não é hora de entrar

**Regra:** Se você está comprando por FOMO, provavelmente é tarde demais.`
      },
      {
        keys: ["ganancia", "ganância", "quero mais", "dobrar"],
        question: "Como controlar a ganância?",
        response: `**Ganância** é tão perigosa quanto o medo.

**Sinais de ganância:**
- Querer retornos "impossíveis"
- Concentrar tudo em um ativo "promissor"
- Não realizar lucros nunca
- Cair em promessas de ganho fácil

**Consequências:**
- Perdas maiores que o necessário
- Cair em golpes e pirâmides
- Destruir anos de ganhos em uma operação

**Como controlar:**
1. Defina metas realistas (10-15% ao ano é excelente)
2. Realize lucros parciais
3. Desconfie de retornos muito altos
4. Diversifique SEMPRE

**Se parece bom demais para ser verdade, provavelmente é.**`
      },
      {
        keys: ["disciplina", "consistencia", "consistência", "rotina"],
        question: "Como manter disciplina nos investimentos?",
        response: `**Disciplina** separa investidores de sucesso dos demais.

**Hábitos de investidores disciplinados:**
1. Investem todo mês, independente do mercado
2. Seguem uma estratégia definida
3. Não se deixam levar por emoções
4. Revisam a carteira periodicamente (não diariamente)
5. Continuam estudando

**Como desenvolver:**
- Automatize seus aportes
- Tenha um plano escrito
- Anote suas decisões e motivos
- Aceite que não vai "acertar" sempre

**Dica:** Trate investimento como uma conta a pagar. É a conta do seu futuro.`
      },
    ]
  },
  {
    id: "simulacao",
    name: "Simulação e Estratégia",
    icon: "calculator",
    questions: [
      {
        keys: ["simular", "simulacao", "simulação", "calcular"],
        question: "Como simular meus investimentos?",
        response: `**Simulação** ajuda a planejar seu futuro financeiro.

**Variáveis importantes:**
- Valor inicial
- Aporte mensal
- Taxa de retorno esperada
- Prazo do investimento

**Exemplo prático:**
- Início: R$ 1.000
- Aporte: R$ 500/mês
- Retorno: 10% ao ano
- Prazo: 20 anos

**Resultado:** ~R$ 380.000

**Dica:** Use nossa plataforma para simular diferentes cenários e entender o poder dos juros compostos!`
      },
      {
        keys: ["aporte", "aportar", "investir mensal", "todo mes"],
        question: "Quanto devo investir por mês?",
        response: `**Não existe valor mágico**, mas existem diretrizes:

**Regra dos 50-30-20:**
- 50% para necessidades (aluguel, comida)
- 30% para desejos (lazer, compras)
- 20% para investimentos e dívidas

**Se não consegue 20%:**
- Comece com o que puder (mesmo R$ 50)
- Aumente gradualmente
- Toda vez que tiver aumento de renda, aumente o aporte

**Progressão sugerida:**
- Iniciante: 10% da renda
- Intermediário: 20% da renda
- Avançado: 30%+ da renda

**O importante é começar e ser consistente.**`
      },
      {
        keys: ["meta", "objetivo", "quanto preciso", "aposentadoria"],
        question: "Como definir metas financeiras?",
        response: `**Metas claras** direcionam seus investimentos.

**Tipos de metas:**
- **Curto prazo (1-2 anos):** Viagem, eletrônicos
- **Médio prazo (3-5 anos):** Carro, entrada de imóvel
- **Longo prazo (10+ anos):** Aposentadoria, independência

**Como calcular:**
1. Defina o valor que precisa
2. Defina o prazo
3. Calcule quanto precisa investir por mês
4. Escolha investimentos adequados ao prazo

**Exemplo - Aposentadoria:**
- Meta: R$ 1.000.000
- Prazo: 25 anos
- Retorno: 8% ao ano
- Aporte necessário: ~R$ 1.050/mês`
      },
      {
        keys: ["rebalancear", "rebalanceamento", "ajustar carteira"],
        question: "Quando rebalancear minha carteira?",
        response: `**Rebalanceamento** mantém sua carteira alinhada com seu perfil.

**Por que fazer:**
- Ativos valorizam em ritmos diferentes
- Sua carteira pode ficar muito arriscada
- Ou muito conservadora

**Quando fazer:**
- A cada 6 meses ou 1 ano
- Quando uma classe fica muito diferente do planejado
- Após grandes movimentos de mercado

**Exemplo:**
- Meta: 50% ações, 50% renda fixa
- Ações subiram muito: agora é 70%/30%
- Venda parte das ações, compre renda fixa

**Dica:** Rebalanceie com os aportes novos quando possível (evita pagar impostos).`
      },
      {
        keys: ["juros compostos", "compound", "exponencial"],
        question: "O que são juros compostos?",
        response: `**Juros compostos** são a "8ª maravilha do mundo" (Einstein).

**Como funciona:**
- Você ganha juros sobre juros
- Crescimento exponencial no tempo
- Quanto mais tempo, mais poderoso

**Exemplo:**
R$ 10.000 a 10% ao ano:
- Ano 1: R$ 11.000
- Ano 5: R$ 16.105
- Ano 10: R$ 25.937
- Ano 20: R$ 67.275
- Ano 30: R$ 174.494

**Para aproveitar:**
1. Comece o mais cedo possível
2. Reinvista os rendimentos
3. Seja paciente (precisa de tempo)
4. Invista regularmente

**Tempo é seu maior aliado nos investimentos.**`
      },
    ]
  },
  {
    id: "analise-tecnica",
    name: "Análise Técnica",
    icon: "chart",
    questions: [
      {
        keys: ["analise tecnica", "análise técnica", "grafico", "gráfico"],
        question: "O que é análise técnica?",
        response: `**Análise Técnica** estuda gráficos para prever movimentos de preço.

**Princípios:**
- O preço desconta tudo
- Preços se movem em tendências
- A história se repete

**Principais ferramentas:**
- Suportes e resistências
- Médias móveis
- Indicadores (RSI, MACD)
- Padrões gráficos

**Quando usar:**
- Trading de curto prazo
- Definir pontos de entrada/saída
- Complementar análise fundamentalista

**Limitações:**
- Não garante acerto
- Funciona melhor em ativos líquidos
- Requer prática e experiência`
      },
      {
        keys: ["suporte", "resistencia", "resistência"],
        question: "O que são suporte e resistência?",
        response: `**Suporte** e **Resistência** são níveis importantes de preço.

**Suporte:**
- Nível onde o preço para de cair
- "Piso" que segura o preço
- Região de compras

**Resistência:**
- Nível onde o preço para de subir
- "Teto" que limita o preço
- Região de vendas

**Como usar:**
- Compre próximo ao suporte
- Venda próximo à resistência
- Stop loss abaixo do suporte

**Dica:** Quanto mais vezes o nível foi testado, mais forte ele é.`
      },
      {
        keys: ["media movel", "média móvel", "sma", "ema"],
        question: "O que são médias móveis?",
        response: `**Médias Móveis** suavizam o preço e mostram tendências.

**Tipos:**
- **SMA:** Média simples dos últimos X períodos
- **EMA:** Média exponencial (mais peso nos recentes)

**Períodos comuns:**
- 9 períodos: curto prazo
- 20 períodos: médio prazo
- 50 e 200: longo prazo

**Sinais:**
- Preço acima da média: tendência de alta
- Preço abaixo: tendência de baixa
- Cruzamento de médias: possível reversão

**Golden Cross:** Média curta cruza acima da longa (alta)
**Death Cross:** Média curta cruza abaixo da longa (baixa)`
      },
      {
        keys: ["rsi", "sobrecompra", "sobrevenda"],
        question: "O que é RSI?",
        response: `**RSI** (Índice de Força Relativa) mede momentum.

**Escala:** 0 a 100

**Interpretação:**
- **Acima de 70:** Sobrecompra (pode cair)
- **Abaixo de 30:** Sobrevenda (pode subir)
- **Entre 30-70:** Neutro

**Como usar:**
- RSI > 70: Considere vender ou não comprar
- RSI < 30: Possível oportunidade de compra
- Divergências: Preço sobe, RSI cai = alerta

**Cuidado:**
- Em tendências fortes, pode ficar muito tempo sobrecomprado/vendido
- Use junto com outros indicadores`
      },
      {
        keys: ["macd", "convergencia", "divergencia", "divergência"],
        question: "O que é MACD?",
        response: `**MACD** mostra convergência/divergência de médias móveis.

**Componentes:**
- **Linha MACD:** EMA 12 - EMA 26
- **Linha de Sinal:** EMA 9 do MACD
- **Histograma:** Diferença entre os dois

**Sinais:**
- MACD cruza sinal para cima: Compra
- MACD cruza sinal para baixo: Venda
- Histograma crescente: Força da tendência

**Divergências:**
- Preço faz nova máxima, MACD não = possível reversão
- Preço faz nova mínima, MACD não = possível alta

**Dica:** Funciona melhor em tendências claras.`
      },
      {
        keys: ["candlestick", "vela", "candle"],
        question: "Como ler gráficos de candlestick?",
        response: `**Candlesticks** mostram preço de abertura, fechamento, máxima e mínima.

**Anatomia:**
- **Corpo:** Diferença entre abertura e fechamento
- **Pavios:** Máxima e mínima do período
- **Verde/Branco:** Fechou acima da abertura (alta)
- **Vermelho/Preto:** Fechou abaixo (baixa)

**Padrões importantes:**
- **Doji:** Indecisão (abertura = fechamento)
- **Martelo:** Possível reversão de baixa
- **Engolfo:** Reversão de tendência

**Como usar:**
- Identifique padrões em níveis importantes
- Confirme com outros indicadores
- Use em conjunto com suportes/resistências`
      },
    ]
  },
  {
    id: "defi-avancado",
    name: "DeFi e Avançado",
    icon: "layers",
    questions: [
      {
        keys: ["defi", "financas descentralizadas", "finanças descentralizadas"],
        question: "O que é DeFi?",
        response: `**DeFi** = Finanças Descentralizadas.

**O que faz:**
- Serviços financeiros sem intermediários
- Empréstimos, trocas, rendimentos
- Funciona 24/7, sem burocracia

**Principais protocolos:**
- **Uniswap:** Exchange descentralizada
- **Aave:** Empréstimos e rendimentos
- **Compound:** Mercado de dinheiro
- **Curve:** Especializado em stablecoins

**Rendimentos:**
- Staking: 4-20% ao ano
- Liquidity pools: variável
- Lending: 3-15% ao ano

**Riscos:**
- Smart contracts podem ter bugs
- Projetos podem falir
- Impermanent loss em pools`
      },
      {
        keys: ["staking", "stake", "rendimento cripto"],
        question: "O que é staking?",
        response: `**Staking** é "travar" suas criptos para ganhar rendimentos.

**Como funciona:**
- Você deposita moedas em um protocolo
- Ajuda a validar transações da rede
- Recebe recompensas em troca

**Rendimentos típicos:**
- Ethereum: 4-5% ao ano
- Solana: 6-8% ao ano
- Cardano: 4-6% ao ano

**Vantagens:**
- Renda passiva com suas criptos
- Contribui para a segurança da rede

**Riscos:**
- Período de lock-up (não pode vender)
- Preço da moeda pode cair
- Slashing em caso de mal comportamento

**Dica:** Comece com staking de ETH ou SOL em exchanges confiáveis.`
      },
      {
        keys: ["halving", "ciclo", "bitcoin ciclo"],
        question: "O que é halving do Bitcoin?",
        response: `**Halving** é a redução pela metade da recompensa dos mineradores.

**Como funciona:**
- Ocorre a cada ~210.000 blocos (~4 anos)
- Recompensa atual: 3.125 BTC por bloco
- Próximo halving: ~2028

**Histórico:**
- 2012: $12 → $1.000 (8.200%)
- 2016: $650 → $19.000 (2.800%)
- 2020: $8.500 → $69.000 (712%)
- 2024: Ocorreu em abril

**Por que importa:**
- Reduz a emissão de novos BTC
- Aumenta a escassez
- Historicamente precede altas de preço

**Padrão:** Alta significativa 12-18 meses após o halving.`
      },
      {
        keys: ["nft", "token nao fungivel", "token não fungível"],
        question: "O que são NFTs?",
        response: `**NFT** = Token Não Fungível.

**O que é:**
- Certificado digital único
- Prova de propriedade de algo digital
- Não pode ser copiado ou substituído

**Usos:**
- Arte digital
- Itens de jogos
- Ingressos e certificados
- Imóveis tokenizados

**Mercado:**
- Muito especulativo
- Bolha estourou em 2022
- Alguns projetos mantêm valor

**Minha opinião:**
- Não recomendo para iniciantes
- A maioria dos NFTs vai a zero
- Se investir, apenas o que pode perder 100%`
      },
    ]
  },
  {
    id: "geral",
    name: "Perguntas Gerais",
    icon: "message-circle",
    questions: [
      {
        keys: ["oi", "ola", "olá", "ei", "bom dia", "boa tarde", "boa noite", "opa"],
        question: "Olá!",
        response: `Olá! Sou o AlphaBot, seu assistente financeiro inteligente.

Estou aqui para ajudar você a:
- Entender o mundo dos investimentos
- Tomar decisões mais informadas
- Aprender sobre diferentes ativos
- Planejar seu futuro financeiro

Como posso ajudar você hoje?`
      },
      {
        keys: ["obrigado", "valeu", "thanks", "brigado"],
        question: "Obrigado!",
        response: `Por nada! Fico feliz em ajudar.

Se tiver mais alguma dúvida sobre investimentos, é só perguntar. Estou aqui para isso!

Lembre-se: investir é uma jornada, não um destino. Continue aprendendo e evoluindo.`
      },
      {
        keys: ["quem é voce", "quem é você", "o que voce faz", "o que você faz"],
        question: "Quem é você?",
        response: `Sou o **AlphaBot**, seu assistente financeiro virtual.

**O que posso fazer:**
- Explicar conceitos de investimentos
- Ajudar a entender diferentes ativos
- Orientar sobre estratégias
- Responder dúvidas sobre o mercado

**O que NÃO faço:**
- Dar recomendações de compra/venda
- Garantir retornos
- Gerenciar seu dinheiro

Sou uma ferramenta educacional para ajudar você a tomar suas próprias decisões de forma mais informada.`
      },
    ]
  }
]

// Compatibilidade com o código antigo - flatten das categorias
export const aiKnowledge = aiKnowledgeCategories.flatMap(cat => 
  cat.questions.map(q => ({
    keys: q.keys,
    response: q.response
  }))
)

export const defaultUser = {
  name: "Visitante",
  email: "",
  type: "Iniciante" as const,
  balance: 5000,
  portfolio: {},
  history: [],
}

export const defaultIAConfig = {
  tone: "balanced" as const,
  accountType: "individual" as const,
  financialSize: "small" as const,
  mainGoal: "learning" as const,
  knowledgeLevel: "beginner" as const,
  isConfigured: false,
}
