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
    action: actionType, // 'ADD_ENTRY', 'SYNC_ALL_ENTRIES', 'SYNC_DEMOS', 'ADD_DEMO'
    subSheetName: targetSubSheet, // Target sub-sheet tab name (e.g. 'Demo Booking Responses', 'Student Data')
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

// Fetch all sub-sheet data live from Google Apps Script Web App (doGet)
export const fetchFromGoogleSheet = async (webAppUrl) => {
  if (!webAppUrl || !webAppUrl.trim()) {
    throw new Error('Google Apps Script Web App URL is required to fetch live sheet data.');
  }

  const cleanUrl = webAppUrl.trim();
  const subSheetsResult = {};

  try {
    // 1. Send GET request to Web App URL
    const url = cleanUrl + (cleanUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}`);
    }

    const rawText = await response.text();
    let json;
    try {
      json = JSON.parse(rawText);
    } catch {
      if (rawText.includes('Lasak') || rawText.includes('Active') || !rawText.trim().startsWith('{') && !rawText.trim().startsWith('[')) {
        throw new Error(
          'Google Apps Script returned plain text instead of JSON ("' + rawText.slice(0, 50) + '..."). Please update doGet(e) in Apps Script with the multi-tab JSON template and deploy a New Version.'
        );
      }
      throw new Error(
        'Google Apps Script response is not valid JSON. Please ensure doGet(e) returns JSON mime type.'
      );
    }

    if (json.status === 'error') {
      throw new Error(json.message || 'Error executing doGet script in Google Apps Script.');
    }

    // CASE 1: Response is an array of row objects directly (User Apps Script style)
    if (Array.isArray(json)) {
      subSheetsResult['Demo Booking Responses'] = { totalRows: json.length, data: json };
      subSheetsResult['Revenue Responses'] = { totalRows: json.length, data: json };

      // Try fetching specific tabs in parallel to build complete multi-sheet view
      const tabsToFetch = ['Demo Booking Responses', 'Revenue Responses', 'Demo Conduction Responses', 'Student Data'];
      await Promise.all(
        tabsToFetch.map(async (tabName) => {
          try {
            const tabUrl = cleanUrl + (cleanUrl.includes('?') ? '&' : '?') + 'sheet=' + encodeURIComponent(tabName) + '&t=' + Date.now();
            const tabRes = await fetch(tabUrl, { method: 'GET' });
            if (tabRes.ok) {
              const tabJson = await tabRes.json();
              if (Array.isArray(tabJson) && tabJson.length > 0) {
                subSheetsResult[tabName] = { totalRows: tabJson.length, data: tabJson };
              }
            }
          } catch (e) {
            // Ignore single tab fetch error
          }
        })
      );

      return {
        status: 'success',
        spreadsheetName: 'Lasak - Sales Revenue Tracker View',
        subSheets: subSheetsResult
      };
    }

    // CASE 2: Response contains subSheets object (Template style)
    if (json.subSheets) {
      return json;
    }

    return {
      status: 'success',
      subSheets: {
        'Main Sheet': { totalRows: Array.isArray(json) ? json.length : 0, data: Array.isArray(json) ? json : [] }
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Multi-Tab & Sub-Sheet Ready Google Apps Script Template
export const APPS_SCRIPT_TEMPLATE = `
// =======================================================
// LASAK EDU - MULTI-TAB GOOGLE APPS SCRIPT WEB APP INTEGRATION
// Sheet Name: "Lasak - Sales Revenue Tracker View"
//
// Sub-Sheet Tabs Handled:
//  1. "Demo Booking Responses" (Columns: Timestamp, AC Name, Student Name, Student Email, Student Phone, Demo Date, Demo Time, Course Name, Price Pitched, Comments)
//  2. "Bookings & Demo Done"
//  3. "Demo Conduction Responses"
//  4. "Revenue Responses"
//  5. "Student Data"
//
// SETUP INSTRUCTIONS IN GOOGLE SHEETS:
// 1. Open your Google Sheet ("Lasak - Sales Revenue Tracker View")
// 2. Click Extensions > Apps Script
// 3. Select all existing code, delete it, and paste this entire code
// 4. Click Save (💾)
// 5. Click Deploy > New deployment
// 6. Select type: "Web app"
// 7. Set "Execute as": "Me"
// 8. Set "Who has access": "Anyone"  <-- CRITICAL for fetching data!
// 9. Click Deploy, copy the Web App URL and paste into your Dashboard!
// =======================================================

// --- READ / FETCH DATA FROM ALL SUB-SHEETS (GET Request) ---
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var result = {
      status: "success",
      spreadsheetName: ss.getName(),
      timestamp: new Date().toISOString(),
      subSheets: {}
    };

    for (var i = 0; i < sheets.length; i++) {
      var sheet = sheets[i];
      var name = sheet.getName();
      var data = sheet.getDataRange().getDisplayValues();

      if (data && data.length > 0) {
        var headers = data[0];
        var rows = [];

        for (var r = 1; r < data.length; r++) {
          var rowObj = {};
          var hasValue = false;

          for (var c = 0; c < headers.length; c++) {
            var rawHeader = headers[c] ? headers[c].toString().trim() : ("Col_" + (c + 1));
            var cellVal = data[r][c];

            // Format date objects to string if needed
            if (cellVal instanceof Date) {
              cellVal = Utilities.formatDate(cellVal, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
            }
            rowObj[rawHeader] = cellVal !== undefined ? cellVal : "";
            if (cellVal !== "" && cellVal !== null) {
              hasValue = true;
            }
          }

          if (hasValue) {
            rows.push(rowObj);
          }
        }

        result.subSheets[name] = {
          headers: headers,
          totalRows: rows.length,
          data: rows
        };
      } else {
        result.subSheets[name] = { headers: [], totalRows: 0, data: [] };
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- WRITE / SYNC DATA TO SUB-SHEETS (POST Request) ---
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var targetTabName = contents.subSheetName || "Demo Booking Responses";
    var data = contents.data;

    // Helper: Get existing sub-sheet tab or create if missing
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

    // SUB-SHEET: Demo Booking Responses / Demo Conduction Responses
    if (action === "SYNC_DEMOS" || action === "ADD_DEMO" || targetTabName.indexOf("Demo") !== -1) {
      var sheet = getOrCreateSheet(
        targetTabName || "Demo Booking Responses",
        "#4f46e5",
        ["Timestamp", "AC Name", "Student Name", "Student Email", "Student Phone", "Demo Date", "Demo Time", "Course Name", "Price Pitched", "Comments"]
      );

      if (action === "ADD_DEMO" && data) {
        sheet.appendRow([
          new Date().toLocaleString(),
          data.staffEmail || data.employeeName || "advisor@lasakedu.in",
          data.prospectName || "",
          data.prospectEmail || "",
          data.prospectPhone || "",
          data.date || "",
          data.timeSlot || "11:00 am",
          data.courseKey || data.course || "Mechanical Designing",
          data.pricePitched || "75,000",
          data.notes || "Scheduled via Dashboard"
        ]);
      } else if (Array.isArray(data)) {
        data.forEach(function(item) {
          sheet.appendRow([
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
    // SUB-SHEET: Student Data / Employee Entries
    else {
      var sheet = getOrCreateSheet(
        targetTabName || "Student Data",
        "#059669",
        ["Timestamp", "Entry ID", "Student / Employee Name", "Date", "Status"]
      );

      if (action === "ADD_ENTRY" && data) {
        sheet.appendRow([
          new Date().toLocaleString(),
          data.id || "",
          data.employeeName || data.name || "",
          data.date || "",
          "Active Entry"
        ]);
      } else if (Array.isArray(data)) {
        data.forEach(function(item) {
          sheet.appendRow([
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
      .createTextOutput(JSON.stringify({ status: "success", message: "Data logged into Google Sheet tab successfully!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
