// ============================================================
// メディカルフォース WEB予約マスター連携 - Google Apps Script
// ============================================================
// 【設定方法】
// 1. Googleスプレッドシートを開く
// 2. 拡張機能 > Apps Script を開く
// 3. このコードを貼り付けて保存
// 4. デプロイ > 新しいデプロイ > 種類: ウェブアプリ
//    - 実行ユーザー: 自分
//    - アクセスできるユーザー: 全員
// 5. 表示されたURLをWebアプリの「設定」に貼り付ける
// ============================================================

const SHEET_NAME = 'Web予約_編集ツール用'
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId()

function doGet(e) {
  const action = e.parameter.action
  if (action === 'read') {
    return readData()
  }
  return jsonResponse({ error: 'unknown action' })
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents)
    if (body.action === 'write') {
      return writeData(body.data)
    }
    return jsonResponse({ error: 'unknown action' })
  } catch (err) {
    return jsonResponse({ error: err.toString() })
  }
}

function readData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    // シートが存在しない場合は空データを返す
    return jsonResponse({ data: null, message: 'シートが存在しません' })
  }

  const json = sheet.getRange('A1').getValue()
  if (!json) {
    return jsonResponse({ data: null })
  }

  try {
    const data = JSON.parse(json)
    return jsonResponse({ data })
  } catch {
    return jsonResponse({ error: 'JSON parse error' })
  }
}

function writeData(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(SHEET_NAME)

  // シートがなければ作成
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
  }

  // A1にJSON保存（内部データ用）
  sheet.getRange('A1').setValue(JSON.stringify(data))

  // 人が読めるテーブル形式でも書き出し（B列以降）
  writeReadableTable(sheet, data)

  return jsonResponse({ ok: true, savedAt: new Date().toISOString() })
}

function writeReadableTable(sheet, data) {
  // ヘッダー行（C1から）
  const headers = ['導線', 'カテゴリ', 'メニューカテゴリー名', 'WEB表示名', '紐づけ施術', '説明文', '金額', '時間目安', '複数選択']
  sheet.getRange(1, 3, 1, headers.length).setValues([headers])

  // ヘッダー色
  sheet.getRange(1, 3, 1, headers.length).setBackground('#f0436e').setFontColor('#ffffff').setFontWeight('bold')

  const rows = []
  data.forEach(d => {
    d.cats.forEach(cat => {
      cat.menus.forEach(m => {
        rows.push([
          d.dosen,
          cat.name,
          `${d.dosen}_${cat.name}`,
          m.name,
          m.master || '',
          m.desc || '',
          m.price || '',
          m.time || '',
          d.multiSel ? '◯' : 'ー'
        ])
      })
    })
  })

  if (rows.length === 0) return

  // 既存データクリア
  const lastRow = sheet.getLastRow()
  if (lastRow > 1) {
    sheet.getRange(2, 3, lastRow, headers.length).clearContent()
  }

  sheet.getRange(2, 3, rows.length, headers.length).setValues(rows)

  // 列幅調整
  sheet.setColumnWidth(3, 200)
  sheet.setColumnWidth(4, 160)
  sheet.setColumnWidth(5, 260)
  sheet.setColumnWidth(6, 220)
  sheet.setColumnWidth(7, 240)
  sheet.setColumnWidth(8, 120)
  sheet.setColumnWidth(9, 80)
  sheet.setColumnWidth(10, 80)
  sheet.setColumnWidth(11, 80)
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
