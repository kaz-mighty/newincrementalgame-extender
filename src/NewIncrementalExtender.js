// ==UserScript==
// @name         NewIncrementalExtender
// @namespace    kaz_mighty
// @version      2025-11-06
// @description  新しい放置ゲームの拡張
// @author       kaz_mighty
// @match        https://dem08656775.github.io/newincrementalgame/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// ==/UserScript==
/* 
# todo
  - 裏段位自動化
  - ゲーム操作を別クラスに分離する
*/

(function() {
'use strict';

console.log("NewIncrementalExtender enable!");

let originalConfirm = unsafeWindow.confirm;
let skipConfirm = false;
unsafeWindow.confirm = function(message) {
    if (skipConfirm) {
        console.log(`confirm skip. message: ${message}`);
        return true;
    }
    return originalConfirm(message);
}
let originalPrompt = unsafeWindow.prompt;
let injectPrompt = null;
unsafeWindow.prompt = function(message, _default) {
    if (injectPrompt != null) {
        console.log(`prompt skip. message: ${message}`);
        return injectPrompt;
    }
    return originalPrompt(message, _default);
}


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
  <div @click="isCollapse = !isCollapse">
    <span v-show="isCollapse">▼拡張機能を開く</span>
    <span v-show="!isCollapse">▲閉じる</span>
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
      </div>
      <br>
      <div>
        <button type="button" class="autobuyerbutton" :class="{ 'selected': autoCrownReset.intervalId !== 0 }" @click="toggleAutoCrownReset()">
          自動化:冠位リセット
        </button>
        <button type="button" class="autobuyerbutton" @click="inputGoalResetTime(false)">
          目標段位リセ回数
        </button>
        <button type="button" class="autobuyerbutton" @click="inputGoalResetTime(true)">
          目標階位リセ回数
        </button>
        <span style="padding-right: 5px;">目標回数</span>
        <span style="padding-right: 5px;">段位: {{ autoCrownReset.goalLevelResetTime.toExponential(3) }}</span>
        <span>階位: {{ autoCrownReset.goalRankResetTime }}</span>
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

                autoCrownReset: {
                    intervalId: 0,
                    useBrightnessId: 0,
                    goalLevelResetTime: new Decimal(1e8),
                    goalRankResetTime: new Decimal(10000),
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
            changeTab(id) {
                const tabStrings = {
                    "basic": "通常",
                    "level": "段位",
                    "auto": "自動",
                    "shine": "輝き",
                }
                const tabs = document.getElementsByClassName("tabs")[0];
                for (const element of tabs.children) {
                    const button = element.firstElementChild;
                    if (button.innerText.includes(tabStrings[id])) {
                        button.click();
                        return true;
                    }
                }
                return false;
            },
            getButton(id, index) {
                switch (id) {
                    case "generator": {
                        const container = document.getElementsByClassName("generators-container")[0];
                        for (const element of container.children) {
                            if (element.firstElementChild.innerText.includes(`発生器${index+1}:`)) {
                                return element.children[1];
                            }
                        }
                        break;
                    }
                    case "startChallenge": {
                        const htmlCollection = document.getElementsByClassName("challengeconfigbutton");
                        for (const element of htmlCollection) {
                            if (element.innerText.includes("挑戦開始")) {
                                return element;
                            }
                        }
                        break;
                    }
                    case "exitChallenge": {
                        const htmlCollection = document.getElementsByClassName("challengeconfigbutton");
                        for (const element of htmlCollection) {
                            if (element.innerText.includes("挑戦放棄")) {
                                return element;
                            }
                        }
                        break;
                    }
                    case "levelReset": {
                        const element = document.getElementById("levelreset");
                        return element?.firstElementChild;
                    }
                    case "rankReset": {
                        const element = document.getElementById("rankreset");
                        return element?.firstElementChild;
                    }
                    case "crownReset": {
                        const element = document.getElementById("crownreset");
                        return element?.firstElementChild;
                    }
                    case "nextChallenge": {
                        const htmlCollection = document.getElementsByClassName("showclearedchallengesbutton");
                        for (const element of htmlCollection) {
                            if (element.innerText.includes("未達成挑戦")) {
                                return element;
                            }
                        }
                        break;
                    }
                    case "nextRankChallenge": {
                        const htmlCollection = document.getElementsByClassName("showclearedchallengesbutton");
                        for (const element of htmlCollection) {
                            if (element.innerText.includes("未達成階位挑戦")) {
                                return element;
                            }
                        }
                        break;
                    }
                    case "modeType": {
                        const pointSiblings = document.getElementById("coinamount").parentElement.children;
                        for (let i = 0; i < 6; i++) {
                            if (pointSiblings[i]?.firstElementChild?.innerText?.includes("モード型適用")) {
                                return pointSiblings[i].firstElementChild;
                            }
                        }
                        break;
                    }
                    case "rankBonusType": {
                        const pointSiblings = document.getElementById("coinamount").parentElement.children;
                        for (let i = 0; i < 6; i++) {
                            if (pointSiblings[i]?.firstElementChild?.innerText?.includes("上位効力型適用" + index)) {
                                return pointSiblings[i].firstElementChild;
                            }
                        }
                        break;
                    }
                    case "toggleAutoBuyer": {
                        const htmlCollection = document.getElementsByClassName("autobuyerbutton");
                        const targetStrings = [
                            "発生器自動購入器",
                            "時間加速器自動購入器",
                            "自動昇段器",
                            "段位効力自動購入器",
                            "",
                            "自動昇階器",
                        ];
                        for (const element of htmlCollection) {
                            if (element.innerText.includes(targetStrings[index])) {
                                return element;
                            }
                        }
                        break;
                    }
                    case "configAutoBuyer": {
                        const htmlCollection = document.getElementsByClassName("autobuyerbutton");
                        const targetStrings = [
                            "自動昇段器設定:入手段位",
                            "自動昇段器設定:停止段位",
                            "自動昇階器設定:入手階位",
                        ];
                        for (const element of htmlCollection) {
                            if (element.innerText.includes(targetStrings[index])) {
                                return element;
                            }
                        }
                        break;
                    }
                    case "spendBrightness": {
                        // todo: 2か所あるうちのどちらを操作するかを決める
                        const htmlCollection = document.getElementsByClassName("spendbrightnessbutton");
                        const spendValue = Math.pow(10, index);
                        for (const element of htmlCollection) {
                            if (element.innerText === "煌き消費:" + spendValue) {
                                return element;
                            }
                        }
                        break;
                    }
                    default:
                        console.error(`getButton invalid id: ${id}`);
                }
            },

            toggleAutoChallenge(isRank) {
                if (this.autoChallenge.intervalId === 0) {
                    this.autoChallenge.intervalId = setInterval(this.updateChallenge, 250);
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
                        this.changeTab("level");
                        return;
                    }
                    if (this.autoChallenge.isRank) {
                        if (nig.player.rankchallengecleared.length === 255) {return;}
                        // 階位挑戦達成数0だとボタン自体が無い
                        if (nig.player.rankchallengecleared.length === 0) {return;}
                        if (nig.player.rankchallengecleared.includes(nig.calcchallengeid()) || nig.player.challenges.length === 0) {
                            this.getButton("nextRankChallenge").click();
                            return;
                        }
                    } else {
                        if (nig.player.challengecleared.length === 255) {return;}
                        if (nig.player.challengecleared.includes(nig.calcchallengeid()) || nig.player.challenges.length === 0) {
                            this.getButton("nextChallenge").click();
                            return;
                        }
                    }
                    try {
                        skipConfirm = true;
                        this.getButton("startChallenge").click();
                    } finally {
                        skipConfirm = false;
                    }
                    return;
                }

                if (nig.player.currenttab !== "basic") {
                    this.changeTab("basic");
                    return;
                }
                // 挑戦クリアできるならリセットする
                const resetButton = this.getButton(this.autoChallenge.isRank ? "rankReset" : "levelReset");
                if (resetButton != null) {
                    if (!resetButton.classList.contains("unavailable")) {
                        try {
                            skipConfirm = true;
                            resetButton.click();
                        } finally {
                            skipConfirm = false;
                        }
                        return;
                    }
                }

                // モード型使用
                if (nig.player.boughttype[0] && !nig.player.challenges.includes(3)) {
                    for (let i = 0; i < 8; i++) {
                        if (nig.player.generatorsMode[i] !== nig.player.setmodes[i]) {
                            this.getButton("modeType")?.click();
                            return;
                        }
                    }
                }

                // 発生器を買う
                for (let i = 7; i >= 0; i--) {
                    if (this.shouldBuyGeneraor(i)) {
                        this.getButton("generator", i).click();
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
                state.intervalId = setInterval(this.updateAutoCrownReset, 250);
                state.phase = 0;
                state.autoResetPhase = 0;
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
                // 1回の呼び出しで最大1つのみ操作を行い、操作が必要だったときはtrue, 不要だったときはfalseを返す
                const nig = document.getElementById("app").__vue_app__._instance.ctx;

                if (nig.player.currenttab !== "auto") {
                    this.changeTab("auto");
                    return true;
                }
                if (nig.genautobuy !== generator) {
                    this.getButton("toggleAutoBuyer", 0)?.click();
                    return true;
                }
                if (nig.accautobuy !== accelerator) {
                    this.getButton("toggleAutoBuyer", 1)?.click();
                    return true;
                }
                if (nig.autolevel !== level) {
                    this.getButton("toggleAutoBuyer", 2)?.click();
                    return true;
                }
                if (nig.litemautobuy !== levelItem) {
                    this.getButton("toggleAutoBuyer", 3)?.click();
                    return true;
                }
                if (nig.autorank != rank) {
                    // falseにしたいとき、ボタンが消滅していれば操作不要
                    const button = this.getButton("toggleAutoBuyer", 5);
                    if (button != null || rank) {
                        button?.click();
                        return true;
                    }
                }
                if (getLevel != null && !nig.autolevelnumber.eq(getLevel)) {
                    try {
                        injectPrompt = getLevel;
                        this.getButton("configAutoBuyer", 0)?.click();
                    } finally {
                        injectPrompt = null;
                    }
                    return true;
                }
                if (stopLevel != null && !nig.autolevelstopnumber.eq(stopLevel)) {
                    try {
                        injectPrompt = stopLevel;
                        this.getButton("configAutoBuyer", 1)?.click();
                    } finally {
                        injectPrompt = null;
                    }
                    return true;
                }
                if (getRank != null && !nig.autoranknumber.eq(getRank)) {
                    try {
                        injectPrompt = getRank;
                        this.getButton("configAutoBuyer", 2)?.click();
                    } finally {
                        injectPrompt = null;
                    }
                    return true;
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
                if (state.phase >= 3 && state.phase < 6) {
                    if (nig.player.levelresettime.gte(state.goalLevelResetTime)) {
                        if (nig.player.level.gte("1e20")) {state.phase = 8;}
                        else {state.phase = 6;}
                    }
                }
                switch (state.phase) {
                    case 0: {
                        // 上位効力を階位稼ぎモードにする
                        this.getButton("rankBonusType", 1)?.click();
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
                        this.changeTab("basic");
                        state.phase = 2;
                        return;
                    }
                    case 2: return; // 階位稼ぎ中
                    case 3: {
                        // 上位効力をポイント稼ぎモードにする
                        this.getButton("rankBonusType", 2)?.click();
                        state.phase = 4;
                        return;
                    }
                    case 4: {
                        // 自動化を段位稼ぎモードにして段位を稼ぐ
                        if (this.updateAutoSetting(true, true, true, true, false, "0", "Infinity", null)) {
                            return;
                        }

                        this.changeTab("basic");
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
                            this.getButton("toggleAutoBuyer", 2)?.click();
                        }
                        state.phase = 8;
                        return;
                    }
                    case 8: {
                        // phase8から開始する場合を考慮して全自動化をチェックする
                        if (this.updateAutoSetting(true, true, false, true, false, null, null, null)) {
                            return;
                        }
                        this.changeTab("level");
                        state.phase = 9;
                        return;
                    }
                    case 9: {
                        // 挑戦を開始し、冠位を目指す
                        if (nig.player.currenttab !== "level") {
                            this.changeTab("level");
                            return;
                        }
                        if (!nig.player.onchallenge) {
                            try {
                                skipConfirm = true;
                                this.getButton("startChallenge").click();
                            } finally {
                                skipConfirm = false;
                            }
                        }
                        state.useBrightnessId = setInterval(this.updateUseBrightness, 100);
                        state.phase = 10;
                        return;
                    }
                    case 10: {
                        // 煌きを消費してポイント稼ぎ中
                        if (nig.player.money.gte("1e214")) {state.phase = 11;}
                        return;
                    }
                    case 11: {
                        // 自動化をオフにする
                        if (this.updateAutoSetting(false, false, false, true, false, null, null, null)) {
                            return;
                        }
                        state.phase = 12;
                        return;
                    }
                    case 12: {
                        // 冠位に到達したら挑戦解除してからリセットする
                        if (nig.player.money.lt("1e216")) {return;}

                        if (nig.player.onchallenge) {
                            if (nig.player.currenttab !== "level") {
                                this.changeTab("level");
                                return;
                            }
                            try {
                                skipConfirm = true;
                                this.getButton("exitChallenge").click();
                            } finally {
                                skipConfirm = false;
                            }
                            return;
                        }
                        if (nig.player.currenttab !== "basic") {
                            this.changeTab("basic");
                            return;
                        }
                        try {
                            skipConfirm = true;
                            this.getButton("crownReset").click();
                        } finally {
                            skipConfirm = false;
                        }
                        clearInterval(state.useBrightnessId);
                        state.useBrightnessId = 0;
                        state.phase = 0;
                        state.autoResetPhase = 0;
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
                    this.changeTab("shine");
                    return;
                }
                // todo 煌き消費量の調整
                // todo focusが機能してないのは裏タブの方のボタンを取得しているせい？
                const spendButton = this.getButton("spendBrightness", 2);
                spendButton?.focus({preventScroll: true, focusVisible: true});
                spendButton?.click();
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
