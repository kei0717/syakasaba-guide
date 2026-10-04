<script setup lang="ts">
// このページで個別に説明していないKeizonの商品を、データから自動で一覧にする
import { computed } from 'vue'
import { useData } from 'vitepress'
import GameIcon from './GameIcon.vue'
import Price from './Price.vue'
import { keizon, pageSet } from '../lib/game'

const { page } = useData()
const done = pageSet(page.value.relativePath, 'keizon')
const rest = computed(() => (keizon as any[]).filter((k) => !done.has(k.id ?? k.name)))
</script>

<template>
  <div class="ss-grid">
    <div v-for="k in rest" :key="k.id ?? k.name" class="ss-card">
      <div class="ss-card-head">
        <GameIcon :src="k.icon" :alt="k.name" />
        <h4>{{ k.name }}</h4>
      </div>
      <div class="ss-badges">
        <span v-if="!k.group" class="ss-badge gold"><Price :unit="k.unit" :cost="k.cost" :sell="k.sell ? k.count : undefined" /></span>
        <template v-else>
          <span v-for="s in k.items" :key="s.id" class="ss-badge">{{ s.name }}<b><Price :unit="s.unit" :cost="s.cost" /></b></span>
        </template>
      </div>
    </div>
  </div>
  <p v-if="!rest.length" class="ss-sub">(すべて上で紹介しています)</p>
</template>
