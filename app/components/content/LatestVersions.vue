<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/pre'
import type { ComponentConfig } from '@nuxt/ui'
</script>

<script setup lang="ts">
import { tv } from '@nuxt/ui/utils/tv'
import { computed, ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '@nuxt/ui/composables/useLocale'

type ProsePre = ComponentConfig<typeof theme, AppConfig, 'pre', 'ui.prose'>

interface Props {
  minecraft?: string
  hideHeader?: boolean
  allowSnapshots?: boolean
}

interface LatestVersionsResponse {
  minecraft: string
  neoforge: string | null
  neoform: string | null
  fabric: {
    apiVersion: string | null
    loaderVersion: string | null
  }
  forge: string | null
  balm: string | null
}

const props = defineProps<Props>()

const { t } = useLocale()
const { copy, copied } = useClipboard()
const appConfig = useAppConfig() as ProsePre['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.pre || {}) })())

const { data: latestMinecraft } = useAsyncData(
  'latest-minecraft-version',
  () => $fetch<{ version: string }>('/api/versions/minecraft/latest')
)

const minecraftVersion = computed(
  () => props.minecraft || latestMinecraft.value?.version || ''
)

const versions = ref<LatestVersionsResponse | null>(null)

watch(
  [minecraftVersion, () => props.allowSnapshots],
  async ([minecraft]) => {
    if (!minecraft) {
      versions.value = null
      return
    }
    versions.value = await $fetch<LatestVersionsResponse>('/api/versions/latest', {
      query: { minecraft, allowSnapshots: props.allowSnapshots || undefined }
    })
  },
  { immediate: true }
)

const entries = computed(() => {
  const v = versions.value
  if (!v) {
    return []
  }
  return [
    { key: 'balm', value: v.balm },
    { key: 'minecraft', value: v.minecraft },
    { key: 'neoForm', value: v.neoform },
    { key: 'neoForge', value: v.neoforge },
    { key: 'forge', value: v.forge },
    { key: 'fabricApi', value: v.fabric?.apiVersion },
    { key: 'fabricLoader', value: v.fabric?.loaderVersion }
  ].filter((e): e is { key: string, value: string } => typeof e.value === 'string' && e.value.length > 0)
})

const effectiveCode = computed(() =>
  '```toml\n' + `[versions]
${entries.value.map(e => `${e.key} = "${e.value}"`).join('\n')}` + '\n```'
)
</script>

<template>
  <div
    v-if="entries.length"
    :class="ui.root({ class: [], filename: true })"
  >
    <div
      v-if="!hideHeader"
      :class="ui.header({ class: [] })"
    >
      <UIcon
        name="i-lucide-book-marked"
        :class="ui.icon({ class: [] })"
      />

      <span :class="ui.filename({ class: [] })">libs.versions.toml</span>

      <span
        v-if="minecraftVersion"
        class="ml-auto text-sm text-muted mr-8"
      >Minecraft {{ minecraftVersion }}</span>
    </div>

    <UButton
      :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
      color="neutral"
      variant="outline"
      size="sm"
      :aria-label="t('prose.pre.copy')"
      :class="ui.copy({ class: [] })"
      tabindex="-1"
      @click="copy(effectiveCode || '')"
    />

    <pre :class="ui.base({ class: [] })">
      <MDC
        :value="effectiveCode"
        class="innerCode"
      />
    </pre>
  </div>
</template>

<style>
.shiki span.line {
  display: block;
}

.innerCode {
    div {
        margin: 0;
    }
    pre {
        border: none;
        padding: 0;
    }
    button {
        display: none;
    }
}
</style>
