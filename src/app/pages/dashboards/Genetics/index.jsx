import { Page } from "components/shared/Page";
import NewPostFrom  from "../../forms/Genetics/GeneticRegitrationForm"

export default function Genetics() {
  return (
    <Page title="Example">
      <div className="transition-content w-full  pt-5 lg:pt-6">
        <div className="min-w-0">

        </div>
        <NewPostFrom />
      </div>
    </Page>
  );
}