export type WorldTheme = "culture" | "history" | "numbers";
export interface World { id: string; name: string; subtitle: string; theme: WorldTheme; progress: number; free: boolean }
export interface Chapter { id: string; worldId: string; name: string; description: string; knowledgeCount: number; questionCount: number; intro: string; bossName: string; bossDescription: string }
export interface Level { id: string; worldId: string; chapterId: string; name: string; kind: "lesson" | "boss"; status: "locked" | "open" | "active" | "complete"; sort: number; questionCount: number; passScore: number; summary: string; stars?: number }

export type QuestionType = "single_choice" | "scene_judgment" | "relation_match" | "numeric_input";
export interface QuestionOption { id: string; text: string }
export interface RelationItem { id: string; text: string }
export interface PublicQuestionBase { questionId: string; knowledgeId: string; type: QuestionType; stem: string; hint?: string }
export interface SingleChoiceQuestion extends PublicQuestionBase { type: "single_choice"; options: QuestionOption[] }
export interface SceneJudgmentQuestion extends PublicQuestionBase { type: "scene_judgment"; scene: string; options: QuestionOption[] }
export interface RelationMatchQuestion extends PublicQuestionBase { type: "relation_match"; leftItems: RelationItem[]; rightItems: RelationItem[] }
export interface NumericInputQuestion extends PublicQuestionBase { type: "numeric_input"; prompt?: string; suffix?: string; inputMode?: "numeric" | "decimal" }
export type PublicQuestion = SingleChoiceQuestion | SceneJudgmentQuestion | RelationMatchQuestion | NumericInputQuestion;
export type SubmittedAnswer = string | Array<{ leftId: string; rightId: string }>;

export interface AnswerExplanation {
  summary: string;
  whyCorrect: string;
  whyUserAnswerWrong?: string;
  wrongOptionExplanations?: Array<{ optionId: string; explanation: string }>;
  commonMistake?: string;
  usageScene?: string;
  relatedKnowledge?: Array<{ id: string; name: string; relation: string }>;
  memoryTip?: string;
}
export interface AnswerResult { isCorrect: boolean; correctAnswer: SubmittedAnswer; explanation: AnswerExplanation; masteryDelta: number; nextReviewAt: string; progress: { current: number; total: number }; nextQuestion?: PublicQuestion }
export interface LevelResult { sessionId: string; levelId: string; levelName: string; correctRate: number; score: number; stars: number; xp: number; coins: number; masteryGain: number; wrongCount: number; weakKnowledge: string[]; nextLevelId: string | null; chapterMastery?: number | undefined; strongestKnowledge?: string | undefined; nextReviewAt?: string | undefined; rewardGranted: boolean }
export interface SessionSnapshot { sessionId: string; level: Pick<Level, "id" | "name" | "questionCount">; currentIndex: number; currentQuestion: PublicQuestion | null; status: "active" | "completed"; result?: LevelResult | undefined }
export interface ProgressMap { levels: Level[]; xp: number; coins: number }
export interface WrongQuestion { questionId: string; knowledgeId: string; knowledgeName: string; wrongCount: number; lastWrongAt: string; status: "active" | "resolved" }
export interface ReviewItem { knowledgeId: string; knowledgeName: string; dueAt: string; reviewType: string; sourceQuestionId?: string }
export interface Mastery { knowledgeId: string; name: string; score: number; nextReviewAt: string }
export interface ApiError { error: { code: string; message: string; requestId: string } }
