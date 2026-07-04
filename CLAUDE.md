# BLUE MOUSE サイト 引き継ぎ情報

## 基本情報
- **会社名**: 合同会社BLUEMOUSE（児童発達支援・放課後等デイサービス）
- **本番URL**: https://www.blue-mouse.net
- **GitHub Pages URL**: https://tratssai71-create.github.io/BLUEMOUSE-temp/
- **GitHubリポジトリ**: https://github.com/tratssai71-create/BLUEMOUSE-temp
- **ブランチ**: main（pushすれば即本番反映）
- **ドメイン**: www.blue-mouse.net（CNAME → tratssai71-create.github.io）

## ローカル作業ディレクトリ（永続）
```
~/Desktop/合同会社BLUEMOUSE/BLUEMOUSE-temp/
```
※ すでにclone済み。再起動後もここで作業できる。

初回セットアップ（別PCの場合のみ）:
```bash
git clone https://github.com/tratssai71-create/BLUEMOUSE-temp.git ~/Desktop/合同会社BLUEMOUSE/BLUEMOUSE-temp
cd ~/Desktop/合同会社BLUEMOUSE/BLUEMOUSE-temp
git config http.postBuffer 524288000
```

## ファイル構成
| ファイル | 内容 |
|---|---|
| `index.html` | トップページ（メイン） |
| `child.html` | 児童発達支援ページ |
| `afterschool.html` | 放課後等デイサービスページ |
| `contact.html` | お問い合わせフォーム |
| `privacy.html` | プライバシーポリシー |
| `thanks.html` | 送信完了ページ |
| `logo.png` | ロゴ |
| `1.webp` | 施設写真（BLUE MOUSE 徳吉） |
| `photos/` | 子ども・活動写真フォルダ |

## CSSカラー変数
```css
--coral: #f2906c
--coral-light: #fdf0eb
--teal: #5fc1c7
--teal-dark: #3a9095
--teal-light: #e8f6f7
--green: #3a6b5e
--ink: #33251a
--bg: #faf8f5
```

## お問い合わせフォーム
- **Web3Forms** アクセスキー: `4fa56afb-03c9-4795-8e00-0d2c8e7b00b6`
- **送信先メール**: 584@bluemouse.blue
- `?type=afterschool` → 放課後等デイサービス見学フォーム
- `?type=child` → 児童発達支援専用フォーム（年齢3-6歳・性別・子の名前・メール・電話）

## 施設情報
| 施設 | 種別 | 住所 | 最寄り |
|---|---|---|---|
| BLUE MOUSE | 放課後等デイサービス | 岡山市中区徳吉町二丁目11番地25 | 東山電停から徒歩1分 |
| LITTLE BLUE MOUSE | 児童発達支援事業 | 岡山市北区辰巳２６−１０２ | 北長瀬駅から徒歩約18分 |

## 写真の扱い
- 大きい画像は `sips -Z 1200 元ファイル --out 圧縮後ファイル` で圧縮してからコミット
- 大きいファイルをpushする場合: `git config http.postBuffer 524288000`

## git操作（毎回の手順）
```bash
cd /tmp/bluemouse-temp-work
git add -A
git commit -m "変更内容"
git push
```
pushすれば数分後に https://www.blue-mouse.net に反映される。

## ヘッダー構造（全ページ共通）
- PC右上：「お問い合わせ」ホバーで3択ドロップダウン
  - お問い合わせ（一般）
  - 放課後等デイサービス 見学
  - 児童発達支援 見学
- ハンバーガーメニュー（スマホ）：同じ3リンク追加済み

## 注意事項
- `fade-in` クラスはJSで `js-ready` が `<html>` に付いた時だけ `opacity:0` になる（白画面対策）
- ヒーローセクションには `fade-in` を付けない
- 画像の `object-position` で表示位置を調整している箇所あり
