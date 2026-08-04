<script setup lang="ts">
import type { SolutionIndex } from '~/types'
import { pipelineStages } from '~/types'

const route = useRoute()
const { data: index, pending, error } = await useFetch<SolutionIndex>('/index.json', { server: false })
const solution = computed(() => index.value?.solutions.find((item) => item.id === route.params.id))

useHead(() => ({
  title: solution.value ? `${solution.value.title} — BetterCallSol` : 'Solution — BetterCallSol'
}))
</script>

<template>
  <article class="detail-page">
    <NuxtLink class="back-link" to="/">Back to Solution index</NuxtLink>

    <div v-if="pending" class="system-state">Loading Solution evidence…</div>
    <div v-else-if="error" class="system-state error-state" role="alert">The Solution index could not be loaded.</div>
    <div v-else-if="!solution" class="system-state">
      <strong>Solution not found.</strong>
      <NuxtLink to="/">Return to the index</NuxtLink>
    </div>

    <template v-else>
      <header class="detail-header">
        <div>
          <p class="specimen-label">{{ solution.task.primary }} · {{ solution.modalities.join(' + ') }}</p>
          <h1>{{ solution.title }}</h1>
          <p>{{ solution.summary }}</p>
        </div>
        <dl class="result-plate">
          <div><dt>Final rank</dt><dd>#{{ solution.result.rank }} / {{ solution.result.teams }}</dd></div>
          <div><dt>Percentile</dt><dd>Top {{ solution.result.percentile.toFixed(1) }}%</dd></div>
          <div><dt>Status</dt><dd>{{ solution.status }}</dd></div>
          <div><dt>Metric</dt><dd>{{ solution.metric }}</dd></div>
        </dl>
      </header>

      <section class="competition-plate">
        <div>
          <span>COMPETITION</span>
          <strong>{{ solution.competition.name }}</strong>
        </div>
        <div><span>ENDED</span><strong>{{ solution.competition.endDate }}</strong></div>
        <a v-if="solution.competition.url" :href="solution.competition.url" target="_blank" rel="noreferrer">Open on Kaggle</a>
      </section>

      <section aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading" class="section-title">Solution Pipeline</h2>
        <ol class="pipeline-list">
          <li v-for="(stage, stageIndex) in pipelineStages" :key="stage">
            <span class="stage-number">{{ stageIndex + 1 }}</span>
            <div>
              <h3>{{ stage }}</h3>
              <ul v-if="solution.pipeline[stage].length">
                <li v-for="claim in solution.pipeline[stage]" :key="claim.text">
                  {{ claim.text }}
                  <span class="cell-reference">cells {{ claim.cellRefs.join(', ') }}</span>
                </li>
              </ul>
              <p v-else class="unknown">Unknown — no supported claim extracted.</p>
            </div>
          </li>
        </ol>
      </section>

      <section aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" class="section-title">Notebook Evidence</h2>
        <ul class="evidence-list">
          <li v-for="evidence in solution.evidence" :key="evidence.url || evidence.owner">
            <div>
              <strong>{{ evidence.owner }}</strong>
              <span>version {{ evidence.version }} · cells {{ evidence.cellRefs.join(', ') }}</span>
            </div>
            <a v-if="evidence.url" :href="evidence.url" target="_blank" rel="noreferrer">View notebook</a>
            <span v-else>Demo evidence</span>
          </li>
        </ul>
      </section>
    </template>
  </article>
</template>
