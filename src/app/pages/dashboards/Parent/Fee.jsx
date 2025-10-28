// src/app/pages/dashboards/Parent/Fee.jsx
import { useEffect, useState } from "react";
import { Page } from "components/shared/Page";
import { Card } from "components/ui";
import FeereportTable from "app/pages/tables/ParentTeacherDashbord/FeereportTable";
import FeeSummaryCard from "app/pages/dashboards/Parent/FeeSummaryCard";
import { fetchFeeReport } from "app/pages/tables/ParentTeacherDashbord/FeereportTable/data";

export default function Fee() {
  const [feeReport, setFeeReport] = useState(null);

  useEffect(() => {
    async function loadReport() {
      const data = await fetchFeeReport(1,384); // tenantId=1, studentId=374
      setFeeReport(data);
    }
    loadReport();
  }, []);

  return (
    <Page title="Fee Report">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="grid grid-cols-12 gap-6">
          {/* First Card - Fee Table */}
          <Card className="col-span-12 lg:col-span-8">
            <FeereportTable />
          </Card>

          {/* Second Card - Fee Summary */}
          <FeeSummaryCard feeReport={feeReport} />
        </div>
      </div>
    </Page>
  );
}
