import { Page } from "components/shared/Page";
// import {FeeDropDownVertical} from "../components/Divider";
// import {FeeStructureTable} from "../components/FeeStructure"
import FeeTable from "../components/FeeTable"


export default function FeeStructure() {
  return (
    <Page title="Fee Structure">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Fee Structure
            
          </h2>
                {/* <FeeDropDownVertical /> */}
                  {/* <FeeStructureTable /> */}
                  <FeeTable />



        </div>
      </div>
    </Page>
  );
}