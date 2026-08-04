const text = (solution) => [
  solution.title,
  solution.summary,
  solution.task.primary,
  ...solution.task.secondary,
  ...solution.modalities,
  solution.metric,
  solution.competition.name,
  ...solution.methods
].join(' ').toLowerCase()

export function filterSolutions(solutions, filters) {
  const query = filters.q.trim().toLowerCase()
  const maxPercentile = Number(filters.maxPercentile || 100)

  return solutions.filter((solution) =>
    (!query || text(solution).includes(query)) &&
    (!filters.task || solution.task.primary === filters.task) &&
    (!filters.modality || solution.modalities.includes(filters.modality)) &&
    (!filters.metric || solution.metric === filters.metric) &&
    (!filters.competition || solution.competition.slug === filters.competition) &&
    (!filters.stage || solution.pipeline[filters.stage]?.length) &&
    (!filters.status || solution.status === filters.status) &&
    solution.result.percentile <= maxPercentile &&
    (!filters.endAfter || solution.competition.endDate >= filters.endAfter)
  ).sort((a, b) =>
    b.competition.endDate.localeCompare(a.competition.endDate) || a.result.rank - b.result.rank
  )
}
