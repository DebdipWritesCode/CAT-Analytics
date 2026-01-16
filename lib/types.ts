// Type definitions for all sheet data structures

export interface MockOverview {
  mockNo: number;
  mockName: string;
  date: string;
  attemptType: "Full" | "Sectional";
  varcScore: number;
  dilrScore: number;
  qaScore: number;
  totalScore: number;
  varcPercentile: number;
  dilrPercentile: number;
  qaPercentile: number;
  overallPercentile: number;
  attemptsVARC: number;
  attemptsDILR: number;
  attemptsQA: number;
  accuracyVARC: number;
  accuracyDILR: number;
  accuracyQA: number;
  rank?: number;
  notes?: string;
}

export interface SectionalTimeUsage {
  mockNo: number;
  section: "VARC" | "DILR" | "QA";
  timePlanned: number;
  timeActuallyUsed: number;
  timeWasted: number;
  last10MinUsage: "Good" | "Panic" | "Guessing";
  timeLostDueTo: "Indecision" | "Overthinking" | "Calculation";
  improvementAction: string;
}

export interface QuestionLevelAnalysis {
  mockNo: number;
  section: "VARC" | "DILR" | "QA";
  questionNo: number;
  topic: string;
  difficulty: string;
  attempted: boolean;
  correct: boolean;
  timeTaken: number;
  idealTime: number;
  decisionQuality: "Good" | "Bad" | "Late";
  whyWrong?: "Concept" | "Misread" | "Calculation" | "Guess";
  shouldHaveAttempted: boolean;
  learnings: string;
}

export interface TopicWiseAccuracy {
  section: "VARC" | "DILR" | "QA";
  topic: string;
  totalQuestionsAttempted: number;
  correct: number;
  wrong: number;
  accuracyPercent: number;
  avgTimePerQuestion: number;
  strengthLevel: "Strong" | "Medium" | "Weak";
  action: "Revise" | "Practice" | "Skip in exam";
}

export interface UnattemptedQuestionsAudit {
  mockNo: number;
  section: "VARC" | "DILR" | "QA";
  questionNo: number;
  topic: string;
  difficulty: string;
  reasonNotAttempted: string;
  shouldIAttemptNextTime: boolean;
  triggerToIdentifyFaster: string;
}

export interface ErrorLog {
  date: string;
  section: "VARC" | "DILR" | "QA";
  topic: string;
  errorType: "Concept" | "Silly" | "Reading" | "Time" | "Guess";
  exactMistake: string;
  correctThoughtProcess: string;
  howToPreventNextTime: string;
  revisionDone: boolean;
}

export interface RCPassageLog {
  mockNo: number;
  passageTheme: string;
  passageLength: string;
  questionsAttempted: number;
  correct: number;
  accuracyPercent: number;
  timeTaken: number;
  whyWrong?: string;
  strategyNextTime: string;
}

export interface DILRSetSelectionLog {
  mockNo: number;
  setNo: number;
  setType: string;
  difficulty: string;
  timeSpent: number;
  questionsSolved: number;
  wasSetSolvable: boolean;
  whenShouldIHaveLeft: number;
  selectionMistake: string;
}

export interface WeeklyActionPlan {
  weekNo: number;
  section: "VARC" | "DILR" | "QA";
  weakAreaIdentified: string;
  action: string;
  targetQuestions: number;
  completionStatus: string;
  resultInNextMock: string;
}

export interface MockReflection {
  mockNo: number;
  stressLevel: number;
  focusLevel: number;
  panicMoment: string;
  whatTriggeredIt: string;
  howToFix: string;
  confidenceAfterMock: number;
}

export type SheetData = {
  Mock_Overview: MockOverview[];
  Sectional_Time_Usage: SectionalTimeUsage[];
  Question_Level_Analysis: QuestionLevelAnalysis[];
  Topic_Wise_Accuracy: TopicWiseAccuracy[];
  Unattempted_Questions_Audit: UnattemptedQuestionsAudit[];
  Error_Log: ErrorLog[];
  RC_Passage_Log: RCPassageLog[];
  DILR_Set_Selection_Log: DILRSetSelectionLog[];
  Weekly_Action_Plan: WeeklyActionPlan[];
  Mock_Reflection: MockReflection[];
};

export const SHEET_NAMES = [
  "Mock_Overview",
  "Sectional_Time_Usage",
  "Question_Level_Analysis",
  "Topic_Wise_Accuracy",
  "Unattempted_Questions_Audit",
  "Error_Log",
  "RC_Passage_Log",
  "DILR_Set_Selection_Log",
  "Weekly_Action_Plan",
  "Mock_Reflection",
] as const;
