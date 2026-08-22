declare class Challenge {
    static challengeText: string[];
    static rewardText: string[];
    static rankRewardText: string[];
    static rewardCost: number[];
    static challengeIds: number[];
    static pChallengeText: string[];
    /** @param {Iterable<number>} iter */
    static getChallengeId(iter: Iterable<number>): number;
    /** @param {Iterable<number>} iter */
    static getPerfectChallengeId(iter: Iterable<number>): number;
    /** @param {number} challengeId */
    static calcChallengesArray(challengeId: number): number[];
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    token: number;
    rankToken: number;
    onChallenge: boolean;
    selected: Set<number>;
    cleared: number[];
    rankCleared: number[];
    bonuses: Set<number>;
    rankBonuses: Set<number>;
    onPerfect: boolean;
    perfectSelected: Set<number>;
    perfectCleared: number[];
    perfectRankCleared: number[];
    bonusesType1: number[];
    bonusesType2: number[];
    rankBonusesType1: number[];
    rankBonusesType2: number[];
    challengeWeight: number[];
    challengeWeightValue: number[];
    activeBonuses: Set<any>;
    perfectStage: number;
    getChallengeId(): number;
    getPerfectChallengeId(): number;
    /** @param {number} index */
    isActive(index: number): boolean;
    /** @param {number} index */
    isPerfectActive(index: number): boolean;
    getMaxToken(): number;
    getMaxRankToken(): number;
    calcToken(): void;
    countPerfectCleared(): void;
    /** @param {number} index */
    buyRewards(index: number): void;
    /** @param {number} index */
    buyRankRewards(index: number): void;
    /** @param {1|2} index */
    setBonuseType(index: 1 | 2): void;
    /** @param {1|2} index */
    setRankBonuseType(index: 1 | 2): void;
    /** @param {1|2} index */
    changeBonuseType(index: 1 | 2): void;
    /** @param {1|2} index */
    changeRankBonuseType(index: 1 | 2): void;
    /** @param {number} index */
    configSelected(index: number): void;
    /** @param {number} index */
    configPerfectSelected(index: number): void;
    /** @param {number} i */
    configChallengeWeightKind(i: number): void;
    /** @param {number} i */
    configChallengeWeightValue(i: number): void;
    /** @param {boolean} isRank */
    showUncleared(isRank: boolean): void;
    /** @param {Player} player */
    startChallenge(player: Player): void;
    /** @param {Player} player */
    startPerfectChallenge(player: Player): void;
    /** @param {Player} player */
    exitChallenge(player: Player): void;
    /** @param {Player} player */
    exitPerfectChallenge(player: Player): void;
}
