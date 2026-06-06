"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { jsPDF } from "jspdf";

type ReportRow = {
  title: string;
  detail: string;
  amount: number;
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
  incomes: ReportRow[];
  expenses: ReportRow[];
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
  incomes,
  expenses,
}: ReportExportActionsProps) {
  const fileSafePeriod = periodLabel.toLowerCase().replace(/\s+/g, "-");

  function downloadPdf() {
    const doc = new jsPDF();
    const margin = 16;
    let y = 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("NM Finance Tracker", margin, y);

    y += 9;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`${periodLabel} report`, margin, y);
    doc.text(`Generated: ${generatedAt}`, margin, y + 6);

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Summary", margin, y);

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Total income: ${formatCurrency(summary.totalIncome)}`, margin, y);
    doc.text(
      `Total expenses: ${formatCurrency(summary.totalExpenses)}`,
      margin,
      y + 7,
    );
    doc.text(`Balance: ${formatCurrency(summary.balance)}`, margin, y + 14);

    y += 28;
    doc.setFont("helvetica", "bold");
    doc.text("Expenses by amount", margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");

    const writeRows = (rows: ReportRow[], emptyText: string) => {
      if (rows.length === 0) {
        doc.text(emptyText, margin, y);
        y += 8;
        return;
      }

      rows.forEach((row) => {
        if (y > 275) {
          doc.addPage();
          y = 18;
        }
        doc.text(`${row.title} (${row.detail})`, margin, y);
        doc.text(formatCurrency(row.amount), 150, y, { align: "right" });
        y += 6;
        doc.setTextColor(100);
        doc.text(row.date, margin, y);
        doc.setTextColor(0);
        y += 8;
      });
    };

    writeRows(expenses, "No expenses found.");

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Incomes by amount", margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    writeRows(incomes, "No incomes found.");

    doc.save(`nm-finance-${fileSafePeriod}-report.pdf`);
  }

  function downloadExcel() {
    const rows = [
      ["Section", "Title", "Detail", "Amount", "Date"],
      ["Summary", "Total Income", "", summary.totalIncome, ""],
      ["Summary", "Total Expenses", "", summary.totalExpenses, ""],
      ["Summary", "Balance", "", summary.balance, ""],
      ["", "", "", "", ""],
      ...expenses.map((expense) => [
        "Expense",
        expense.title,
        expense.detail,
        expense.amount,
        expense.date,
      ]),
      ...incomes.map((income) => [
        "Income",
        income.title,
        income.detail,
        income.amount,
        income.date,
      ]),
    ];

    const worksheetRows = rows
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
