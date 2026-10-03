<script setup lang="ts">
// ゲーム内のアイコン(ドット絵)を表示する。src が無いときは空の枠だけ出す
import { withBase } from 'vitepress'
defineProps<{ src?: string | null; alt?: string; size?: number }>()
</script>

<template>
  <img
    v-if="src"
    class="ss-icon"
    :src="withBase(src)"
    :alt="alt ?? ''"
    :style="size ? { width: size + 'px', height: size + 'px' } : undefined"
  />
  <span v-else class="ss-icon empty" :style="size ? { width: size + 'px', height: size + 'px' } : undefined" />
</template>
