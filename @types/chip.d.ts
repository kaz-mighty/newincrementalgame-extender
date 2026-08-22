declare class Chip {
    /** @type {[Decimal, number[]][]} */
    static probTable: [Decimal, number[]][];
    static chipName: string[];
    static chipBonusName: string[];
    /** @param {Decimal} money */
    static getChipLevel(money: Decimal): number;
    /**
     * @param {number} lv
     * @param {number} time
     */
    static getChipId(lv: number, time: number): number;
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    chip: number[];
    setChip: number[];
    disabledChip: boolean[];
    spendChip: number[];
    chipType1: number[];
    chipUsed: any[];
    calcChipRetryTime(): number;
    haveEnoughChip(): boolean;
    /** @param {Decimal} money */
    calcGainChip(money: Decimal): number;
    /**
     * @param {number} kind
     * @param {number} chipDoubleProb
     * @param {boolean} isGw2
     */
    calcChipGetNum(kind: number, chipDoubleProb: number, isGw2: boolean): number;
    /**
     * @param {Decimal} money
     * @param {number} chipDoubleProb
     * @param {boolean} isGw2
     */
    gainRandomChip(money: Decimal, chipDoubleProb: number, isGw2: boolean): void;
    /**
     * @param {number} statue
     * @param {number} i
     */
    configSpendChip(statue: number, i: number): void;
    /**
     * @param {number} rememberSum
     * @param {number} i
     */
    isSetChipShown(rememberSum: number, i: number): boolean;
    /**
     * @param {number} i 対象の鋳片効力 0-indexed
     * @param {number} j 鋳片の種類 1-indexed (0=None)
     */
    chipSet(i: number, j: number): void;
    checkUsedChips(): void;
    clearSetChip(): void;
    /** @param {number} i */
    disableChip(i: number): void;
    setChipType(): void;
    changeChipType(): void;
}
