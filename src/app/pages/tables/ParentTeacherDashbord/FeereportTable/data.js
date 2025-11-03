// src/app/pages/tables/ParentTeacherDashboard/FeereportTable/data.js
import axios from "axios";

// Base API URL (use env var or fallback for dev)
// const API_BASE = "https://localhost:7202";
const BASE_URL=`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net`;


// 🔹 Fetch fee report for a student
export async function fetchFeeReport(tenantId, studentId) {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/FeeTransactions/report-fee/${tenantId}/${studentId}`
    );
    return res.data?.data || null;
  } catch (err) {
    console.error("❌ Failed to fetch fee report", err);
    return null;
  }
}

// 🔹 Transform API response into table-friendly rows
export function mapFeeReportToRows(feeReport) {
  if (!feeReport) return [];
  return feeReport.transactions.map((t) => ({
    id: t.id,
    feeStructureName: t.feeStructureName,
    trxDate: t.trxDate,
    trxMonth: t.trxMonth,
    trxYear: t.trxYear,
    trxType: t.trxType,
    trxName: t.trxName,
    debit: t.debit,
    credit: t.credit,
    trxStatus: t.trxStatus,
    paymentType: t.paymentType,
  }));
}

// 🔹 Status filter options (used in Toolbar filters)
export const orderStatusOptions = [
  { value: "Completed", label: "Completed", color: "success" },
  { value: "Pending", label: "Pending", color: "warning" },
  { value: "Cancelled", label: "Cancelled", color: "danger" },
];
