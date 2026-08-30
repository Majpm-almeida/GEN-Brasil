export const CASE_TITLE = "Minerais Críticos, Autonomia e Poder Nacional";

export const classificationOptions = [
  "CARACTERIZADO",
  "HIPÓTESE PLAUSÍVEL, MAS NÃO CONFIRMADA",
  "NÃO CARACTERIZADO",
] as const;

export type Classification = (typeof classificationOptions)[number];

export const worksheetLenses = [
  "guerra_hibrida",
  "lawfare",
  "seguranca_transnacional",
] as const;

export type WorksheetLens = (typeof worksheetLenses)[number];

export const exerciseSchedule = [
  {
    date: "31 ago. 2026",
    weekday: "Segunda-feira",
    title: "Guerra Híbrida no contexto da Guerra do Futuro",
    lens: "Guerra Híbrida",
    deadline: "17:00",
    deliverable: "Ficha-Síntese 1 - Guerra Híbrida",
    description: "Palestra/debate, microleitura, teste analítico e consolidação da primeira Ficha-Síntese.",
  },
  {
    date: "1º set. 2026",
    weekday: "Terça-feira",
    title: "Lawfare no contexto da Guerra Híbrida",
    lens: "Lawfare",
    deadline: "17:00",
    deliverable: "Ficha-Síntese 2 - Lawfare",
    description: "Palestra/debate, microleitura, teste analítico e consolidação da segunda Ficha-Síntese.",
  },
  {
    date: "2 set. 2026",
    weekday: "Quarta-feira",
    title: "Segurança Transnacional e Segurança Não Tradicional",
    lens: "Segurança Transnacional",
    deadline: "17:00",
    deliverable: "Ficha-Síntese 3 - Segurança Transnacional",
    description: "Palestra/debate, microleitura, teste analítico e consolidação da terceira Ficha-Síntese.",
  },
  {
    date: "3 set. 2026",
    weekday: "Quinta-feira",
    title: "Atividade Integradora e Missão de Aprofundamento",
    lens: "Síntese Estratégica Integrada",
    deadline: "12:30",
    deliverable: "Síntese Estratégica Integrada + 4 slides",
    description: "Comparação das três lentes, resposta à missão específica do GT e estruturação da apresentação final.",
  },
  {
    date: "3–4 set. 2026",
    weekday: "Quinta-feira e sexta-feira",
    title: "Apresentações dos Grupos de Trabalho",
    lens: "Apresentação oral",
    deadline: "Conforme escala",
    deliverable: "Exposição de 15 minutos + arguição de 5 minutos",
    description: "Apresentação dos GT 1 a 8 na quinta-feira à tarde e dos GT 9 a 16 na sexta-feira pela manhã.",
  },
];

export const caseContext = {
  title: CASE_TITLE,
  summary:
    "O caso examina como o Brasil pode converter sua posição em minerais críticos em autonomia e capacidade nacional, conciliando atração de capital e tecnologia, agregação de valor, proteção de conhecimento sensível, sustentabilidade, direitos de comunidades, rastreabilidade, repressão a ilícitos, diversificação de parceiros e resiliência de infraestrutura.",
  centralQuestion:
    "Diante da crescente competição internacional pelos minerais críticos, como o Brasil deve articular as diferentes Expressões do Poder Nacional para proteger seus interesses estratégicos, reduzir vulnerabilidades e ampliar sua autonomia e liberdade de ação?",
  analyticalRule:
    "Os acontecimentos hipotéticos devem ser testados com prudência. Simultaneidade, benefício, correlação ou gravidade isolada não demonstram autoria, sincronização ou instrumentalização.",
};

export const caseDescription = {
  strategicContext: [
    "Em agosto de 2026, a geopolítica dos minerais críticos combina transição energética, digitalização, inteligência artificial, indústria de defesa e segurança econômica. A Agência Internacional de Energia registra que as cadeias de processamento e refino continuam altamente concentradas: em 2025, China e Indonésia responderam por mais de três quartos do crescimento recente do fornecimento refinado dos principais minerais energéticos, e a China permanece como principal refinadora da maioria dos minerais analisados. Para alguns insumos — como gálio, grafita, manganês e terras raras — a participação do principal refinador supera 90%. Essa concentração transforma capacidade de processamento, tecnologia, acesso a mercados e segurança de suprimento em temas de competição estratégica, e não apenas de comércio de commodities (IEA, 2026).",
    "O Brasil entra nessa disputa com vantagens geológicas e com o desafio de transformar recurso mineral em capacidade econômica, tecnológica e estratégica. A ANM destaca a relevância brasileira em lítio, níquel, cobre, nióbio, manganês e grafita e o potencial geológico em terras raras, com ocorrências importantes em Minas Gerais, Goiás, Pará, Bahia e Amazonas (ANM, 2026). Em julho de 2026, o Plano Nacional de Mineração 2050 passou a orientar a política mineral de longo prazo, enfatizando segurança de suprimento, agregação de valor, competitividade, sustentabilidade e soberania (MME, 2026e). O MME também mantém o Minerais Críticos do Brasil: Guia para Investidores Estrangeiros 2026 (MME, 2026c), enquanto BNDES e Finep apoiam projetos de transformação mineral, P,D&I e manufatura associada às cadeias estratégicas (BNDES; FINEP, 2025).",
    "No plano externo, o Brasil procura diversificar parceiros e preservar liberdade de ação. Em 2025-2026, o MME manteve ou ampliou agendas de cooperação mineral com a China, os Estados Unidos, a União Europeia, a Índia e o Japão. A cooperação com a China inclui o Plano de Ação de Cooperação Brasil-China para o Desenvolvimento Sustentável da Mineração 2025-2026 (MME, 2025). Com os Estados Unidos, houve diálogo específico sobre minerais críticos e estratégicos em maio de 2026 (MME, 2026d). Com a União Europeia, a agenda de 2026 inclui investimentos e cadeias de valor relacionadas a minerais críticos (MME, 2026a). Brasil e Índia estabeleceram cooperação no campo de elementos e terras raras e minerais críticos (MME, 2026b). A parceria Brasil-Japão prevê aprofundamento da cooperação em áreas estratégicas no período 2025-2030 (BRASIL; JAPÃO, 2025). Esses movimentos devem ser compreendidos, no exercício, como manifestações legítimas da competição e da cooperação internacional por diversificação de suprimentos, tecnologia, financiamento e inserção em cadeias de maior valor agregado.",
    "Para a Grande Estratégia Nacional, a questão central é como converter essa posição mineral em autonomia e capacidade nacional sem cair em dois extremos: tratar todo interesse estrangeiro como ameaça ou, no sentido oposto, reduzir os minerais críticos a uma oportunidade puramente comercial. O Brasil precisa conciliar atração de capital e tecnologia, agregação de valor no território nacional, proteção de conhecimento sensível, sustentabilidade, direitos de comunidades, rastreabilidade, repressão a ilícitos, diversificação de parceiros e resiliência de infraestrutura. É nesse ambiente real que se insere o Caso de Estudo semirrealista abaixo.",
  ],
  realActors: [
    ["Brasil — MME/SNGM, ANM e SGB", "Formulação da política mineral, regulação, conhecimento geológico, licenciamento minerário e produção de dados para decisão. O PNM 2050 e o Guia 2026 reforçam segurança de suprimento, agregação de valor e atração de investimentos."],
    ["Brasil — BNDES e Finep", "Instrumentos de financiamento e apoio à transformação de minerais estratégicos, P,D&I e manufatura associada às cadeias de valor."],
    ["Brasil — MRE, MD e demais órgãos competentes", "Dimensões diplomática, de defesa, segurança, inteligência, fronteiras, proteção de infraestrutura e cooperação internacional, conforme competências legais."],
    ["China / National Development and Reform Commission — NDRC", "Parceiro econômico relevante e ator central nas cadeias globais de processamento/refino. Brasil e China mantêm cooperação formal para o desenvolvimento sustentável da mineração."],
    ["Estados Unidos", "Política de segurança de suprimentos e diversificação de cadeias; diálogo bilateral com o Brasil sobre minerais críticos e estratégicos em 2026."],
    ["União Europeia / Comissão Europeia", "Busca diversificação de matérias-primas críticas e investimentos em cadeias sustentáveis; agenda com o Brasil inclui lítio, níquel e terras raras."],
    ["Índia e Japão", "Parceiros adicionais de diversificação, tecnologia, investimento e cooperação em minerais críticos/estratégicos."],
  ],
  brazilianFramework: [
    ["MME / SNGM / CNPM / ANM / SGB", "Política mineral, planejamento, regulação, fiscalização, conhecimento geológico e desenvolvimento da cadeia de minerais críticos e estratégicos."],
    ["MRE", "Política externa, negociação, diversificação de parcerias, cooperação internacional e defesa de interesses brasileiros no plano externo."],
    ["MD / Forças Armadas", "Defesa Nacional e contribuição, nos limites constitucionais e legais, para proteção de interesses estratégicos, vigilância, inteligência, logística e apoio quando cabível."],
    ["GSI / SISBIN", "Avaliação, integração e compartilhamento de informações sobre riscos estratégicos e ameaças que afetem interesses nacionais, observadas as competências institucionais."],
    ["MJSP / PF e órgãos de segurança", "Enfrentamento ao crime organizado, ilícitos federais, lavagem de ativos, contrabando e delitos transnacionais, inclusive por cooperação policial e judicial."],
    ["MCTI / MDIC / BNDES / Finep e sistema de inovação", "Tecnologia, industrialização, adensamento produtivo, financiamento, P,D&I, redução de dependências e aumento de valor agregado."],
  ],
  fictionalActors: [
    ["Projeto Horizonte", "Projeto de terras raras em Goiás, com pesquisa mineral avançada e plano de instalar unidade piloto de beneficiamento e separação no Brasil. Busca capital, tecnologia e contratos de compra futura."],
    ["Lítio Aurora S.A.", "Empresa brasileira fictícia com operação de lítio em Minas Gerais e projeto de conversão química para ampliar valor agregado no País."],
    ["Tecnometais Brasil S.A.", "Empresa fictícia de processamento mineral na Bahia, dependente de equipamentos importados, sistemas digitais industriais e logística portuária."],
    ["Instituto Caminhos do Cerrado", "Organização socioambiental fictícia que acompanha impactos, transparência e participação social no Projeto Horizonte. Atua por meios administrativos, judiciais e de comunicação pública."],
    ["Rede Mercúrio", "Rede criminosa fictícia que opera mineração ilegal, contrabando, empresas de fachada e lavagem de recursos em mais de um país sul-americano."],
    ["Perfis e operadores digitais não atribuídos", "Conjunto de contas, páginas e agentes cuja identidade, coordenação e eventual patrocínio não são conhecidos no início do exercício."],
  ],
};

export const caseEvents = [
  {
    id: 1,
    title: "Pressão sobre sistemas e informação estratégica",
    evidence:
      "Entre junho e agosto de 2026, Projeto Horizonte, Lítio Aurora S.A. e Tecnometais Brasil S.A. registram aumento de tentativas de acesso não autorizado a redes corporativas, contas de executivos, dados geológicos e repositórios técnicos. No Projeto Horizonte, um fornecedor detecta tentativa de obtenção de arquivos sobre ensaios de separação de terras raras; na Lítio Aurora, credenciais de um gerente são comprometidas; na Tecnometais Brasil, há varreduras sobre sistemas industriais. Os três incidentes ocorrem em período de maior negociação com investidores e compradores estrangeiros.",
    limitation:
      "Não há atribuição técnica conclusiva nem prova de operador comum. Os fatos são compatíveis com espionagem econômica, criminalidade cibernética, coleta oportunista ou preparação de campanha coordenada. A coincidência temporal com negociações internacionais não demonstra nexo causal.",
  },
  {
    id: 2,
    title: "Ambiente informacional e disputa de narrativas",
    evidence:
      "Nas semanas seguintes, redes sociais e canais digitais ampliam conteúdos sobre 'entrega do patrimônio mineral', risco ambiental, dependência de capital estrangeiro, suposta exportação de minério sem agregação de valor e eventual perda de soberania. Parte das publicações utiliza dados verdadeiros do setor; outras misturam informações desatualizadas, imagens fora de contexto e alegações não verificadas. Também circulam críticas opostas, acusando movimentos socioambientais de atuarem contra o desenvolvimento nacional. Alguns conteúdos alcançam influenciadores e páginas sediadas fora do Brasil.",
    limitation:
      "Não se sabe se existe coordenação, patrocínio comum ou apenas reprodução orgânica de narrativas. Há atores domésticos e estrangeiros no debate, e crítica política, ambiental ou econômica é legítima. Alcance, polarização ou origem externa de conteúdo não provam operação de influência coordenada.",
  },
  {
    id: 3,
    title: "Competição econômica e negociação externa",
    evidence:
      "No mesmo período, o governo brasileiro recebe manifestações de interesse e propostas de cooperação relacionadas a minerais críticos provenientes de parceiros como China, Estados Unidos, União Europeia, Índia e Japão, coerentes com agendas reais de diversificação de suprimentos, investimentos e tecnologia. No caso, grupos empresariais ligados a diferentes mercados apresentam ao Projeto Horizonte e à Lítio Aurora alternativas de financiamento, contratos de compra futura, transferência tecnológica, processamento local e cláusulas de preferência comercial. As propostas diferem quanto a conteúdo local, propriedade intelectual, garantias de fornecimento, padrões ambientais e acesso a produtos processados.",
    limitation:
      "A atuação é pública e, em princípio, legítima. Negociação dura, busca por exclusividade, defesa de interesses nacionais estrangeiros ou tentativa de obter melhores condições comerciais não constituem por si só coerção, ameaça híbrida ou Lawfare. O GT deve separar competição estratégica legítima de eventual instrumentalização de outros meios.",
  },
  {
    id: 4,
    title: "Controvérsias jurídicas e regulatórias",
    evidence:
      "O Instituto Caminhos do Cerrado, associações locais e representantes de comunidades apresentam requerimentos administrativos e ações judiciais sobre licenciamento, estudos de impacto, transparência, consulta e medidas compensatórias relativas ao Projeto Horizonte. Parte das alegações é considerada tecnicamente consistente por especialistas independentes; outras são contestadas pela empresa. Paralelamente, uma fundação estrangeira financia campanha pública de educação socioambiental do Instituto, e mensagens de redes sociais associam o litígio a narrativas sobre soberania mineral.",
    limitation:
      "Não há prova de que o financiamento externo tenha custeado as ações judiciais, de que o financiador dite estratégia jurídica, de fraude processual ou de coordenação com governos/empresas estrangeiras. O exercício exige distinguir uso legítimo do Direito, litigância estratégica legítima e possível instrumentalização.",
  },
  {
    id: 5,
    title: "Criminalidade transnacional",
    evidence:
      "A Polícia Federal, em cooperação com autoridades de dois países sul-americanos, identifica a Rede Mercúrio, organização fictícia que utiliza frentes de mineração ilegal, documentos falsos, empresas de fachada, transporte terrestre e fluvial e contas de terceiros para inserir minério de origem ilícita em cadeias legais. Há indícios de contrabando, lavagem de recursos e aquisição de equipamentos em diferentes jurisdições. Parte dos fluxos passa por áreas de fronteira e hubs logísticos usados também por atividades lícitas.",
    limitation:
      "A transnacionalidade da rede está suficientemente demonstrada para o exercício. Não há evidência de que a Rede Mercúrio atue a serviço de governo estrangeiro, empresa real, Projeto Horizonte ou campanha híbrida. A existência de crime organizado transnacional não comprova uso instrumental por ator estatal.",
  },
  {
    id: 6,
    title: "Vulnerabilidades de infraestrutura e logística",
    evidence:
      "A expansão dos três projetos fictícios revela dependência de corredores rodoviários e ferroviários, energia contínua, conectividade, equipamentos importados e poucos pontos de escoamento. Uma subestação que atende Tecnometais Brasil sofre falha técnica; um trecho logístico usado por Lítio Aurora registra furto de cabos; e o Projeto Horizonte identifica risco de indisponibilidade de peças críticas importadas. Nenhum episódio causa paralisação prolongada, mas os relatórios internos apontam baixa redundância em alguns serviços.",
    limitation:
      "As vulnerabilidades são reais dentro do caso, porém não há padrão comprovado de sabotagem. Falhas, furtos e dependências estruturais podem existir sem ação adversária. O GT deve distinguir vulnerabilidade explorável de exploração efetivamente demonstrada.",
  },
  {
    id: 7,
    title: "Coordenação estatal ainda incompleta no caso",
    evidence:
      "Diante da simultaneidade dos fatos, é criado para o exercício um arranjo interagências temporário que reúne representantes das áreas de mineração, relações exteriores, defesa, segurança pública, inteligência, meio ambiente, indústria, ciência e tecnologia e finanças. Na primeira rodada de reuniões, os órgãos dispõem de bases de dados, critérios de risco e temporalidades diferentes. Alguns tratam os fatos como questões setoriais; outros defendem análise integrada. Ainda não existe quadro comum de indicadores para diferenciar competição legítima, crime, vulnerabilidade, influência, espionagem econômica e possível ação coordenada.",
    limitation:
      "Essa dificuldade é uma condição hipotética do caso, não uma avaliação sobre o desempenho real dos órgãos brasileiros. Falta de coordenação do Estado não é prova de coordenação adversária, mas pode aumentar tempo de resposta e dificultar atribuição.",
  },
  {
    id: 8,
    title: "Convergência de efeitos, mas não de autoria",
    evidence:
      "Ao final de agosto de 2026, decisores recebem um quadro em que coexistem: incidentes cibernéticos sobre ativos de conhecimento; disputa intensa de narrativas; competição por financiamento, tecnologia e contratos de fornecimento; controvérsias jurídicas; crime organizado transnacional; e vulnerabilidades de infraestrutura. Alguns efeitos podem favorecer concorrentes, grupos políticos, agentes econômicos ou redes criminosas distintas. Outros podem ser apenas consequência do aumento da visibilidade estratégica do setor mineral brasileiro.",
    limitation:
      "Não há, no material inicial, prova de comando único, sincronização entre todos os eventos ou objetivo estratégico comum. Benefício, simultaneidade e convergência de efeitos não bastam para atribuição. A tarefa do GT é decidir o que está caracterizado, o que permanece hipótese plausível e o que não se sustenta com as evidências disponíveis.",
  },
];

export const exerciseRules = {
  separation: [
    "Os atores reais acima definem o ambiente geopolítico e institucional. Os atores fictícios dão materialidade aos fatos do exercício. Nenhum evento hipotético deve ser usado para inferir, insinuar ou atribuir conduta indevida à China, aos Estados Unidos, à União Europeia, à Índia, ao Japão, a órgãos brasileiros ou a empresas reais. Quando um país ou bloco real aparecer no caso, sua atuação será descrita apenas em termos públicos e legítimos de diplomacia, investimento, regulação, cooperação ou competição econômica.",
    "O contexto geopolítico e institucional foi construído a partir de fatos e agendas públicas de 2025-2026. Os incidentes, vínculos, financiamentos, campanhas, litígios, operações criminosas e eventuais conexões entre instrumentos são HIPOTÉTICOS. Os atores reais são usados somente para representar interesses e políticas publicamente documentados; qualquer conduta potencialmente ilícita ou hostil recai exclusivamente sobre atores fictícios ou não atribuídos.",
  ],
  useEvents: [
    "Os eventos hipotéticos constituem a BASE EMPÍRICA COMUM E PERMANENTE do exercício. Eles não são atividades separadas e não representam, isoladamente, Guerra Híbrida, Lawfare ou Segurança Transnacional. Em cada dia, o GT retorna ao mesmo conjunto de acontecimentos, seleciona os que forem pertinentes à lente do dia e os submete aos critérios da microleitura e do teste correspondente. O mesmo evento pode ser utilizado em dias diferentes, desde que a relação seja explicada e a evidência disponível não seja extrapolada.",
    "Nos três primeiros dias, o trabalho deve seguir a sequência: PALESTRA TEMÁTICA → MICROLEITURA DE CONSOLIDAÇÃO → CASO DE ESTUDO E EVENTOS HIPOTÉTICOS → TESTE DOS ELEMENTOS CONSTITUTIVOS → FICHA-SÍNTESE → INTEGRAÇÃO.",
  ],
  stages: [
    ["Caso de estudo", "Define o contexto estratégico comum.", "Em que ambiente o Brasil está tomando decisões?"],
    ["Eventos hipotéticos", "Fornecem fatos, indícios, limitações e pontos que ainda precisam ser esclarecidos.", "Que dados estão realmente disponíveis ao GT?"],
    ["Microleitura", "Oferece a lente conceitual do dia.", "Que conceito e que distinções devemos usar?"],
    ["Teste", "Transforma o conceito em critérios verificáveis.", "Quais elementos estão presentes, ausentes ou com evidência insuficiente?"],
    ["Ficha-Síntese", "Registra a conclusão analítica e as respostas.", "Como classificamos o fenômeno e o que recomendamos?"],
    ["Integração", "Combina os resultados sem apagar as incertezas.", "O que está caracterizado, o que é hipótese e como isso orienta a estratégia?"],
  ],
  lensMap: [
    ["31 ago. — Guerra Híbrida", "1, 2, 3, 6, 7 e 8", "Testar pluralidade de instrumentos, vulnerabilidades, possível sincronização e objetivo estratégico comum. Os eventos não são, isoladamente, 'atos de GH'."],
    ["1º set. — Lawfare", "4; apoio de 2, 3 e 8", "Usar o Evento 4 como núcleo do teste jurídico. Eventos 2, 3 e 8 somente entram se houver nexo demonstrável com a controvérsia jurídica."],
    ["2 set. — Segurança Transnacional", "5; apoio de 1 e 6 se houver dimensão transfronteiriça", "O Evento 5 é o principal dado de transnacionalidade. Outros eventos só devem ser incluídos se o GT demonstrar fluxos, atores, jurisdições ou efeitos além-fronteiras."],
    ["3 set. — Integração", "Todos os eventos, conforme pertinência específica do GT e Missão de Aprofundamento", "Reutilizar os eventos já analisados para responder à Missão de Aprofundamento distinguindo fatos demonstrados, relações possíveis, hipóteses e pontos que ainda precisam ser esclarecidos."],
  ],
  note: "IMPORTANTE: a indicação de 'eventos prioritários' é um guia de trabalho, não uma lista fechada. Um GT poderá usar outro evento se justificar sua pertinência com base nos critérios do tema.",
};

export type TestCriterion = {
  id: string;
  title: string;
  definition: string;
  prompt: string;
  insufficient: string;
};

export const lenses: Record<WorksheetLens, {
  id: WorksheetLens;
  label: "Guerra Híbrida" | "Lawfare" | "Segurança Transnacional";
  subtitle: string;
  priorityEvents: number[];
  keyQuestion: string;
  guidance: string;
  decisionRule: string;
  paragraphFiveFocus: string;
  criteria: TestCriterion[];
}> = {
  guerra_hibrida: {
    id: "guerra_hibrida",
    label: "Guerra Híbrida",
    subtitle: "Emprego sincronizado de múltiplos instrumentos para explorar vulnerabilidades e produzir objetivo político ou estratégico.",
    priorityEvents: [1, 2, 3, 6, 7, 8],
    keyQuestion:
      "Os eventos demonstram coexistência de pressões e vulnerabilidades ou há evidências suficientes de sincronização entre instrumentos, exploração de vulnerabilidades e objetivo político ou estratégico comum?",
    guidance:
      "A análise considera o espectro PMESII e os instrumentos MPECI. O ponto decisivo é a existência de vínculo verificável e articulação deliberada; simultaneidade não é sincronização e benefício não demonstra autoria.",
    decisionRule:
      "CARACTERIZADO exige pluralidade de instrumentos, vulnerabilidades exploradas, sincronização demonstrada e objetivo estratégico comum sustentado. Sem evidência de sincronização, finalidade comum ou atribuição, a conclusão adequada pode ser hipótese plausível, mas não confirmada.",
    paragraphFiveFocus:
      "Indique a principal vulnerabilidade brasileira revelada pelo caso, uma resposta preliminar de resiliência e uma necessidade de esclarecimento.",
    criteria: [
      { id: "pluralidade", title: "Pluralidade de instrumentos", definition: "Emprego ou incidência de meios de naturezas distintas.", prompt: "Há dimensões políticas, econômicas, informacionais, cibernéticas, civis, militares ou outras relevantes?", insufficient: "Muitos problemas coexistirem." },
      { id: "vulnerabilidades", title: "Exploração de vulnerabilidades", definition: "Ação que utiliza, aciona ou procura explorar fragilidade específica do alvo.", prompt: "Que vulnerabilidade é efetivamente utilizada ou procurada por alguma ação?", insufficient: "A mera existência ou exposição potencial da vulnerabilidade." },
      { id: "sincronizacao", title: "Sincronização / sistematicidade", definition: "Articulação entre ações para produzir efeito conjunto.", prompt: "Há nexo verificável entre ações, executores, cronogramas, financiamento, alvos ou mensagens?", insufficient: "Simultaneidade, correlação ou benefício comum." },
      { id: "objetivo", title: "Objetivo político ou estratégico", definition: "Finalidade de alterar vontade, decisão, capacidade ou posição do alvo.", prompt: "Que mudança se pretende produzir e em que evidência isso se apoia?", insufficient: "Objetivo apenas imaginado pelo analista." },
      { id: "atribuicao", title: "Atribuição e grau de confiança", definition: "Relação da campanha a ator ou rede com base em evidências.", prompt: "O que permite atribuir autoria ou direção e qual o grau de confiança?", insufficient: "Inferir autoria somente porque alguém se beneficia." },
    ],
  },
  lawfare: {
    id: "lawfare",
    label: "Lawfare",
    subtitle: "Análise do uso do Direito, distinguindo mecanismos legítimos de eventual instrumentalização estratégica extrajurídica.",
    priorityEvents: [4, 2, 3, 8],
    keyQuestion:
      "Os mecanismos jurídicos e regulatórios observados representam exercício legítimo do Direito ou existem evidências suficientes de instrumentalização ou abuso associado a finalidade estratégica extrajurídica?",
    guidance:
      "Judicialização, fiscalização, financiamento externo, publicidade ou efeito econômico não equivalem a Lawfare. A resposta deve preservar legalidade, devido processo e independência institucional.",
    decisionRule:
      "CARACTERIZADO exige mecanismo jurídico e evidências suficientes de instrumentalização ou abuso e finalidade extrajurídica estratégica. Sinais que ainda não sustentam abuso, finalidade ou coordenação levam a hipótese plausível, mas não confirmada.",
    paragraphFiveFocus:
      "Formule respostas preliminares com a lógica: medida necessária, limite jurídico ou institucional e garantia preservada.",
    criteria: [
      { id: "mecanismo", title: "Mecanismo jurídico/regulatório", definition: "Uso de processo, norma, fiscalização, arbitragem, investigação ou outro instrumento do Direito.", prompt: "Qual mecanismo está sendo utilizado e por quem?", insufficient: "Apenas haver controvérsia jurídica." },
      { id: "regularidade", title: "Base legítima / regularidade", definition: "Existência de competência, fundamento plausível e uso regular do procedimento.", prompt: "Há fundamento jurídico e institucional reconhecível?", insufficient: "O resultado ser desfavorável ao Estado." },
      { id: "abuso", title: "Instrumentalização / abuso", definition: "Emprego artificial, manipulativo, abusivo ou desviado para finalidade extrajurídica.", prompt: "Há fraude, manipulação, seletividade abusiva, repetição artificial ou desvio de finalidade?", insufficient: "Financiamento externo, publicidade, impacto econômico ou resultado desfavorável isoladamente." },
      { id: "finalidade", title: "Finalidade extrajurídica estratégica", definition: "Objetivo predominante de impor custo, restringir liberdade, deslegitimar ou obter vantagem estratégica.", prompt: "Que efeito estratégico se busca e qual evidência sustenta essa finalidade?", insufficient: "Inferir intenção pelo efeito econômico." },
      { id: "nexo", title: "Nexo com outros instrumentos", definition: "Coordenação do domínio jurídico com pressão informacional, econômica, diplomática ou outra.", prompt: "Há comunicação, cronograma, financiamento ou objetivo comum conectando ações?", insufficient: "Ações ocorrerem no mesmo período." },
    ],
  },
  seguranca_transnacional: {
    id: "seguranca_transnacional",
    label: "Segurança Transnacional",
    subtitle: "Exame de ameaças, atores, fluxos e efeitos que atravessam fronteiras e exigem resposta além de uma única jurisdição.",
    priorityEvents: [5, 1, 6],
    keyQuestion:
      "Quais atores, fluxos, meios, causas ou efeitos atravessam materialmente fronteiras, envolvem mais de uma jurisdição e tornam insuficiente uma resposta exclusivamente nacional?",
    guidance:
      "A gravidade do fato, a presença incidental de estrangeiro ou a repercussão internacional não são suficientes. Segurança Não Tradicional é enquadramento ampliado e não recebe classificação independente neste exercício.",
    decisionRule:
      "CARACTERIZADO exige dimensão transfronteiriça material, rede, fluxos ou efeitos além de uma jurisdição e necessidade de cooperação. Se a dimensão externa for incidental, a classificação deve ser não caracterizado.",
    paragraphFiveFocus:
      "Indique a liderança institucional adequada, apoios necessários, cooperação internacional requerida e o papel da Defesa — necessário, complementar ou não prioritário — com justificativa.",
    criteria: [
      { id: "fronteiras", title: "Transposição de fronteiras", definition: "Fluxos, atores, meios, causas ou efeitos cruzam limites estatais de forma material.", prompt: "O que atravessa a fronteira e por qual rota ou mecanismo?", insufficient: "Haver estrangeiro envolvido incidentalmente." },
      { id: "jurisdicoes", title: "Pluralidade de jurisdições", definition: "Mais de um Estado ou sistema jurídico é relevante para compreender ou responder ao problema.", prompt: "Que países ou jurisdições são materialmente envolvidos?", insufficient: "O problema ser apenas grave no território nacional." },
      { id: "rede", title: "Rede / proliferação / contágio", definition: "Existência de conexões que permitem adaptação, deslocamento ou reprodução da ameaça.", prompt: "Como pessoas, dinheiro, mercadorias, dados ou organizações se conectam?", insufficient: "Um episódio isolado sem rede." },
      { id: "impacto", title: "Impacto sobre segurança", definition: "O fenômeno compromete objetivos, estruturas, população ou sensação de segurança.", prompt: "Que interesse ou capacidade nacional é afetado?", insufficient: "Dano econômico comum sem dimensão de segurança." },
      { id: "cooperacao", title: "Necessidade de cooperação", definition: "A resposta apenas nacional é insuficiente ou incompleta.", prompt: "Que informação, ação policial, judicial, financeira ou diplomática depende de outros países?", insufficient: "Cooperação ser apenas conveniente, mas não necessária." },
    ],
  },
};

export const missions = [
  [1, "GH / atribuição", "Atribuição e sincronização: quais evidências seriam necessárias para sustentar que ações distintas compõem uma campanha coordenada?"],
  [2, "Lawfare / legitimidade", "Uso legítimo do Direito x instrumentalização: quais critérios permitem separar controle jurídico legítimo de possível Lawfare?"],
  [3, "Seg. Transnacional", "Mineração ilegal e crime organizado: como ilícitos associados aos minerais críticos afetam segurança e interesses nacionais?"],
  [4, "Grande Estratégia", "Autonomia industrial e tecnológica: como transformar recursos minerais em capacidade nacional e reduzir dependências estratégicas?"],
  [5, "GH / ciberinformacional", "Cibernético, informacional e cognitivo: como ataques, influência e desinformação podem explorar vulnerabilidades da cadeia mineral?"],
  [6, "Lawfare / econômico-regulatório", "Pressões jurídicas, regulatórias e comerciais externas: quando deixam de ser competição legítima e adquirem sentido estratégico?"],
  [7, "Seg. Transnacional", "Fronteiras, logística e fluxos ilícitos: quais vulnerabilidades territoriais e logísticas exigem resposta integrada?"],
  [8, "Grande Estratégia", "Parcerias externas e diversificação: como cooperar com China, EUA, UE e outros atores preservando liberdade de ação?"],
  [9, "Grande Estratégia", "Governança do Poder Nacional: que arquitetura interagências deveria coordenar uma política nacional de minerais críticos?"],
  [10, "GH / econômico-estrutural", "Dependências econômicas e cadeias de suprimento: quais vulnerabilidades podem ser exploradas abaixo do limiar do conflito?"],
  [11, "Lawfare / institucional", "Resiliência jurídica e institucional: como responder a pressões estratégicas sem enfraquecer o Estado de Direito?"],
  [12, "Seg. Transnacional", "Lavagem, ativos e redes financeiras: como fluxos ilícitos transnacionais sustentam a exploração mineral criminosa?"],
  [13, "Seg. Transnacional", "Coordenação internacional e papel da Defesa: quando e como a Defesa deve contribuir para ameaças transfronteiriças?"],
  [14, "Lawfare / jurídico-diplomático", "Resposta jurídico-diplomática externa: como defender interesses nacionais em arenas internacionais sem deslegitimar mecanismos jurídicos?"],
  [15, "Grande Estratégia", "Legitimidade, comunicação estratégica e estado final: como obter apoio interno e externo para uma política mineral de longo prazo?"],
  [16, "GH / resiliência", "Resiliência nacional e infraestrutura crítica: que capacidades devem ser priorizadas para reduzir vulnerabilidades sistêmicas?"],
].map(([number, axis, text]) => ({ number: number as number, code: `GT ${String(number).padStart(2, "0")}`, axis: axis as string, text: text as string }));

export const deliverableDefinitions = [
  { type: "ficha_guerra_hibrida", label: "Ficha-Síntese 1 - Guerra Híbrida", deadline: "31 de agosto, 17:00", filename: "GTXX_FichaSintese1_GuerraHibrida.pdf" },
  { type: "ficha_lawfare", label: "Ficha-Síntese 2 - Lawfare", deadline: "1º de setembro, 17:00", filename: "GTXX_FichaSintese2_Lawfare.pdf" },
  { type: "ficha_seguranca_transnacional", label: "Ficha-Síntese 3 - Segurança Transnacional", deadline: "2 de setembro, 17:00", filename: "GTXX_FichaSintese3_SegurancaTransnacional.pdf" },
  { type: "sintese_integrada", label: "Síntese Estratégica Integrada", deadline: "3 de setembro, 12:30", filename: "GTXX_SinteseEstrategicaIntegrada.pdf" },
  { type: "slides_finais", label: "4 slides da apresentação", deadline: "3 de setembro, 12:30", filename: "GTXX_Slides_Apresentacao.pdf" },
] as const;

export const academicReferences = [
  "DA CRUZ, José de Arimatéia; DA CRUZ, Becky Kohler. Brazil's Transnational Organized Crime (TOC) and its National Security Implications. Small Wars Journal, 2013.",
  "DUNLAP JR., Charles J. Lawfare Today: A Perspective. Yale Journal of International Affairs, v. 3, n. 1, 2008.",
  "GARCIA, Francisco Proença. As Ameaças Transnacionais e a Segurança dos Estados: Subsídios para o seu Estudo. Negócios Estrangeiros, n. 9.1, 2006.",
  "HOFFMAN, Frank G. Hybrid Warfare and Challenges. Joint Force Quarterly, n. 52, 2009.",
  "MULTINATIONAL CAPABILITY DEVELOPMENT CAMPAIGN. Understanding Hybrid Warfare. 2017.",
  "MULTINATIONAL CAPABILITY DEVELOPMENT CAMPAIGN. Countering Hybrid Warfare. 2019.",
  "RODRIGUES, Bernardo Salgado. Guerra Híbrida na América do Sul: uma definição das ações políticas veladas. Sul Global, v. 1, n. 1, 2020.",
  "TROPIN, Zakhar. Lawfare as part of hybrid wars: the experience of Ukraine in conflict with Russian Federation. Security and Defence Quarterly, v. 33, n. 1, 2021.",
];
