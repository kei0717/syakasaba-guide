<script setup lang="ts">
// スクショを並べて、クリックで大きく表示する。
// images には docs/public/images/ に置いたファイル名を書く(例: ['balloon.webp'])
// .png の小さい画像(色の一覧など)はドット絵としてくっきり表示する
import { ref } from 'vue'
import { withBase } from 'vitepress'

defineProps<{ images: string[]; alt?: string }>()
const open = ref<string | null>(null)
const src = (name: string) => withBase('/images/' + name)
</script>

<template>
  <div class="ss-shots">
    <img
      v-for="name in images"
      :key="name"
      :src="src(name)"
      :alt="alt ?? ''"
      :class="{ small: name.endsWith('.png') }"
      loading="lazy"
      @click="open = name"
    />
  </div>
  <Teleport to="body">
    <div v-if="open" class="ss-lightbox" @click="open = null">
      <img :src="src(open)" :alt="alt ?? ''" :class="{ pixel: open.endsWith('.png') }" />
    </div>
  </Teleport>
</template>
