declare class LevelShop {
    static itemCost: Decimal[];
    static itemText: string[];
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    levelItems: number[];
    levelItemBought: number;
    /** @param {number} index */
    calcLevelItemCost(index: number): Decimal;
    /**
    * @param {Player} player
    * @param {number} index
    */
    canBuyLevelItems(player: Player, index: number): boolean;
    /**
     * @param {Player} player
     * @param {number} index
     */
    buyLevelItems(player: Player, index: number): void;
}
