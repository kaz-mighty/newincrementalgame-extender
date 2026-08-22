declare class MarkStone {
    /** @param {number} ticks */
    static calcTickDecay(ticks: number): number;
    static markStoneData: {
        name: string;
        baseExp: number;
        decayMult: number;
    }[];
    static Calibration: {
        new (calData: MarkStoneSaveData["calibration"]): {
            active: boolean;
            selectedEnemy: number;
            enemyHp: number;
            enemyLevel: number;
            cooldown: number;
            totalDamage: number;
            achievements: number;
            shopUpgrades: boolean[];
            resolutions: number[];
            /** @returns {MarkStoneSaveData["calibration"]} */
            toSaveObject(): MarkStoneSaveData["calibration"];
            getEnemyMaxHp(): number;
            getRewardMult(): number;
            calcAttack(): number;
            /** @param {number} enemyId */
            isEnemyShown(enemyId: number): boolean;
            isShopShown(): boolean;
            toggleCalibration(): void;
            /** @param {number} enemyId */
            selectEnemy(enemyId: number): void;
            /** @param {number} level */
            selectEnemyLevel(level: number): void;
            /** @param {number} upgradeId */
            buyShopUpgrade(upgradeId: number): void;
            /** @param {number[]} greatStones */
            updateCalibration(greatStones: number[]): void;
        };
        enemyTypes: {
            name: string;
            resolveName: string;
            hp: number;
        }[];
        shopItems: {
            name: string;
            cost: number;
            desc: string;
        }[];
    };
    /** @param {MarkStoneSaveData} stoneData */
    constructor(stoneData: MarkStoneSaveData);
    stones: number[];
    gainedSinceCrownReset: number[];
    greatStones: number[];
    ticksSinceRankReset: number;
    selectedType: number;
    calibration: {
        active: boolean;
        selectedEnemy: number;
        enemyHp: number;
        enemyLevel: number;
        cooldown: number;
        totalDamage: number;
        achievements: number;
        shopUpgrades: boolean[];
        resolutions: number[];
        /** @returns {MarkStoneSaveData["calibration"]} */
        toSaveObject(): MarkStoneSaveData["calibration"];
        getEnemyMaxHp(): number;
        getRewardMult(): number;
        calcAttack(): number;
        /** @param {number} enemyId */
        isEnemyShown(enemyId: number): boolean;
        isShopShown(): boolean;
        toggleCalibration(): void;
        /** @param {number} enemyId */
        selectEnemy(enemyId: number): void;
        /** @param {number} level */
        selectEnemyLevel(level: number): void;
        /** @param {number} upgradeId */
        buyShopUpgrade(upgradeId: number): void;
        /** @param {number[]} greatStones */
        updateCalibration(greatStones: number[]): void;
    };
    /** @returns {MarkStoneSaveData} */
    toSaveObject(): MarkStoneSaveData;
    /** @param {number} type */
    calcRequirement(type: number): Decimal;
    /**
     * @param {Decimal} money
     * @param {number} [type]
     */
    canGetStone(money: Decimal, type?: number): boolean;
    /** @param {Decimal} money */
    tryGetStone(money: Decimal): boolean;
    calcStoneEffect(): Decimal;
    /** @param {number} type */
    selectType(type: number): void;
    canResetStone(): boolean;
    resetStone(): void;
    /** @param {Decimal} money */
    resetRank(money: Decimal): void;
    resetCrown(): void;
    update(): void;
}
