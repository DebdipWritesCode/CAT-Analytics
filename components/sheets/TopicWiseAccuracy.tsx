"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "@/components/charts/BarChart";
import BubbleChart from "@/components/charts/BubbleChart";

interface TopicWiseAccuracyProps {
  data: SheetData;
}

export default function TopicWiseAccuracy({ data }: TopicWiseAccuracyProps) {
  const topicData = data.Topic_Wise_Accuracy;

  // Prepare data for Horizontal Bar Chart: Accuracy by Topic
  const accuracyByTopic = topicData
    .map((t) => ({
      topic: t.topic,
      accuracy: t.accuracyPercent,
    }))
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 20); // Top 20 topics

  // Prepare data for Bubble Chart: Topic Risk Map
  const bubbleData = topicData.map((t) => ({
    x: t.avgTimePerQuestion,
    y: t.accuracyPercent,
    z: t.totalQuestionsAttempted,
    name: t.topic,
    color:
      t.strengthLevel === "Strong"
        ? "hsl(var(--chart-1))"
        : t.strengthLevel === "Medium"
        ? "hsl(var(--chart-2))"
        : "hsl(var(--chart-3))",
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accuracy by Topic</CardTitle>
          <CardDescription>Top 20 topics by accuracy percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={accuracyByTopic}
            xKey="topic"
            bars={[
              { name: "Accuracy %", dataKey: "accuracy", color: "hsl(var(--chart-1))" },
            ]}
            xLabel="Topic"
            yLabel="Accuracy %"
            height={400}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topic Risk Map</CardTitle>
          <CardDescription>Time vs Accuracy analysis (bubble size = frequency)</CardDescription>
        </CardHeader>
        <CardContent>
          <BubbleChart
            data={bubbleData}
            xKey="x"
            yKey="y"
            sizeKey="z"
            xLabel="Avg Time per Question (sec)"
            yLabel="Accuracy %"
            height={400}
          />
        </CardContent>
      </Card>
    </div>
  );
}
