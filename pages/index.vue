<script setup lang="ts">
import type { Solution, SolutionFilters, SolutionIndex } from '~/types'
import { pipelineStages } from '~/types'
import { filterSolutions } from '~/utils/filter-solutions.mjs'

const route = useRoute()
const router = useRouter()
const filtersOpen = ref(false)

const queryFilters = (query: typeof route.query): SolutionFilters => ({
  q: String(query.q || ''), task: String(query.task || ''), modality: String(query.modality || ''),
  metric: String(query.metric || ''), competition: String(query.competition || ''), stage: String(query.stage || ''),
  status: String(query.status || ''), maxPercentile: String(query.maxPercentile || '10'), endAfter: String(query.endAfter || '')
})

const filters = reactive<SolutionFilters>(queryFilters(route.query))

const { data: index, pending, error, refresh } = await useFetch<SolutionIndex>('/index.json', {
  server: false,
  default: () => ({
    meta: { generatedAt: '', evidenceThrough: '', coverageMonths: 18, demo: false, source: 'Kaggle' },
    solutions: []
  })
})

const values = (items: string[]) => [...new Set(items)].sort()
const tasks = computed(() => values(index.value.solutions.map((s) => s.task.primary)))
const modalities = computed(() => values(index.value.solutions.flatMap((s) => s.modalities)))
const metrics = computed(() => values(index.value.solutions.map((s) => s.metric)))
const competitions = computed(() => [...index.value.solutions]
  .sort((a, b) => a.competition.name.localeCompare(b.competition.name))
  .filter((solution, position, items) => items.findIndex((item) => item.competition.slug === solution.competition.slug) === position))
const results = computed<Solution[]>(() => filterSolutions(index.value.solutions, filters))
const specimen = computed(() => filters.task || results.value[0]?.task.primary || 'SOLUTIONS')
const methodFrequency = computed<{ name: string, count: number }[]>(() => {
  const evidence = new Map<string, { name: string, competitions: Set<string> }>()
  for (const solution of results.value) {
    for (const method of solution.methods) {
      const key = method.trim().toLowerCase()
      const item = evidence.get(key) || { name: method, competitions: new Set<string>() }
      item.competitions.add(solution.competition.slug)
      evidence.set(key, item)
    }
  }
  return [...evidence.values()].map((item) => ({ name: item.name, count: item.competitions.size }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 22)
})
const maxMethodFrequency = computed(() => Math.max(1, ...methodFrequency.value.map((item: { count: number }) => item.count)))

watch(filters, () => {
  const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value && value !== '10')) as Record<string, string>
  const current = Object.fromEntries(Object.entries(route.query).map(([key, value]) => [key, String(value || '')]))
  if (JSON.stringify(query) !== JSON.stringify(current)) router.replace({ query })
}, { deep: true })

watch(() => route.query, (query: typeof route.query) => Object.assign(filters, queryFilters(query)), { deep: true })

function resetFilters() {
  Object.assign(filters, { q: '', task: '', modality: '', metric: '', competition: '', stage: '', status: '', maxPercentile: '10', endAfter: '' })
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') filtersOpen.value = false
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onUnmounted(() => window.removeEventListener('keydown', closeOnEscape))
</script>

<template>
  <div class="finder">
    <button class="mobile-filter-button" type="button" :aria-expanded="filtersOpen" aria-controls="filters" @click="filtersOpen = true">
      Filters <span>{{ results.length }}</span>
    </button>

    <aside id="filters" class="filter-rail" :class="{ open: filtersOpen }" aria-label="Solution filters">
      <div class="filter-heading">
        <strong>FILTER INDEX</strong>
        <button class="close-filters" type="button" aria-label="Close filters" @click="filtersOpen = false">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" /></svg>
        </button>
      </div>

      <label class="search-field">
        <span>Keyword</span>
        <input v-model="filters.q" type="search" placeholder="Search methods or competitions" autocomplete="off">
      </label>

      <label>
        <span>Primary task</span>
        <select v-model="filters.task">
          <option value="">All tasks</option>
          <option v-for="task in tasks" :key="task" :value="task">{{ task }}</option>
        </select>
      </label>

      <label>
        <span>Modality</span>
        <select v-model="filters.modality">
          <option value="">All modalities</option>
          <option v-for="modality in modalities" :key="modality" :value="modality">{{ modality }}</option>
        </select>
      </label>

      <label>
        <span>Metric</span>
        <select v-model="filters.metric">
          <option value="">All metrics</option>
          <option v-for="metric in metrics" :key="metric" :value="metric">{{ metric }}</option>
        </select>
      </label>

      <label>
        <span>Competition</span>
        <select v-model="filters.competition">
          <option value="">All competitions</option>
          <option v-for="solution in competitions" :key="solution.competition.slug" :value="solution.competition.slug">
            {{ solution.competition.name }}
          </option>
        </select>
      </label>

      <label>
        <span>Pipeline stage</span>
        <select v-model="filters.stage">
          <option value="">Any stage</option>
          <option v-for="stage in pipelineStages" :key="stage" :value="stage">{{ stage }}</option>
        </select>
      </label>

      <fieldset>
        <legend>Evidence status</legend>
        <label v-for="status in ['', 'frontier', 'emerging', 'proven']" :key="status || 'all'" class="radio-row">
          <input v-model="filters.status" type="radio" :value="status">
          <span>{{ status || 'all evidence' }}</span>
        </label>
      </fieldset>

      <label>
        <span>Maximum final percentile</span>
        <select v-model="filters.maxPercentile">
          <option value="1">Top 1%</option>
          <option value="5">Top 5%</option>
          <option value="10">Top 10%</option>
        </select>
      </label>

      <label>
        <span>Competition ended after</span>
        <input v-model="filters.endAfter" type="date">
      </label>

      <button class="reset-button" type="button" @click="resetFilters">Reset filters</button>
    </aside>

    <button v-if="filtersOpen" class="filter-scrim" type="button" aria-label="Close filters" @click="filtersOpen = false" />

    <section class="results" aria-labelledby="results-heading">
      <div v-if="index.meta.demo" class="demo-banner" role="status">
        SEED INDEX — one verified Kaggle Solution plus illustrative cards. The weekly workflow replaces this file.
      </div>

      <div class="specimen-panel">
        <div>
          <p class="specimen-label">PRIMARY TASK SPECIMEN</p>
          <h1 id="results-heading" class="specimen-word">{{ specimen }}</h1>
          <div class="dot-matrix" aria-hidden="true" />
        </div>
        <div class="evidence-summary">
          <span>{{ results.length }} MATCHES</span>
          <span>EVIDENCE THROUGH {{ index.meta.evidenceThrough || '—' }}</span>
          <div class="frequency-bars" aria-label="Cross-competition method frequency">
            <span
              v-for="method in methodFrequency"
              :key="method.name"
              :style="{ height: `${12 + (method.count / maxMethodFrequency) * 38}px` }"
              :title="`${method.name}: ${method.count} competitions`"
              role="img"
              :aria-label="`${method.name}, ${method.count} competitions`"
            />
          </div>
        </div>
      </div>

      <div v-if="pending" class="system-state" aria-live="polite">Loading the Solution index…</div>
      <div v-else-if="error" class="system-state error-state" role="alert">
        <strong>The index could not be loaded.</strong>
        <button type="button" @click="() => refresh()">Try again</button>
      </div>
      <div v-else-if="!results.length" class="system-state">
        <strong>No verified Solutions match these filters.</strong>
        <button type="button" @click="resetFilters">Clear filters</button>
      </div>

      <div v-else class="solution-grid">
        <NuxtLink v-for="solution in results" :key="solution.id" class="solution-card" :to="`/solutions/${solution.id}`">
          <div class="card-heading">
            <span class="method-glyph" aria-hidden="true">{{ solution.title.slice(0, 2).toUpperCase() }}</span>
            <div>
              <h2>{{ solution.title }}</h2>
              <p>{{ solution.task.primary }} · {{ solution.modalities.join(' + ') }}</p>
            </div>
            <span class="status-dot" :class="solution.status" :title="solution.status" />
          </div>

          <p class="card-summary">{{ solution.summary }}</p>

          <dl class="rank-strip">
            <div><dt>Competition</dt><dd>{{ solution.competition.name }}</dd></div>
            <div><dt>Final rank</dt><dd>#{{ solution.result.rank }} / {{ solution.result.teams }}</dd></div>
            <div><dt>Percentile</dt><dd>Top {{ solution.result.percentile.toFixed(1) }}%</dd></div>
          </dl>

          <div class="percentile-track" aria-hidden="true"><i :style="{ width: `${Math.max(4, 100 - solution.result.percentile * 8)}%` }" /></div>

          <ol class="pipeline-cells" aria-label="Solution Pipeline coverage">
            <li
              v-for="stage in pipelineStages"
              :key="stage"
              :class="{ known: solution.pipeline[stage].length }"
              :title="`${stage}: ${solution.pipeline[stage].length ? `${solution.pipeline[stage].length} claims` : 'unknown'}`"
            >
              <span>{{ stage.slice(0, 2) }}</span>
              <strong>{{ solution.pipeline[stage].length || '—' }}</strong>
            </li>
          </ol>

          <div class="card-footer">
            <span>{{ solution.status }}</span>
            <span>EVIDENCE {{ index.meta.evidenceThrough }}</span>
            <span class="card-arrow" aria-hidden="true" />
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
