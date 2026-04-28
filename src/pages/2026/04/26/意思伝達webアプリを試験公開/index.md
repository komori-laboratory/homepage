---
layout: ../../../../../layouts/BaseLayout.astro
title: 意思伝達Webアプリを試験公開 | 株式会社小森研究所
description: 株式会社小森研究所は、ALSや多系統萎縮症など、身体の動作が極めて限定的な方が、たった1つのスイッチ入力だけで日本語文章を作成できる意思伝達Webアプリの試験公開を開始しました。
ogType: article
publishedTime: 2026-04-26T00:00:00+09:00
---

2026年4月26日

# 意思伝達Webアプリを試験公開

株式会社小森研究所(以下当社)は、ALSや多系統萎縮症 (MSA) など、身体の動作が極めて限定的な方が、たった1つのスイッチ入力(走査入力)だけで日本語文章を作成できる「意思伝達」Webアプリの試験公開を開始しました。

<img src="/images/activities/2026-04-26-ishindenshin-screenshot.webp" alt="意思伝達Webアプリの画面" class="figure-screenshot" />


<p style="text-align: center;">意思伝達Webアプリ(試験公開版): <a href="https://komolab.jp/ishindenshin/public/">https://komolab.jp/ishindenshin/public/</a></p>

ALSや多系統萎縮症などの疾患をお持ちの方の中には、ご自身の意思を周囲に伝える手段が極めて限られている方がいらっしゃいます。

そこで当社では、ブラウザがあればすぐに使えるWebアプリとして「意思伝達」を構築し、Space / Enterキーやゲームパッドのフェイスボタンといった汎用的な入力デバイス1つで、50音表からの文字選択・濁点／半濁点・小書き・走査方向の反転までを行えるようにしました。

走査は行(縦方向) → 列(横方向)の二段階で進み、目的の位置に枠が来た瞬間にスイッチを押して文字を確定します。サーバ側処理は一切なく、ローカルでファイルを開いて動作確認することも可能です。

本Webアプリは現在試験公開中で、モダンブラウザ(Chrome / Edge / Safari / Firefox の最新版)があれば、キーボード相当の外部スイッチ、DualSense / Xbox 互換のゲームパッド、または介護者によるマウス／タップ操作のいずれでもご利用いただけます。

なお、本Webアプリは試験公開中のため、事前の告知なくサービスを終了する場合があります。また、本Webアプリは無保証で提供されるものであり、当社は本Webアプリの利用により生じたいかなる損害についても責任を負いません。

## 技術スタック

- HTML / CSS / JavaScript (バニラ実装、静的Webアプリ)
- PWA (manifest.webmanifest, Service Worker)
- nginx:alpine (Docker)
- Cloudflare Zero Trust Tunnel (cloudflared)

## ソースコード 

本Webアプリのソースコードは [GitHubリポジトリ (comoc/ishindenshin)](https://github.com/comoc/ishindenshin) にて [0BSD ライセンス](https://licenses.opensource.jp/0BSD/0BSD.html) で公開しています。

[活動一覧へ戻る](/activities/)
