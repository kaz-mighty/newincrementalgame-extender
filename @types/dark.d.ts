declare class Dark {
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    darkMoney: Decimal;
    darkLevel: Decimal;
    darkLevelProof: number;
    darkGenerators: Decimal[];
    darkGeneratorsBought: Decimal[];
    darkGeneratorsCost: Decimal[];
    /** @type {(() => void) | null} */
    updateProofCallback: (() => void) | null;
    /**
     * @param {Player} player
     * @param {number} i
     */
    calcCost(player: Player, i: number): Decimal;
    /** @param {Player} player */
    updateAllCost(player: Player): void;
    /**
     * @param {Player} player
     * @param {Decimal} mu
     */
    updateDarkGenerators(player: Player, mu: Decimal): void;
    /**
     * @param {Player} player
     * @param {number} index
     */
    canBuyDarkGenerator(player: Player, index: number): boolean;
    /**
     * @param {Player} player
     * @param {number} index
     */
    buyDarkGenerator(player: Player, index: number): void;
    calcDarkLevelProof(): number;
    updateDarkLevelProof(): void;
    /** @param {Player} player */
    gainDarkLevel(player: Player): Decimal;
    /** @param {Player} player */
    resetDarkLevel(player: Player): void;
}
