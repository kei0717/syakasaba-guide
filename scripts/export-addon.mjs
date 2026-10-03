// アドオン(社会性サバイバルAd)から、サイトに載せる情報だけを書き出すスクリプト
//
// 使い方(websiteフォルダで実行):
//   node scripts/export-addon.mjs <BPフォルダ> <RPフォルダ> [バニラRPフォルダ]
//
// 書き出すもの:
//   docs/game-data/skilltree.json  スキルツリー(skillTreeData.js)
//   docs/game-data/keizon.json     Keizonの商品(phone/keizon.js)
//   docs/game-data/recipes.json    工作・料理レシピ(craft/crafting_recipe.js, cooking_recipe.js)
//   docs/public/game/...           上で使うアイコン画像(PNG)だけ
//
// アドオンのコードそのものはサイトに入れません(名前・値段・素材・アイコンだけ)。

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(here, "..");
const [BP, RP, VANILLA] = process.argv.slice(2);
if (!BP || !RP) {
  console.error("使い方: node scripts/export-addon.mjs <BPフォルダ> <RPフォルダ> [バニラRPフォルダ]");
  process.exit(1);
}

// サイトに載せないスキルツリーのカテゴリ(テスト用など)
const EXCLUDE_SKILL_CATEGORIES = ["life_3"];

const DATA_OUT = path.join(SITE, "docs", "game-data");
const TEX_OUT = path.join(SITE, "docs", "public", "game");
fs.mkdirSync(DATA_OUT, { recursive: true });
fs.rmSync(TEX_OUT, { recursive: true, force: true });
fs.mkdirSync(TEX_OUT, { recursive: true });

// ---------- 共通 ----------
const cleanName = (s) =>
  String(s ?? "")
    .replace(/§./g, "")
    .replace(/[\(（]クリック(?:して|で)詳細[\)）]/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// 拡張子なしのテクスチャパス(例: textures/items/item_car)をPNGとして書き出し、サイト上のパスを返す
const copied = new Map();
function texture(texPath) {
  if (!texPath) return null;
  const rel = texPath.replace(/\\/g, "/").replace(/\.png$/, "");
  if (copied.has(rel)) return copied.get(rel);
  let result = null;
  for (const root of [RP, VANILLA].filter(Boolean)) {
    const src = path.join(root, rel + ".png");
    if (fs.existsSync(src)) {
      const dest = path.join(TEX_OUT, rel + ".png");
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      result = "/game/" + rel + ".png";
      break;
    }
  }
  copied.set(rel, result);
  return result;
}

// アドオンのスクリプトはNode用ではないので、一時フォルダに.mjsとしてコピーして読み込む
async function importModule(file) {
  const tmp = path.join(os.tmpdir(), `site_export_${path.basename(file)}_${Date.now()}.mjs`);
  fs.copyFileSync(file, tmp);
  try {
    return await import(pathToFileURL(tmp).href);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

// 文字列・コメントを飛ばしながら、対応するかっこまでを切り出す
function sliceBracket(src, start) {
  const open = src[start], close = open === "[" ? "]" : "}";
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      for (i++; i < src.length && src[i] !== c; i++) if (src[i] === "\\") i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "/" && src[i + 1] === "*") { i = src.indexOf("*/", i + 2) + 1; continue; }
    if (c === open) depth++;
    if (c === close && --depth === 0) return src.slice(start, i + 1);
  }
  throw new Error("かっこの対応が見つかりません");
}

// ---------- スキルツリー ----------
{
  const mod = await importModule(path.join(BP, "scripts/skillTree/skillTreeData.js"));
  const categories = mod.skillCategories
    .filter((c) => !EXCLUDE_SKILL_CATEGORIES.includes(c.id))
    .map((c) => ({ id: c.id, name: c.name, icon: texture(c.icon), requiresSkill: c.requiresSkill ?? null }));
  const catIds = new Set(categories.map((c) => c.id));
  const skills = mod.skillDefinitions
    .filter((s) => catIds.has(s.category))
    .map((s) => ({
      id: s.id,
      category: s.category,
      name: s.name,
      icon: texture(s.icon),
      parent: s.parent ?? null,
      levels: (s.levels ?? []).map((lv) => ({
        description: lv.description ?? "",
        materials: (lv.materials ?? []).map((m) => ({ id: m.id, name: m.name, count: m.count })),
        reward: lv.reward ?? [],
        // このレベルで give されるアイテムID(レシピ本の入手方法の自動表示に使う)
        gives: (lv.commands ?? []).map((c) => /^give\s+@s\s+(\S+)/.exec(c)?.[1]).filter(Boolean),
      })),
    }));
  fs.writeFileSync(path.join(DATA_OUT, "skilltree.json"), JSON.stringify({ categories, skills }, null, 2));
  console.log(`スキルツリー: ${categories.length}カテゴリ / ${skills.length}スキル`);
}

// ---------- Keizon ----------
{
  const src = fs.readFileSync(path.join(BP, "scripts/phone/keizon.js"), "utf8");
  const listText = sliceBracket(src, src.indexOf("[", src.indexOf("const itemList")));
  const itemList = new Function("const ingot = 0, block = 1, emerald = 2; return " + listText)();
  // 詳細ページ(jump)は shop 関数の case の順番で itemList[1], [2]... に対応している
  const jumpOrder = [...src.matchAll(/case\s+"([^"]+)"\s*:/g)].map((m) => m[1]);
  const UNIT = ["ingot", "block", "emerald"];
  const toItem = (it) => ({
    name: cleanName(it.name),
    id: it.id ?? null,
    unit: UNIT[it.costType] ?? null,
    cost: it.cost ?? null,
    count: it.value ?? 1,
    icon: texture(it.texture),
  });
  const items = itemList[0].map((it) => {
    if (it.jump && it.jump !== "diamond" && !it.id) {
      const idx = jumpOrder.indexOf(it.jump) + 1;
      return { ...toItem(it), group: true, items: (itemList[idx] ?? []).map(toItem) };
    }
    if (it.jump === "diamond") return { ...toItem(it), sell: true };
    return toItem(it);
  });
  fs.writeFileSync(path.join(DATA_OUT, "keizon.json"), JSON.stringify(items, null, 2));
  console.log(`Keizon: ${items.length}件`);
}

// ---------- 工作・料理レシピ ----------
{
  const toRecipe = (r) => ({
    id: r.id,
    name: cleanName(r.name),
    count: r.count ?? 1,
    icon: texture(r.texture),
    materials: (r.materialItem ?? []).map((m) => ({ id: m.id, name: m.name, count: m.count })),
  });
  const conv = (list) =>
    list.map((r) => ({
      tag: r.tag,
      name: cleanName(r.name),
      icon: texture(r.texture),
      items: r.recipeType === "group" ? (r.groupItem ?? []).map(toRecipe) : [toRecipe(r)],
    }));
  const crafting = (await importModule(path.join(BP, "scripts/craft/crafting_recipe.js"))).craftingRecipe;
  const cooking = (await importModule(path.join(BP, "scripts/craft/cooking_recipe.js"))).cookingRecipe;
  fs.writeFileSync(path.join(DATA_OUT, "recipes.json"), JSON.stringify({ crafting: conv(crafting), cooking: conv(cooking) }, null, 2));
  console.log(`レシピ: 工作${crafting.length}件 / 料理${cooking.length}件`);
}

// ---------- ページ(Markdown)や設定から直接使っているアイコン ----------
// 例: ![](/game/textures/items/telephone.png) と書けば、ここで自動的にコピーされる
{
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      if (e.name === "node_modules" || e.name === "public" || e.name.startsWith(".") && e.name !== ".vitepress") return [];
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : /\.(md|mts|vue|ts)$/.test(e.name) ? [p] : [];
    });
  for (const file of walk(path.join(SITE, "docs"))) {
    for (const m of fs.readFileSync(file, "utf8").matchAll(/\/game\/(textures\/[^)"'\s]+?)\.png/g)) texture(m[1]);
  }
}

const missing = [...copied].filter(([, v]) => !v).map(([k]) => k);
console.log(`アイコン: ${[...copied.values()].filter(Boolean).length}枚書き出し` + (missing.length ? ` / 見つからない: ${missing.join(", ")}` : ""));
