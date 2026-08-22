declare class Statue {
    /** @param {PlayerSaveData} playerData */
    static "new"(playerData: PlayerSaveData): Vue.Raw<Statue>;
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    statue: number[];
    polishedStatue: number[];
    brightStatue: number[];
    flickerStatue: number[];
    _statueSum: Vue.ComputedRef<number>;
    _polishedStatueSum: Vue.ComputedRef<number>;
    _brightStatueSum: Vue.ComputedRef<number>;
    _flickerStatueSum: Vue.ComputedRef<number>;
    _flickerStatueSumNotSlice: Vue.ComputedRef<number>;
    _generatorMulti: Vue.ComputedRef<Decimal>;
    get statueSum(): number;
    get polishedStatueSum(): number;
    get brightStatueSum(): number;
    get flickerStatueSum(): number;
    get flickerStatueSumNotSlice(): number;
    get generatorMulti(): Decimal;
    /** @param {number} i */
    calcStatueCost(i: number): number;
    /**
     * @param {Player} player
     * @param {number} i
     */
    buildStatue(player: Player, i: number): void;
    /** @param {number} i */
    calcPolishCost(i: number): number;
    /**
     * @param {Player} player
     * @param {number} i
     */
    polishStatue(player: Player, i: number): void;
    /** @param {number} i */
    calcPolishCostBright(i: number): number;
    /**
     * @param {Player} player
     * @param {number} i
     */
    polishStatueBright(player: Player, i: number): void;
    /** @param {number} i */
    calcPolishCostFlicker(i: number): number;
    /**
     * @param {Player} player
     * @param {number} i
     */
    polishStatueFlicker(player: Player, i: number): void;
}
