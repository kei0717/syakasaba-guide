<script setup lang="ts">
// 工作・料理レシピの「素材」と「レシピ本の入手(スキルツリー)」を、アドオンのデータから自動で表示する。
//   <Recipe tag="crafting_recipe_balloon" />
import { computed } from 'vue'
import { useData } from 'vitepress'
import GameIcon from './GameIcon.vue'
import { allRecipes, skillGives, recipeBookId, pageSet } from '../lib/game'

const props = defineProps<{ tag: string; noSkill?: boolean }>()
const { page } = useData()
pageSet(page.value.relativePath, 'recipe').add(props.tag)

const recipe = computed(() => allRecipes.find((r) => r.tag === props.tag))
const skill = computed(() => skillGives.get(recipeBookId(props.tag)))
const sameMaterials = computed(() => {
  const items = recipe.value?.items ?? []
  if (items.length < 2) return false
  const key = (i: any) => i.materials.map((m: any) => m.count).join(',')
  return items.every((i) => key(i) === key(items[0]))
})
</script>

<template>
  <div v-if="recipe" class="ss-card ss-recipe">
    <div v-if="recipe.items.length > 1" class="ss-icons-row">
      <GameIcon v-for="it in recipe.items" :key="it.id" :src="it.icon" :alt="it.name" :size="36" :title="it.name" />
    </div>
    <div v-if="recipe.items.length === 1">
      <div class="ss-label">素材</div>
      <div class="ss-badges">
        <span v-for="m in recipe.items[0].materials" :key="m.id" class="ss-badge">{{ m.name }} × {{ m.count }}</span>
      </div>
    </div>
    <details v-else>
      <summary>素材を見る({{ recipe.items.length }}種類)</summary>
      <table>
        <thead><tr><th>作れるもの</th><th>素材</th></tr></thead>
        <tbody>
          <tr v-for="it in recipe.items" :key="it.id">
            <td><GameIcon :src="it.icon" :size="24" /> {{ it.name }}<span v-if="it.count > 1"> × {{ it.count }}</span></td>
            <td>{{ it.materials.map((m) => `${m.name} × ${m.count}`).join('、') }}</td>
          </tr>
        </tbody>
      </table>
    </details>
    <div v-if="skill && !noSkill" class="ss-sub">
      📘 レシピ本はスキルツリー「{{ skill.category }}」の「{{ skill.skill }}」で入手できます
    </div>
  </div>
  <div v-else class="warning custom-block"><p>レシピ「{{ tag }}」が見つかりません(ゲームから削除された可能性があります)</p></div>
</template>
