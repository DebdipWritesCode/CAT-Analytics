"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if sheet ID exists in localStorage
    const sheetId = localStorage.getItem("sheetId");
    if (sheetId) {
      router.push("/dashboard");
    }
  }, [router]);

  const extractSpreadsheetId = (url: string): string | null => {
    // Handle various Google Sheets URL formats:
    // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
    // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
    // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!sheetUrl.trim()) {
      setError("Please enter a Google Sheets URL");
      return;
    }

    const spreadsheetId = extractSpreadsheetId(sheetUrl);
    if (!spreadsheetId) {
      setError("Invalid Google Sheets URL. Please check the link and try again.");
      return;
    }

    // Store in localStorage
    localStorage.setItem("sheetId", spreadsheetId);
    
    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Analytics Dashboard</CardTitle>
          <CardDescription>
            Enter your Google Sheets link to view analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sheet-url">Google Sheets URL</Label>
              <Input
                id="sheet-url"
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="w-full"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Load Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
