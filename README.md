# しゃかさば ガイド

『社会性サバイバル』の参加方法・規約・追加要素をまとめたサイトです。[VitePress](https://vitepress.dev/) で作っていて、GitHubに Push すると自動で公開されます。

## 文章を直すとき

ページはすべて `docs/` の中の Markdown ファイルです。

| ページ | ファイル |
| --- | --- |
| トップ | `docs/index.md` |
| 参加方法 / 参加規約 / よくある質問 | `docs/guide/join.md` / `rules.md` / `faq.md` |
| チャットコマンド / K-phone / スキルツリー / Discord bot | `docs/play/commands.md` / `kphone.md` / `skilltree.md` / `bot.md` |
| 追加アイテム / 工作・料理レシピ / Keizon / そのほか | `docs/items/index.md` / `recipes.md` / `keizon.md` / `others.md` |
| 変更履歴 | `docs/changelog.md` |

- メニューの並びは `docs/.vitepress/config.mts` の `sidebar` で変えられます。
- サイトの色は `docs/.vitepress/theme/style.css` の先頭で変えられます。
- スクショは `docs/public/images/` に置き、ページの中で `<Shots :images="['ファイル名.webp']" />` と書くと表示されます。

## ゲームのデータを更新するとき

スキルツリー・Keizonの値段・レシピの素材・アイコンは、アドオンから自動で書き出しています。ゲームを更新したら、websiteフォルダで次を実行してから Push します。

```
node scripts/export-addon.mjs "<BPフォルダ>" "<RPフォルダ>"
```

アドオンのコードそのものはサイトに入りません(名前・値段・素材・アイコン画像だけ)。

ページの中で使える自動表示:

- `<Recipe tag="crafting_recipe_xxx" />` … レシピの素材と、スキルツリーでの入手方法
- `<RecipeRest />` … そのページで紹介していないレシピの一覧
- `<Keizon id="kei:item_xxx" />` … Keizonの値段(まとめ商品は `name="体操着"` のように名前で)
- `<KeizonRest />` … そのページで紹介していない商品の一覧
- `<SkillTree />` … スキルツリー全体

## 手元で確認するとき

```
npm install
npm run dev
```
