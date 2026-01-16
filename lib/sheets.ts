import { SheetData, SHEET_NAMES } from "./types";

// Fetch sheet data from API
export async function fetchSheetData(
  spreadsheetId: string
): Promise<SheetData | null> {
  try {
    const response = await fetch(
      `/api/sheets?id=${encodeURIComponent(spreadsheetId)}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.error) {
      throw new Error(result.error);
    }

    return parseSheetData(result.data);
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return null;
  }
}

// Parse raw sheet data into typed objects
export function parseSheetData(rawData: Record<string, any[][]>): SheetData {
  const parsed: Partial<SheetData> = {};

  // Helper to parse a row into an object based on headers
  function parseRow(headers: string[], row: any[]): Record<string, any> {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      const value = row[index]?.toString().trim() || "";
      obj[header] = value;
    });
    return obj;
  }

  // Helper to convert string to number
  function toNumber(str: string): number {
    const num = parseFloat(str.replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? 0 : num;
  }

  // Helper to convert string to boolean
  function toBoolean(str: string): boolean {
    const lower = str.toLowerCase().trim();
    return lower === "true" || lower === "yes" || lower === "1";
  }

  // Parse Mock_Overview
  if (rawData.Mock_Overview && rawData.Mock_Overview.length > 1) {
    const headers = rawData.Mock_Overview[0].map((h: string) =>
      h.toString().trim()
    );
    parsed.Mock_Overview = rawData.Mock_Overview.slice(1).map((row) => {
      const obj = parseRow(headers, row);
      return {
        mockNo: toNumber(obj["Mock No"] || obj["MockNo"] || "0"),
        mockName: obj["Mock Name"] || obj["MockName"] || "",
        date: obj["Date"] || "",
        attemptType: (obj["Attempt Type (Full / Sectional)"] ||
          obj["Attempt Type"] ||
          "Full") as "Full" | "Sectional",
        varcScore: toNumber(obj["VARC Score"] || obj["VARCScore"] || "0"),
        dilrScore: toNumber(obj["DILR Score"] || obj["DILRScore"] || "0"),
        qaScore: toNumber(obj["QA Score"] || obj["QAScore"] || "0"),
        totalScore: toNumber(obj["Total Score"] || obj["TotalScore"] || "0"),
        varcPercentile: toNumber(
          obj["VARC %ile"] || obj["VARCPercentile"] || "0"
        ),
        dilrPercentile: toNumber(
          obj["DILR %ile"] || obj["DILRPercentile"] || "0"
        ),
        qaPercentile: toNumber(obj["QA %ile"] || obj["QAPercentile"] || "0"),
        overallPercentile: toNumber(
          obj["Overall %ile"] || obj["OverallPercentile"] || "0"
        ),
        attemptsVARC: toNumber(
          obj["Attempts VARC"] || obj["AttemptsVARC"] || "0"
        ),
        attemptsDILR: toNumber(
          obj["Attempts DILR"] || obj["AttemptsDILR"] || "0"
        ),
        attemptsQA: toNumber(obj["Attempts QA"] || obj["AttemptsQA"] || "0"),
        accuracyVARC: toNumber(
          obj["Accuracy VARC (%)"] || obj["AccuracyVARC"] || "0"
        ),
        accuracyDILR: toNumber(
          obj["Accuracy DILR (%)"] || obj["AccuracyDILR"] || "0"
        ),
        accuracyQA: toNumber(
          obj["Accuracy QA (%)"] || obj["AccuracyQA"] || "0"
        ),
        rank: obj["Rank (if provided)"] || obj["Rank"]
          ? toNumber(obj["Rank (if provided)"] || obj["Rank"])
          : undefined,
        notes: obj["Notes (fatigue, distractions, bad day, etc.)"] ||
          obj["Notes"] ||
          undefined,
      };
    });
  } else {
    parsed.Mock_Overview = [];
  }

  // Parse Sectional_Time_Usage
  if (rawData.Sectional_Time_Usage && rawData.Sectional_Time_Usage.length > 1) {
    const headers = rawData.Sectional_Time_Usage[0].map((h: string) =>
      h.toString().trim()
    );
    parsed.Sectional_Time_Usage = rawData.Sectional_Time_Usage.slice(1).map(
      (row) => {
        const obj = parseRow(headers, row);
        return {
          mockNo: toNumber(obj["Mock No"] || obj["MockNo"] || "0"),
          section: (obj["Section (VARC / DILR / QA)"] ||
            obj["Section"] ||
            "VARC") as "VARC" | "DILR" | "QA",
          timePlanned: toNumber(
            obj["Time Planned (min)"] || obj["TimePlanned"] || "0"
          ),
          timeActuallyUsed: toNumber(
            obj["Time Actually Used (min)"] || obj["TimeActuallyUsed"] || "0"
          ),
          timeWasted: toNumber(
            obj["Time Wasted (min)"] || obj["TimeWasted"] || "0"
          ),
          last10MinUsage: (obj["Last 10 min Usage (Good / Panic / Guessing)"] ||
            obj["Last10MinUsage"] ||
            "Good") as "Good" | "Panic" | "Guessing",
          timeLostDueTo: (obj[
            "Time Lost Due To (Indecision / Overthinking / Calculation)"
          ] ||
            obj["TimeLostDueTo"] ||
            "Indecision") as "Indecision" | "Overthinking" | "Calculation",
          improvementAction:
            obj["Improvement Action"] || obj["ImprovementAction"] || "",
        };
      }
    );
  } else {
    parsed.Sectional_Time_Usage = [];
  }

  // Parse Question_Level_Analysis
  if (
    rawData.Question_Level_Analysis &&
    rawData.Question_Level_Analysis.length > 1
  ) {
    const headers = rawData.Question_Level_Analysis[0].map((h: string) =>
      h.toString().trim()
    );
    parsed.Question_Level_Analysis = rawData.Question_Level_Analysis.slice(
      1
    ).map((row) => {
      const obj = parseRow(headers, row);
      return {
        mockNo: toNumber(obj["Mock No"] || obj["MockNo"] || "0"),
        section: (obj["Section (VARC / DILR / QA)"] ||
          obj["Section"] ||
          "VARC") as "VARC" | "DILR" | "QA",
        questionNo: toNumber(
          obj["Question No"] || obj["QuestionNo"] || "0"
        ),
        topic: obj["Topic"] || "",
        difficulty: obj["Difficulty"] || "",
        attempted: toBoolean(obj["Attempted"] || "false"),
        correct: toBoolean(obj["Correct"] || "false"),
        timeTaken: toNumber(
          obj["Time Taken (sec)"] || obj["TimeTaken"] || "0"
        ),
        idealTime: toNumber(
          obj["Ideal Time (sec)"] || obj["IdealTime"] || "0"
        ),
        decisionQuality: (obj[
          "Decision Quality (Good / Bad / Late)"
        ] ||
          obj["DecisionQuality"] ||
          "Good") as "Good" | "Bad" | "Late",
        whyWrong: obj["Why Wrong (Concept / Misread / Calculation / Guess)"] ||
          obj["WhyWrong"]
          ? (obj["Why Wrong (Concept / Misread / Calculation / Guess)"] ||
              obj["WhyWrong"]) as
              | "Concept"
              | "Misread"
              | "Calculation"
              | "Guess"
          : undefined,
        shouldHaveAttempted: toBoolean(
          obj["Should Have Attempted"] || obj["ShouldHaveAttempted"] || "false"
        ),
        learnings: obj["Learnings"] || "",
      };
    });
  } else {
    parsed.Question_Level_Analysis = [];
  }

  // Parse Topic_Wise_Accuracy
  if (
    rawData.Topic_Wise_Accuracy &&
    rawData.Topic_Wise_Accuracy.length > 1
  ) {
    const headers = rawData.Topic_Wise_Accuracy[0].map((h: string) =>
      h.toString().trim()
    );
    parsed.Topic_Wise_Accuracy = rawData.Topic_Wise_Accuracy.slice(1).map(
      (row) => {
        const obj = parseRow(headers, row);
        return {
          section: (obj["Section"] || "VARC") as "VARC" | "DILR" | "QA",
          topic: obj["Topic"] || "",
          totalQuestionsAttempted: toNumber(
            obj["Total Questions Attempted"] ||
              obj["TotalQuestionsAttempted"] ||
              "0"
          ),
          correct: toNumber(obj["Correct"] || "0"),
          wrong: toNumber(obj["Wrong"] || "0"),
          accuracyPercent: toNumber(
            obj["Accuracy %"] || obj["AccuracyPercent"] || "0"
          ),
          avgTimePerQuestion: toNumber(
            obj["Avg Time per Question (sec)"] ||
              obj["AvgTimePerQuestion"] ||
              "0"
          ),
          strengthLevel: (obj["Strength Level (Strong / Medium / Weak)"] ||
            obj["StrengthLevel"] ||
            "Medium") as "Strong" | "Medium" | "Weak",
          action: (obj["Action (Revise / Practice / Skip in exam)"] ||
            obj["Action"] ||
            "Practice") as "Revise" | "Practice" | "Skip in exam",
        };
      }
    );
  } else {
    parsed.Topic_Wise_Accuracy = [];
  }

  // Parse Unattempted_Questions_Audit
  if (
    rawData.Unattempted_Questions_Audit &&
    rawData.Unattempted_Questions_Audit.length > 1
  ) {
    const headers = rawData.Unattempted_Questions_Audit[0].map((h: string) =>
      h.toString().trim()
    );
    parsed.Unattempted_Questions_Audit =
      rawData.Unattempted_Questions_Audit.slice(1).map((row) => {
        const obj = parseRow(headers, row);
        return {
          mockNo: toNumber(obj["Mock No"] || obj["MockNo"] || "0"),
          section: (obj["Section"] || "VARC") as "VARC" | "DILR" | "QA",
          questionNo: toNumber(
            obj["Question No"] || obj["QuestionNo"] || "0"
          ),
          topic: obj["Topic"] || "",
          difficulty: obj["Difficulty"] || "",
          reasonNotAttempted:
            obj["Reason Not Attempted"] || obj["ReasonNotAttempted"] || "",
          shouldIAttemptNextTime: toBoolean(
            obj["Should I Attempt Next Time?"] ||
              obj["ShouldIAttemptNextTime"] ||
              "false"
          ),
          triggerToIdentifyFaster:
            obj["Trigger to Identify Faster"] ||
            obj["TriggerToIdentifyFaster"] ||
            "",
        };
      });
  } else {
    parsed.Unattempted_Questions_Audit = [];
  }

  // Parse Error_Log
  if (rawData.Error_Log && rawData.Error_Log.length > 1) {
    const headers = rawData.Error_Log[0].map((h: string) =>
      h.toString().trim()
    );
    parsed.Error_Log = rawData.Error_Log.slice(1).map((row) => {
      const obj = parseRow(headers, row);
      return {
        date: obj["Date"] || "",
        section: (obj["Section"] || "VARC") as "VARC" | "DILR" | "QA",
        topic: obj["Topic"] || "",
        errorType: (() => {
          const errorTypeStr = (obj["Error Type"] || obj["ErrorType"] || "Concept").toLowerCase().trim();
          if (errorTypeStr.includes("concept")) return "Concept";
          if (errorTypeStr.includes("silly")) return "Silly";
          if (errorTypeStr.includes("reading")) return "Reading";
          if (errorTypeStr.includes("time") || errorTypeStr.includes("misjudgment")) return "Time";
          if (errorTypeStr.includes("guess")) return "Guess";
          return "Concept"; // Default
        })() as "Concept" | "Silly" | "Reading" | "Time" | "Guess",
        exactMistake: obj["Exact Mistake"] || obj["ExactMistake"] || "",
        correctThoughtProcess:
          obj["Correct Thought Process"] || obj["CorrectThoughtProcess"] || "",
        howToPreventNextTime:
          obj["How to Prevent Next Time"] || obj["HowToPreventNextTime"] || "",
        revisionDone: toBoolean(obj["Revision Done?"] || obj["RevisionDone"] || "false"),
      };
    });
  } else {
    parsed.Error_Log = [];
  }

  // Parse RC_Passage_Log
  if (rawData.RC_Passage_Log && rawData.RC_Passage_Log.length > 1) {
    const headers = rawData.RC_Passage_Log[0].map((h: string) =>
      h.toString().trim()
    );
    parsed.RC_Passage_Log = rawData.RC_Passage_Log.slice(1).map((row) => {
      const obj = parseRow(headers, row);
      return {
        mockNo: toNumber(obj["Mock No"] || obj["MockNo"] || "0"),
        passageTheme: obj["Passage Theme"] || obj["PassageTheme"] || "",
        passageLength: obj["Passage Length"] || obj["PassageLength"] || "",
        questionsAttempted: toNumber(
          obj["Questions Attempted"] || obj["QuestionsAttempted"] || "0"
        ),
        correct: toNumber(obj["Correct"] || "0"),
        accuracyPercent: toNumber(
          obj["Accuracy %"] || obj["AccuracyPercent"] || "0"
        ),
        timeTaken: toNumber(obj["Time Taken"] || obj["TimeTaken"] || "0"),
        whyWrong: obj["Why Wrong (if any)"] || obj["WhyWrong"] || undefined,
        strategyNextTime:
          obj["Strategy Next Time"] || obj["StrategyNextTime"] || "",
      };
    });
  } else {
    parsed.RC_Passage_Log = [];
  }

  // Parse DILR_Set_Selection_Log
  if (
    rawData.DILR_Set_Selection_Log &&
    rawData.DILR_Set_Selection_Log.length > 1
  ) {
    const headers = rawData.DILR_Set_Selection_Log[0].map((h: string) =>
      h.toString().trim()
    );
    parsed.DILR_Set_Selection_Log = rawData.DILR_Set_Selection_Log.slice(
      1
    ).map((row) => {
      const obj = parseRow(headers, row);
      return {
        mockNo: toNumber(obj["Mock No"] || obj["MockNo"] || "0"),
        setNo: toNumber(obj["Set No"] || obj["SetNo"] || "0"),
        setType: obj["Set Type"] || obj["SetType"] || "",
        difficulty: obj["Difficulty (Perceived)"] || obj["Difficulty"] || "",
        timeSpent: toNumber(obj["Time Spent (sec)"] || obj["TimeSpent"] || "0"),
        questionsSolved: toNumber(
          obj["Questions Solved"] || obj["QuestionsSolved"] || "0"
        ),
        wasSetSolvable: toBoolean(
          obj["Was Set Solvable"] || obj["WasSetSolvable"] || "false"
        ),
        whenShouldIHaveLeft: toNumber(
          obj["When Should I Have Left? (Minute Mark)"] ||
            obj["WhenShouldIHaveLeft"] ||
            "0"
        ),
        selectionMistake:
          obj["Selection Mistake"] || obj["SelectionMistake"] || "",
      };
    });
  } else {
    parsed.DILR_Set_Selection_Log = [];
  }

  // Parse Weekly_Action_Plan
  if (rawData.Weekly_Action_Plan && rawData.Weekly_Action_Plan.length > 1) {
    const headers = rawData.Weekly_Action_Plan[0].map((h: string) =>
      h.toString().trim()
    );
    parsed.Weekly_Action_Plan = rawData.Weekly_Action_Plan.slice(1).map(
      (row) => {
        const obj = parseRow(headers, row);
        return {
          weekNo: toNumber(obj["Week No"] || obj["WeekNo"] || "0"),
          section: (obj["Section"] || "VARC") as "VARC" | "DILR" | "QA",
          weakAreaIdentified:
            obj["Weak Area Identified"] || obj["WeakAreaIdentified"] || "",
          action: obj["Action"] || "",
          targetQuestions: toNumber(
            obj["Target Questions"] || obj["TargetQuestions"] || "0"
          ),
          completionStatus:
            obj["Completion Status"] || obj["CompletionStatus"] || "",
          resultInNextMock:
            obj["Result in Next Mock"] || obj["ResultInNextMock"] || "",
        };
      }
    );
  } else {
    parsed.Weekly_Action_Plan = [];
  }

  // Parse Mock_Reflection
  if (rawData.Mock_Reflection && rawData.Mock_Reflection.length > 1) {
    const headers = rawData.Mock_Reflection[0].map((h: string) =>
      h.toString().trim()
    );
    parsed.Mock_Reflection = rawData.Mock_Reflection.slice(1).map((row) => {
      const obj = parseRow(headers, row);
      return {
        mockNo: toNumber(obj["Mock No"] || obj["MockNo"] || "0"),
        stressLevel: toNumber(obj["Stress Level"] || obj["StressLevel"] || "0"),
        focusLevel: toNumber(obj["Focus Level"] || obj["FocusLevel"] || "0"),
        panicMoment: obj["Panic Moment"] || obj["PanicMoment"] || "",
        whatTriggeredIt:
          obj["What Triggered It"] || obj["WhatTriggeredIt"] || "",
        howToFix: obj["How to Fix"] || obj["HowToFix"] || "",
        confidenceAfterMock: toNumber(
          obj["Confidence After Mock"] || obj["ConfidenceAfterMock"] || "0"
        ),
      };
    });
  } else {
    parsed.Mock_Reflection = [];
  }

  // Ensure all sheets are present
  SHEET_NAMES.forEach((sheetName) => {
    if (!parsed[sheetName]) {
      parsed[sheetName] = [];
    }
  });

  return parsed as SheetData;
}
