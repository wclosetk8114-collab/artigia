# BUILDERS — 会員募集LP

AI×フリーランスのスクール型コミュニティ「BUILDERS（ビルダーズ）」の会員募集サイト。
静的HTML（ビルド不要）。Vercel に接続済みで、main に push すると自動で再デプロイされる。

## 構成

```
index.html       トップ（LP本体）
terms.html       利用規約（事業譲渡条項あり・第11条）
privacy.html     プライバシーポリシー（事業承継に伴う提供・第5条）
tokushoho.html   特定商取引法に基づく表記
legal.css        法務ページ共通スタイル
```

## 料金プランと Stripe

現在は **テストモード**。実際の課金は発生しない。

| コース | 月額 | price_id (test) |
| --- | --- | --- |
| FORGE supporter 初級 | 2,200円 | price_1UCFdfGV1dNJ9MiqSLFBhXBj |
| FORGE supporter 中級 | 3,300円 | price_1UCFdkGV1dNJ9Miqgk5TbTXl |
| FORGE supporter 上級 | 4,400円 | price_1UCFdoGV1dNJ9MiqySjQ5Sgu |
| FORGE startup 初級 | 5,500円 | price_1UCFduGV1dNJ9Miq2ZlzW6cv |
| FORGE startup 中級 | 8,800円 | price_1UCFdyGV1dNJ9MiqdAlgRYJl |
| FORGE startup 上級 | 11,000円 | price_1UCFe3GV1dNJ9MiqCSdU7PHV |
| FORGE freelance 初級 | 16,500円 | price_1UCFe8GV1dNJ9MiqRL7yG3O1 |
| FORGE freelance 中級 | 22,000円 | price_1UCFeDGV1dNJ9MiqAgDesCir |
| FORGE freelance 上級 | 33,000円 | price_1UCFeJGV1dNJ9MiqoqEuNchu |

創設メンバー枠は先行33名まで。どのコースでもこの価格を在籍中据え置く。

テスト決済用カード：`4242 4242 4242 4242` / 有効期限は未来の日付 / CVCは任意の3桁。

Payment Link は `index.html` の料金セクションに直接ベタ書きしている。
本番化のときはここを Live の Payment Link に差し替える。

## 公開前にやること

1. `tokushoho.html` の金色プレースホルダ（事業者名・所在地・電話番号・メール）を実際の情報に差し替える
2. `privacy.html` のお問い合わせ窓口を記入する
3. Stripe を Live モードに切り替える（`switch-to-live-mode` スキル）
4. `index.html` のヒーロー下と料金下にある「テストモード」の注記を削除する

## 更新方法

正本は GitHub リモート。ローカルは作業コピー。

```bash
git clone <repo> && cd artigia
# 編集
git add -A && git commit -m "..." && git push
# → Vercel が自動で再デプロイ
```

Cowork からは「BUILDERS のサイトを直して」で `update-deploy` が走る。
Vercel プロジェクトの再作成はしない（名前衝突で重複が増える）。

## 設計の背景

「半年で売却できるビジネスモデル」として設計している。以下は意図的な仕様なので勝手に外さないこと。

- **主宰者を表に出さない** — 講師名・顔・個人ブランドをサイトに載せない。属人性が売却価値を下げるため
- **利用規約 第11条／プライバシーポリシー 第5条** — 事業譲渡時に会員情報を承継できる条項。これがないと会員名簿を渡せず、事業の価値がゼロになる
- **高額バックエンド講座を作らない** — 継続収益にならず、売却価格に乗らない
- **運営を1人に集めない** — 教材と週1のペア学習で場が回る構造。オーナーが交代しても壊れないことの証明になる
