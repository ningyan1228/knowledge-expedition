import type { Level, World } from "@expedition/shared";

export type WorldVisual = "history" | "culture" | "poetry" | "civilization" | "nature" | "numbers";

export interface ExpeditionWorld extends World {
  visual: WorldVisual;
  chapterLabel: string;
  stars: string;
  landmark: string;
  locked?: boolean;
}

export const expeditionWorlds: ExpeditionWorld[] = [
  { id: "history", name: "华夏纪年", subtitle: "沿时间长河，重建人物与事件", theme: "history", visual: "history", chapterLabel: "章节 12 / 60", stars: "36 / 180", landmark: "城阙与青山", progress: 42, free: true },
  { id: "culture", name: "文化万象", subtitle: "从典故、诗书到民俗，点亮文化脉络", theme: "culture", visual: "culture", chapterLabel: "章节 8 / 50", stars: "24 / 150", landmark: "书院与牌坊", progress: 32, free: true },
  { id: "poetry", name: "诗词山河", subtitle: "顺着诗句，抵达山河与心境", theme: "culture", visual: "poetry", chapterLabel: "章节 4 / 48", stars: "16 / 144", landmark: "楼阁与明月", progress: 18, free: false, locked: true },
  { id: "civilization", name: "世界文明", subtitle: "看见城邦、帝国与世界的交汇", theme: "history", visual: "civilization", chapterLabel: "章节 0 / 55", stars: "0 / 165", landmark: "遗迹与城邦", progress: 0, free: false, locked: true },
  { id: "nature", name: "科技自然馆", subtitle: "探索自然规律与科学方法", theme: "numbers", visual: "nature", chapterLabel: "章节 0 / 50", stars: "0 / 150", landmark: "天文台与植物", progress: 0, free: false, locked: true },
  { id: "numbers", name: "数字工坊", subtitle: "把公式锻造成快速判断力", theme: "numbers", visual: "numbers", chapterLabel: "章节 4 / 40", stars: "18 / 120", landmark: "算盘与数据塔", progress: 15, free: true },
];

export const mockChapterLevels: Level[] = [
  { id: "scout", worldId: "culture", name: "侦察关", kind: "lesson", status: "complete", x: 5, summary: "卷轴侦察：看见关键信息" },
  { id: "idiom-2", worldId: "culture", name: "基础关", kind: "lesson", status: "active", x: 23, summary: "基本释义与使用场景" },
  { id: "analysis", worldId: "culture", name: "辨析关", kind: "lesson", status: "open", x: 41, summary: "相近表达的细微差别" },
  { id: "relation", worldId: "culture", name: "关系关", kind: "branch", status: "locked", x: 59, summary: "人物、典故与时代关联" },
  { id: "application", worldId: "culture", name: "应用关", kind: "lesson", status: "locked", x: 77, summary: "在真实语境中判断" },
  { id: "boss-culture", worldId: "culture", name: "文脉守关人", kind: "boss", status: "locked", x: 95, summary: "综合挑战：典故与场景" },
];

export const leaderboard = [
  ["学而无涯", 3250, "Lv.18"],
  ["知行者", 2850, "Lv.16"],
  ["星图旅人", 2760, "Lv.15"],
  ["书山有路", 2560, "Lv.14"],
  ["奋进青年", 2340, "Lv.13"],
] as const;
