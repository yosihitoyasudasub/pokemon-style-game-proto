# Pokémon-Style Game with LLM Conversation

このプロジェクトは、Pokémonスタイルの2DゲームにGemini APIを使用した動的会話システムを統合したものです。

## 機能

- 🎮 従来のPokémonスタイルゲームプレイ
- 🤖 Gemini APIを使用した動的NPC会話
- 🔒 セキュアなAPIキー管理
- 🎯 簡単な設定UI
- 📱 レスポンシブデザイン

## セットアップ

### 1. プロジェクトのクローン
```bash
git clone <repository-url>
cd pokemon-style-game-proto
```

### 2. Vercelでのデプロイ

#### 2.1 Vercel CLIのインストール
```bash
npm install -g vercel
```

#### 2.2 プロジェクトのデプロイ
```bash
vercel
```

#### 2.3 環境変数の設定
```bash
vercel env add GEMINI_API_KEY
```

または、Vercelダッシュボードで設定：
1. プロジェクト設定 → Environment Variables
2. キー: `GEMINI_API_KEY`
3. 値: あなたのGemini APIキー

### 3. Gemini APIキーの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. APIキーを作成
3. 作成したキーをコピー

## 使用方法

### 1. ゲーム開始
1. デプロイされたURLにアクセス
2. 右上の「LLM: 無効」ボタンをクリック
3. APIキーを入力して「設定を保存」
4. 「LLM会話機能を有効にする」にチェック
5. 「接続テスト」で動作確認

### 2. 会話システム
1. ゲーム内でNPC（長老または村人）に近づく
2. スペースキーを押して会話開始
3. プロンプトで話したい内容を入力
4. AIがNPCとして応答

### 3. 従来の会話モード
- LLM機能を無効にすると、従来の固定会話に戻ります

## 技術仕様

### アーキテクチャ
- **フロントエンド**: Vanilla JavaScript + HTML Canvas
- **バックエンド**: Vercel Serverless Functions
- **AI API**: Google Gemini Pro
- **セキュリティ**: サーバーサイドAPIキー管理

### ファイル構造
```
├── api/
│   └── gemini.js              # Vercel Serverless Function
├── js/
│   ├── conversationManager.js # 会話管理クラス
│   ├── apiKeyManager.js       # APIキー管理UI
│   └── utils.js               # ユーティリティ
├── data/                      # ゲームデータ
├── img/                       # 画像アセット
├── index.html                 # メインHTML
├── index.js                   # メインゲームロジック
├── classes.js                 # ゲームクラス
├── vercel.json               # Vercel設定
└── README.md                 # このファイル
```

## セキュリティ

### APIキー管理
- APIキーはサーバーサイドで安全に管理
- クライアントには露出しない
- 環境変数による保護

### 推奨事項
- 専用のAPIキーを使用
- 定期的にキーを更新
- 信頼できる環境でのみ使用

## トラブルシューティング

### よくある問題

#### 1. APIキーエラー
```
エラー: Service unavailable - API key not configured
```
**解決方法**: Vercel環境変数にAPIキーを正しく設定

#### 2. CORSエラー
```
エラー: Access to fetch at '/api/gemini' from origin '...' has been blocked
```
**解決方法**: vercel.jsonのCORS設定を確認

#### 3. タイムアウトエラー
```
エラー: Service temporarily unavailable
```
**解決方法**: 
- APIキーの有効性を確認
- ネットワーク接続を確認
- Vercelの制限を確認

### デバッグ
1. ブラウザの開発者ツールでコンソールを確認
2. Vercelダッシュボードでログを確認
3. 接続テスト機能を使用

## 制限事項

### Vercel無料プラン制限
- 実行時間: 10秒まで
- リクエスト数: 月100,000リクエストまで
- 同時実行: 最大10個

### 推奨使用量
- 個人使用: 十分
- 小規模テスト: 十分
- 大規模運用: 有料プラン推奨

## ライセンス

このプロジェクトは教育目的で作成されています。

## サポート

問題や質問がある場合は、GitHubのIssuesで報告してください。 