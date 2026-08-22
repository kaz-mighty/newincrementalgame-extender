// ==UserScript==
// @name         NewIncrementalExtender for fork
// @namespace    kaz_mighty
// @version      1.0.0-beta.1
// @description  新しい放置ゲームの拡張
// @author       kaz_mighty
// @match        http://127.0.0.1:3000/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// ==/UserScript==
/* 
# todo
  - 裏段位自動化
  - updateAutoSettingで設定は合ってるがそもそも効力がオフになってるときに止まらないので原因が分かりづらいかも
*/

(function () {
  'use strict';

  console.log("NewIncrementalExtender for fork start!");
  if (document.title != "新しい放置ゲーム(1).file") return;
  if (!Array.prototype.some.call(document.scripts, (item) => item.src.includes("game/components.js"))) return;
  console.log("NewIncrementalExtender for fork enable!");

  /* ゲームへの操作を担当する */
  class GameConnector {
    static #singleton;

    constructor() {
      if (GameConnector.#singleton) {
        return GameConnector.#singleton;
      }
      GameConnector.#singleton = this;

      this.tabStrings = {
        "basic": "通常",
        "level": "段位",
        "auto": "自動",
        "shine": "輝き",
      };

      /* confirmとpromptをスキップ可能にする */
      this.originalConfirm = unsafeWindow.confirm.bind(undefined);
      this.skipConfirm = false;
      unsafeWindow.confirm = this.#confirm.bind(this);
      this.originalPrompt = unsafeWindow.prompt.bind(undefined);
      this.injectPrompt = null;
      unsafeWindow.prompt = this.#prompt.bind(this);
    }

    #confirm(message) {
      if (this.skipConfirm) {
        console.log(`confirm skip. message: ${message}`);
        return true;
      }
      return this.originalConfirm(message);
    }

    #prompt(message, _default) {
      if (this.injectPrompt != null) {
        console.log(`prompt skip. message: ${message}`);
        return this.injectPrompt;
      }
      return this.originalPrompt(message, _default);
    }


    /** ボタンをクリックします
     * @param {?Element} button 
     * @param {boolean} checkAvailability
     * @param {boolean} skipConfirm
     * @param {?string} injectPrompt
     * @returns {boolean} 操作に成功したかどうかを返す
     */
    #click(button, checkAvailability = false, skipConfirm = false, injectPrompt = null) {
      if (button == null || !(button instanceof HTMLElement)) {return false;}
      if (checkAvailability && button.classList.contains("unavailable")) {
        return false;
      }
      try {
        this.skipConfirm = skipConfirm;
        this.injectPrompt = injectPrompt;
        // Chromium系も2026年2月に focusVisible に対応した
        button.focus({preventScroll: true, focusVisible: true});
        button.click();
      } finally {
        this.skipConfirm = false;
        this.injectPrompt = null;
      }
      return true;
    }

    /* ヘッダー操作 */
    #searchHeaderTypeButton(text) {
      const buttons = document.getElementById("header-type-button").children;
      for (const button of buttons) {
        if (button.innerText === text) {
          return button;
        }
      }
    }
    useModeType() {
      return this.#click(this.#searchHeaderTypeButton("モード型適用"));
    }
    useRankBonusType(index) {
      return this.#click(this.#searchHeaderTypeButton("上位効力型適用" + index));
    }
    /** タブを変更し、成否を返す
     * @param {string} id
     * @returns {boolean} タブの変更に成功したかどうか
     */
    changeTab(id) {
      const button = document.getElementById(id)?.firstElementChild;
      return this.#click(button);
    }

    /* 通常タブ操作 */
    resetLevel() {
      const button = document.getElementById("level-reset")?.firstElementChild;
      return this.#click(button, true, true);
    }
    resetRank() {
      const button = document.getElementById("rank-reset")?.firstElementChild;
      return this.#click(button, true, true);
    }
    resetCrown() {
      const button = document.getElementById("crown-reset")?.firstElementChild;
      return this.#click(button, true, true);
    }
    buyGenerator(index) {
      const generators = document.getElementById("generators-container")?.children;
      if (generators == null) {return false;}
      for (const element of generators) {
        if (element.firstElementChild?.innerText.includes(`発生器${index + 1}:`)) {
          return this.#click(element.children[1]);
        }
      }
      return false;
    }

    /* 段位タブ操作 */
    toggleChallengeKind(index) {
      const buttons = document.getElementById("challenges-container")?.getElementsByClassName("challenge-button");
      if (buttons == null) {return false;}
      for (const button of buttons) {
        if (button.innerText === `挑戦 ${index + 1}`) {
          return this.#click(button);
        }
      }
      return false;
    }
    startChallenge() {
      const button = document.getElementById("challenge-start");
      return this.#click(button, false, true);
    }
    exitChallenge() {
      const button = document.getElementById("challenge-exit");
      return this.#click(button, false, true);
    }
    nextChallenge(isRank) {
      const targetId = isRank ? "search-uncleared-rank" : "search-uncleared";
      const button = document.getElementById(targetId);
      return this.#click(button);
    }

    /* 自動タブ操作 */
    toggleAutoBuyer(index) {
      const targetString = [
        "発生器自動購入器",
        "時間加速器自動購入器",
        "自動昇段器",
        "段位効力自動購入器",
        "",
        "自動昇階器",
      ][index];
      const htmlCollection = document.getElementsByClassName("auto-buyer-button");
      for (const element of htmlCollection) {
        if (element.innerText === targetString) {
          return this.#click(element);
        }
      }
      return false;
    }
    configAutoBuyer(index, input) {
      const targetString = [
        "自動昇段器設定:入手段位",
        "自動昇段器設定:停止段位",
        "自動昇階器設定:入手階位",
        "設定:リセットポイント",
      ][index];
      const htmlCollection = document.getElementsByClassName("auto-buyer-button");
      for (const element of htmlCollection) {
        if (element.innerText === targetString) {
          return this.#click(element, false, false, input);
        }
      }
      return false;
    }

    /* 輝きタブ操作 */
    spendShine(index) {
      const targetText = "輝き消費:" + Math.pow(10, index);
      const htmlCollection = document.getElementsByClassName("spend-shine-button");
      for (const element of htmlCollection) {
        if (element.innerText === targetText) {
          return this.#click(element);
        }
      }
      return false;
    }
    spendBrightness(index) {
      // 2か所あるうち、可視状態の方をクリックする。どちらも不可視なら何もしない。
      const targetText = "煌き消費:" + Math.pow(10, index);
      const htmlCollection = document.getElementsByClassName("spend-brightness-button");
      for (const element of htmlCollection) {
        if (element.innerText === targetText && element.checkVisibility()) {
          return this.#click(element);
        }
      }
      return false;
    }
  }
  const gameConnector = new GameConnector;


  function AddComponent() {
    const vueContainer = document.createElement("div");
    vueContainer.id = "extendApp";
    // 余計な余白を消してから挿入
    const firstTextNode = document.body.firstChild;
    if (firstTextNode.nodeType === Node.TEXT_NODE) {
      document.body.removeChild(firstTextNode);
    }
    document.body.insertBefore(vueContainer, document.body.firstChild);

    // css
    const style = document.createElement("style");
    style.textContent = `
.collapse {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.2s ease;
}
.collapse.show {
    grid-template-rows: 1fr;
}
.collapse > div {
    overflow: hidden;
}
button:focus-visible {
    border-color: blue;
    outline: blue solid 3px;
}
`;
    document.head.appendChild(style);

    Vue.createApp(Vue.defineComponent({
      template: `
  <audio loop id="force-active" src="https://kaz-mighty.github.io/newincrementalgame-simulator/silent.wav"></audio>
  <div>
    <span @click="isCollapse = !isCollapse">
      <span v-show="isCollapse">▼拡張機能を開く</span>
      <span v-show="!isCollapse">▲閉じる</span>
    </span>
  </div>
  <div class="collapse" :class="{ 'show': !isCollapse }"><div>
    <div>
      <button type="button" class="autobuyerbutton" :class="{ 'selected': autoChallenge.intervalId !== 0 && !autoChallenge.isRank }"
        @click="toggleAutoChallenge(false)">
        自動化:挑戦
      </button>
      <button type="button" class="autobuyerbutton" :class="{ 'selected': autoChallenge.intervalId !== 0 && autoChallenge.isRank }"
        @click="toggleAutoChallenge(true)">
        自動化:階位挑戦
      </button>
      <button type="button" class="autobuyerbutton" :class="{ 'selected': isAudioPlay }" @click="toggleAudio()">
        無音再生
      </button>
      <button type="button" class="autobuyerbutton" @click="copyClipboard()">
        {{ copyButtonText }}
      </button>
    </div>

    <br>
    <div>
      <span @click="autoCrownReset.isCollapse = !autoCrownReset.isCollapse">
        <span v-show="autoCrownReset.isCollapse">▼自動昇冠設定を開く</span>
        <span v-show="!autoCrownReset.isCollapse">▲閉じる</span>
      </span>
    </div>
    <div class="collapse" :class="{ 'show': !autoCrownReset.isCollapse }"><div>
      <div>
        <button type="button" class="autobuyerbutton" :class="{ 'selected': autoCrownReset.intervalId !== 0 }" @click="toggleAutoCrownReset()">
          自動化:冠位リセット
        </button>
        <button type="button" class="autobuyerbutton" style="width: 200px;" @click="inputGoalResetTime(false)">
          目標段位リセット: {{ autoCrownReset.goalLevelResetTime.toExponential(2) }} 回
        </button>
        <button type="button" class="autobuyerbutton" style="width: 200px;" @click="inputGoalResetTime(true)">
          目標階位リセット: {{ autoCrownReset.goalRankResetTime }} 回
        </button>
        <button type="button" class="autobuyerbutton" :class="{ 'selected': autoCrownReset.useChallenge }" @click="toggleAutoCrownUseChallenge()">
          挑戦1,5を使用する
        </button>
      </div>
      <div>
        <template v-for="i in [1, 2, 3, 4]">
          <button type="button" class="autobuyerbutton" :class="{ 'selected': isSelectedSpendButton(0, i)}"
            @click="choiceAutoCrownSpendShine(0, i)">
            輝き消費単位: {{ Math.pow(10, i) }}
          </button>
        </template>
      </div>
      <div>
        <template v-for="i in [0, 1, 2]">
          <button type="button" class="autobuyerbutton" :class="{ 'selected': isSelectedSpendButton(1, i)}"
            @click="choiceAutoCrownSpendShine(1, i)">
            煌き消費単位: {{ Math.pow(10, i) }}
          </button>
        </template>
      </div>
      <template v-for="(config, index) in autoCrownReset.autoResetConfig">
        <div v-if="index !== 0">
          <button type="button" class="autobuyerbutton" @click="inputAutoResetConfig(index, 'needRank')">
            階位 {{ config.needRank }} 以上で
          </button>
          入手段位 {{ config.getLevel }}、
          <button type="button" class="autobuyerbutton" @click="inputAutoResetConfig(index, 'getRank')">
            入手階位 {{ config.getRank }}
          </button>
          に設定する
        </div>
      </template>
    </div></div>
  </div></div>
`,
      data() {
        return {
          isCollapse: true,

          autoChallenge: {
            intervalId: 0,
            isRank: false,
          },
          isAudioPlay: false,
          copyButtonText: "データエクスポート",

          autoCrownReset: {
            isCollapse: true,

            intervalId: 0,
            useBrightnessId: 0,

            goalLevelResetTime: new Decimal(1e8),
            goalRankResetTime: new Decimal(10000),
            useChallenge: true,
            shineSpend: {
              kind: 1,
              index: 2,
            },
            autoResetConfig: [
              {
                needRank: "0",
                getLevel: "0",
                stopLevel: "1e5",
                // getRankはindex1を参照する
              },
              {
                needRank: "2000",
                getLevel: "2e5",
                stopLevel: "1e5",
                getRank: "2000",
              },
              {
                needRank: "60000",
                getLevel: "2e10",
                stopLevel: "1e10",
                getRank: "2800",
              }
            ],

            phase: 0,
            autoResetPhase: 0,
            sleep: 0,
          },
        }
      },
      methods: {
        shouldBuyGeneraor(index) {
          const player = currentPlayer.value;
          if (player.challenge.isActive(6)) {
            if (index === 3 || index === 7) {return false;}
          }
          if (player.challenge.isPerfectActive(2)) {
            if (index === 2 || index === 5) {return false;}
          }
          return player.money.gte(player.generator.generatorsCost[index]);
        },

        toggleAutoChallenge(isRank) {
          if (this.autoChallenge.intervalId === 0) {
            this.autoChallenge.intervalId = setInterval(this.updateChallenge, 400);
            this.autoChallenge.isRank = isRank;
            return;
          }
          if (isRank !== this.autoChallenge.isRank) {
            this.autoChallenge.isRank = isRank;
            return;
          }
          clearInterval(this.autoChallenge.intervalId);
          this.autoChallenge.intervalId = 0;
          return;
        },
        updateChallenge() {
          const player = currentPlayer.value;
          const challenge = player.challenge;

          if (challenge.onChallenge) {
            // 達成済みの挑戦中は何もしない(誤リセット防止のため)
            const cleared = this.autoChallenge.isRank
              ? challenge.rankCleared
              : challenge.cleared;
            if (cleared.includes(challenge.getChallengeId())) {return;}
          } else {
            // 挑戦中でないなら挑戦を開始する
            // ただし階位挑戦は昇段器ONなら停止するまでなにもしない
            if (this.autoChallenge.isRank) {
              if (player.common.autoLevel && challenge.activeBonuses.has(14) && player.level.lt(player.common.autoLevelStopNumber)) {
                return;
              }
            }
            if (player.currentTab !== "level") {
              gameConnector.changeTab("level");
              return;
            }
            if (this.autoChallenge.isRank) {
              if (challenge.rankCleared.length === 255) {return;}
              // 階位挑戦達成数0だとボタン自体が無い
              if (challenge.rankCleared.length === 0) {return;}
              if (challenge.rankCleared.includes(challenge.getChallengeId()) || challenge.selected.size === 0) {
                gameConnector.nextChallenge(true);
                return;
              }
            } else {
              if (challenge.cleared.length === 255) {return;}
              if (challenge.cleared.includes(challenge.getChallengeId()) || challenge.selected.size === 0) {
                gameConnector.nextChallenge(false);
                return;
              }
            }
            gameConnector.startChallenge();
            return;
          }

          if (player.currentTab !== "basic") {
            gameConnector.changeTab("basic");
            return;
          }
          // 挑戦クリアできるならリセットする
          if (this.autoChallenge.isRank ? gameConnector.resetRank() : gameConnector.resetLevel()) {
            return;
          }

          // モード型使用
          if (player.shine.boughtType[0] && !player.challenge.selected.has(3)) {
            for (let i = 0; i < 8; i++) {
              if (player.generator.generatorsMode[i] !== player.generator.modeType[i]) {
                gameConnector.useModeType();
                return;
              }
            }
          }

          // 発生器を買う
          for (let i = 7; i >= 0; i--) {
            if (this.shouldBuyGeneraor(i)) {
              gameConnector.buyGenerator(i);
              return;
            }
          }
        },

        toggleAudio() {
          const audio = /** @type {HTMLAudioElement} */ (document.getElementById("force-active"));
          if (audio.paused) {
            audio.play();
          } else {
            audio.pause();
          }
        },

        copyClipboard() {
          const saveText = nigInstance.value.dataSave();
          navigator.clipboard.writeText(saveText).then(
            () => {
              this.copyButtonText = "成功!";
              setTimeout(() => {this.copyButtonText = "データエクスポート";}, 1000);
            },
            () => {
              this.copyButtonText = "失敗...";
              setTimeout(() => {this.copyButtonText = "データエクスポート";}, 1000);
            }
          );
        },

        toggleAutoCrownReset() {
          const state = this.autoCrownReset;
          if (state.intervalId !== 0) {
            clearInterval(state.intervalId);
            clearInterval(state.useBrightnessId);
            state.intervalId = 0;
            state.useBrightnessId = 0;
            return;
          }
          if (!confirm("自動冠位リセットを開始しますか? これにより、段位と階位が失われるほか、輝き/煌きが自動で消費されます。")) {
            return;
          }
          state.intervalId = setInterval(this.updateAutoCrownReset, 400);
          state.phase = 0;
          state.autoResetPhase = 0;
          state.sleep = 0;
        },
        toggleAutoCrownUseChallenge() {
          const state = this.autoCrownReset;
          state.useChallenge = !state.useChallenge;
        },
        inputGoalResetTime(isRank) {
          let input = prompt("目標段位/階位を入力");
          let value = new Decimal(input);
          if (isRank) {
            this.autoCrownReset.goalRankResetTime = value;
          } else {
            this.autoCrownReset.goalLevelResetTime = value;
          }
        },
        inputAutoResetConfig(index, key) {
          let input = prompt("階位を入力");
          let value = new Decimal(input);
          this.autoCrownReset.autoResetConfig[index][key] = value.gte(1e5)
            ? value.toExponential(3)
            : value.toString();
        },
        isSelectedSpendButton(kind, index) {
          const spend = this.autoCrownReset.shineSpend;
          return spend.kind == kind && spend.index == index;
        },
        choiceAutoCrownSpendShine(kind, index) {
          const spend = this.autoCrownReset.shineSpend;
          spend.kind = kind;
          spend.index = index;
        },
        updateAutoSetting(generator, accelerator, level, levelItem, rank, getLevel, stopLevel, getRank) {
          // 自動タブの設定を引数の通り設定する。
          // 1回の呼び出しで最大1つのみ操作を行う。
          // 操作が必要だったときは(成否にかかわらず)true, 不要だったときはfalseを返す
          const player = currentPlayer.value;

          if (player.currentTab !== "auto") {
            gameConnector.changeTab("auto");
            return true;
          }
          if (player.common.genAutoBuy !== generator) {
            gameConnector.toggleAutoBuyer(0);
            return true;
          }
          if (player.common.accAutoBuy !== accelerator) {
            gameConnector.toggleAutoBuyer(1);
            return true;
          }
          if (player.common.autoLevel !== level) {
            gameConnector.toggleAutoBuyer(2);
            return true;
          }
          if (player.common.levelItemAutoBuy !== levelItem) {
            gameConnector.toggleAutoBuyer(3);
            return true;
          }
          if (player.common.autoRank != rank) {
            // falseにしたいとき、ボタンが消滅していれば操作不要
            if (gameConnector.toggleAutoBuyer(5) || rank) {
              return true;
            }
          }
          if (getLevel != null && !player.common.autoLevelNumber.eq(getLevel)) {
            gameConnector.configAutoBuyer(0, getLevel);
            return true;
          }
          if (stopLevel != null && !player.common.autoLevelStopNumber.eq(stopLevel)) {
            gameConnector.configAutoBuyer(1, stopLevel);
            return true;
          }
          if (getRank != null && !player.common.autoRankNumber.eq(getRank)) {
            gameConnector.configAutoBuyer(2, getRank);
            return true;
          }
          return false;
        },
        updateChallengeSetting(challengeIds) {
          //挑戦タブの挑戦を引数の通り設定する。
          // 1回の呼び出しで最大1つのみ操作を行う。
          // 操作が必要だったときは(成否にかかわらず)true, 不要だったときはfalseを返す
          const player = currentPlayer.value;
          if (player.currentTab !== "level") {
            gameConnector.changeTab("level");
            return true;
          }
          for (let i = 0; i < 8; i++) {
            if (challengeIds.includes(i) !== player.challenge.selected.has(i)) {
              gameConnector.toggleChallengeKind(i);
              return true;
            }
          }
          return false;
        },
        updateAutoCrownReset() {
          const player = currentPlayer.value;
          const state = this.autoCrownReset;

          if (state.phase < 3) {
            while (state.autoResetPhase + 1 < state.autoResetConfig.length) {
              if (player.rank.lt(state.autoResetConfig[state.autoResetPhase + 1].needRank)) {
                break;
              }
              state.autoResetPhase += 1;
              if (state.phase === 2) {state.phase = 1;}
            }
            if (player.rank.gte(260000) && player.rankResetTime.gte(state.goalRankResetTime)) {
              state.phase = 3;
            }
          }
          if (state.phase >= 4) {
            if (state.phase < 6) {
              if (player.levelResetTime.gte(state.goalLevelResetTime)) {
                if (player.level.gte("1e20")) {state.phase = 8;}
                else {state.phase = 6;}
              }
            }
            if (state.phase < 11 && player.money.gte("1e214")) {state.phase = 11;}
          }

          switch (state.phase) {
            case 0: {
              // 上位効力を階位稼ぎモードにする
              gameConnector.useRankBonusType(1);
              state.phase = 1;
              return;
            }
            case 1: {
              // 自動化全てを有効にし、パラメータを設定して階位を稼ぐ
              if (this.updateAutoSetting(
                true, true, true, true, true,
                state.autoResetConfig[state.autoResetPhase].getLevel,
                state.autoResetConfig[state.autoResetPhase].stopLevel,
                state.autoResetConfig[state.autoResetPhase === 0 ? 1 : state.autoResetPhase].getRank
              )) {
                return;
              }
              gameConnector.changeTab("basic");
              state.phase = 2;
              return;
            }
            case 2: return; // 階位稼ぎ中
            case 3: {
              // 上位効力をポイント稼ぎモードにする
              gameConnector.useRankBonusType(2);
              state.phase = 4;
              return;
            }
            case 4: {
              // 自動化を段位稼ぎモードにして段位を稼ぐ
              if (this.updateAutoSetting(true, true, true, true, false, "0", "Infinity", null)) {
                return;
              }

              gameConnector.changeTab("basic");
              state.phase = 5;
              return;
            }
            case 5: return; // 段位稼ぎ中
            case 6: {
              // 約1秒だけ自動昇段器をオフにして段位を稼ぐ
              if (this.updateAutoSetting(true, true, false, true, false, "0", "Infinity", null)) {
                return;
              }
              state.phase = 7;
              state.sleep = 4;
              return;
            }
            case 7: {
              // 前フェーズの続き
              if (state.sleep > 0) {
                state.sleep -= 1;
                return;
              }
              if (!player.common.autoLevel) {
                gameConnector.toggleAutoBuyer(2);
              }
              state.phase = 8;
              return;
            }
            // @ts-expect-error fall-through
            case 8: {
              // phase8から開始する場合を考慮して全自動化をチェックする
              if (this.updateAutoSetting(true, true, false, true, false, null, null, null)) {
                return;
              }
              state.phase = 9;
              state.sleep = 3;
              // fall-throuth
            }
            case 9: {
              // 挑戦を開始し、冠位を目指す
              if (!player.challenge.onChallenge && state.useChallenge) {
                if (this.updateChallengeSetting([0, 4])) {
                  return;
                }
                gameConnector.startChallenge();
                return;
              }
              if (state.sleep > 0) {
                state.sleep -= 1;
                return;
              }
              state.useBrightnessId = setInterval(this.updateUseBrightness, 100);
              state.phase = 10;
              return;
            }
            case 10: return; // 煌きを消費してポイント稼ぎ中
            case 11: {
              // 自動化をオフにして1e216を目指す
              if (this.updateAutoSetting(false, false, false, true, false, null, null, null)) {
                return;
              }
              if (state.useBrightnessId === 0) {
                state.useBrightnessId = setInterval(this.updateUseBrightness, 100);
              }
              state.phase = 12;
              return;
            }
            case 12: {
              // 冠位に到達したら挑戦解除してからリセットする
              if (player.money.lt("1e216")) {return;}

              if (player.challenge.onChallenge) {
                if (player.currentTab !== "level") {
                  gameConnector.changeTab("level");
                  return;
                }
                gameConnector.exitChallenge();
                return;
              }
              if (player.currentTab !== "basic") {
                gameConnector.changeTab("basic");
                return;
              }
              if (gameConnector.resetCrown()) {
                clearInterval(state.useBrightnessId);
                state.useBrightnessId = 0;
                state.phase = 0;
                state.autoResetPhase = 0;
              }
              return;
            }

          }
        },
        updateUseBrightness() {
          const player = currentPlayer.value;
          const state = this.autoCrownReset;

          if (state.phase !== 10 && state.phase !== 12) {
            return;
          }
          if (player.money.gte("1e216")) {
            return;
          }
          if (player.currentTab !== "shine") {
            gameConnector.changeTab("shine");
            return;
          }

          switch (state.shineSpend.kind) {
            case 0:
              gameConnector.spendShine(state.shineSpend.index);
              break;
            case 1:
              gameConnector.spendBrightness(state.shineSpend.index);
              break;
          }
        },
      },
      mounted() {
        const audio = /** @type {HTMLAudioElement} */ (document.getElementById("force-active"));
        audio.volume = 0.05;
        audio.addEventListener("play", () => {this.isAudioPlay = true;});
        audio.addEventListener("pause", () => {this.isAudioPlay = false;});
      },
    })).mount(vueContainer);
  }

  AddComponent();
})();
