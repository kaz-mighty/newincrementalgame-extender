/* external library */
declare var Vue: typeof import("vue");
declare var Decimal: typeof import("break_infinity.js").default;



/* Campaigns types */
type CampaignItem = {
  title: string;
  desc: string;
  cost: number;
  commonBonus: number;
  predicate?: (month: number, date: number) => boolean;
};

/* SaveData types */

type RingSaveData = {
  setrings: number[];
  ringsexp: number[];
  onmission: boolean;
  missionid: number;
  missionstate: {
    turn: number;
    activering: number;
    skilllog: [number, number][];
    flowerpoint: number;
    snowpoint: number;
    moonpoint: number;
    flowermultiplier: number;
    snowmultiplier: number;
    moonmultiplier: number;
    tps: number[];
    fieldeffect: [fieldId: number, value: number][];
  };
  clearedmission: number[];
  auto: {
    doauto: boolean;
    automissionid: number;
  };
  outsideauto: {
    autospendshine: boolean;
    autospendshinenumber: number;
    autospendbright: boolean;
    autospendbrightnumber: number;
    autodarklevelreset: boolean;
    autodarklevelresetborder: number;
    autodochallenge: boolean;
    autochallenge?: boolean; // autodochallengeにリネームされたが、古いデータが残っている
  };
};

type MarkStoneSaveData = {
  club: number;
  clubGainedSinceCrownReset: number;
  diamond: number;
  diamondGainedSinceCrownReset: number;
  heart: number;
  heartGainedSinceCrownReset: number;
  spade: number;
  spadeGainedSinceCrownReset: number;
  ticksSinceRankReset: number;
  selectedType: number;
  greatClub: number;
  greatDiamond: number;
  greatHeart: number;
  greatSpade: number;
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
  },
};

type PlayerSaveData = {
  money: Decimal | string;
  level: Decimal | string;
  levelresettime: Decimal | string;
  maxlevelgained: Decimal | string;
  token: number;
  shine: number;
  brightness: number;
  flicker: number;

  shineloader: number[];
  brightloader: number[];

  residue: number;

  rank: Decimal | string;
  rankresettime: Decimal | string;

  crown: Decimal | string;
  crownresettime: Decimal | string;

  ranktoken: number;

  markstone: MarkStoneSaveData;

  generators: (Decimal | string)[];
  generatorsBought: (Decimal | string)[];
  generatorsCost: (Decimal | string)[];
  generatorsMode: number[];

  accelerators: (Decimal | string)[];
  acceleratorsBought: (Decimal | string)[];
  acceleratorsCost: (Decimal | string)[];

  darkmoney: Decimal | string;

  darkgenerators: (Decimal | string)[];
  darkgeneratorsBought: (Decimal | string)[];
  darkgeneratorsCost: (Decimal | string)[];

  darklevel: Decimal | string;
  darklevelproof: number;

  lightmoney: Decimal | string;

  lightgenerators: (Decimal | string)[];
  lightgeneratorsBought: (Decimal | string)[];
  lightgeneratorsCost: (Decimal | string)[];

  tickspeed: number;
  accelevel: number;
  accelevelused: number;
  activatedcampaigns: string[];
  timecrystal: number[];
  saveversion: number;

  currenttab: string;
  tweeting: string[];

  onchallenge: boolean;
  challenges: number[];
  challengecleared: number[];
  challengebonuses: number[];

  challengeweight: number[];
  challengeweightvalue: number[];

  onpchallenge: boolean;
  pchallenges: number[];
  pchallengecleared: number[];
  prchallengecleared: number[];

  boughttype: boolean[];
  setmodes: number[];
  setchallengebonusesfst: number[];
  setchallengebonusessnd: number[];
  setrankchallengebonusesfst: number[];
  setrankchallengebonusessnd: number[];

  rankchallengecleared: number[];
  rankchallengebonuses: number[];

  trophies: boolean[];
  smalltrophies: boolean[];
  smalltrophies2nd: boolean[];

  levelitems: number[];
  levelitembought: number;

  remember: number;
  rememberspent: number;
  rememberforgot: number;

  chip: number[];
  setchip: number[];
  disabledchip: boolean[];
  spendchip: number[];

  statue: number[];
  polishedstatue: number[];
  polishedstatuebr: number[];
  polishedstatuefl: number[];

  spiritlevela: number[];
  spiritboughtcurrentcrown: number[];

  setchiptypefst: number[];

  worldpipe: number[];
  rings: RingSaveData;
};
