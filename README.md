# TwitCasting Viewer

TwitCastingのユーザー情報、ライブ情報、録画情報を取得・表示するWebアプリケーションのプロトタイプです。

## 機能

- **OAuth認証**: TwitCastingのImplicitフローを使用した認証
- **ユーザー情報表示**: 認証ユーザーの基本情報を表示
- **ライブ情報取得**: 指定ユーザーの現在配信中のライブ情報を表示
- **録画一覧表示**: 指定ユーザーの過去の録画一覧を表示
- **レスポンシブデザイン**: デスクトップ・モバイル両対応

## 技術スタック

- **フロントエンド**: React 18 + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **アイコン**: Lucide React
- **認証**: OAuth 2.0 (Implicit Grant)

## セットアップ

### 前提条件

1. Node.js 18以上がインストールされていること
2. TwitCastingでアプリケーションを登録し、クライアントIDを取得していること

### インストール

1. プロジェクトディレクトリに移動
```bash
cd twitcasting-app
```

2. 依存関係をインストール
```bash
npm install
```

3. クライアントIDの設定
`src/App.jsx`の以下の行を編集し、実際のクライアントIDに置き換えてください：
```javascript
const CLIENT_ID = 'YOUR_CLIENT_ID' // 実際のクライアントIDに置き換えてください
```

4. 開発サーバーを起動
```bash
npm run dev
```

## TwitCasting アプリ登録

1. [TwitCasting Developer](https://apiv2.twitcasting.tv/)にアクセス
2. 新しいアプリケーションを作成
3. **Redirect URI**に以下を設定：
   - 開発環境: `http://localhost:5173/`
   - 本番環境: あなたのドメイン
4. **Grant Type**で「Implicit」を選択
5. 取得したクライアントIDをアプリに設定

## 使用方法

1. アプリケーションにアクセス
2. 「TwitCastingで認証」ボタンをクリック
3. TwitCastingでアプリ連携を許可
4. 認証完了後、ユーザー検索フィールドにユーザーIDまたはスクリーンIDを入力
5. 「検索」ボタンをクリックしてライブ・録画情報を表示

## API エンドポイント

このアプリケーションは以下のTwitCasting APIエンドポイントを使用しています：

- `GET /verify_credentials` - 認証ユーザー情報取得
- `GET /users/:user_id/current_live` - 現在のライブ情報取得
- `GET /users/:user_id/movies` - 過去の録画一覧取得

## 注意事項

- このアプリケーションはプロトタイプです
- 実際の使用には適切なクライアントIDの設定が必要です
- CORS制限により、一部のAPIが動作しない場合があります
- 本番環境では適切なエラーハンドリングとセキュリティ対策を実装してください

## ライセンス

MIT License

