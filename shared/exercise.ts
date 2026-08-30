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

export const caseEvents = [
  {
    id: 1,
    title: "Pressão sobre sistemas e informação estratégica",
    evidence:
      "Projeto Horizonte, Lítio Aurora S.A. e Tecnometais Brasil S.A. registram tentativas de acesso não autorizado a redes corporativas, contas de executivos, dados geológicos, repositórios técnicos e sistemas industriais, em período de negociações com investidores e compradores estrangeiros.",
    limitation:
      "Não há atribuição técnica conclusiva nem prova de operador comum. Os fatos admitem explicações como espionagem econômica, criminalidade cibernética, coleta oportunista ou preparação de campanha coordenada.",
  },
  {
    id: 2,
    title: "Ambiente informacional e disputa de narrativas",
    evidence:
      "Redes sociais e canais digitais ampliam conteúdos sobre soberania mineral, risco ambiental, capital estrangeiro e agregação de valor. Parte do conteúdo usa dados verdadeiros; outra parte apresenta informações desatualizadas, imagens fora de contexto e alegações não verificadas.",
    limitation:
      "Não se sabe se existe coordenação ou patrocínio comum. Há debate doméstico e estrangeiro legítimo; alcance, polarização ou origem externa de conteúdo não provam operação coordenada de influência.",
  },
  {
    id: 3,
    title: "Competição econômica e negociação externa",
    evidence:
      "Parceiros como China, Estados Unidos, União Europeia, Índia e Japão apresentam manifestações públicas de interesse e cooperação. Grupos empresariais oferecem financiamento, contratos de compra futura, transferência tecnológica, processamento local e cláusulas comerciais distintas.",
    limitation:
      "Atuação pública, negociação dura, interesse por exclusividade e melhores condições comerciais não constituem, por si sós, coerção, ameaça híbrida ou Lawfare. É necessário separar competição legítima de eventual instrumentalização.",
  },
  {
    id: 4,
    title: "Controvérsias jurídicas e regulatórias",
    evidence:
      "O Instituto Caminhos do Cerrado, associações locais e representantes de comunidades apresentam requerimentos administrativos e ações judiciais sobre licenciamento, impactos, transparência, consulta e medidas compensatórias. Uma fundação estrangeira financia campanha pública de educação socioambiental.",
    limitation:
      "Não há prova de financiamento direto do litígio, direção externa da estratégia jurídica, fraude processual ou coordenação com governos ou empresas estrangeiras. Deve-se distinguir uso legítimo do Direito, litigância estratégica legítima e eventual instrumentalização.",
  },
  {
    id: 5,
    title: "Criminalidade transnacional",
    evidence:
      "A Polícia Federal, em cooperação com autoridades de dois países sul-americanos, identifica a Rede Mercúrio: organização fictícia que utiliza mineração ilegal, documentos falsos, empresas de fachada, transporte terrestre e fluvial e contas de terceiros em mais de uma jurisdição.",
    limitation:
      "A transnacionalidade está demonstrada para o exercício, mas não há evidência de que a Rede Mercúrio atue a serviço de governo estrangeiro, empresa real, Projeto Horizonte ou campanha híbrida.",
  },
  {
    id: 6,
    title: "Vulnerabilidades de infraestrutura e logística",
    evidence:
      "A expansão dos projetos revela dependência de corredores rodoviários e ferroviários, energia contínua, conectividade, equipamentos importados e poucos pontos de escoamento. Há falha técnica, furto de cabos e risco de indisponibilidade de peças críticas.",
    limitation:
      "As vulnerabilidades são reais no caso, porém não existe padrão comprovado de sabotagem. Falhas, furtos e dependências estruturais não demonstram exploração adversária.",
  },
  {
    id: 7,
    title: "Coordenação estatal ainda incompleta no caso",
    evidence:
      "Um arranjo interagências temporário reúne áreas de mineração, relações exteriores, defesa, segurança pública, inteligência, meio ambiente, indústria, ciência e tecnologia e finanças, mas ainda não possui quadro comum de indicadores para diferenciar riscos e fenômenos.",
    limitation:
      "A dificuldade de coordenação é hipótese do caso e não avaliação sobre órgãos reais. A coordenação estatal incompleta pode aumentar o tempo de resposta, mas não prova coordenação adversária.",
  },
  {
    id: 8,
    title: "Convergência de efeitos, mas não de autoria",
    evidence:
      "Coexistem incidentes cibernéticos, disputa de narrativas, competição por financiamento e tecnologia, controvérsias jurídicas, crime transnacional e vulnerabilidades de infraestrutura. Alguns efeitos podem favorecer agentes distintos ou decorrer da maior visibilidade estratégica do setor.",
    limitation:
      "Não há prova de comando único, sincronização entre todos os eventos ou objetivo estratégico comum. Benefício, simultaneidade e convergência de efeitos não bastam para atribuição.",
  },
];

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
