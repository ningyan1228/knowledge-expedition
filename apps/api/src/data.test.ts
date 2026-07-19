import {describe,expect,it} from "vitest";
import {questionsForLevel} from "./data.js";

describe("idiom question answer distribution",()=>{
  it("distributes single-choice answers across A-D",()=>{
    const answers=questionsForLevel("idiom-1").map(question=>question.answer);
    expect(new Set(answers)).toEqual(new Set(["A","B","C","D"]));
    expect(answers.filter(answer=>answer==="A").length).toBeLessThan(answers.length/2);
  });

  it("mixes correct and incorrect scene judgments",()=>{
    const answers=questionsForLevel("idiom-2").map(question=>question.answer);
    expect(new Set(answers)).toEqual(new Set(["A","B"]));
  });
});
