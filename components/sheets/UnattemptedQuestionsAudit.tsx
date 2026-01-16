"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import { CHART_COLORS } from "@/lib/colors";

interface UnattemptedQuestionsAuditProps {
  data: SheetData;
}

export default function UnattemptedQuestionsAudit({ data }: UnattemptedQuestionsAuditProps) {
  const unattemptedData = data.Unattempted_Questions_Audit;

  // Prepare data for Pie Chart: Reasons for Skipping
  const reasonsCount = unattemptedData.reduce((acc, item) => {
    const reason = item.reasonNotAttempted || "Unknown";
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(reasonsCount).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare data for Bar Chart: Should Have Attempted vs Skipped
  const shouldAttemptData = [
    {
      category: "Should Have Attempted",
      count: unattemptedData.filter((q) => q.shouldIAttemptNextTime).length,
    },
    {
      category: "Correctly Skipped",
      count: unattemptedData.filter((q) => !q.shouldIAttemptNextTime).length,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reasons for Skipping</CardTitle>
          <CardDescription>Distribution of reasons for not attempting questions</CardDescription>
        </CardHeader>
        <CardContent>
          <PieChart data={pieData} height={400} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Should Have Attempted vs Skipped</CardTitle>
          <CardDescription>Analysis of skipped questions</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={shouldAttemptData}
            xKey="category"
            bars={[
              { name: "Count", dataKey: "count", color: CHART_COLORS.primary[0] },
            ]}
            xLabel="Category"
            yLabel="Count"
          />
        </CardContent>
      </Card>
    </div>
  );
}
