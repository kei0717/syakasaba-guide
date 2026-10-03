// サイト内で共通に使うゲームデータ(scripts/export-addon.mjs が書き出したもの)
import skilltree from '../../../game-data/skilltree.json'
import keizon from '../../../game-data/keizon.json'
import recipes from '../../../game-data/recipes.json'

export { skilltree, keizon, recipes }

export type Material = { id: string; name: string; count: number }
export type RecipeItem = { id: string; name: string; count: number; icon: string | null; materials: Material[] }
export type RecipeGroup = { tag: string; name: string; icon: string | null; items: RecipeItem[]; kind?: string }

export const allRecipes: RecipeGroup[] = [
  ...recipes.crafting.map((r: RecipeGroup) => ({ ...r, kind: 'crafting' })),
  ...recipes.cooking.map((r: RecipeGroup) => ({ ...r, kind: 'cooking' }))
]

// アイテムID -> それを報酬でくれるスキル名
export const skillGives = new Map<string, { skill: string; category: string }>()
for (const s of skilltree.skills as any[]) {
  const cat = (skilltree.categories as any[]).find((c) => c.id === s.category)?.name ?? ''
  for (const lv of s.levels) for (const id of lv.gives ?? []) skillGives.set(id, { skill: s.name, category: cat })
}

// レシピの tag(crafting_recipe_xxx) -> レシピ本のアイテムID
export const recipeBookId = (tag: string) => 'kei:item_' + tag

export const UNIT_LABEL: Record<string, string> = { ingot: '金インゴット', block: '金ブロック', emerald: 'エメラルド' }

// ページ内で「個別に説明済み」の項目を覚えておき、最後の「そのほか」一覧から除くための仕組み
const registry = new Map<string, Set<string>>()
export function pageSet(path: string, kind: string) {
  const key = path + '::' + kind
  if (!registry.has(key)) registry.set(key, new Set())
  return registry.get(key)!
}
