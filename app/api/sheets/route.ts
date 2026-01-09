import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { SHEET_NAMES } from "@/lib/types";

// Initialize Google Sheets API
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const authClient = await auth.getClient();
  return google.sheets({ version: "v4", auth: authClient });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const spreadsheetId = searchParams.get("id");

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: "Spreadsheet ID is required" },
        { status: 400 }
      );
    }

    const sheets = await getSheetsClient();

    // Fetch all sheets in parallel
    const sheetPromises = SHEET_NAMES.map(async (sheetName) => {
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!A:Z`, // Get all columns A-Z
        });

        return {
          sheetName,
          data: response.data.values || [],
        };
      } catch (error) {
        console.error(`Error fetching sheet ${sheetName}:`, error);
        return {
          sheetName,
          data: [],
          error: `Failed to fetch ${sheetName}`,
        };
      }
    });

    const results = await Promise.all(sheetPromises);

    // Convert results to object format
    const sheetData: Record<string, any[][]> = {};
    results.forEach((result) => {
      sheetData[result.sheetName] = result.data;
    });

    return NextResponse.json({ data: sheetData });
  } catch (error: any) {
    console.error("Error fetching sheets:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch sheet data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
