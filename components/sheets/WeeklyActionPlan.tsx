"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from "@/components/charts/ProgressBar";
import LineChart from "@/components/charts/LineChart";
import { CHART_COLORS } from "@/lib/colors";

interface WeeklyActionPlanProps {
  data: SheetData;
}

export default function WeeklyActionPlan({ data }: WeeklyActionPlanProps) {
  const planData = data.Weekly_Action_Plan;

  // Prepare data for Progress Bar: Completion % per week
  const completionByWeek = planData.reduce((acc, plan) => {
    const weekNo = plan.weekNo;
    if (!acc[weekNo]) {
      acc[weekNo] = { weekNo, completed: 0, total: 0 };
    }
    acc[weekNo].total += 1;
    if (plan.completionStatus.toLowerCase().includes("complete") || 
        plan.completionStatus.toLowerCase().includes("done")) {
      acc[weekNo].completed += 1;
    }
    return acc;
  }, {} as Record<number, { weekNo: number; completed: number; total: number }>);

  const progressData = Object.values(completionByWeek).map((week) => ({
    label: `Week ${week.weekNo}`,
    value: week.completed,
    max: week.total,
  }));

  // Prepare data for Line Chart: Weak Area → Next Mock Improvement
  // This would require linking to Mock_Overview data
  const improvementData = planData.map((plan) => ({
    week: plan.weekNo,
    target: plan.targetQuestions,
    // In a real implementation, you'd link this to actual mock results
    improvement: 0, // Placeholder
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Completion Progress</CardTitle>
          <CardDescription>Task completion percentage per week</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar data={progressData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weak Area → Next Mock Improvement</CardTitle>
          <CardDescription>Tracking improvement from action plans</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={improvementData}
            xKey="week"
            yKey="target"
            xLabel="Week"
            yLabel="Target Questions"
            color={CHART_COLORS.primary[0]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
