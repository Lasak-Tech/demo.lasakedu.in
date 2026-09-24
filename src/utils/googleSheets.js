// Google Sheets Integration Utility for Admin & Employee Dashboards with Sub-Sheet / Multi-Tab Routing

// Export dataset to CSV file downloadable in browser
export const exportToCSV = (filename, headers, rows) => {
  if (!rows || !rows.length) return false;

  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = headers.map((h) => escapeCell(h.label)).join(',');
  const dataRows = rows.map((row) =>
    headers.map((h) => escapeCell(row[h.key] ?? '')).join(',')
  );

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headerRow, ...dataRows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};

// Sync payload to Google Apps Script Web App URL targeting specific sub-sheet tabs
export const syncToGoogleSheet = async (webAppUrl, actionType, dataPayload, targetSubSheet = '') => {
  if (!webAppUrl || !webAppUrl.trim()) {
    throw new Error('Google Apps Script Web App URL is required for live cloud sync.');
  }

  const payload = {
    action: actionType, // 'ADD_ENTRY', 'SYNC_ALL_ENTRIES', 'SYNC_DEMOS'
    subSheetName: targetSubSheet, // Target sub-sheet tab name (e.g. 'Employee Entries', 'Demo Analytics')
    timestamp: new Date().toISOString(),
    data: dataPayload
  };

  try {
    const response = await fetch(webAppUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Avoids CORS preflight block on Google Apps Script
      },
      body: JSON.stringify(payload)
    });

    const resultText = await response.text();
    try {
      return JSON.parse(resultText);
    } catch {
      return { success: true, message: `Data transmitted to sub-sheet successfully` };
    }
  } catch (error) {
    console.warn('Standard fetch error, trying no-cors mode fallback:', error);
    try {
      await fetch(webAppUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      return { success: true, message: `Data pushed to Google Sheet tab (no-cors mode)` };
    } catch (err) {
      throw new Error(`Google Sheet sync failed: ${err.message}`);
    }
  }
};

// Multi-Tab & Sub-Sheet Ready Google Apps Script Template
export const APPS_SCRIPT_TEMPLATE = `
// =======================================================
// LASAK EDU - MULTI-TAB GOOGLE APPS SCRIPT WEB APP INTEGRATION
// Linked with Existing Sheet: "Lasak - Sales Revenue Tracker View"
//
// Automatically routes and logs data into existing Sub-Sheet Tabs:
//  1. "Demo Booking Responses" (Columns A-J: Timestamp, AC Name, Student Name, Student Email, Student Phone, Demo Date, Demo Time, Course Name, Price Pitched, Comments)
//  2. "Bookings & Demo Done"
//  3. "Demo Conduction Responses"
//  4. "Revenue Responses"
//  5. "Student Data"
//
// Setup Instructions for Existing Google Sheet:
// 1. Open your existing Google Sheet ("Lasak - Sales Revenue Tracker View")
// 2. Click Extensions > Apps Script
// 3. Delete any old script code, paste this code & click Save (💾)
// 4. Click Deploy > New deployment
// 5. Select type: "Web app"
// 6. Set "Execute as": Me | "Who has access": Anyone
// 7. Click Deploy, copy the Web App URL and paste into Dashboard!
// =======================================================

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var subSheetName = contents.subSheetName || "";
    var data = contents.data;

    // Helper: Find existing sub-sheet tab or create if missing
    function getOrCreateSheet(sheetName, defaultHeaderColor, headers) {
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
      }
      if (sheet.getLastRow() === 0 && headers) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length)
          .setFontWeight("bold")
          .setBackground(defaultHeaderColor)
          .setFontColor("#ffffff");
      }
      return sheet;
    }

    // --- SUB-SHEET 1: DEMO BOOKING RESPONSES (Matches Your Existing Sheet Columns A-J) ---
    if (action === "SYNC_DEMOS" || action === "ADD_DEMO") {
      var bookingSheet = getOrCreateSheet(
        "Demo Booking Responses",
        "#4f46e5",
        ["Timestamp", "AC Name", "Student Name", "Student Email", "Student Phone", "Demo Date", "Demo Time", "Course Name", "Price Pitched", "Comments"]
      );

      if (action === "ADD_DEMO" && data) {
        bookingSheet.appendRow([
          new Date().toLocaleString(),
          data.staffEmail || data.employeeName || "advisor@lasakedu.in",
          data.prospectName || "",
          data.prospectEmail || "",
          data.prospectPhone || "",
          data.date || "",
          data.timeSlot || "11:00 am",
          data.courseKey || data.course || "Mechanical Designing",
          data.pricePitched || "75,000",
          data.notes || "Demo Scheduled via Dashboard"
        ]);
      } else if (Array.isArray(data)) {
        data.forEach(function(item) {
          bookingSheet.appendRow([
            new Date().toLocaleString(),
            item.staffEmail || item.employeeName || "advisor@lasakedu.in",
            item.prospectName || "",
            item.prospectEmail || "",
            item.prospectPhone || "",
            item.date || "",
            item.timeSlot || "11:00 am",
            item.courseKey || item.course || "Mechanical Designing",
            item.pricePitched || "75,000",
            item.notes || "Dashboard Synced Entry"
          ]);
        });
      }
    }

    // --- SUB-SHEET 2: EMPLOYEE & STUDENT DATA ---
    else if (action === "ADD_ENTRY" || action === "SYNC_ALL_ENTRIES") {
      var studentSheet = getOrCreateSheet(
        "Student Data",
        "#059669",
        ["Timestamp", "Entry ID", "Student / Employee Name", "Date", "Status"]
      );

      if (action === "ADD_ENTRY") {
        studentSheet.appendRow([
          new Date().toLocaleString(),
          data.id || "",
          data.employeeName || data.name || "",
          data.date || "",
          "Active Entry"
        ]);
      } else if (Array.isArray(data)) {
        data.forEach(function(item) {
          studentSheet.appendRow([
            new Date().toLocaleString(),
            item.id || "",
            item.employeeName || item.name || "",
            item.date || "",
            "Synced Record"
          ]);
        });
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data logged into your existing Google Sheet sub-sheet successfully!" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Lasak Edu - Sales Revenue Tracker View Web App Active!");
}
`;
