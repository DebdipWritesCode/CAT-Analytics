"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StackedBarChart from "@/components/charts/StackedBarChart";
import MultiLineChart from "@/components/charts/MultiLineChart";
import { CHART_COLORS, getSectionColor } from "@/lib/colors";

interface SectionalTimeUsageProps {
  data: SheetData;
}

export default function SectionalTimeUsage({ data }: SectionalTimeUsageProps) {
  const timeData = data.Sectional_Time_Usage;

  // Prepare data for Planned vs Used vs Wasted Time
  const timeUsage = ["VARC", "DILR", "QA"].map((section) => {
    const sectionData = timeData.filter((t) => t.section === section);
    return {
      section,
      Planned: sectionData.reduce((sum, t) => sum + t.timePlanned, 0) / sectionData.length || 0,
      Actual: sectionData.reduce((sum, t) => sum + t.timeActuallyUsed, 0) / sectionData.length || 0,
      Wasted: sectionData.reduce((sum, t) => sum + t.timeWasted, 0) / sectionData.length || 0,
    };
  });

  // Prepare data for Time Used vs Score
  const timeVsScore = timeData.reduce((acc, item) => {
    const existing = acc.find((a) => a.mockNo === item.mockNo && a.section === item.section);
    if (existing) {
      existing.timeUsed = item.timeActuallyUsed;
    } else {
      acc.push({
        mockNo: item.mockNo,
        section: item.section,
        timeUsed: item.timeActuallyUsed,
        score: 0, // Will be populated from Mock_Overview
      });
    }
    return acc;
  }, [] as any[]);

  // Get scores from Mock_Overview
  data.Mock_Overview.forEach((mock) => {
    timeVsScore.forEach((item) => {
      if (item.mockNo === mock.mockNo) {
        if (item.section === "VARC") item.score = mock.varcScore;
        if (item.section === "DILR") item.score = mock.dilrScore;
        if (item.section === "QA") item.score = mock.qaScore;
      }
    });
  });

  // Group by mock for line chart
  const timeScoreByMock = timeData.reduce((acc, item) => {
    const key = item.mockNo;
    if (!acc[key]) {
      acc[key] = { mockNo: key, VARC: 0, DILR: 0, QA: 0 };
    }
    acc[key][item.section] = item.timeActuallyUsed;
    return acc;
  }, {} as Record<number, any>);

  const timeScoreData = Object.values(timeScoreByMock);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Planned vs Used vs Wasted Time</CardTitle>
          <CardDescription>Time allocation analysis by section</CardDescription>
        </CardHeader>
        <CardContent>
          <StackedBarChart
            data={timeUsage}
            xKey="section"
            bars={[
              { name: "Planned", dataKey: "Planned", color: CHART_COLORS.stacked.planned },
              { name: "Actual", dataKey: "Actual", color: CHART_COLORS.stacked.actual },
              { name: "Wasted", dataKey: "Wasted", color: CHART_COLORS.stacked.wasted },
            ]}
            xLabel="Section"
            yLabel="Time (minutes)"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Used vs Score (per mock)</CardTitle>
          <CardDescription>Time efficiency analysis across mocks</CardDescription>
        </CardHeader>
        <CardContent>
          <MultiLineChart
            data={timeScoreData}
            xKey="mockNo"
            lines={[
              { name: "VARC Time", dataKey: "VARC", color: getSectionColor("VARC") },
              { name: "DILR Time", dataKey: "DILR", color: getSectionColor("DILR") },
              { name: "QA Time", dataKey: "QA", color: getSectionColor("QA") },
            ]}
            xLabel="Mock"
            yLabel="Time Used (minutes)"
          />
        </CardContent>
      </Card>
    </div>
  );
}
