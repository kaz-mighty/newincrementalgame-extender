/**
 * @param {Decimal} dec
 * @param {number} exp
 */
declare function toFormated(dec: Decimal, exp: number): string | number;
declare const TabHeader: Vue.DefineComponent<{}, {}, {
    nig: Vue.Ref<Nig>;
    player: Vue.ComputedRef<Player>;
}, {
    isDarkShown(): boolean;
    isLightShown(): boolean;
    isTimeShown(): boolean;
    isLevelShown(): boolean;
    isRankShown(): boolean;
    isCrownShown(): boolean;
    isSpiritShown(): boolean;
    isAutoShown(): boolean;
    isShineShown(): boolean;
    isWorldShown(): any;
    isChipShown(): boolean;
    isStatueShown(): boolean;
    isRingShown(): boolean;
    isMarkStoneShown(): boolean;
}, {
    /** @param {string} tabname */
    changeTab(tabname: string): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const BasicTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
    showMult: boolean;
}, {
    modeBonus(): [levelBonus: Decimal, rankBonus: number];
    incrementMults(): string[];
    shownNum(): number;
}, {
    /**
     * @param {boolean} force
     * @param {boolean} exit
     */
    resetLevel(force: boolean, exit: boolean): void;
    /** @param {boolean} force */
    resetRank(force: boolean): void;
    /** @param {boolean} force */
    resetCrown(force: boolean): void;
    configShowMult(): void;
    /** @param {number} i */
    buyGenerator(i: number): void;
    /** @param {number} i */
    changeMode(i: number): void;
    /** @param {number} i */
    buyAccelerator(i: number): void;
    setModeType(): void;
    changeModeType(): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const DarkTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
    brightnessSpendUnits: number[];
}, {
    isSpendBrightnessShown(): boolean[];
}, {
    resetDarkLevel(): void;
    /** @param {number} i */
    buyDarkGenerator(i: number): void;
    /** @param {number} num */
    spendBrightness(num: number): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const LightTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
}, {}, {
    /** @param {number} i */
    buyLightGenerator(i: number): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const TimeTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
}, {}, {
    /** @param {number} value */
    addAccelLevelUsed(value: number): void;
    /** @param {string} campaignId */
    chooseCampaigns(campaignId: string): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const OptionTab: Vue.DefineComponent<{}, {}, {
    nig: Vue.Ref<Nig>;
    player: Vue.ComputedRef<Player>;
}, {
    tweets(): {
        id: string;
        name: string;
        isShow: any;
    }[];
}, {
    /** @param {boolean} force */
    resetData(force: boolean): void;
    /** @param {string} content */
    configTweet(content: string): void;
    exportSave(): void;
    exportSaveFile(): void;
    importSave(): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const LevelTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
}, {
    weightKinds(): number[][];
}, {
    /** @param {number} i */
    configSelected(i: number): void;
    /** @param {boolean} isRank */
    showUncleared(isRank: boolean): void;
    startChallenge(): void;
    exitChallenge(): void;
    /** @param {number} i */
    buyRewards(i: number): void;
    /** @param {number} i */
    buyRankRewards(i: number): void;
    /** @param {1 | 2} i */
    setBonuseType(i: 1 | 2): void;
    /** @param {1 | 2} i */
    changeBonuseType(i: 1 | 2): void;
    /** @param {1 | 2} i */
    setRankBonuseType(i: 1 | 2): void;
    /** @param {1 | 2} i */
    changeRankBonuseType(i: 1 | 2): void;
    /** @param {number} i */
    configChallengeWeightKind(i: number): void;
    /** @param {number} i */
    configChallengeWeightValue(i: number): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const RankTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
}, {}, {
    /** @param {number} i */
    buyLevelItems(i: number): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const CrownTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
}, {
    pChallengeId(): number;
}, {
    /** @param {number} i */
    configPerfectSelected(i: number): void;
    startPerfectChallenge(): void;
    exitPerfectChallenge(): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const SpiritTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
}, {}, {
    /** @param {number} i */
    buySpirit(i: number): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const AutoTab: Vue.DefineComponent<{}, {}, {
    nig: Vue.Ref<Nig>;
    player: Vue.ComputedRef<Player>;
}, {}, {
    /** @param {number} i */
    toggleAutoBuyer(i: number): void;
    /** @param {number} i */
    configAutoBuyer(i: number): void;
    /** @param {number} i */
    toggleRingAutoBuyer(i: number): void;
    /** @param {number} i */
    configRingAutoBuyer(i: number): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const ShineTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
    shineSpendUnits: number[];
    brightnessSpendUnits: number[];
    flickerSpendUnits: number[];
    typeNames: string[];
}, {
    isSpendShineShown(): boolean[];
    isSpendBrightnessShown(): boolean[];
    isSpendFlickerShown(): boolean[];
    isBuyTypeShown(): boolean[];
    isResidueShown(): boolean;
}, {
    /** @param {number} num */
    spendShine(num: number): void;
    /** @param {number} num */
    spendBrightness(num: number): void;
    /** @param {number} num */
    spendFlicker(num: number): void;
    /** @param {number} i */
    buyType(i: number): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const WorldTab: Vue.DefineComponent<{}, {}, {
    nig: Vue.Ref<Nig>;
    player: Vue.ComputedRef<Player>;
}, {
    isRememberShown(): boolean;
    isPipeShown(): boolean;
    maxPipe(): 1 | 2 | 3;
}, {
    /** @param {number} i */
    moveWorld(i: number): void;
    /** @param {number} i */
    shrinkWorld(i: number): void;
    /** @param {number} i */
    openPipe(i: number): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const ChipTab: Vue.DefineComponent<{}, {}, {
    nig: Vue.Ref<Nig>;
    player: Vue.ComputedRef<Player>;
}, {}, {
    toggleChipThresholdUse(): void;
    configChipThresholdNumber(): void;
    /** @param {number} i */
    configSpendChip(i: number): void;
    /**
     * @param {number} i
     * @param {number} j
     */
    chipSet(i: number, j: number): void;
    clearSetChip(): void;
    setChipType(): void;
    changeChipType(): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const StatueTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
}, {}, {
    /** @param {number} i */
    buildStatue(i: number): void;
    /** @param {number} i */
    polishStatue(i: number): void;
    /** @param {number} i */
    polishStatueBright(i: number): void;
    /** @param {number} i */
    polishStatueFlicker(i: number): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const RingTab: Vue.DefineComponent<{}, {}, {
    nig: Vue.Ref<Nig>;
    player: Vue.ComputedRef<Player>;
}, {
    activeRingId(): number;
}, {
    configAutoMission(): void;
    /** @param {number} i */
    configSetRings(i: number): void;
    /** @param {number} i */
    startMission(i: number): void;
    /** @param {number} i */
    useSkill(i: number): void;
    endMission(): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const TrophyTab: Vue.DefineComponent<{}, {}, {
    nig: Vue.Ref<Nig>;
    player: Vue.ComputedRef<Player>;
}, {}, {
    confCheckTrophies(): void;
    /** @param {number} i */
    getTrophyName(i: number): string;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const MarkStoneTab: Vue.DefineComponent<{}, {}, {
    player: Vue.ComputedRef<Player>;
}, {
    calibration(): {
        active: boolean;
        selectedEnemy: number;
        enemyHp: number;
        enemyLevel: number;
        cooldown: number;
        totalDamage: number;
        achievements: number;
        shopUpgrades: boolean[];
        resolutions: number[];
        toSaveObject(): MarkStoneSaveData["calibration"];
        getEnemyMaxHp(): number;
        getRewardMult(): number;
        calcAttack(): number;
        isEnemyShown(enemyId: number): boolean;
        isShopShown(): boolean;
        toggleCalibration(): void;
        selectEnemy(enemyId: number): void;
        selectEnemyLevel(level: number): void;
        buyShopUpgrade(upgradeId: number): void;
        updateCalibration(greatStones: number[]): void;
    };
}, {
    /** @param {number} i */
    selectType(i: number): void;
    resetStone(): void;
    toggleCalibration(): void;
    /** @param {number} i */
    selectEnemy(i: number): void;
    /** @param {number} lv */
    selectEnemyLevel(lv: number): void;
    /** @param {number} i */
    buyShopUpgrade(i: number): void;
}, Vue.ComponentOptionsMixin, Vue.ComponentOptionsMixin, {}, string, Vue.PublicProps, Readonly<Vue.ExtractPropTypes<{}>>, {}, {}>;
declare const app: Vue.App<Element>;
declare const rootComponentInstance: Vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, Vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}>;
