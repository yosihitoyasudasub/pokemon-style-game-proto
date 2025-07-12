# Pokémon-Style Game with LLM Conversation

このプロジェクトは、Pokémonスタイルの2DゲームにGemini APIを使用した動的会話システムを統合したものです。元のchriscourses/pokemon-style-gameをベースに、AIによる自然なNPC会話機能を追加しています。

## プロジェクト背景

### 元プロジェクト
- **ベース**: [chriscourses/pokemon-style-game](https://github.com/chriscourses/pokemon-style-game)
- **作者**: Chris Courses
- **目的**: バニラJavaScriptとHTML Canvasを使用したゲーム開発の学習

### 拡張内容
- Google Gemini APIによる動的NPC会話システム
- 多言語対応（日本語・英語）
- セキュアなAPIキー管理
- Vercelデプロイ対応

## 目的

1. **教育目的**: ゲーム開発とAI統合の学習
2. **技術実証**: バニラJavaScriptでのAI機能統合
3. **ユーザー体験向上**: 動的なNPC会話による没入感の向上

## デプロイ

### デプロイ先
- **本番環境**: [https://pokemon-style-game-proto.vercel.app](https://pokemon-style-game-proto.vercel.app)

## 遊び方

### 基本操作
- **移動**: 矢印キーまたはWASD
- **会話**: NPCに近づいてスペースキー
- **バトル**: 特定エリアで自動開始

### LLM会話機能
1. ゲーム画面右上の「LLM: 無効」ボタンをクリック
2. APIキーを入力して「設定を保存」
3. 「LLM会話機能を有効にする」にチェック
4. 「接続テスト」で動作確認
5. NPCに近づいてSpaceキーを押下して会話開始

### 従来モード
- LLM機能を無効にすると、固定会話モードに切り替わります

## APIキーの取得・設定方法

### 1. Google Gemini APIキーの取得
1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. APIキーをコピー（一度しか表示されません）

### 2. ゲーム内での設定
1. ゲーム画面右上の設定ボタンをクリック
2. APIキー入力欄に取得したキーを入力
3. 「設定を保存」をクリック
4. 「LLM会話機能を有効にする」にチェック

## 技術仕様

### フロントエンド
- **言語**: Vanilla JavaScript (ES6+)
- **レンダリング**: HTML5 Canvas API
- **UI**: カスタムCSS + HTML
- **フォント**: PixelMplus10/12（ピクセルフォント）

### バックエンド
- **プラットフォーム**: Vercel Serverless Functions
- **API**: Google Gemini 1.5 Flash
- **通信**: REST API (JSON)

### ゲームエンジン
- **ゲームループ**: requestAnimationFrame
- **状態管理**: カスタム状態マシン
- **衝突検出**: AABB（Axis-Aligned Bounding Box）
- **アニメーション**: スプライトシートベース

### データ管理
- **マップデータ**: Tiled Map Editor形式
- **ゲームデータ**: JSON形式
- **会話履歴**: ローカルストレージ

## ファイル・フォルダ構造

```
pokemon-style-game-proto/
├── api/
│   └── gemini.js              # Vercel Serverless Function
├── js/
│   ├── conversationManager.js # 会話管理クラス
│   ├── apiKeyManager.js       # APIキー管理UI
│   └── utils.js               # ユーティリティ関数
├── data/
│   ├── attacks.js             # 攻撃データ
│   ├── audio.js               # 音声設定
│   ├── battleZones.js         # バトルエリア
│   ├── characters.js          # キャラクターデータ
│   ├── collisions.js          # 衝突データ
│   └── monsters.js            # モンスターデータ
├── img/                       # 画像アセット
├── audio/                     # 音声ファイル
├── fonts/                     # フォントファイル
├── index.html                 # メインHTML
├── index.js                   # メインゲームロジック
├── classes.js                 # ゲームクラス定義
├── battleScene.js             # バトルシーン管理
├── vercel.json               # Vercel設定
├── .gitignore                # Git除外設定
├── README.md                 # このファイル
├── pokemon-style-game-spec.md # 詳細仕様書
└── pokemon-style-game-ai-design.md # AI設計書
```

## セキュリティ

### APIキー管理
- **クライアントサイド**: ローカルストレージでAPIキーを管理
- **サーバーサイド**: フロントエンドから送信されたAPIキーを使用
- **HTTPS通信**: すべてのAPI通信は暗号化

### 推奨事項
- 専用のAPIキーを使用
- 定期的にキーをユーザー自身で更新
- 信頼できる環境でのみ使用

## 推奨事項

### 開発環境
- モダンブラウザ（Chrome, Firefox, Safari, Edge）

### 運用環境
- Vercel（推奨）
- その他のサーバーレスプラットフォーム

### パフォーマンス
- 画像の最適化
- 音声ファイルの圧縮
- API呼び出しの制限

## ライセンス

このプロジェクトは教育目的で作成されています。

### 元プロジェクトのライセンス
- **ベースプロジェクト**: chriscourses/pokemon-style-game
- **ライセンス**: 元プロジェクトのライセンスに従います

### 使用ライセンス
- **フォント**: PixelMplus（商用利用可能）
- **画像**: 元プロジェクトのライセンスに従います

## 謝辞

### 元プロジェクト
- **chriscourses/pokemon-style-game**: ゲームの基盤となるコードとアセット
- **Chris Courses**: 包括的なゲーム開発チュートリアルの提供

### 技術・ライブラリ
- **Google Gemini API**: AI会話機能の提供
- **Vercel**: サーバーレスデプロイプラットフォーム
- **HTML5 Canvas**: ゲームレンダリング技術
- **PixelMplus**: ピクセルフォント

### コミュニティ
- オープンソースコミュニティ
- ゲーム開発者コミュニティ
- AI開発者コミュニティ

---

## サポート

問題や質問がある場合は、GitHubのIssuesで報告してください。

### 貢献
プルリクエストやイシューの報告を歓迎します。

### 連絡先
- GitHub: [プロジェクトリポジトリ](https://github.com/your-username/pokemon-style-game-proto)
- Issues: [GitHub Issues](https://github.com/your-username/pokemon-style-game-proto/issues) 