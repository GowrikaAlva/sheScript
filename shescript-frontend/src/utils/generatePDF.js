/**
 * generatePDF.js
 *
 * Uses a hidden print window instead of html2canvas.
 * Works for ALL languages (Kannada, Hindi, Tamil, Telugu, Malayalam, English)
 * and renders emoji correctly because it uses the real browser renderer.
 *
 * No extra npm packages needed — remove jspdf and html2canvas.
 */

export function generateMedicinePDF(elementId, medicineName, lang = "en") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return;
  }

  // Grab all stylesheets from the current page so fonts/styles carry over
  const styleSheets = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        // Cross-origin sheet (e.g. Google Fonts) — link it instead
        return sheet.href ? `@import url("${sheet.href}");` : "";
      }
    })
    .join("\n");

  const printWindow = window.open("", "_blank", "width=900,height=700");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8" />
      <title>${medicineName || "Medicine"} Report</title>

      <!-- Fonts: covers Latin + all Indian scripts -->
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Noto+Sans:wght@400;600&family=Noto+Sans+Kannada:wght@400;600&family=Noto+Sans+Devanagari:wght@400;600&family=Noto+Sans+Tamil:wght@400;600&family=Noto+Sans+Telugu:wght@400;600&family=Noto+Sans+Malayalam:wght@400;600&display=swap" rel="stylesheet" />

      <style>
        /* Carry over all app styles */
        ${styleSheets}

        /* Print-specific overrides */
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        body {
          margin: 0;
          padding: 24px;
          background: #F5EFE6 !important;
          font-family: 'DM Sans', 'Noto Sans', 'Noto Sans Kannada',
                       'Noto Sans Devanagari', 'Noto Sans Tamil',
                       'Noto Sans Telugu', 'Noto Sans Malayalam',
                       Arial, sans-serif;
        }

        /* Hide the download button inside the report */
        button { display: none !important; }

        /* Page setup */
        @page {
          size: A4;
          margin: 16mm 12mm;
        }

        @media print {
          body { padding: 0; background: #F5EFE6 !important; }
          /* Prevent breaking inside cards */
          [class*="card"], [class*="Card"], section, .result-section { page-break-inside: avoid; }
        }

        /* Footer printed on every page */
        @page {
          @bottom-center {
            content: "MediScan Report  |  ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}  |  ${lang.toUpperCase()}";
            font-size: 8pt;
            color: #9E9488;
          }
        }
      </style>
    </head>
    <body>
      ${element.innerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for fonts to load before triggering print
  printWindow.onload = () => {
    // Extra delay for Google Fonts to finish loading
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // Close the window after the print dialog is dismissed
      printWindow.onafterprint = () => printWindow.close();
    }, 800);
  };
}