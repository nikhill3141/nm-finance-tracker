"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { jsPDF } from "jspdf";

type ReportRow = {
  type: "Income" | "Expense";
  title: string;
  categoryOrSource: string;
  paymentMode: string;
  amount: number;
  signedAmount: number;
  date: string;
};

type ReportExportActionsProps = {
  periodLabel: string;
  generatedAt: string;
  user: {
    name: string;
    email: string;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
  rows: ReportRow[];
};

function formatPdfCurrency(value: number) {
  const amount = Math.abs(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `Rs ${amount}`;
}

function cleanPdfText(value: string, maxLength: number) {
  return value
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function ReportExportActions({
  periodLabel,
  generatedAt,
  user,
  summary,
  rows,
}: ReportExportActionsProps) {
  const fileSafePeriod = periodLabel.toLowerCase().replace(/\s+/g, "-");

  function downloadPdf() {
    const doc = new jsPDF();
    const margin = 16;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    let y = 18;

    const drawTableHeader = () => {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, contentWidth, 10, "F");
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y + 10, pageWidth - margin, y + 10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text("Date", margin + 3, y + 7);
      doc.text("Type", margin + 31, y + 7);
      doc.text("Title", margin + 58, y + 7);
      doc.text("Payment", margin + 122, y + 7);
      doc.text("Amount", pageWidth - margin - 3, y + 7, { align: "right" });
      y += 15;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
    };

    const ensureSpace = (height: number) => {
      if (y + height <= pageHeight - 18) {
        return;
      }

      doc.addPage();
      y = 18;
      drawTableHeader();
    };

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, 48, "F");
    doc.setDrawColor(226, 232, 240);
    doc.line(0, 48, pageWidth, 48);

    doc.setFillColor(15, 23, 42);
    doc.rect(pageWidth - margin - 42, 12, 42, 13, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("NM Finance", pageWidth - margin - 21, 20, { align: "center" });

    doc.setFontSize(17);
    doc.setTextColor(15, 23, 42);
    doc.text("Financial Report", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${periodLabel} cash flow statement`, margin, y);
    doc.text(`Generated: ${generatedAt}`, pageWidth - margin, 32, {
      align: "right",
    });

    y += 9;
    doc.setTextColor(100, 116, 139);
    doc.text("Prepared for", margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(cleanPdfText(user.name, 34), margin + 25, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(cleanPdfText(user.email, 42), margin + 25, y + 5);

    y = 60;
    const summaryItems = [
      {
        label: "Total Income",
        value: formatPdfCurrency(summary.totalIncome),
        color: [22, 163, 74],
      },
      {
        label: "Total Expenses",
        value: formatPdfCurrency(summary.totalExpenses),
        color: [220, 38, 38],
      },
      {
        label: "Closing Balance",
        value: formatPdfCurrency(summary.balance),
        color: summary.balance >= 0 ? [22, 163, 74] : [220, 38, 38],
      },
    ] as const;

    const summaryWidth = (contentWidth - 8) / 3;
    summaryItems.forEach((item, index) => {
      const x = margin + index * (summaryWidth + 4);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(x, y, summaryWidth, 25, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(item.label, x + 4, y + 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(item.color[0], item.color[1], item.color[2]);
      doc.text(item.value, x + 4, y + 18);
    });

    y += 36;
    drawTableHeader();

    if (rows.length === 0) {
      doc.setFontSize(9);
      doc.text("No transactions found for this period.", margin + 3, y);
      y += 10;
    }

    rows.forEach((row) => {
      ensureSpace(12);

      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(cleanPdfText(row.date, 18), margin + 3, y);
      doc.text(row.type, margin + 31, y);
      doc.text(cleanPdfText(row.title, 34), margin + 58, y);
      doc.text(cleanPdfText(row.paymentMode, 16), margin + 122, y);
      doc.setTextColor(
        row.signedAmount >= 0 ? 22 : 220,
        row.signedAmount >= 0 ? 163 : 38,
        row.signedAmount >= 0 ? 74 : 38,
      );
      doc.text(formatPdfCurrency(row.signedAmount), pageWidth - margin - 3, y, {
        align: "right",
      });
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + 5, pageWidth - margin, y + 5);
      y += 10;
    });

    doc.save(`nm-finance-${fileSafePeriod}-report.pdf`);
  }

  function downloadExcel() {
    const worksheetData = [
      [
        "Date",
        "Type",
        "Description",
        "Source or Category",
        "Payment Mode",
        "Amount",
      ],
      ...rows.map((row) => [
        row.date,
        row.type,
        row.title,
        row.categoryOrSource,
        row.paymentMode,
        row.signedAmount,
      ]),
      ["", "", "", "", ""],
      ["", "", "", "Total Income", "", summary.totalIncome],
      ["", "", "", "Total Expenses", "", -summary.totalExpenses],
      ["", "", "", "Closing Balance", "", summary.balance],
    ];

    const worksheetRows = worksheetData
      .map((row) => {
        const cells = row
          .map((cell) => {
            if (typeof cell === "number") {
              return `<Cell><Data ss:Type="Number">${cell}</Data></Cell>`;
            }

            return `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`;
          })
          .join("");

        return `<Row>${cells}</Row>`;
      })
      .join("");

    const workbook = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Report">
  <Table>${worksheetRows}</Table>
 </Worksheet>
</Workbook>`;

    saveBlob(
      new Blob([workbook], {
        type: "application/vnd.ms-excel;charset=utf-8",
      }),
      `nm-finance-${fileSafePeriod}-report.xls`,
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={downloadPdf}
        className="button-primary justify-center"
      >
        <FileText className="mr-2" size={17} />
        PDF
        <Download className="ml-2" size={15} />
      </button>
      <button
        type="button"
        onClick={downloadExcel}
        className="button-soft min-h-11 justify-center"
      >
        <FileSpreadsheet className="mr-2" size={17} />
        Excel
        <Download className="ml-2" size={15} />
      </button>

    </div>
  );
}
