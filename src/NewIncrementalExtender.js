// ==UserScript==
// @name         NewIncrementalExtender
// @namespace    kaz_mighty
// @version      2.3.0
// @description  新しい放置ゲームの拡張
// @author       kaz_mighty
// @match        https://dem08656775.github.io/newincrementalgame/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// ==/UserScript==
/* 
# todo
  - 裏段位自動化
  - updateAutoSettingで設定は合ってるがそもそも効力がオフになってるときに止まらないので原因が分かりづらいかも
*/

(function() {
'use strict';

console.log("NewIncrementalExtender enable!");

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
     * @param {?HTMLElement} button 
     * @param {boolean} checkAvailability
     * @param {boolean} skipConfirm
     * @param {?string} injectPrompt
     * @returns {boolean} 操作に成功したかどうかを返す
     */
    #click(button, checkAvailability = false, skipConfirm = false, injectPrompt = null) {
        if (button == null) {return false;}
        if (checkAvailability && button.classList.contains("unavailable")) {
            return false;
        }
        try {
            this.skipConfirm = skipConfirm;
            this.injectPrompt = injectPrompt;
            // Chromium系は focusVisible に未対応
            // button.focus({preventScroll: true, focusVisible: true});
            button.click();
        } finally {
            this.skipConfirm = false;
            this.injectPrompt = null;
        }
        return true;
    }

    /* ヘッダー操作 */
    #searchHeaderTypeButton(text) {
        const pointSiblings = document.getElementById("coinamount").parentElement.children;
        for (let i = 0; i < 6; i++) {
            if (pointSiblings[i]?.firstElementChild?.innerText === text) {
                return pointSiblings[i].firstElementChild;
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
        const tabs = document.getElementsByClassName("tabs")[0];
        for (const element of tabs.children) {
            const button = element.firstElementChild;
            if (button.innerText === this.tabStrings[id]) {
                return this.#click(button);
            }
        }
        return false;
    }

    /* 通常タブ操作 */
    resetLevel() {
        const button = document.getElementById("levelreset")?.firstElementChild;
        return this.#click(button, true, true);
    }
    resetRank() {
        const button = document.getElementById("rankreset")?.firstElementChild;
        return this.#click(button, true, true);
    }
    resetCrown() {
        const button = document.getElementById("crownreset")?.firstElementChild;
        return this.#click(button, true, true);
    }
    buyGenerator(index) {
        const container = document.getElementsByClassName("generators-container")[0];
        for (const element of container.children) {
            if (element.firstElementChild.innerText.includes(`発生器${index + 1}:`)) {
                return this.#click(element.children[1]);
            }
        }
        return false;
    }

    /* 段位タブ操作 */
    toggleChallengeKind(index) {
        const containerElements = document.getElementsByClassName("challenges-container");
        for (const container of containerElements) {
            if (container.firstChild.textContent.includes("挑戦:挑戦とは厳しい条件で昇段リセットを目指すことです。")) {
                const buttonElements = container.getElementsByClassName("challengeconfigbutton");
                for (const button of buttonElements) {
                    if (button.innerText === `挑戦 ${index + 1}`) {
                        return this.#click(button);
                    }
                }
            }
        }
        return false;
    }
    startChallenge() {
        const containerElements = document.getElementsByClassName("challenges-container");
        for (const container of containerElements) {
            if (container.firstChild.textContent.includes("挑戦:挑戦とは厳しい条件で昇段リセットを目指すことです。")) {
                const buttonElements = container.getElementsByClassName("challengeconfigbutton");
                for (const button of buttonElements) {
                    if (button.innerText === "挑戦開始") {
                        return this.#click(button, false, true);
                    }
                }
            }
        }
        return false;
    }
    exitChallenge() {
        const htmlCollection = document.getElementsByClassName("challengeconfigbutton");
        for (const element of htmlCollection) {
            if (element.innerText === "挑戦放棄") {
                return this.#click(element, false, true);
            }
        }
        return false;
    }
    nextChallenge(isRank) {
        const targetText = isRank ? "未達成階位挑戦" : "未達成挑戦"
        const htmlCollection = document.getElementsByClassName("showclearedchallengesbutton");
        for (const element of htmlCollection) {
            if (element.innerText === targetText) {
                return this.#click(element);
            }
        }
        return false;
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
        const htmlCollection = document.getElementsByClassName("autobuyerbutton");
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
        ][index];
        const htmlCollection = document.getElementsByClassName("autobuyerbutton");
        for (const element of htmlCollection) {
            if (element.innerText === targetString) {
                return this.#click(element, false, false, input);
            }
        }
        return false;
    }

    /* 輝きタブ操作 */
    spendBrightness(index) {
        // 2か所あるうち、可視状態の方をクリックする。どちらも不可視なら何もしない。
        const targetText = "煌き消費:" + Math.pow(10, index);
        const htmlCollection = document.getElementsByClassName("spendbrightnessbutton");
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
    max-height: 160px;
}
.collapse-enter-active,
.collapse-leave-active {
    overflow: hidden;
    transition: max-height 0.2s ease;
}
.collapse-enter-from,
.collapse-leave-to {
    max-height: 0;
}
`;
    document.head.appendChild(style);

    Vue.createApp({
        template: 
`
  <audio loop id="force-active" src="https://kaz-mighty.github.io/newincrementalgame-simulator/silent.wav"></audio>
  <div>
    <span @click="isCollapse = !isCollapse">
      <span v-show="isCollapse">▼拡張機能を開く</span>
      <span v-show="!isCollapse">▲閉じる</span>
    </span>
  </div>
  <Transition name="collapse">
    <div class="collapse" :class="{ 'show': !isCollapse }" v-show="!isCollapse">
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
        <button type="button" class="autobuyerbutton" :class="{ 'selected': autoCrownReset.intervalId !== 0 }" @click="toggleAutoCrownReset()">
          自動化:冠位リセット
        </button>
        <button type="button" class="autobuyerbutton" style="width: 200px;" @click="inputGoalResetTime(false)">
          目標段位リセット: {{ autoCrownReset.goalLevelResetTime.toExponential(2) }} 回
        </button>
        <button type="button" class="autobuyerbutton" style="width: 200px;" @click="inputGoalResetTime(true)">
          目標階位リセット: {{ autoCrownReset.goalRankResetTime }} 回
        </button>

        <button type="button" class="autobuyerbutton" @click="toggleAutoCrownSpendBright()">
          煌き消費単位 {{ Math.pow(10, autoCrownReset.spendBrightnessIndex) }}
        </button>
        <button type="button" class="autobuyerbutton" :class="{ 'selected': autoCrownReset.useChallenge }" @click="toggleAutoCrownUseChallenge()">
          挑戦1,5を使用する
        </button>
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
    </div>
  </Transition>
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
                    intervalId: 0,
                    useBrightnessId: 0,
                    goalLevelResetTime: new Decimal(1e8),
                    goalRankResetTime: new Decimal(10000),
                    spendBrightnessIndex: 2,
                    useChallenge: true,
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
                const nig = document.getElementById("app").__vue_app__._instance.ctx;
                if (nig.player.onchallenge && nig.player.challenges.includes(6)) {
                    if (index === 3 || index === 7) {return false;}
                }
                if (nig.player.onpchallenge && nig.player.pchallenges.includes(2)) {
                    if (index === 2 || index === 5) {return false;}
                }
                return nig.player.money.gte(nig.player.generatorsCost[index]);
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
                const nig = document.getElementById("app").__vue_app__._instance.ctx;

                if (nig.player.onchallenge) {
                    // 達成済みの挑戦中は何もしない(誤リセット防止のため)
                    const cleared = this.autoChallenge.isRank
                        ? nig.player.rankchallengecleared
                        : nig.player.challengecleared;
                    if (cleared.includes(nig.calcchallengeid())) {return;}
                } else {
                    // 挑戦中でないなら挑戦を開始する
                    // ただし階位挑戦は昇段器ONなら停止するまでなにもしない
                    if (this.autoChallenge.isRank) {
                        if (nig.autolevel && nig.activechallengebonuses.includes(14) && nig.player.level.lt(nig.autolevelstopnumber)) {
                            return;
                        }
                    }
                    if (nig.player.currenttab !== "level") {
                        gameConnector.changeTab("level");
                        return;
                    }
                    if (this.autoChallenge.isRank) {
                        if (nig.player.rankchallengecleared.length === 255) {return;}
                        // 階位挑戦達成数0だとボタン自体が無い
                        if (nig.player.rankchallengecleared.length === 0) {return;}
                        if (nig.player.rankchallengecleared.includes(nig.calcchallengeid()) || nig.player.challenges.length === 0) {
                            gameConnector.nextChallenge(true);
                            return;
                        }
                    } else {
                        if (nig.player.challengecleared.length === 255) {return;}
                        if (nig.player.challengecleared.includes(nig.calcchallengeid()) || nig.player.challenges.length === 0) {
                            gameConnector.nextChallenge(false);
                            return;
                        }
                    }
                    gameConnector.startChallenge();
                    return;
                }

                if (nig.player.currenttab !== "basic") {
                    gameConnector.changeTab("basic");
                    return;
                }
                // 挑戦クリアできるならリセットする
                if (this.autoChallenge.isRank ? gameConnector.resetRank() : gameConnector.resetLevel()) {
                    return;
                }

                // モード型使用
                if (nig.player.boughttype[0] && !nig.player.challenges.includes(3)) {
                    for (let i = 0; i < 8; i++) {
                        if (nig.player.generatorsMode[i] !== nig.player.setmodes[i]) {
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
                const audio = document.getElementById("force-active");
                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                }
            },

            copyClipboard() {
                const nig = document.getElementById("app").__vue_app__._instance.ctx;
                const saveText = btoa(JSON.stringify(nig.players));
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
                if (!confirm("自動冠位リセットを開始しますか? これにより、段位と階位が失われるほか、煌きが自動で消費されます。")) {
                    return;
                }
                state.intervalId = setInterval(this.updateAutoCrownReset, 400);
                state.phase = 0;
                state.autoResetPhase = 0;
                state.sleep = 0;
            },
            toggleAutoCrownSpendBright() {
                const state = this.autoCrownReset;
                state.spendBrightnessIndex += 1;
                state.spendBrightnessIndex %= 3;
            },
            toggleAutoCrownUseChallenge() {
                const state = this.autoCrownReset;
                state.useChallenge = !state.useChallenge;
            },
            inputGoalResetTime(isRank) {
                let input = prompt("目標段位/階位を入力");
                input = new Decimal(input);
                if (isRank) {
                    this.autoCrownReset.goalRankResetTime = input;
                } else {
                    this.autoCrownReset.goalLevelResetTime = input;
                }
            },
            inputAutoResetConfig(index, key) {
                let input = prompt("階位を入力");
                input = new Decimal(input);
                if (input.gte(1e5)) {
                    input = input.toExponential(3);
                } else {
                    input = input.toString();
                }
                this.autoCrownReset.autoResetConfig[index][key] = input;
            },
            updateAutoSetting(generator, accelerator, level, levelItem, rank, getLevel, stopLevel, getRank) {
                // 自動タブの設定を引数の通り設定する。
                // 1回の呼び出しで最大1つのみ操作を行う。
                // 操作が必要だったときは(成否にかかわらず)true, 不要だったときはfalseを返す
                const nig = document.getElementById("app").__vue_app__._instance.ctx;

                if (nig.player.currenttab !== "auto") {
                    gameConnector.changeTab("auto");
                    return true;
                }
                if (nig.genautobuy !== generator) {
                    gameConnector.toggleAutoBuyer(0);
                    return true;
                }
                if (nig.accautobuy !== accelerator) {
                    gameConnector.toggleAutoBuyer(1);
                    return true;
                }
                if (nig.autolevel !== level) {
                    gameConnector.toggleAutoBuyer(2);
                    return true;
                }
                if (nig.litemautobuy !== levelItem) {
                    gameConnector.toggleAutoBuyer(3);
                    return true;
                }
                if (nig.autorank != rank) {
                    // falseにしたいとき、ボタンが消滅していれば操作不要
                    if (gameConnector.toggleAutoBuyer(5) || rank) {
                        return true;
                    }
                }
                if (getLevel != null && !nig.autolevelnumber.eq(getLevel)) {
                    gameConnector.configAutoBuyer(0, getLevel);
                    return true;
                }
                if (stopLevel != null && !nig.autolevelstopnumber.eq(stopLevel)) {
                    gameConnector.configAutoBuyer(1, stopLevel);
                    return true;
                }
                if (getRank != null && !nig.autoranknumber.eq(getRank)) {
                    gameConnector.configAutoBuyer(2, getRank);
                    return true;
                }
                return false;
            },
            updateChallengeSetting(challengeIds) {
                //挑戦タブの挑戦を引数の通り設定する。
                // 1回の呼び出しで最大1つのみ操作を行う。
                // 操作が必要だったときは(成否にかかわらず)true, 不要だったときはfalseを返す
                const nig = document.getElementById("app").__vue_app__._instance.ctx;
                if (nig.player.currenttab !== "level") {
                    gameConnector.changeTab("level");
                    return true;
                }
                for (let i = 0; i < 8; i++) {
                    if (challengeIds.includes(i) !== nig.player.challenges.includes(i)) {
                        gameConnector.toggleChallengeKind(i);
                        return true;
                    }
                }
                return false;
            },
            updateAutoCrownReset() {
                const nig = document.getElementById("app").__vue_app__._instance.ctx;
                const state = this.autoCrownReset;

                if (state.phase < 3) {
                    while (state.autoResetPhase + 1 < state.autoResetConfig.length) {
                        if (nig.player.rank.lt(state.autoResetConfig[state.autoResetPhase + 1].needRank)) {
                            break;
                        }
                        state.autoResetPhase += 1;
                        if (state.phase === 2) {state.phase = 1;}
                    }
                    if (nig.player.rank.gte(260000) && nig.player.rankresettime.gte(state.goalRankResetTime)) {
                        state.phase = 3;
                    }
                }
                if (state.phase >= 4) {
                    if (state.phase < 6) {
                        if (nig.player.levelresettime.gte(state.goalLevelResetTime)) {
                            if (nig.player.level.gte("1e20")) {state.phase = 8;}
                            else {state.phase = 6;}
                        }
                    }
                    if (state.phase < 11 && nig.player.money.gte("1e214")) {state.phase = 11;}
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
                        if (!nig.autolevel) {
                            gameConnector.toggleAutoBuyer(2);
                        }
                        state.phase = 8;
                        return;
                    }
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
                        if (!nig.player.onchallenge && state.useChallenge) {
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
                        if (nig.player.money.lt("1e216")) {return;}

                        if (nig.player.onchallenge) {
                            if (nig.player.currenttab !== "level") {
                                gameConnector.changeTab("level");
                                return;
                            }
                            gameConnector.exitChallenge();
                            return;
                        }
                        if (nig.player.currenttab !== "basic") {
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
                const nig = document.getElementById("app").__vue_app__._instance.ctx;
                const state = this.autoCrownReset;

                if (state.phase !== 10 && state.phase !== 12) {
                    return;
                }
                if (nig.player.money.gte("1e216")) {
                    return;
                }
                if (nig.player.currenttab !== "shine") {
                    gameConnector.changeTab("shine");
                    return;
                }

                gameConnector.spendBrightness(state.spendBrightnessIndex);
            },
        },
        mounted() {
            const audio = document.getElementById("force-active");
            audio.volume = 0.05;
            audio.addEventListener("play", () => {this.isAudioPlay = true;});
            audio.addEventListener("pause", () => {this.isAudioPlay = false;});
        },
    }).mount(vueContainer);
}

    AddComponent();
})();
