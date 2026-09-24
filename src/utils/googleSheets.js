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
// Handles Sub-Sheets: "Employee Entries" & "Demo Analytics"
// Paste this code into Google Sheets > Extensions > Apps Script
// Click Deploy > New Deployment > Select "Web app"
// Set "Execute as": Me | "Who has access": Anyone
// Copy the Web App URL and paste it into your Dashboard!
// =======================================================

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var subSheetName = contents.subSheetName || "";
    var data = contents.data;

    // Helper: Find or create sub-sheet tab by name
    function getOrCreateSheet(sheetName, defaultHeaderColor, headers) {
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
      }
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length)
          .setFontWeight("bold")
          .setBackground(defaultHeaderColor)
          .setFontColor("#ffffff");
      }
      return sheet;
    }

    // --- SUB-SHEET 1: EMPLOYEE ENTRIES ---
    if (action === "ADD_ENTRY" || action === "SYNC_ALL_ENTRIES") {
      var targetTab = subSheetName || "Employee Entries";
      var empSheet = getOrCreateSheet(
        targetTab,
        "#059669",
        ["Sync Time", "Entry ID", "Employee Name", "Work Date", "Status"]
      );

      if (action === "ADD_ENTRY") {
        empSheet.appendRow([
          new Date().toLocaleString(),
          data.id || "",
          data.employeeName || "",
          data.date || "",
          "Active Entry"
        ]);
      } else if (Array.isArray(data)) {
        data.forEach(function(item) {
          empSheet.appendRow([
            new Date().toLocaleString(),
            item.id || "",
            item.employeeName || "",
            item.date || "",
            "Bulk Synced Entry"
          ]);
        });
      }
    }

    // --- SUB-SHEET 2: DEMO ANALYTICS & TIMETABLE ---
    else if (action === "SYNC_DEMOS") {
      var demoTabName = subSheetName || "Demo Analytics";
      var demoSheet = getOrCreateSheet(
        demoTabName,
        "#4f46e5",
        ["Sync Time", "Demo ID", "Prospect Name", "Phone", "Course", "Advisor / Employee", "Date", "Time Slot", "Notes"]
      );

      if (Array.isArray(data)) {
        data.forEach(function(item) {
          demoSheet.appendRow([
            new Date().toLocaleString(),
            item.id || "",
            item.prospectName || "",
            item.prospectPhone || "",
            item.courseKey || "",
            item.employeeName || "",
            item.date || "",
            item.timeSlot || "",
            item.notes || ""
          ]);
        });
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data logged into sub-sheet successfully!" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Lasak Edu Multi-Tab Google Sheets Web App is Active!");
}
`;
