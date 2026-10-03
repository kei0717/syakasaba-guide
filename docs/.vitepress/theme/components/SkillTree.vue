<script setup lang="ts">
// スキルツリーをアドオンのデータ(skillTreeData.js)から自動で表示する
import { computed, ref } from 'vue'
import GameIcon from './GameIcon.vue'
import SkillNode from './SkillNode.vue'
import { skilltree } from '../lib/game'

const cats = skilltree.categories as any[]
const current = ref(cats[0]?.id)
const skills = computed(() => (skilltree.skills as any[]).filter((s) => s.category === current.value))
const ids = computed(() => new Set(skills.value.map((s) => s.id)))
const roots = computed(() => skills.value.filter((s) => !s.parent || !ids.value.has(s.parent)))
const children = (id: string) => skills.value.filter((s) => s.parent === id)
const cat = computed(() => cats.find((c) => c.id === current.value))
const skillName = (id: string) => (skilltree.skills as any[]).find((s) => s.id === id)?.name ?? id
</script>

<template>
  <div class="ss-filter">
    <button v-for="c in cats" :key="c.id" :class="{ active: c.id === current }" @click="current = c.id">
      <GameIcon v-if="c.icon" :src="c.icon" :size="18" /> {{ c.name }}
    </button>
  </div>
  <p v-if="cat?.requiresSkill" class="ss-sub">
    🔒 このページは「{{ skillName(cat.requiresSkill) }}」を解放すると開けます
  </p>
  <ul class="ss-skill-tree">
    <SkillNode v-for="s in roots" :key="s.id" :skill="s" :children="children" />
  </ul>
</template>
