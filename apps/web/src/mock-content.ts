import type { World } from "@expedition/shared";

export type WorldVisual = "history" | "culture" | "poetry" | "civilization" | "nature" | "numbers";

export interface ExpeditionWorld extends World {
  visual: WorldVisual;
  chapterLabel: string;
  stars: string;
  landmark: string;
  locked?: boolean;
}

export const expeditionWorlds: ExpeditionWorld[] = [
  { id: "history", name: "华夏纪年", subtitle: "沿时间长河，重建人物与事件", theme: "history", visual: "history", chapterLabel: "历史题库筹备中", stars: "待开放", landmark: "城阙与青山", progress: 0, free: true },
  { id: "culture", name: "文化万象", subtitle: "从典故、诗书到民俗，点亮文化脉络", theme: "culture", visual: "culture", chapterLabel: "成语初章", stars: "65 道训练题", landmark: "书院与牌坊", progress: 0, free: true },
  { id: "common", name: "公考常识", subtitle: "法律、历史、科技与国情的判断训练", theme: "culture", visual: "culture", chapterLabel: "常识初章", stars: "100 题", landmark: "法典与山河", progress: 0, free: true },
  { id: "poetry", name: "诗词山河", subtitle: "顺着诗句，抵达山河与心境", theme: "culture", visual: "poetry", chapterLabel: "章节 4 / 48", stars: "16 / 144", landmark: "楼阁与明月", progress: 18, free: true },
  { id: "civilization", name: "世界文明", subtitle: "看见城邦、帝国与世界的交汇", theme: "history", visual: "civilization", chapterLabel: "章节 0 / 55", stars: "0 / 165", landmark: "遗迹与城邦", progress: 0, free: true },
  { id: "nature", name: "科技自然馆", subtitle: "探索自然规律与科学方法", theme: "numbers", visual: "nature", chapterLabel: "章节 0 / 50", stars: "0 / 150", landmark: "天文台与植物", progress: 0, free: true },
  { id: "numbers", name: "数字工坊", subtitle: "把公式锻造成快速判断力", theme: "numbers", visual: "numbers", chapterLabel: "数字训练工坊", stars: "80 道训练题", landmark: "算盘与数据塔", progress: 0, free: true },
];

export const leaderboard = [
  ["学而无涯", 3250, "Lv.18"],
  ["知行者", 2850, "Lv.16"],
  ["星图旅人", 2760, "Lv.15"],
  ["书山有路", 2560, "Lv.14"],
  ["奋进青年", 2340, "Lv.13"],
] as const;
