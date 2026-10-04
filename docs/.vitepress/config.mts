import { defineConfig } from 'vitepress'

// GitHub Pages のURL(https://ユーザー名.github.io/リポジトリ名/)に合わせるための設定。
// 自動公開(GitHub Actions)では BASE にリポジトリ名が入る。独自ドメインにする場合は '/' のままでOK。
const base = process.env.BASE || '/'

// 見出しのリンク(#〜)を作る関数。標準のままだと「バ」「プ」などの濁点が分解されて
// ページ内リンクが効かなくなるので、日本語を分解しない形に作り直している
const slugify = (str: string) =>
  str
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[\u0000-\u001f]/g, '')
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
    .normalize('NFC')

export default defineConfig({
  base,
  lang: 'ja-JP',
  title: '社会性サバイバル',
  description: 'マイクラ統合版サーバー『社会性サバイバル』(しゃかさば)の参加方法・規約・追加要素のまとめ',
  cleanUrls: true,
  markdown: { anchor: { slugify } },
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.png` }]
  ],

  themeConfig: {
    siteTitle: 'しゃかさば ガイド',
    logo: '/game/textures/items/telephone.png',

    nav: [
      { text: 'はじめに', link: '/guide/rules', activeMatch: '/guide/(rules|join)' },
      { text: '遊び方', link: '/play/commands', activeMatch: '/play/' },
      { text: 'アイテム図鑑', link: '/items/', activeMatch: '/items/' },
      { text: 'よくある質問', link: '/guide/faq' },
      { text: '変更履歴', link: '/changelog' }
    ],

    sidebar: [
      {
        text: 'はじめに',
        items: [
          { text: '参加規約', link: '/guide/rules' },
          { text: '参加方法', link: '/guide/join' }
        ]
      },
      {
        text: '遊び方',
        items: [
          { text: 'チャットコマンド', link: '/play/commands' },
          { text: 'K-phoneアプリ', link: '/play/kphone' },
          { text: 'スキルツリー', link: '/play/skilltree' },
          { text: 'Discord botで追加できるもの', link: '/play/bot' }
        ]
      },
      {
        text: 'アイテム図鑑',
        items: [
          { text: '追加アイテム・ブロック', link: '/items/' },
          { text: '工作・料理レシピ', link: '/items/recipes' },
          { text: 'Keizonラインナップ', link: '/items/keizon' },
          { text: 'そのほかの仕様', link: '/items/others' }
        ]
      },
      {
        text: 'サポート',
        items: [
          { text: 'よくある質問', link: '/guide/faq' },
          { text: '変更履歴', link: '/changelog' }
        ]
      }
    ],

    outline: { level: [2, 3], label: 'このページの内容' },
    docFooter: { prev: '前のページ', next: '次のページ' },
    lastUpdated: { text: '最終更新' },
    darkModeSwitchLabel: '表示モード',
    sidebarMenuLabel: 'メニュー',
    returnToTopLabel: 'ページの先頭へ',
    search: {
      provider: 'local',
      options: {
        // 標準の検索は「空白で区切られた単語」でしか探せず、空白のない日本語だと探せない。
        // そこで日本語は2文字ずつに区切って登録・検索する(英数字はそのまま単語として扱う)。
        // ※この関数はブラウザ側にも文字列のまま送られるので、外の変数を使わないこと
        miniSearch: {
          options: {
            tokenize: (text) => {
              const tokens = []
              const parts = text.toLowerCase().match(/[a-z0-9_]+|[^\sa-z0-9_\p{P}\p{S}]+/gu) || []
              for (const p of parts) {
                if (/^[a-z0-9_]+$/.test(p) || p.length === 1) tokens.push(p)
                else for (let i = 0; i < p.length - 1; i++) tokens.push(p.slice(i, i + 2))
              }
              return tokens
            }
          },
          searchOptions: {
            combineWith: 'AND',
            fuzzy: false,
            prefix: true
          }
        },
        translations: {
          button: { buttonText: '検索', buttonAriaLabel: '検索' },
          modal: {
            noResultsText: '見つかりませんでした',
            resetButtonTitle: 'リセット',
            footer: { selectText: '選択', navigateText: '移動', closeText: '閉じる' }
          }
        }
      }
    },
    footer: {
      message: '『社会性サバイバル』運営',
      copyright: 'Minecraftは Mojang Studios の商標です。本サイトは公式とは関係ありません。'
    }
  }
})
