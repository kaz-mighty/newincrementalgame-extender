declare class Shine {
    static shineShopCost: number[];
    /** @param {number} clear */
    static getBaseShinePercent(clear: number): 0 | 0.2 | 0.1 | 0.02 | 0.16 | 0.13 | 0.07 | 0.04;
    /** @param {number} clear */
    static getBaseBrightPercent(clear: number): 0 | 0.01 | 0.001 | 0.008 | 0.006 | 0.005 | 0.004 | 0.003 | 0.002;
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    shine: number;
    brightness: number;
    flicker: number;
    residue: number;
    boughtType: boolean[];
    /** @param {Player} player */
    calcShinePercent(player: Player): number;
    /** @param {Player} player */
    calcMaxShine(player: Player): number;
    /** @param {Player} player */
    calcBrightPercent(player: Player): number;
    /** @param {Player} player */
    calcMaxBright(player: Player): number;
    /**
     * @param {number} stage
     * @param {Statue} statue
     */
    getFlickerPercent(stage: number, statue: Statue): number;
    /**
     * @param {number} stage
     * @param {Statue} statue
     */
    getMaxFlicker(stage: number, statue: Statue): number;
    /** @param {Player} player */
    updateShine(player: Player): void;
    /** @param {Player} player */
    updateBright(player: Player): void;
    /** @param {Player} player */
    updateFlicker(player: Player): void;
    /** @param {number} num */
    buyType(num: number): void;
}
