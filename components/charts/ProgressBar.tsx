"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressData {
  label: string;
  value: number;
  max?: number;
}

interface ProgressBarProps {
  data: ProgressData[];
  title?: string;
  description?: string;
}

export default function ProgressBar({
  data,
  title,
  description,
}: ProgressBarProps) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {data.map((item, index) => {
          const max = item.max || 100;
          const percentage = Math.min((item.value / max) * 100, 100);
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.label}</span>
                <span className="text-muted-foreground">
                  {item.value} / {max} ({percentage.toFixed(0)}%)
                </span>
              </div>
              <Progress value={percentage} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
