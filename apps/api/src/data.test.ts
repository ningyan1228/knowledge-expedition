import {describe,expect,it} from "vitest";
import {idioms,questionsForLevel} from "./data.js";

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
});
