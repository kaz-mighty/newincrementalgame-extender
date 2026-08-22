declare class Trophy {
    static contents: string[];
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    trophies: boolean[];
    smallTrophies1st: boolean[];
    smallTrophies2nd: boolean[];
    remember: number;
    memory: number;
    smallTrophy: number;
    /** @param {number} i */
    unlockTrophy(i: number): void;
    /** @param {Player} player */
    checkTrophies(player: Player): void;
    countMemory(): void;
    countSmallTrophies(): void;
}
