export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.bodyPrepend.unshift(`<!--
  THESIS: Evidence reads like a bitmap type specimen, refusing the generic SaaS directory.
  OWN-WORLD: Newsprint, rich black, cobalt selection, orange verification, square ruled components, pixel display type.
  STORY: Practitioners filter verified competition methods, scan their evidence, and open the full Solution Pipeline.
  FIRST VIEWPORT: A 64px masthead, fixed filter rail, oversized task specimen, evidence bars, and dense Solution grid.
  FORM: Specimen Index, approved comp A; seed 55e7d672.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
  -->`)
  })
})
