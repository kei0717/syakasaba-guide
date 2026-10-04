<script setup lang="ts">
// Keizonの値段をアドオンのデータから自動で表示する。
//   <Keizon id="kei:item_car" />     通常の商品(IDで指定)
//   <Keizon name="サンタコス" />     まとめ商品(詳細ページがあるもの)は名前で指定
import { computed } from 'vue'
import { useData } from 'vitepress'
import GameIcon from './GameIcon.vue'
import Price from './Price.vue'
import { keizon, pageSet } from '../lib/game'

const props = defineProps<{ id?: string; name?: string }>()
const { page } = useData()
const item = computed(() => (keizon as any[]).find((k) => (props.id ? k.id === props.id : k.name === props.name)))
if (item.value) pageSet(page.value.relativePath, 'keizon').add(item.value.id ?? item.value.name)
</script>

<template>
  <div v-if="item" class="ss-keizon">
    <GameIcon :src="item.icon" :alt="item.name" />
    <div v-if="!item.group" class="ss-badges">
      <span class="ss-badge gold"><Price :unit="item.unit" :cost="item.cost" :sell="item.sell ? item.count : undefined" /></span>
      <span v-if="item.count > 1 && !item.sell" class="ss-badge">{{ item.count }}個</span>
    </div>
    <div v-else class="ss-badges">
      <span v-for="s in item.items" :key="s.id" class="ss-badge"><GameIcon :src="s.icon" :size="16" /> {{ s.name }}<b><Price :unit="s.unit" :cost="s.cost" /></b></span>
    </div>
  </div>
  <div v-else class="warning custom-block"><p>Keizonの商品「{{ id ?? name }}」が見つかりません(販売終了した可能性があります)</p></div>
</template>
