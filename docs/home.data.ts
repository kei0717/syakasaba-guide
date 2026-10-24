// ホームに出す「最近の変更」。changelog.md を読んで、新しい順に数件だけ取り出す(ビルド時に1回だけ動く)
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export type Entry = { date: string; items: string[] }

const COUNT = 3

// Markdownのリンク・コード・太字だけをHTMLにする(本文は changelog.md と同じ書き方でよい)
function inline(md: string): string {
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

export default {
  watch: ['./changelog.md'],
  load(): Entry[] {
    const src = readFileSync(resolve(__dirname, 'changelog.md'), 'utf-8').replace(/<!--[\s\S]*?-->/g, '')
    const entries: Entry[] = []
    for (const line of src.split('\n')) {
      const h = line.match(/^## (\d{4}-\d{2}-\d{2})/)
      if (h) { entries.push({ date: h[1], items: [] }); continue }
      const li = line.match(/^- (.+)/)
      if (li && entries.length) entries[entries.length - 1].items.push(inline(li[1].trim()))
    }
    return entries.slice(0, COUNT)
  }
}
