import { Page } from "components/shared/Page";
import HealthForm  from "../../forms/Genetics/GeneticRegitrationForm"

export default function Genetics() {
  return (
    <Page title="Example">
      <div className="transition-content w-full  pt-5 lg:pt-6">
        <HealthForm />
      </div>
    </Page>
  );
}