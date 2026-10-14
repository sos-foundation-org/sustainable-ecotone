import type { L10n } from "@/lib/i18n";

// ─── Fungi library: metadata ─────────────────────────────────────────────────
// The drawings live in src/components/fungi/library.tsx (one function per
// species, same engraved hand as the grasshopper). Add a species: a drawing
// there + an entry here. Gallery (internal, not indexed): /lab/fungi

export type FungusId =
  | "mycena"
  | "macrolepiota"
  | "boletus"
  | "amanita"
  | "morchella"
  | "coprinus"
  | "cantharellus"
  | "trametes"
  | "clathrus"
  | "geastrum"
  | "cyathus";

export type FungusMeta = {
  id: FungusId;
  name: L10n;
  latin: string;
  /** what the silhouette is, for the gallery */
  form: L10n;
};

export const FUNGI: FungusMeta[] = [
  { id: "mycena", name: { zh: "小菇", en: "Bonnet" }, latin: "Mycena", form: { zh: "細長鐘形菌蓋、放射條紋", en: "slender bell, striate cap" } },
  { id: "macrolepiota", name: { zh: "高大環柄菇", en: "Parasol mushroom" }, latin: "Macrolepiota procera", form: { zh: "陽傘形、鱗片、菌環", en: "parasol, scales, ring" } },
  { id: "boletus", name: { zh: "美味牛肝菌", en: "Penny bun" }, latin: "Boletus edulis", form: { zh: "饅頭形菌蓋、粗壯菌柄", en: "bun cap, stout stem" } },
  { id: "amanita", name: { zh: "毒蠅傘", en: "Fly agaric" }, latin: "Amanita muscaria", form: { zh: "疣點、裙狀菌環、球狀菌托", en: "warts, skirt ring, bulbous volva" } },
  { id: "morchella", name: { zh: "羊肚菌", en: "Morel" }, latin: "Morchella esculenta", form: { zh: "蜂巢狀凹坑", en: "honeycomb pits" } },
  { id: "coprinus", name: { zh: "毛頭鬼傘", en: "Shaggy ink cap" }, latin: "Coprinus comatus", form: { zh: "高筒形、蓬鬆鱗片、墨汁邊緣", en: "tall shaggy cylinder, inky edge" } },
  { id: "cantharellus", name: { zh: "雞油菌", en: "Chanterelle" }, latin: "Cantharellus cibarius", form: { zh: "漏斗形、波浪邊、延生假褶", en: "funnel, wavy rim, decurrent ridges" } },
  { id: "trametes", name: { zh: "雲芝", en: "Turkey tail" }, latin: "Trametes versicolor", form: { zh: "層疊的扇形菌架（長在樹樁上）", en: "stacked brackets on a stump" } },
  { id: "clathrus", name: { zh: "紅籠頭菌", en: "Lattice stinkhorn" }, latin: "Clathrus ruber", form: { zh: "鏤空籠狀、菌托", en: "open cage on an egg" } },
  { id: "geastrum", name: { zh: "地星", en: "Earthstar" }, latin: "Geastrum triplex", form: { zh: "星狀裂片托著孢子囊", en: "star rays holding a spore sac" } },
  { id: "cyathus", name: { zh: "鳥巢菌", en: "Bird's nest fungus" }, latin: "Cyathus striatus", form: { zh: "杯狀小巢與「蛋」", en: "tiny cups with 'eggs'" } },
];

export const fungusMeta = (id: FungusId) => FUNGI.find((f) => f.id === id)!;
