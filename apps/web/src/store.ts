import {create} from "zustand"; import {persist} from "zustand/middleware";
type State={onboarded:boolean;goal:string;minutes:number;xp:number;streak:number;completed:string[];finishOnboarding:(goal:string,minutes:number)=>void;complete:(level:string,xp:number)=>void};
export const usePlayer=create<State>()(persist(set=>({onboarded:false,goal:"文化通识积累",minutes:15,xp:240,streak:6,completed:[],finishOnboarding:(goal,minutes)=>set({onboarded:true,goal,minutes}),complete:(level,xp)=>set(s=>({completed:[...new Set([...s.completed,level])],xp:s.xp+xp}))}),{name:"knowledge-expedition-player"}));
