declare class Ring {
    static statusDataType: number[][];
    static levelTable: number[];
    /** @type {{[x: number]: number}[]} */
    static levelSkills: {
        [x: number]: number;
    }[];
    static missionInfo: {
        name: string;
        turn: number;
        goal: number;
        exp: number;
        setsizemin: number;
        setsizemax: number;
        passivefunction: number[];
        preventchallenge: number[];
    }[];
    /**
     * @typedef {Object} FieldEffect
     * @prop {number} id
     * @prop {(v: {state: Ring["missionState"], prop: string, value: number}) => void} [useSkill]
     * @prop {(v: Ring["missionState"], val: number) => void} [endTurn]
     * @prop {string} description
     */
    /** @type {FieldEffect[]} */
    static fieldEffects: {
        id: number;
        useSkill?: (v: {
            state: Ring["missionState"];
            prop: string;
            value: number;
        }) => void;
        endTurn?: (v: Ring["missionState"], val: number) => void;
        description: string;
    }[];
    /** @type {{name: string, tp: number, effect: (rings: Ring) => void}[]} */
    static skills: {
        name: string;
        tp: number;
        effect: (rings: Ring) => void;
    }[];
    /** @param {number} fst */
    static statusTable(fst: number): number[];
    /**
     * @param {number} ringId
     * @param {number} statusId
     * @param {number} level
     */
    static getStatus(ringId: number, statusId: number, level: number): number;
    static levelCap(): number;
    /** @param {RingSaveData} ringData */
    constructor(ringData: RingSaveData);
    setRings: number[];
    ringsExp: number[];
    onMission: boolean;
    missionId: number;
    missionState: {
        turn: number;
        activeRing: number;
        skillLog: [number, number][];
        flowerPoint: number;
        snowPoint: number;
        moonPoint: number;
        flowerMultiplier: number;
        snowMultiplier: number;
        moonMultiplier: number;
        tps: number[];
        fieldEffect: [fieldId: number, value: number][];
    };
    clearedMission: number[];
    unUsed: {
        automissionid: number;
    };
    /**
     * @param {Player} player
     * @return {RingSaveData}
     */
    toSaveObject(player: Player): RingSaveData;
    /** @param {number} ringId */
    getLevel(ringId: number): number;
    /** @param {number} statusId */
    shortGetStatus(statusId: number): number;
    /** @param {number} ringId */
    availableSkills(ringId: number): number[];
    /**
     * @param {"flowerPoint" | "snowPoint" | "moonPoint" | "flowerMultiplier" | "snowMultiplier" | "moonMultiplier"} property
     * @param {number} value
     */
    affect(property: "flowerPoint" | "snowPoint" | "moonPoint" | "flowerMultiplier" | "snowMultiplier" | "moonMultiplier", value: number): void;
    /**
     * @param {number} fieldId
     * @param {number} value
     */
    affectField(fieldId: number, value: number): void;
    /**
     * @param {number} worldId
     * @param {number} ringId
     */
    isAvailableRing(worldId: number, ringId: number): boolean;
    /**
     * @param {number} worldId
     * @param {number} ringId
     */
    configSetRings(worldId: number, ringId: number): void;
    autoPlayMission(): void;
    /** @param {number} missionId */
    isAvailableMission(missionId: number): boolean;
    /** @param {number} missionId */
    startMission(missionId: number): void;
    /** @param {number} skillId */
    useSkill(skillId: number): void;
    endMission(): void;
    ringPointSum(): number;
}
type FieldEffect = {
    id: number;
    useSkill?: (v: {
        state: Ring["missionState"];
        prop: string;
        value: number;
    }) => void;
    endTurn?: (v: Ring["missionState"], val: number) => void;
    description: string;
};
