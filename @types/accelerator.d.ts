declare class Accelerator {
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    accelerators: Decimal[];
    acceleratorsBought: Decimal[];
    acceleratorsCost: Decimal[];
    timeCrystal: number[];
    timeCrystalSum: number;
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
    updateAccelerators(player: Player, mu: Decimal): void;
    /** @param {Player} player */
    getShownNum(player: Player): number;
    /**
     * @param {Player} player
     * @param {number} index
     */
    canBuyAccelerator(player: Player, index: number): boolean;
    /**
     * @param {Player} player
     * @param {number} index
     */
    buyAccelerator(player: Player, index: number): void;
    gainTimeCrystal(): void;
    /**
     * @param {Challenge} challenge
     * @param {number} chip10
     */
    calcSpeed(challenge: Challenge, chip10: number): number;
    /** @param {Challenge} challenge */
    reset(challenge: Challenge): void;
}
