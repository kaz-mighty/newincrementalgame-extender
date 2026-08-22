declare class GameGenerator {
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    generators: Decimal[];
    generatorsBought: Decimal[];
    generatorsCost: Decimal[];
    generatorsMode: number[];
    modeType: number[];
    highestGenerator: number;
    findHighestGenerator(): void;
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
    updateGenerators(player: Player, mu: Decimal): void;
    /**
     * @param {Player} player
     * @param {number} index
     */
    canBuyGenerator(player: Player, index: number): boolean;
    /**
     * @param {Player} player
     * @param {number} index
     */
    buyGenerator(player: Player, index: number): void;
    reset(): void;
    setModeType(): void;
    /** @param {Player} player  */
    changeModeType(player: Player): void;
    /**
     * @param {Player} player
     * @param {number} index
     */
    changeMode(player: Player, index: number): void;
}
