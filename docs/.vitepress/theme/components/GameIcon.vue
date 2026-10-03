<script setup lang="ts">
// ゲーム内のアイコン(ドット絵)を表示する。
// ブロックのテクスチャ(展開図そのまま)はアイコンとして見栄えが悪いので出さない。画像が無いときも何も出さない
import { computed } from 'vue'
import { withBase } from 'vitepress'
const props = defineProps<{ src?: string | null; alt?: string; size?: number }>()
const show = computed(() => !!props.src && !props.src.includes('/textures/blocks/'))
</script>

<template>
  <img
    v-if="show"
    class="ss-icon"
    :src="withBase(src!)"
    :alt="alt ?? ''"
    :style="size ? { width: size + 'px', height: size + 'px' } : undefined"
  />
</template>
