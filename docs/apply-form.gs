/**
 * AI Creator Camp 申し込みフォームの受け口（Google Apps Script）
 *
 * 使い方
 *  1. Googleスプレッドシートを新規作成する（名前は「AI Creator Camp 申込」など）
 *  2. そのシートのURLの /d/ と /edit のあいだの文字列を SHEET_ID に貼る
 *  3. 拡張機能 → Apps Script を開き、このファイルの中身をぜんぶ貼り付けて保存
 *  4. 右上「デプロイ」→「新しいデプロイ」→ 種類は「ウェブアプリ」
 *       次のユーザーとして実行： 自分
 *       アクセスできるユーザー： 全員
 *     を選んでデプロイ。初回は権限の承認画面が出るので許可する
 *  5. 出てきた https://script.google.com/macros/s/....../exec を控える
 *     （このURLを apply.html の ENDPOINT に入れる）
 *
 * 注意：スクリプトを直したときは「デプロイを管理」から既存デプロイを編集して
 *       バージョンを「新バージョン」にすること。URLは変わりません。
 *
 * このスクリプト1本で2種類の申し込みを受けます。
 *   入会の申し込み（apply.html）    → 1枚目のシート
 *   説明会の申し込み（briefing.html）→ 「説明会」タブ（なければ自動で作られます）
 *
 * 紹介リンク：https://ai-creator-camp-theta.vercel.app/apply.html?ref=お名前
 *   ?ref= の値が「紹介者」列に入ります。学割リンクと併用するときは
 *   ?plan=student&ref=お名前 のようにつなげてください。
 */

var SHEET_ID  = 'ここにスプレッドシートのIDを貼る';
var NOTIFY_TO = 'w.closet.k8114@gmail.com';        // 運営（つっちー）への通知先
var CONTACT   = 'ai.creator.camp2026@gmail.com';   // 申込者に見せる窓口アドレス

// ---- 説明会の自動返信メール（申込者ご本人あて）の設定 ------------------
// 差出人の表示名。実アドレスはスクリプトを動かしているアカウントのものになり、
// 返信先（Reply-To）だけ CONTACT になる。
var FROM_NAME  = 'AI Creator Camp 運営';

// Zoom は毎週同じ固定URL（定期ミーティング）
var ZOOM = {
  topic:    'AIクリエイターキャンプ説明会',
  when:     '毎週木曜 22:00〜23:00（日本時間）',
  join:     'https://us06web.zoom.us/j/89409005137?pwd=0qg5NUFay4dDiNRarpvBzoiUsm2mTa.1',
  notes:    'https://us06web.zoom.us/j/89409005137?pwd=0qg5NUFay4dDiNRarpvBzoiUsm2mTa.1&mynotes=on',
  chat:     'https://us06web.zoom.us/launch/jc/89409005137',
  id:       '894 0900 5137',
  passcode: '182515'
};

var OPENCHAT_URL = 'https://line.me/ti/g2/Rb8wl5BurHkiFmU3CnM_USl3rSwAv64a3DN4Cg';

var HEADERS = ['受付日時', 'お名前', 'メールアドレス', 'お立場', '分野', '作ってみたいもの', '週の時間', 'プラン', '紹介者', '送信元ページ'];

// 説明会（briefing.html）用。別タブ「説明会」に記録する
var BRIEF_SHEET  = '説明会';
var BRIEF_HEADERS = ['受付日時', 'お名前', 'メールアドレス', '参加希望日', '送信元ページ'];

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    // ハニーポット（ボットが埋めた場合は記録せず成功を返す）
    if (d.company) { return json({ ok: true }); }

    // 説明会の申し込みは別タブへ
    if (d.kind === 'briefing') { return handleBriefing(d); }

    var sh = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }

    sh.appendRow([
      new Date(),
      d.name  || '',
      d.email || '',
      d.role  || '',
      d.field || '',
      d.idea  || '',
      d.hours || '',
      d.plan  || '',
      d.ref   || '',
      d.page  || ''
    ]);

    notify(d);
    return json({ ok: true });

  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function handleBriefing(d) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(BRIEF_SHEET);
  if (!sh) {
    sh = ss.insertSheet(BRIEF_SHEET);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(BRIEF_HEADERS);
    sh.getRange(1, 1, 1, BRIEF_HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }

  sh.appendRow([
    new Date(),
    d.name  || '',
    d.email || '',
    d.date  || '',
    d.page  || ''
  ]);

  notifyBriefing(d);
  replyBriefing(d);
  return json({ ok: true });
}

/**
 * 申込者ご本人への自動返信（Zoomリンク入り）
 * 記録は済んでいるので、ここで失敗しても申し込み自体は成立させる。
 */
function replyBriefing(d) {
  try {
    var to = (d.email || '').trim();
    if (!to || to.indexOf('@') < 1) { return; }

    var name = (d.name || '').trim();
    var body = [
      (name ? name + ' 様' : 'お申し込みいただいた方へ'),
      '',
      'AI Creator Camp の説明会にお申し込みいただき、ありがとうございます。',
      '下記の内容で承りました。',
      '',
      '──────────────────',
      '■ ご希望の回',
      (d.date || ZOOM.when),
      '',
      '■ 参加方法（Zoom）',
      'トピック： ' + ZOOM.topic,
      '時刻　　： ' + ZOOM.when,
      '',
      'Zoom ミーティングに参加する',
      ZOOM.join,
      '',
      '参加してメモを作成',
      ZOOM.notes,
      '',
      'ミーティングチャットへのリンク',
      ZOOM.chat,
      '',
      'ミーティングID： ' + ZOOM.id,
      'パスコード　　： ' + ZOOM.passcode,
      '──────────────────',
      '',
      '毎週同じリンクです。当日は時間になったら上のURLから入ってください。',
      'カメラ・マイクはオフのままでも大丈夫です。',
      '',
      '■ オープンチャットにもぜひ',
      '直前のご案内や、当日に入れなかったときの連絡はこちらで行っています。',
      OPENCHAT_URL,
      '',
      '■ 都合が変わったとき',
      'このメールにそのまま返信いただければ、別の木曜に振り替えます。',
      'キャンセルの連絡も不要ですが、いただけると助かります。',
      '',
      'それでは当日お会いできるのを楽しみにしています。',
      '',
      'AI Creator Camp 運営　つっちー',
      CONTACT
    ].join('\n');

    // 送信は MailApp のみを使う（別の送信APIを呼ぶと追加の権限承認が必要になる）。
    // 差出人はこのスクリプトを動かしているアカウントだが、表示名は FROM_NAME、
    // 返信先は CONTACT になるので、受け取る側には運営アドレス宛てで返信が届く。
    MailApp.sendEmail({
      to: to,
      subject: '【AI Creator Camp】説明会のお申し込みを承りました（Zoomリンク）',
      body: body,
      name: FROM_NAME,
      replyTo: CONTACT
    });

  } catch (err) {
    // 自動返信に失敗しても記録と運営通知は残す
  }
}

function notifyBriefing(d) {
  try {
    var body = [
      'AI Creator Camp の説明会に申し込みが入りました。',
      '',
      'お名前　　： ' + (d.name  || ''),
      'メール　　： ' + (d.email || ''),
      '参加希望日： ' + (d.date  || ''),
      '',
      '※ Zoomリンク入りの自動返信は、ご本人あてに送信済みです。'
    ].join('\n');

    MailApp.sendEmail({
      to: NOTIFY_TO,
      subject: '【説明会】申し込み：' + (d.name || '名前なし') + '／' + (d.date || ''),
      body: body
    });
  } catch (err) {
    // 通知に失敗しても記録は残す
  }
}

function doGet() {
  return json({ ok: true, message: 'AI Creator Camp application endpoint' });
}

function notify(d) {
  try {
    var body = [
      'AI Creator Camp に新しいお申し込みが入りました。',
      '',
      'お名前　　： ' + (d.name  || ''),
      'メール　　： ' + (d.email || ''),
      'お立場　　： ' + (d.role  || ''),
      '分野　　　： ' + (d.field || ''),
      '週の時間　： ' + (d.hours || ''),
      'プラン　　： ' + (d.plan  || ''),
      '紹介者　　： ' + (d.ref   || '（なし）'),
      '',
      '作ってみたいもの：',
      (d.idea || '（記入なし）'),
      '',
      '※ この時点ではまだ決済は完了していません。Stripe の入金も合わせて確認してください。'
    ].join('\n');

    MailApp.sendEmail({
      to: NOTIFY_TO,
      subject: '【AI Creator Camp】申し込み：' + (d.name || '名前なし'),
      body: body
    });
  } catch (err) {
    // 通知に失敗しても記録は残す
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
