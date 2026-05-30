# THU Auto Login

Tsinghua University の学習システムへの遷移とログイン画面操作を補助する Chrome 拡張です。認証情報を拡張機能内に保存せず、ブラウザ側の既存入力・自動入力を利用する設計にしています。

- GitHub: https://github.com/Mr-Sakasu/THU-auto-login
- 種別: Chrome Extension、学習環境の操作自動化
- 対象: `learn.tsinghua.edu.cn`、`id.tsinghua.edu.cn`

## 作成物の説明

学習システムのログイン導線で発生するクリック操作や再ログイン導線を自動化する軽量な拡張機能です。ログインフォームの DOM を検出し、必要な入力欄が埋まっている場合だけ送信操作を行います。

## 担当した役割

- Manifest V3 の拡張構成を設計
- content script によるページ判定、ボタン検出、フォーム送信処理を実装
- autofill や fingerprint hidden field の準備完了を待つためのリトライ処理を実装
- 認証情報をコード・設定ファイルに持たせない運用に整理

## 直面した課題と解決方法

- ログイン画面の DOM がページ遷移や SSO 側で変わるため、複数 selector と fallback を用意しました。
- ブラウザの autofill が content script 実行直後に反映されない場合があるため、`setInterval` と `MutationObserver` で短時間だけ再検出します。
- セキュリティ上、ID/パスワードを拡張機能に保存しない方針にし、入力済みフィールドが存在する場合のみ submit する実装にしました。

## 技術情報

- Chrome Extension Manifest V3
- JavaScript content script
- DOM selector fallback
- `MutationObserver`
- `document_idle` 実行

## 関連リポジトリ

- Portfolio: https://github.com/Mr-Sakasu/portfolio
- 競技プログラミング: https://github.com/Mr-Sakasu/abc
