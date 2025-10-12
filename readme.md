# Newincremental Extender

This is a user script for [newincrementalgame](https://dem08656775.github.io/newincrementalgame/).

これは[newincrementalgame](https://dem08656775.github.io/newincrementalgame/)用のユーザースクリプトです。


## 使い方

`src/NewIncrementalExtender.js`をTampermonkey等に張り付けてください

## 機能

各種自動化器は手動時のボタン操作をシミュレートしているため、勝手にタブが切り替わることがあります。(操作間隔0.25s)
ただし`window.confirm()`はスキップします。

### (階位)挑戦自動化器

自動で挑戦を達成してくれます。
自動購入器、自動リセット器が無くても自動で操作してくれます。
モード型がある場合、効果があるなら自動で使用します。

階位挑戦の場合、自動昇段器稼働中は挑戦を開始しません。
停止段位でいい感じに制御してください。

既に達成済みの挑戦中の場合はなにもしません。(誤操作によるリセット防止)

### 無音再生

ほぼ無音(完全な無音だと再生扱いにならないため)のwavファイルを再生します。
これにより、非アクティブ時もゲームが減速しなくなります。
(Chromeでのみ確認)


## todo

- 冠位リセット自動化
- 裏段位自動化
  (作者はもう不要なため本当に実装するかは未定…)
