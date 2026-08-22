declare class Light {
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    lightMoney: Decimal;
    lightGenerators: Decimal[];
    lightGeneratorsBought: Decimal[];
    lightGeneratorsCost: Decimal[];
    /** @param {number} i */
    calcCost(i: number): Decimal;
    updateAllCost(): void;
    /**
     * @param {Player} player
     * @param {Decimal} mu
     */
    updateLightGenerators(player: Player, mu: Decimal): void;
    /**
     * @param {Player} player
     * @param {number} index
     */
    canBuyLightGenerator(player: Player, index: number): boolean;
    /**
     * @param {Player} player
     * @param {number} index
     */
    buyLightGenerator(player: Player, index: number): void;
}
