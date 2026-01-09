"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { SHEET_NAMES } from "@/lib/types";
import { fetchSheetData, type SheetData } from "@/lib/sheets";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Home } from "lucide-react";
import Link from "next/link";

// Import sheet view components
import MockOverview from "@/components/sheets/MockOverview";
import SectionalTimeUsage from "@/components/sheets/SectionalTimeUsage";
import QuestionLevelAnalysis from "@/components/sheets/QuestionLevelAnalysis";
import TopicWiseAccuracy from "@/components/sheets/TopicWiseAccuracy";
import UnattemptedQuestionsAudit from "@/components/sheets/UnattemptedQuestionsAudit";
import ErrorLog from "@/components/sheets/ErrorLog";
import RCPassageLog from "@/components/sheets/RCPassageLog";
import DILRSetSelectionLog from "@/components/sheets/DILRSetSelectionLog";
import WeeklyActionPlan from "@/components/sheets/WeeklyActionPlan";
import MockReflection from "@/components/sheets/MockReflection";

const SHEET_COMPONENTS: Record<string, React.ComponentType<{ data: SheetData }>> = {
  Mock_Overview: MockOverview,
  Sectional_Time_Usage: SectionalTimeUsage,
  Question_Level_Analysis: QuestionLevelAnalysis,
  Topic_Wise_Accuracy: TopicWiseAccuracy,
  Unattempted_Questions_Audit: UnattemptedQuestionsAudit,
  Error_Log: ErrorLog,
  RC_Passage_Log: RCPassageLog,
  DILR_Set_Selection_Log: DILRSetSelectionLog,
  Weekly_Action_Plan: WeeklyActionPlan,
  Mock_Reflection: MockReflection,
};

function DashboardSidebar({ onSheetChange }: { onSheetChange: (sheet: string) => void }) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics Sheets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SHEET_NAMES.map((sheetName) => (
                <SidebarMenuButton
                  key={sheetName}
                  onClick={() => {
                    onSheetChange(sheetName);
                    setOpenMobile(false);
                  }}
                  className="w-full justify-start"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {sheetName.replace(/_/g, " ")}
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSheet, setSelectedSheet] = useState(SHEET_NAMES[0]);

  useEffect(() => {
    // Check if sheet ID exists
    const sheetId = localStorage.getItem("sheetId");
    if (!sheetId) {
      router.push("/");
      return;
    }

    // Fetch sheet data
    async function loadData() {
      setLoading(true);
      setError(null);
      const data = await fetchSheetData(sheetId);
      if (data) {
        setSheetData(data);
      } else {
        setError("Failed to load sheet data. Please check your Google Sheets link.");
      }
      setLoading(false);
    }

    loadData();
  }, [router]);

  const handleSheetChange = (sheet: string) => {
    setSelectedSheet(sheet);
  };

  const SelectedSheetComponent = SHEET_COMPONENTS[selectedSheet];

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sheetData) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar onSheetChange={handleSheetChange} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {selectedSheet.replace(/_/g, " ")}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Analytics and insights for your CAT preparation
            </p>
          </div>
          <div className="w-full overflow-x-auto">
            {SelectedSheetComponent && (
              <SelectedSheetComponent data={sheetData} />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
