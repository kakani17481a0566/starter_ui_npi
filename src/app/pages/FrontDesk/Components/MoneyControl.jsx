// Import Dependencies
import {
  AcademicCapIcon,
  UserGroupIcon,

} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

// Local Imports
import { Button,} from "components/ui";
import { randomId } from "utils/randomId";

// import StudentsTable from "./StudentsTable";
import { PostalDelivery } from "./PostalDelivery";
import { SendFlow } from "./SendFlow";
// ----------------------------------------------------------------------

const tabs = [
  {
    id: randomId(),
    title: "Exchange",
    icon: AcademicCapIcon,
    content: (
      <div>
        <PostalDelivery />
      </div>
    ),
  },
  {
    id: randomId(),
    title: "Transctions",
    icon: UserGroupIcon,
    content: (
      <div>
        <SendFlow />
      </div>
    ),
  },


];

const MoneyControl = () => {
  return (
    <div className="w-full"> {/* ✅ Full width */}
      <TabGroup>
        <div className="hide-scrollbar overflow-x-auto">
          <div className="w-max min-w-full border-b-2 border-gray-150 dark:border-dark-500">
            <TabList className="-mb-0.5 flex">
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    clsx(
                      "shrink-0 space-x-2 whitespace-nowrap border-b-2 px-3 py-2 font-medium",
                      selected
                        ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                        : "border-transparent hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100"
                    )
                  }
                  as={Button}
                  unstyled
                >
                  {/* ✅ Better icons with proper size */}
                  <tab.icon className="size-6" />
                  <span>{tab.title}</span>
                </Tab>
              ))}
            </TabList>
          </div>
        </div>
        <TabPanels className="mt-3">
          {tabs.map((tab) => (
            <TabPanel key={tab.id}>{tab.content}</TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export { MoneyControl };
