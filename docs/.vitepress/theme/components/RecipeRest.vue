<script setup lang="ts">
// このページで個別に説明していないレシピを、データから自動で一覧にする(新しく増えたレシピもここに出る)
import { computed } from 'vue'
import { useData } from 'vitepress'
import GameIcon from './GameIcon.vue'
import { allRecipes, skillGives, recipeBookId, pageSet } from '../lib/game'

// source: 'skill' = スキルツリーでレシピ本が手に入るものだけ / 'other' = それ以外だけ
const props = defineProps<{ kind?: 'crafting' | 'cooking'; source?: 'skill' | 'other' }>()
const { page } = useData()
const done = pageSet(page.value.relativePath, 'recipe')
const bySource = (tag: string) => {
  if (!props.source) return true
  const fromSkill = skillGives.has(recipeBookId(tag))
  return props.source === 'skill' ? fromSkill : !fromSkill
}
const rest = computed(() =>
  allRecipes.filter((r) => (!props.kind || r.kind === props.kind) && !done.has(r.tag) && bySource(r.tag))
)
</script>

<template>
  <div class="ss-grid">
    <div v-for="r in rest" :key="r.tag" class="ss-card">
      <div class="ss-card-head">
        <GameIcon :src="r.icon" :alt="r.name" />
        <h4>{{ r.name }}</h4>
      </div>
      <div v-for="it in r.items" :key="it.id" class="ss-sub">
        <template v-if="r.items.length > 1">{{ it.name }}:</template>
        {{ it.materials.map((m) => `${m.name} × ${m.count}`).join('、') }}
      </div>
      <div v-if="skillGives.get(recipeBookId(r.tag))" class="ss-sub">
        📘 スキル「{{ skillGives.get(recipeBookId(r.tag))!.skill }}」でレシピ本を入手
      </div>
    </div>
  </div>
  <p v-if="!rest.length && !props.source" class="ss-sub">(すべて上で紹介しています)</p>
</template>
