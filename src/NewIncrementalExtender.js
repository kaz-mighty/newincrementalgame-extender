// ==UserScript==
// @name         NewIncrementalExtender-BetaInterim
// @namespace    kaz_mighty
// @version      0.1.0
// @description  新しい放置ゲームの拡張
// @author       kaz_mighty
// @match        https://dem08656775.github.io/newincrementalgamebeta/*
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
    spendShine(index) {
        const targetText = "輝き消費:" + Math.pow(10, index);
        const htmlCollection = document.getElementsByClassName("spendshinebutton");
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
        const htmlCollection = document.getElementsByClassName("spendbrightnessbutton");
        for (const element of htmlCollection) {
            if (element.innerText === targetText && element.checkVisibility()) {
                return this.#click(element);
            }
        }
        return false;
    } 
}
// const gameConnector = new GameConnector;


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
#extendApp {
    margin: 8px;
}
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
  <div class="collapse" :class="{ 'show': !isCollapse }"><div>
    <div>
      <button type="button" class="autobuyerbutton" :class="{ 'selected': isAudioPlay }" @click="toggleAudio()">
        無音再生
      </button>
      <button type="button" class="autobuyerbutton" @click="copyClipboard()">
        {{ copyButtonText }}
      </button>
    </div>
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
