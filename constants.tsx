import { Tool } from './types';

export const DISCIPLINAS = [
  'Português', 'Matemática', 'História', 'Geografia', 'Ciências', 'Artes', 
  'Educação Física', 'Inglês', 'Ensino Religioso', 'Computação'
];

export const ANOS_ESCOLARIDADE = [
  'Educação Infantil', '1º ano', '2º ano', '3º ano', '4º ano', '5º ano', 
  '6º ano', '7º ano', '8º ano', '9º ano', 'Ensino Médio'
];

// Mapeamento extraído dos dados da API BNCC fornecidos
export const BNCC_DATA: Record<string, Record<string, string[]>> = {
  'Português': {
    '1º ano': ['(EF01LP01) Reconhecer protocolos de leitura', '(EF01LP02) Correspondência fonema-grafema', '(EF01LP05) Sistema de escrita alfabética', '(EF01LP10) Nomear letras do alfabeto'],
    '2º ano': ['(EF02LP01) Grafia correta e pontuação', '(EF02LP02) Segmentação em sílabas', '(EF02LP07) Formas imprensa e cursiva', '(EF02LP10) Sinônimos e antônimos'],
    '3º ano': ['(EF03LP01) Correspondências regulares contextuais', '(EF03LP03) Dígrafos lh, nh, ch', '(EF03LP06) Sílaba tônica'],
    '4º ano': ['(EF04LP01) Regras de correspondência fonema-grafema', '(EF04LP05) Pontuação e discurso direto'],
    '5º ano': ['(EF05LP01) Regras contextuais e morfológicas', '(EF05LP05) Tempos verbais do indicativo'],
    '6º ano': ['(EF06LP01) Neutralidade e imparcialidade jornalística', '(EF06LP04) Função e flexões de substantivos/adjetivos'],
    'Ensino Médio': ['EM13LP01: Contexto sócio-histórico', 'EM13LP05: Análise de textos argumentativos', 'EM13LP10: Variação linguística']
  },
  'Matemática': {
    '1º ano': ['(EF01MA01) Números naturais e ordem', '(EF01MA04) Contagem até 100', '(EF01MA13) Figuras espaciais'],
    '2º ano': ['(EF02MA01) Centenas e valor posicional', '(EF02MA05) Fatos básicos da adição', '(EF02MA14) Sólidos geométricos'],
    '3º ano': ['(EF03MA01) Números até unidade de milhar', '(EF03MA07) Multiplicação: adição de parcelas'],
    '9º ano': ['(EF09MA01) Números irracionais', '(EF09MA13) Teorema de Pitágoras'],
    'Ensino Médio': ['EM13MAT101: Taxas de variação', 'EM13MAT302: Funções polinomiais', 'EM13MAT308: Relações métricas no triângulo']
  },
  'Ciências': {
    '1º ano': ['(EF01CI01) Características dos materiais', '(EF01CI02) Partes do corpo humano'],
    '2º ano': ['(EF02CI01) Propriedades dos materiais', '(EF02CI04) Seres vivos no ambiente'],
    '5º ano': ['(EF05CI02) Ciclo hidrológico', '(EF05CI06) Nutrição e sistemas digestório/respiratório'],
    '9º ano': ['(EF09CI01) Mudanças de estado físico', '(EF09CI10) Lamarck e Darwin']
  },
  'História': {
    '1º ano': ['(EF01HI01) Fases da vida', '(EF01HI08) Comemorações escolares'],
    '7º ano': ['(EF07HI01) Modernidade', '(EF07HI04) Humanismos e Renascimentos'],
    '8º ano': ['(EF08HI01) Iluminismo e Liberalismo', '(EF08HI03) Revolução Industrial']
  },
  'Geografia': {
    '1º ano': ['(EF01GE01) Lugares de vivência', '(EF01GE05) Ciclos naturais'],
    '8º ano': ['(EF08GE01) Rotas de dispersão populacional', '(EF08GE05) Estado, nação e território'],
    '9º ano': ['(EF09GE01) Hegemonia europeia', '(EF09GE05) Globalização e mundialização']
  },
  'Educação Infantil': {
    'Educação Infantil': [
      'Conviver com outras crianças e adultos', 
      'Brincar cotidianamente de diversas formas', 
      'Participar ativamente do planejamento',
      'Explorar movimentos, gestos e sons',
      'EI03ET01: Estabelecer relações de comparação',
      'EI03EF01: Expressar ideias e sentimentos'
    ]
  },
  'Computação': {
    '1º ano': ['(EF01CO01) Organização de objetos', '(EF01CO02) Sequências de passos'],
    'Ensino Médio': ['EM13CO01: Solução de problemas/reúso', 'EM13CO10: Fundamentos da IA']
  }
};

export const TOOLS: Tool[] = [
  {
    id: 'questoes-ia',
    title: 'Criar Questionários IA',
    description: 'Gere questões automáticas personalizadas seguindo a BNCC.',
    icon: 'fa-brain',
    category: 'Avaliar'
  },
  {
    id: 'slides-ia',
    title: 'Apresentação de Slides',
    description: 'Crie roteiros e estruturas de slides em segundos para sua aula.',
    icon: 'fa-file-powerpoint',
    category: 'Criar Aula'
  },
  {
    id: 'plano-aula',
    title: 'Plano de Aula',
    description: 'Planeje sua sequência didática completa com objetivos e BNCC.',
    icon: 'fa-calendar-check',
    category: 'Planejar'
  },
  {
    id: 'corretor-ia',
    title: 'Corretor de Redação',
    description: 'Auxílio na correção e feedback produtivo para estudantes.',
    icon: 'fa-pen-nib',
    category: 'Corrigir'
  }
];
