// ==UserScript==
// @name         NewIncrementalExtender
// @namespace    kaz_mighty
// @version      2025-10-12
// @description  新しい放置ゲームの拡張
// @author       kaz_mighty
// @match        https://dem08656775.github.io/newincrementalgame/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// ==/UserScript==
/* 
# todo
  - 冠位リセット自動化
  - 裏段位自動化
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
    max-height: 36px;
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
            <button type="button" class="autobuyerbutton" :class="{ 'selected': autoChallenge.intervalId !== 0 && !autoChallenge.isRank }" @click="toggleAutoChallenge(false)">
                自動化:挑戦
            </button>
            <button type="button" class="autobuyerbutton" :class="{ 'selected': autoChallenge.intervalId !== 0 && autoChallenge.isRank }" @click="toggleAutoChallenge(true)">
                自動化:階位挑戦
            </button>
            <button type="button" class="autobuyerbutton" :class="{ 'selected': isAudioPlay }" @click="toggleAudio()">
                無音再生
            </button>
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
                    case "levelReset": {
                        const element = document.getElementById("levelreset");
                        return element?.firstElementChild;
                    }
                    case "rankReset": {
                        const element = document.getElementById("rankreset");
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
