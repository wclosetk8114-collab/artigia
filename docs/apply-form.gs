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
 */

var SHEET_ID  = 'ここにスプレッドシートのIDを貼る';
var NOTIFY_TO = 'w.closet.k8114@gmail.com';

var HEADERS = ['受付日時', 'お名前', 'メールアドレス', 'お立場', '分野', '作ってみたいもの', '週の時間', 'プラン', '送信元ページ'];

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    // ハニーポット（ボットが埋めた場合は記録せず成功を返す）
    if (d.company) { return json({ ok: true }); }

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
      d.page  || ''
    ]);

    notify(d);
    return json({ ok: true });

  } catch (err) {
    return json({ ok: false, error: String(err) });
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
