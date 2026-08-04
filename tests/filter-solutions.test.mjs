import assert from 'node:assert/strict'
import test from 'node:test'
import { filterSolutions } from '../utils/filter-solutions.mjs'

const solution = (id, task, modality, percentile, endDate) => ({
  id,
  title: `${task} method`,
  summary: 'verified approach',
  task: { primary: task, secondary: [] },
  modalities: [modality],
  metric: 'Score',
  competition: { name: 'Challenge', slug: id === 'new' ? 'target' : 'other', endDate },
  result: { rank: 1, percentile },
  status: 'emerging',
  methods: ['Model'],
  pipeline: { model: [{ text: 'Model', cellRefs: [1] }] }
})

test('filters and sorts Solution records', () => {
  const filters = { q: 'method', task: 'Classification', modality: '', metric: '', competition: 'target', stage: 'model', status: '', maxPercentile: '10', endAfter: '' }
  const result = filterSolutions([
    solution('old', 'Classification', 'Image', 5, '2025-01-01'),
    solution('new', 'Classification', 'Text', 3, '2026-01-01'),
    solution('wrong', 'Regression', 'Tabular', 1, '2026-02-01')
  ], filters)
  assert.deepEqual(result.map(({ id }) => id), ['new'])
})
