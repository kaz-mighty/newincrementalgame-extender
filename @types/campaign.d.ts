declare class Campaign {
    /** @type {Object<string, CampaignItem>} */
    static campaigns: {
        [x: string]: CampaignItem;
    };
    /** @param {PlayerSaveData} playerData */
    static "new"(playerData: PlayerSaveData): Vue.Raw<Campaign>;
    /** @param {PlayerSaveData} playerData */
    constructor(playerData: PlayerSaveData);
    _accelLevel: Vue.Ref<number>;
    _accelLevelUsed: Vue.Ref<number>;
    activated: string[];
    _nowMonth: Vue.Ref<number>;
    _nowDate: Vue.Ref<number>;
    _sumCommonBonus: Vue.ComputedRef<number>;
    _campaignCosts: Vue.ComputedRef<number>;
    set accelLevel(x: number);
    get accelLevel(): number;
    set accelLevelUsed(x: number);
    get accelLevelUsed(): number;
    get sumCommonBonus(): number;
    get campaignCosts(): number;
    updateCampaign(): boolean;
    /** @param {number} tickSpeed */
    updateAccelLevel(tickSpeed: number): void;
    /** @param {number} value */
    addAccelLevelUsed(value: number): void;
    /** @param {CampaignItem} campaign */
    isDuring(campaign: CampaignItem): boolean;
    clearActivated(): void;
    /** @param {string} campaignId */
    chooseCampaigns(campaignId: string): void;
}
