---
layout: ../../../../../layouts/BaseLayout.astro
title: 血圧管理Webアプリを試験公開 | 株式会社小森研究所
description: 株式会社小森研究所は、血圧管理Webアプリの試験公開を開始しました。
ogType: article
publishedTime: 2026-04-19T00:00:00+09:00
---

2026年4月19日

# 血圧管理Webアプリを試験公開

株式会社小森研究所(以下当社)は、血圧管理Webアプリの試験公開を開始しました。

<img src="/images/activities/2026-04-19-bpm-app-screenshot.webp" alt="血圧管理Webアプリのトップ画面" class="figure-screenshot" />


<p style="text-align: center;">血圧管理Webアプリ(試験公開版): <a href="https://bpm.comoc.net/">https://bpm.comoc.net/</a></p>

既存の血圧管理サービスやスマートフォンアプリは数多く存在しますが、記録された血圧データが各サービス内に閉じているため、ユーザー自身が利用したいと考えるAIやツールとの連携に障壁が生じている状況がありました。

そこで当社では、血圧管理機能をシンプルなWebアプリケーションとして構築し、記録されたデータをCSV形式のファイルとしてエクスポートできるようにすることで、外部のサービスやツールとの連携をしやすくしました。

本Webアプリは現在試験公開中で、Google、XまたはLINEのいずれかのアカウントをお持ちの方であれば、どなたでもご利用いただけます。

なお、本Webアプリは試験公開中のため、事前の告知なくサービスを終了する場合があります。また、本Webアプリは無保証で提供されるものであり、当社は本Webアプリの利用により生じたいかなる損害についても責任を負いません。

## 技術スタック

- Astro 5 (SSR, @astrojs/node standalone)
- React 19 アイランド (フォーム、グラフ)
- better-auth (ソーシャルログイン: Google / X / LINE、セッションDB)
- SQLite + Drizzle ORM
- Tailwind CSS v4
- Chart.js + react-chartjs-2
- @vite-pwa/astro (PWA、オフライン)

[活動一覧へ戻る](/activities/)
