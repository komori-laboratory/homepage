---
layout: ../../layouts/BaseLayout.astro
title: お問い合わせ | 株式会社小森研究所
description: 株式会社小森研究所へのお問い合わせページです。
---

<section class="panel">
<h1>お問い合わせ</h1>
<p>ご相談・ご依頼は以下フォームからご連絡ください。内容を確認のうえ、担当者より返信します。</p>

<form name="contact" method="POST" action="/contactus/thanks/" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <div class="field">
    <label for="name">お名前</label>
    <input id="name" name="name" type="text" autocomplete="name" required />
  </div>
  <div class="field">
    <label for="email">メールアドレス</label>
    <input id="email" name="email" type="email" autocomplete="email" required />
  </div>
  <div class="field">
    <label for="message">お問い合わせ内容</label>
    <textarea id="message" name="message" rows="6" required></textarea>
  </div>
  <button class="button" type="submit">送信する</button>
</form>
</section>
