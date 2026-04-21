# WEB予約 マスター編集ツール

メディカルフォースのWEB予約画面をそのまま編集 → Googleスプレッドシートのマスターシートへ自動反映するWebアプリです。

---

## セットアップ手順

### 1. Vercelにデプロイ

```bash
# GitHubにリポジトリを作成してpush
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/your-repo/web-yoyaku-app.git
git push -u origin main
```

Vercel (https://vercel.com) にログインして「New Project」→ GitHubリポジトリを選択してデプロイ。

---

### 2. Google Apps Script の設定

1. マスターシート（Googleスプレッドシート）を開く
2. **拡張機能 > Apps Script** を開く
3. `GAS_CODE.gs` の内容を貼り付けて保存（Ctrl+S）
4. **デプロイ > 新しいデプロイ** をクリック
   - 種類：**ウェブアプリ**
   - 説明：「WEB予約編集ツール連携」
   - 実行ユーザー：**自分**
   - アクセスできるユーザー：**全員**
5. **デプロイ** ボタンをクリック
6. 表示された **ウェブアプリURL** をコピー

---

### 3. WebアプリにGAS URLを設定

1. デプロイしたVercel URLにアクセス
2. 右上の **⚙ 設定** ボタンをクリック
3. コピーしたGAS URLを貼り付け
4. **接続テスト** をクリック

---

## 使い方

- 左側の編集エリアでメニュー名・時間目安・金額・説明文・マスター施術名を編集
- 右側にWEB予約画面のリアルタイムプレビューが表示される
- 編集後1.5秒で **自動的にGoogleスプレッドシートへ保存**
- 「スプシから読み込む」ボタンで最新のスプレッドシートデータを取得

## スプレッドシートへの書き込み内容

`Web予約_編集ツール用` というシートが自動作成され、以下が記録されます：

| 列 | 内容 |
|----|------|
| A1 | JSONデータ（内部用） |
| C列〜 | 人が読める表形式（導線・カテゴリ・メニュー名・施術名・説明文・金額・時間・複数選択） |

---

## ローカル開発

```bash
npm install
npm run dev
# → http://localhost:3000
```
