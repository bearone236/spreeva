## プロジェクト概要
![Spreeva Icon](public/spreeva-icon.png)

### 1. プロジェクト名
**Spreeva (スプリーバ)**:  
Spreeva は「Speak（話す）」と「Revive（活性化）」を組み合わせた造語

「Revive」: 新しい可能性を開き、眠っていた英語の力を呼び覚まし、活性化することを意味します。この「Revive」は、これまで表に出せなかったスピーキング力を、練習と学びを通じて発展させることを象徴しています。
「Speak」: 言葉を使う楽しさを取り戻し、自由に英語を話せる自信をつけるという目標を表現する。
「Spreeva」: この2つの要素を組み合わせることで、英語学習における「新しいスタート」を意味する名前となっています。

Spreeva の名前は、「英語力の復活や成長」を意味し、楽しさや自由さといった要素も含む理想的な名称として位置付けられる.

### 2. 背景・目的
オーストラリアでの語学交流で、1分しか話せなかった悔しさを元に、英語のキャッチボールを活性化するためのアプリを作成しました。
短い会話ではなく、複数の文でしっかりと相手とコミュニケーションを取ることを目指しています。

### 3. ターゲットユーザー
- リスニング・スピーキング力を向上させたい人
- 英語を話す環境が欲しい人
- 英語スピーキングテストを実施したい教育機関
- 英語思考力を身につけたい人

## 4. 主要機能

- **時間制限スピーキング練習**: ランダム・指定ワードを基に質問が表示され、設定した時間内でスピーキングの練習ができる。
- **OCR壁打ち機能**： PDF等のファイルをアップロードすることによって、よりパーソナライズされたテーマを出力できる。こちらを用いて、たとえば国際学会論文の質疑応答練習を行うことができる。
- **団体機能**： 団体でユーザーのスピーキング力を管理することができる。そのため、教育機関での有用性が期待できる

## 5. 既存サービスとの比較・強み

- **時間制限スピーキング練習**: 短い時間で話す力を鍛える点で、他のアプリと差別化されています。
- **OCRとAIを掛け合わせた国際学会壁打ち機能**：ただテーマを出題させるだけでなく、自身が作成したPDF等のファイルを元にテーマが出題されるのでよりパーソナライズされる。

## 6. アーキテクチャ概要

**アーキテクチャパターン**: オニオンアーキテクチャ  
- **Domain層**: ビジネスルールやエンティティを定義。  
- **UseCase層**: ビジネスアクションを実行し、リポジトリ層と連携。  
- **Repository層**: データベースや外部サービスとの通信を抽象化。  
- **Controller層**: HTTPリクエストを処理し、レスポンスを返す。

## 7. 技術スタック

- **言語**: TypeScript
- **フロントサイド**: Next.js (App Router)
- **サーバーサイド**: Hono
- **独自機能API**: FastAPI, python
- **Database**: Supabase Database(PostgreSQL)
- **グローバル状態管理**: Zustand
- **音声データ格納**： Supabase Storage
- **マイグレーションツール**: Prisma
- **ホスティング**: Vercel, Cloud Run
- **デザイン**: Shadcn/ui, Tailwind CSS
- **アイコン**: Lucide
- **認証機能**: Auth.js
- **環境構築**: Biome
- **Git管理**: Lefthook
- **その他機能**： Google Cloud Vision API, Google Cloud Speech-To-Text API, Gemini API

## 8. 特記事項

開発サイクルを上げるために、モダンな技術選定を行い、開発効率と拡張性を重視しています。また、スピーキング力を強化するための独自機能を持つことがSpreevaの強みです。

## 9. ライセンス
このプロジェクトはMITライセンスの下でライセンスされています。詳細については、[LICENSE](./LICENSE) ファイルをご覧ください。