import {describe,expect,it} from "vitest"; import {answersEqual,masteryDelta,nextReview,rewardFor,starsFor} from "./index";
describe("learning engine",()=>{
  it("penalizes wrong answers",()=>expect(masteryDelta({correct:false,difficulty:3,usedHint:false,kind:"basic",streak:0})).toBe(-5));
  it("rewards durable application",()=>expect(masteryDelta({correct:true,difficulty:3,usedHint:false,kind:"application",streak:2})).toBe(19));
  it("schedules failed recall in ten minutes",()=>expect(nextReview(new Date("2026-01-01T00:00:00Z"),"again",20).toISOString()).toBe("2026-01-01T00:10:00.000Z"));
  it("awards stars from server rules",()=>{expect(starsFor(59,0)).toBe(0);expect(starsFor(75,0)).toBe(1);expect(starsFor(85,2)).toBe(2);expect(starsFor(95,1)).toBe(3)});
  it("matches relations independent of order",()=>expect(answersEqual([{leftId:"a",rightId:"1"},{leftId:"b",rightId:"2"}],[{leftId:"b",rightId:"2"},{leftId:"a",rightId:"1"}])).toBe(true));
  it("uses larger boss rewards",()=>expect(rewardFor(3,true)).toEqual({xp:240,coins:90}));
});
