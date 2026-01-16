"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ScatterPlot from "@/components/charts/ScatterPlot";
import BarChart from "@/components/charts/BarChart";
import { CHART_COLORS, getSectionColor } from "@/lib/colors";

interface QuestionLevelAnalysisProps {
  data: SheetData;
}

export default function QuestionLevelAnalysis({ data }: QuestionLevelAnalysisProps) {
  const questionData = data.Question_Level_Analysis;

  // Prepare data for Time Taken vs Accuracy scatter plot
  const scatterData = questionData
    .filter((q) => q.attempted)
    .map((q) => ({
      x: q.timeTaken,
      y: q.correct ? 1 : 0,
      section: q.section,
      color: getSectionColor(q.section),
    }));

  // Prepare data for Wrong Reasons Distribution
  const wrongReasons = questionData
    .filter((q) => q.attempted && !q.correct && q.whyWrong)
    .reduce((acc, q) => {
      const reason = q.whyWrong || "Unknown";
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const wrongReasonsData = Object.entries(wrongReasons).map(([reason, count]) => ({
    reason,
    count,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Taken vs Accuracy</CardTitle>
          <CardDescription>Relationship between time spent and correctness</CardDescription>
        </CardHeader>
        <CardContent>
          <ScatterPlot
            data={scatterData}
            xKey="x"
            yKey="y"
            colorKey="section"
            xLabel="Time Taken (seconds)"
            yLabel="Correct (1/0)"
            colors={[getSectionColor("VARC"), getSectionColor("DILR"), getSectionColor("QA")]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wrong Reasons Distribution</CardTitle>
          <CardDescription>Breakdown of error types</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={wrongReasonsData}
            xKey="reason"
            bars={[
              { name: "Count", dataKey: "count", color: CHART_COLORS.primary[0] },
            ]}
            xLabel="Error Type"
            yLabel="Count"
          />
        </CardContent>
      </Card>
    </div>
  );
}
