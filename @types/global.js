/* 型情報インポート 
 * 非モジュールjsファイルで@importすると、何故か非モジュールのままグローバルにインポートできる。
 * tsファイルだと再現できないため、player.d.tsのimportを削除してこっちに移動した。
 * 
 * 名前空間インポートと同名の変数定義があるとき、ファイル名の昇順でインポートが先だと何故か衝突するため、
 * d.tsファイルより後ろのファイルに書く。(typescript 5.9.3 ～ 6.0.3で確認)
 */
/** @import * as Vue from "vue" */
/** @import Decimal from "break_infinity.js" */
