<script setup lang="ts">
// ホームの「数字で見る」。ゲームのデータ(game-data/*.json)から数えるので、更新のたびに自動で変わる
import { withBase } from 'vitepress'
import { skilltree, keizon, recipes } from '../lib/game'

const recipeCount = [...recipes.crafting, ...recipes.cooking].reduce((n, g: any) => n + g.items.length, 0)
const skillCount = (skilltree.skills as any[]).length
const keizonCount = (keizon as any[]).length
const stats = [
  { n: recipeCount, label: '工作・料理のレシピ', link: '/items/recipes' },
  { n: skillCount, label: 'スキルツリーのスキル', link: '/play/skilltree' },
  { n: keizonCount, label: 'Keizonの商品', link: '/items/keizon' }
]
</script>

<template>
  <div class="ss-stats">
    <a v-for="s in stats" :key="s.label" class="ss-stat" :href="withBase(s.link)">
      <b>{{ s.n }}</b>
      <span>{{ s.label }}</span>
    </a>
  </div>
</template>
