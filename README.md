# Life-Bridge

人生の重要なイベント（結婚、出産、転職、引越し、介護）をサポートするWebアプリケーション

## 主な機能

- **ライフイベント管理**: 各イベントに必要な手続きをチェックリスト形式で管理
- **AIコンシェルジュ**: Gemini APIを活用した質問応答システム
- **期限リマインダー**: ブラウザ通知でタスクの期限をお知らせ
- **メモ帳**: Google Keepスタイルのメモ管理機能
- **給付金シミュレーター**: 収入・家族構成に基づく給付金試算

## 技術スタック

- **フレームワーク**: Vite + React 18
- **言語**: TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **AI**: Google Gemini API
- **状態管理**: React Hooks
- **ルーティング**: React Router

## 開発環境のセットアップ

### 必要要件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/tomomini0815/Life-Bridge.git

# ディレクトリに移動
cd Life-Bridge

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .envファイルを編集してGemini APIキーを設定
```

### 環境変数

`.env`ファイルに以下を設定：

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Gemini APIキーは[Google AI Studio](https://makersuite.google.com/app/apikey)で取得できます。

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:8080` を開きます。

### ビルド

```bash
npm run build
```

## デプロイ

このプロジェクトはVercelにデプロイできます。

### Vercelへのデプロイ手順

1. [Vercel](https://vercel.com)にログイン
2. GitHubリポジトリを接続
3. 環境変数`VITE_GEMINI_API_KEY`を設定
4. デプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tomomini0815/Life-Bridge)

## プロジェクト構成

```
src/
├── components/     # Reactコンポーネント
├── services/       # ビジネスロジック・API連携
├── types/          # TypeScript型定義
├── data/           # 静的データ
└── lib/            # ユーティリティ関数
```

## ライセンス

MIT License

## 作者

[@tomomini0815](https://github.com/tomomini0815)
