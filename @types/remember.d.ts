declare class Shrink {
    static contents: string[];
    static givenChallenges: number[][][];
    /**
     * @param {PlayerSaveData} newData
     * @param {number} giveId
     * @param {boolean} isRank
     */
    static giveChallenge(newData: PlayerSaveData, giveId: number, isRank: boolean): void;
    /**
     * @param {number} world 対象世界 (0-index)
     * @param {PlayerSaveData} playerData
     * @param {number} memory 対象世界の実績数
     * @param {number} remember0 世界0の合計思い出
     * @return {PlayerSaveData | undefined}
     */
    static shrinkWorld(world: number, playerData: PlayerSaveData, memory: number, remember0: number): PlayerSaveData | undefined;
}
