# AI Creator Camp — 会員募集LP

90日でAIを身につけ、自分のサービスの試作品をつくるオンラインブートキャンプ
「AI Creator Camp」の募集サイト。運営ブランドは **FORGE**。
静的HTML（ビルド不要）。Vercel に接続済みで、main に push すると自動で再デプロイされる。

旧称は BUILDERS（さらにその前は ARTIGIA）。2026-09-06 に AI Creator Camp へ変更。

## 構成

```
index.html       トップ（LP本体）
terms.html       利用規約（事業譲渡条項あり・第11条）
privacy.html     プライバシーポリシー（事業承継に伴う提供・第5条）
tokushoho.html   特定商取引法に基づく表記
legal.css        法務ページ共通スタイル
```

## サービス設計

- 期間は90日（Month1 / Month2 / Month3）
- 毎月末に**通過審査**。通った人だけが次の月に進む
- 落ちた場合は退会ではなく、翌月に同じ月をやり直す（会費は同額）
- 3つの関門を通ると修了。ゴールは「動く試作品・価格表・提案書」の3点セット
- 0期は先行33名まで

| 月 | 関門 | 提出物 |
| --- | --- | --- |
| Month1（DAY1-30）つくれる状態になる | 関門1 | 動くものを1つ |
| Month2（DAY31-60）自分の商品を決める | 関門2 | 企画書＋試作の骨組み |
| Month3（DAY61-90）売れる形にする | 関門3 | デモ＋価格表＋提案書 |

## 料金プランと Stripe

**月額制**。月ごとに金額が上がる（進むほど運営の手数が増えるため）。
現在は **テストモード**。実際の課金は発生しない。

| コース | 月 | 月額 | price_id (test) |
| --- | --- | --- | --- |
| LIGHT | Month1 | 9,900円 | price_1UCVdFGV1dNJ9MiqdKaX1Kx5 |
| LIGHT | Month2 | 13,200円 | price_1UCVdGGV1dNJ9MiqROKJcq1a |
| LIGHT | Month3 | 16,500円 | price_1UCVdHGV1dNJ9MiqV7XbDNfb |
| STANDARD | Month1 | 27,500円 | price_1UCVdMGV1dNJ9MiqRQ4AYf47 |
| STANDARD | Month2 | 33,000円 | price_1UCVdOGV1dNJ9MiqCmUhKrca |
| STANDARD | Month3 | 38,500円 | price_1UCVdPGV1dNJ9MiqKUX5gN2f |
| PRO | Month1 | 55,000円 | price_1UCVdTGV1dNJ9MiqbY4gHZVo |
| PRO | Month2 | 66,000円 | price_1UCVdUGV1dNJ9MiqHUKHi8Uo |
| PRO | Month3 | 77,000円 | price_1UCVdWGV1dNJ9Miq9AaLGrmL |

3ヶ月合計：LIGHT 39,600円 ／ STANDARD 99,000円 ／ PRO 198,000円（すべて税込）

テスト決済用カード：`4242 4242 4242 4242` / 有効期限は未来の日付 / CVCは任意の3桁。

Payment Link は `index.html` の料金セクションに直接ベタ書きしている。
本番化のときはここを Live の Payment Link に差し替える。

旧 BUILDERS 時代の9つの price（FORGE supporter / startup / freelance）は使っていない。

## 公開前にやること

1. `tokushoho.html` の金色プレースホルダ（事業者名・所在地・電話番号・メール）を実際の情報に差し替える
2. `privacy.html` のお問い合わせ窓口を記入する
3. Stripe を Live モードに切り替える（`switch-to-live-mode` スキル）
4. `index.html` のヒーロー下と料金下にある「テストモード」の注記を削除する
5. ロゴが確定したらヘッダーの文字ロゴを差し替え、favicon を入れる

## 更新方法

正本は GitHub リモート。ローカルは作業コピー。

```bash
git clone <repo> && cd artigia-repo
# 編集
git add -A && git commit -m "..." && git push
# → Vercel が自動で再デプロイ
```

Cowork からは「AI Creator Camp のサイトを直して」で `update-deploy` が走る。
Vercel プロジェクトの再作成はしない（名前衝突で重複が増える）。
リポジトリ名・Vercel プロジェクト名は `artigia` のまま（変更するとURLが変わるため据え置き）。

## 設計の背景

「半年で売却できるビジネスモデル」として設計している。以下は意図的な仕様なので勝手に外さないこと。

- **主宰者を表に出さない** — 講師名・顔・個人ブランドをサイトに載せない。属人性が売却価値を下げるため。FAQの「誰が教えるの？」も運営チームと答えている
- **利用規約 第11条／プライバシーポリシー 第5条** — 事業譲渡時に会員情報を承継できる条項。これがないと会員名簿を渡せず、事業の価値がゼロになる
- **月額制を維持する** — 90日一括ではなく月額にしているのは、継続収益が年買法での売値に直結するため
- **審査は運営1人に依存させない** — 審査基準を事前公開し、ひとつ上の月のメンバーも審査に入る。オーナーが交代しても回ることの証明になる
- **正直セクションを消さない** — 会員0人を明かしたうえで33名限定にしている。実績がない段階での唯一の誠実な売り方
<!-- deploy 1788673051 -->
<!-- retry 1788673580 -->
<!-- check 1788686154 -->
<!-- public-test 1788687374 -->
