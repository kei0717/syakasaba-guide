# ダンジョン

ワールドには **3種類のダンジョン** があり、それぞれのゲートから中に入れます。どのダンジョンも、最深部にはボスが待っています。

<Shots :images="['dungeon_gate_1.webp', 'dungeon_gate_2.webp', 'dungeon_gate_3.webp']" alt="ダンジョンのゲート" />

## ロール {#role}

ダンジョンに入る前に、画面で **ロール** を1つ選びます。選んだロールは、ダンジョンから出るまで変えられません。ロールごとに、ダンジョンの中だけで効く効果があります。

| ロール | ダンジョンの中での効果 | 専用アイテム |
| --- | --- | --- |
| タンク | ハートが2つ増える | 守護の大盾 |
| ヒーラー | ダウンした仲間を起こすのが速い | 癒しの杖 |
| アタッカー | 足が速くなる | 勇者の大剣 |
| メイジ | 弾が当たった敵が遅くなる | 黒魔の書 |

### 専用アイテム {#role-item}

ロールの専用アイテムは、ダンジョンの中で、そのロールを選んでいるときだけ使えます。ダンジョンの中では、そのロールの武器にもなります。

- **使う** と1つ目のスキル、**しゃがみながら使う** と2つ目のスキルが出ます。スキルの説明と数字は、アイテムの説明に出ます。
- 着ている防具が強いほど、殴る強さとスキルの効き目が上がります。
- タンクは、しゃがんでいる間は盾を構えて受けるダメージを減らせます。構えた直後に攻撃を受けると、はじき返せます。
- ヒーラーは、[ダウン](/play/down) した仲間を離れた所から起こせます。

レシピ本はスキルツリーで手に入ります。

<div class="ss-item">

### ![](/game/textures/items/role/tank.png){.hicon} 守護の大盾(タンク) {#tank}

<Recipe tag="crafting_recipe_role_tank" />
</div>

<div class="ss-item">

### ![](/game/textures/items/role/healer.png){.hicon} 癒しの杖(ヒーラー) {#healer}

<Recipe tag="crafting_recipe_role_healer" />
</div>

<div class="ss-item">

### ![](/game/textures/items/role/attacker.png){.hicon} 勇者の大剣(アタッカー) {#attacker}

<Recipe tag="crafting_recipe_role_attacker" />
</div>

<div class="ss-item">

### ![](/game/textures/items/role/mage.png){.hicon} 黒魔の書(メイジ) {#mage}

<Recipe tag="crafting_recipe_role_mage" />
</div>

## 魔法石 {#magic-stone}

ダンジョンで手に入る魔法石を専用アイテムにはめると、スキルの性能が変わります。はめられる魔法石は1つだけで、強くなるところと引きかえに、少し弱くなるところもあります。

| 魔法石 | 伸びるもの |
| --- | --- |
| ![](/game/textures/items/role/stone_red.png){.hicon} 赤の魔法石 | 強さ |
| ![](/game/textures/items/role/stone_blue.png){.hicon} 青の魔法石 | 時間(効果の長さ・待ち時間) |
| ![](/game/textures/items/role/stone_green.png){.hicon} 緑の魔法石 | 範囲 |

<div class="ss-item">

### ![](/game/textures/icon/magic_stone_table.png){.hicon} 魔法石の台 {#magic-stone-table}

専用アイテムを持って触ると、魔法石をはめる・外す画面が開きます。はめる前に、今とはめたあとの数字をくらべられます。レシピ本はスキルツリーで手に入ります。

<Recipe tag="crafting_recipe_magic_stone_table" />
</div>
