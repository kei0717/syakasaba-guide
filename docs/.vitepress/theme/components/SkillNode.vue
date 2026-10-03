<script setup lang="ts">
// スキル1つ分(子スキルも入れ子で表示する)
import GameIcon from './GameIcon.vue'
defineOptions({ name: 'SkillNode' })
const props = defineProps<{ skill: any; children: (id: string) => any[] }>()
</script>

<template>
  <li class="ss-skill">
    <div class="ss-card">
      <div class="ss-card-head">
        <GameIcon v-if="skill.icon" :src="skill.icon" :alt="skill.name" />
        <div>
          <h4>{{ skill.name }}</h4>
          <div v-if="skill.levels.length > 1" class="ss-sub">最大 Lv.{{ skill.levels.length }}</div>
        </div>
      </div>
      <div v-for="(lv, i) in skill.levels" :key="i" class="ss-skill-level">
        <div v-if="skill.levels.length > 1" class="ss-label">Lv.{{ i + 1 }}</div>
        <p v-if="lv.description" class="ss-desc">{{ lv.description }}</p>
        <div class="ss-badges">
          <span v-for="m in lv.materials" :key="m.id" class="ss-badge">{{ m.name }} × {{ m.count }}</span>
          <span v-for="r in lv.reward.filter((x: string) => x !== 'なし')" :key="r" class="ss-badge gold">🎁 {{ r }}</span>
        </div>
      </div>
    </div>
    <ul v-if="children(skill.id).length" class="ss-skill-children">
      <SkillNode v-for="c in children(skill.id)" :key="c.id" :skill="c" :children="children" />
    </ul>
  </li>
</template>
