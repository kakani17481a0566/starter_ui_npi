// src/app/pages/dashboards/Attendence/page.jsx

import { Page } from "components/shared/Page";
import {RegistartionForm} from  "app/pages/forms/RegistrationFormms";

// import StatusCards from '../teacher/AiNew/Result';
export default function Registartion() {

  return (
    <Page title="Registration">
      <div
        className="transition-content w-full pt-5 lg:pt-6"
        style={{ paddingLeft: "var(--margin-x)", paddingRight: "var(--margin-x)" }}
      >
        
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          Registration Form
          </h2>
        </div>
        <RegistartionForm/>

      
      </div>
    </Page>
  );
}

