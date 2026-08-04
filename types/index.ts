export const pipelineStages = [
  'validation',
  'preprocessing',
  'model',
  'training',
  'inference',
  'postprocessing',
  'ensembling'
] as const

export type PipelineStage = typeof pipelineStages[number]
export type SolutionStatus = 'frontier' | 'emerging' | 'proven'

export interface MethodClaim {
  text: string
  cellRefs: number[]
}

export interface NotebookEvidence {
  owner: string
  url: string
  version: number
  cellRefs: number[]
  verified: boolean
}

export interface Solution {
  id: string
  title: string
  summary: string
  task: { primary: string; secondary: string[] }
  modalities: string[]
  metric: string
  competition: { name: string; slug: string; url: string; endDate: string }
  result: { rank: number; teams: number; percentile: number; award: string | null }
  status: SolutionStatus
  methods: string[]
  pipeline: Record<PipelineStage, MethodClaim[]>
  evidence: NotebookEvidence[]
  sourceHash: string
}

export interface SolutionIndex {
  meta: {
    generatedAt: string
    evidenceThrough: string
    coverageMonths: number
    demo: boolean
    source: string
  }
  solutions: Solution[]
}

export interface SolutionFilters {
  q: string
  task: string
  modality: string
  metric: string
  competition: string
  stage: string
  status: string
  maxPercentile: string
  endAfter: string
}
