<script setup lang="ts">
// 値段の表示。通貨はゲームと同じ見た目のアイコンで出す
//   金インゴット・ダイヤモンド・エメラルド … バニラのテクスチャ
//   金ブロック … しゃかさばのフォント(glyph_E1 の )のドット絵を切り抜いたもの
import { withBase } from 'vitepress'
import { UNIT_LABEL, UNIT_ICON } from '../lib/game'
defineProps<{ unit: string; cost: number; sell?: number }>()
</script>

<template>
  <span class="ss-price">
    <template v-if="sell">
      <img :src="withBase(UNIT_ICON.diamond)" alt="" />ダイヤモンド × {{ sell }}<span class="ss-price-arrow">→</span>
    </template>
    <img v-if="UNIT_ICON[unit]" :src="withBase(UNIT_ICON[unit])" alt="" />{{ UNIT_LABEL[unit] ?? '' }} × {{ cost }}
  </span>
</template>
