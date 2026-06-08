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
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
  rows: ReportRow[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
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
  summary,
  rows,
}: ReportExportActionsProps) {
  const fileSafePeriod = periodLabel.toLowerCase().replace(/\s+/g, "-");

  function downloadPdf() {
    const doc = new jsPDF();
    const margin = 16;
    let y = 18;

    const tableTop = () => {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, 178, 9, "F");
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y + 9, 194, y + 9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Date", margin + 2, y + 6);
      doc.text("Type", margin + 26, y + 6);
      doc.text("Description", margin + 50, y + 6);
      doc.text("Mode", margin + 112, y + 6);
      doc.text("Amount", 192, y + 6, { align: "right" });
      y += 11;
      doc.setFont("helvetica", "normal");
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("NM Finance Tracker", margin, y);
    y += 9;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`${periodLabel} cash flow statement`, margin, y);
    doc.text(`Generated: ${generatedAt}`, margin, y + 6);

    y += 20;
    tableTop();

    if (rows.length === 0) {
      doc.text("No transactions found for this period.", margin + 2, y);
      y += 10;
    }

    rows.forEach((row) => {
      if (y > 270) {
        doc.addPage();
        y = 18;
        tableTop();
      }

      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(row.date, margin + 2, y);
      doc.text(row.type, margin + 26, y);
      doc.text(row.title.slice(0, 34), margin + 50, y);
      doc.text(row.paymentMode, margin + 112, y);
      doc.text(formatCurrency(row.signedAmount), 192, y, { align: "right" });
      y += 4;
      doc.setTextColor(100, 116, 139);
      doc.text(row.categoryOrSource.slice(0, 46), margin + 50, y);
      doc.setTextColor(0, 0, 0);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + 3, 194, y + 3);
      y += 7;
    });

    y += 8;
    if (y > 260) {
      doc.addPage();
      y = 18;
    }

    const totals = [
      ["Total income", summary.totalIncome],
      ["Total expenses", -summary.totalExpenses],
      ["Closing balance", summary.balance],
    ] as const;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    totals.forEach(([label, value]) => {
      doc.text(label, 130, y);
      doc.text(formatCurrency(value), 192, y, { align: "right" });
      y += 7;
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
      </button>
      <button
        type="button"
        onClick={downloadExcel}
        className="button-soft min-h-11 justify-center"
      >
        <FileSpreadsheet className="mr-2" size={17} />
        Excel
      </button>
      <span className="hidden items-center text-xs text-slate-500 lg:inline-flex">
        <Download className="mr-1" size={14} />
        Current filter only
      </span>
    </div>
  );
}
