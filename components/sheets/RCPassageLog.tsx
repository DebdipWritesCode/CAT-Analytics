"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";

interface RCPassageLogProps {
  data: SheetData;
}

export default function RCPassageLog({ data }: RCPassageLogProps) {
  const rcData = data.RC_Passage_Log;

  // Prepare data for Bar Chart: Accuracy by Passage Theme
  const accuracyByTheme = rcData.reduce((acc, passage) => {
    const theme = passage.passageTheme || "Unknown";
    if (!acc[theme]) {
      acc[theme] = { theme, total: 0, correct: 0 };
    }
    acc[theme].total += passage.questionsAttempted;
    acc[theme].correct += passage.correct;
    return acc;
  }, {} as Record<string, { theme: string; total: number; correct: number }>);

  const accuracyByThemeData = Object.values(accuracyByTheme).map((item) => ({
    theme: item.theme,
    accuracy: item.total > 0 ? (item.correct / item.total) * 100 : 0,
  }));

  // Prepare data for Line Chart: Time vs Accuracy per Passage
  const timeVsAccuracy = rcData.map((passage) => ({
    passage: `Mock ${passage.mockNo} - ${passage.passageTheme}`,
    time: passage.timeTaken,
    accuracy: passage.accuracyPercent,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accuracy by Passage Theme</CardTitle>
          <CardDescription>Performance across different passage themes</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={accuracyByThemeData}
            xKey="theme"
            bars={[
              { name: "Accuracy %", dataKey: "accuracy", color: "hsl(var(--chart-1))" },
            ]}
            xLabel="Passage Theme"
            yLabel="Accuracy %"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time vs Accuracy per Passage</CardTitle>
          <CardDescription>Time efficiency analysis for each passage</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={timeVsAccuracy}
            xKey="passage"
            yKey="accuracy"
            xLabel="Passage"
            yLabel="Accuracy %"
            color="hsl(var(--chart-1))"
            height={400}
          />
        </CardContent>
      </Card>
    </div>
  );
}
