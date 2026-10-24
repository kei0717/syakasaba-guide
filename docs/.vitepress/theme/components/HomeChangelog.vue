<script setup lang="ts">
// ホームの「最近の変更」。中身は docs/home.data.ts が changelog.md から取り出す
import { withBase } from 'vitepress'
import { data } from '../../../home.data'

// 本文の中のリンク(/play/... など)を、公開先のURLに合わせる
const fix = (html: string) => html.replace(/href="\//g, `href="${withBase('/')}`)
const fmt = (d: string) => {
  const [y, m, day] = d.split('-')
  return `${y}年${+m}月${+day}日`
}
</script>

<template>
  <div class="ss-log">
    <div v-for="e in data" :key="e.date" class="ss-log-entry">
      <time class="ss-log-date">{{ fmt(e.date) }}</time>
      <ul>
        <li v-for="(it, i) in e.items" :key="i" v-html="fix(it)" />
      </ul>
    </div>
  </div>
</template>
