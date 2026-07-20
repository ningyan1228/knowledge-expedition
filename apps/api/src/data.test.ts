import {describe,expect,it} from "vitest";
import {chapters,idioms,questionsForLevel} from "./data.js";
import {commonSenseItems,commonSenseQuestions} from "./common-sense.js";
import {historyItems,historyQuestions} from "./history.js";

describe("idiom question answer distribution",()=>{
  it("distributes single-choice answers across A-D",()=>{
    const answers=questionsForLevel("idiom-1").map(question=>question.answer);
    expect(new Set(answers)).toEqual(new Set(["A","B","C","D"]));
    expect(answers.filter(answer=>answer==="A").length).toBeLessThan(answers.length/2);
    expect(answers.join("")).not.toContain("ABCD");
  });

  it("mixes correct and incorrect scene judgments",()=>{
    const answers=questionsForLevel("idiom-2").map(question=>question.answer);
    expect(new Set(answers)).toEqual(new Set(["A","B"]));
  });

  it("keeps every memory tip as a complete sentence",()=>{
    for(const item of idioms){
      expect(item.memoryTip).not.toBe(`记住关键词：${item.meaning.slice(0,12)}`);
      expect(item.memoryTip.length).toBeGreaterThan(8);
    }
  });

  it("ships a complete first common-sense chapter",()=>{
    expect(commonSenseItems).toHaveLength(100);
    expect(commonSenseQuestions).toHaveLength(100);
    expect(chapters.find(chapter=>chapter.id==="common-sense-foundation")?.questionCount).toBe(100);
    expect(new Set(commonSenseItems.map(item=>item.category))).toEqual(new Set(["法律","历史文化","科技生活","地理国情"]));
    expect(new Set(commonSenseQuestions.map(question=>question.answer))).toEqual(new Set(["A","B","C","D"]));
  });

  it("keeps 华夏纪年 as a separate, playable history chapter",()=>{
    expect(historyItems).toHaveLength(60);
    expect(historyQuestions).toHaveLength(60);
    expect(chapters.find(chapter=>chapter.id==="history-timeline")?.questionCount).toBe(60);
    expect(new Set(historyQuestions.map(question=>question.levelId))).toEqual(new Set(["history-1","history-2","history-3","history-4","history-5","history-boss"]));
    expect(new Set(historyQuestions.map(question=>question.answer))).toEqual(new Set(["A","B","C","D"]));
    expect(historyQuestions.map(question=>question.id).some(id=>id.startsWith("common-"))).toBe(false);
  });
});
