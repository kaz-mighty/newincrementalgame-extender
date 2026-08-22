/** @typedef {ReturnType<typeof initialCommonData>} CommonData */
/** 全世界で共有され、(UIを除く)ゲームの動作にも影響する変数 */
declare function initialCommonData(): {
    trophyCheck: boolean;
    genAutoBuy: boolean;
    accAutoBuy: boolean;
    autoLevel: boolean;
    autoLevelNumber: Decimal;
    autoLevelPoint: Decimal;
    autoLevelStopNumber: Decimal;
    levelItemAutoBuy: boolean;
    autoRank: boolean;
    autoRankNumber: Decimal;
    autoRankPoint: Decimal;
    autoRankRequireMarkStone: boolean;
    chipThresholdUse: boolean;
    chipThreshold: Decimal;
    exported: string;
    totalDarkLevelProof: number;
    worldOpened: any[];
};
/** @type {() => PlayerSaveData} */
declare const initialData: () => PlayerSaveData;
/** UIを除くゲームの全てを扱うクラス。
 *
 * player 一つに関する処理でも、タイマーが関与する物はここで扱う。
 */
declare class Nig {
    world: number;
    playersSave: PlayerSaveData[];
    players: Player[];
    player: Player;
    common: {
        trophyCheck: boolean;
        genAutoBuy: boolean;
        accAutoBuy: boolean;
        autoLevel: boolean;
        autoLevelNumber: Decimal;
        autoLevelPoint: Decimal;
        autoLevelStopNumber: Decimal;
        levelItemAutoBuy: boolean;
        autoRank: boolean;
        autoRankNumber: Decimal;
        autoRankPoint: Decimal;
        autoRankRequireMarkStone: boolean;
        chipThresholdUse: boolean;
        chipThreshold: Decimal;
        exported: string;
        totalDarkLevelProof: number;
        worldOpened: any[];
    };
    autoMissionTimerId: number;
    autoShineTimerId: number;
    autoBrightTimerId: number;
    autoChallengeTimerId: number;
    time: number;
    diff: number;
    awake(): void;
    dataSave(): string;
    save(): void;
    dataLoad(): void;
    /** @param {number} world */
    load(world: number): void;
    update(): void;
    /** @param {number} index */
    configAutoBuyer(index: number): void;
    /** @param {number} index */
    toggleAutoBuyer(index: number): void;
    toggleChipThresholdUse(): void;
    configChipThresholdNumber(): void;
    confCheckTrophies(): void;
    autoShine(): void;
    autoBright(): void;
    autoChallenge(): void;
    /** @param {number} index */
    toggleRingAutoBuyer(index: number): void;
    /** @param {number} index */
    configRingAutoBuyer(index: number): void;
    configAutoMission(): void;
    /** @param {boolean} force */
    resetData(force: boolean): void;
    /** @param {number} i */
    moveWorld(i: number): void;
    /** @param {number} i */
    shrinkWorld(i: number): void;
    checkTotalDarkLevelProof(): void;
    checkMemories(): void;
    checkRemembers(): void;
    checkPipedSmallTrophies(): void;
}
/** @type {Vue.Ref<Nig>} */
declare const nigInstance: Vue.Ref<Nig>;
/** @type {Vue.ComputedRef<Player>} */
declare const currentPlayer: Vue.ComputedRef<Player>;
type CommonData = ReturnType<typeof initialCommonData>;
