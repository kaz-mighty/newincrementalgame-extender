// tscで出力したままの型定義ファイルだとうまく動かないので修正(global.jsを参照)
declare class Player {
    /**
     * @param {Decimal} num
     * @param {Decimal} cap
     */
    static softCap(num: Decimal, cap: Decimal): Decimal;
    /**
     * @param {Decimal} num
     * @param {Decimal} cap
     */
    static strongSoftCap(num: Decimal, cap: Decimal): Decimal;
    /**
     * @param {number} world
     * @param {PlayerSaveData} playerData
     * @param {CommonData} commonData
     */
    constructor(world: number, playerData: PlayerSaveData, commonData: CommonData);
    world: number;
    saveVersion: number;
    money: Decimal;
    tickSpeed: number;
    currentTab: string;
    tweeting: string[];
    level: Decimal;
    levelResetTime: Decimal;
    maxLevelGained: Decimal;
    rank: Decimal;
    rankResetTime: Decimal;
    crown: Decimal;
    crownResetTime: Decimal;
    generator: GameGenerator;
    accelerator: Accelerator;
    dark: Dark;
    light: Light;
    campaign: Vue.Raw<Campaign>;
    challenge: Challenge;
    levelShop: LevelShop;
    shine: Shine;
    chip: Chip;
    statue: Vue.Raw<Statue>;
    ring: Ring;
    trophy: Trophy;
    spiritLevelA: number[];
    markStone: MarkStone;
    worldPipe: number[];
    auto: {
        autoSpendShine: boolean;
        autoSpendShineNumber: number;
        autoSpendBright: boolean;
        autoSpendBrightNumber: number;
        autoDarkLevelReset: boolean;
        autoDarkLevelResetBorder: number;
        autoDoChallenge: boolean;
        autoRing: boolean;
    };
    unUsed: {
        shineLoader: number[];
        brightLoader: number[];
        rememberSpent: number;
        rememberForgot: number;
        spiritBoughtCurrentCrown: number[];
    };
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
    commonMult: Decimal;
    incrementalMults: Decimal[];
    multByAc: Decimal;
    _shouldCostUpdate: boolean;
    memorySum: number;
    rememberSum: number;
    eachPipedSmallTrophy: any[];
    pipedSmallTrophy: number;
    /** @returns {PlayerSaveData} */
    toSaveObject(): PlayerSaveData;
    calcCommonMult(): void;
    /** @param {number} i */
    calcBasicIncrementMult(i: number): void;
    /** @returns {[levelBonus: Decimal, rankBonus: number]} */
    calcCommonModeBonus(): [levelBonus: Decimal, rankBonus: number];
    /**
     * @param {number} i
     * @param {number} to
     * @param {Decimal} levelBonus
     * @param {number} rankBonus
     */
    calcIncrementMult(i: number, to: number, levelBonus: Decimal, rankBonus: number): Decimal;
    calcTickSpeed(): number;
    /** @param {number} num */
    spendShine(num: number): void;
    /** @param {number} num */
    spendBrightness(num: number): void;
    /** @param {number} num */
    spendFlicker(num: number): void;
    /** @param {string} content */
    configTweet(content: string): void;
    resetLevelBorder(): Decimal;
    calcGainLevel(): Decimal;
    /**
     * @param {boolean} force
     * @param {boolean} exit
     */
    resetLevel(force: boolean, exit: boolean): void;
    resetRankBorder(): Decimal;
    calcGainRank(): Decimal;
    /** @param {boolean} force */
    resetRank(force: boolean): void;
    resetCrownBorder(): Decimal;
    calcGainCrown(): Decimal;
    /** @param {boolean} exit */
    resetCrown(exit: boolean): void;
    resetDarkLevel(): void;
    calcMaxPipe(): 1 | 2 | 3;
    /** @param {number} to */
    openPipe(to: number): void;
    checkWorlds(): void;
    update(): void;
    updateTickSpeed(): void;
}
