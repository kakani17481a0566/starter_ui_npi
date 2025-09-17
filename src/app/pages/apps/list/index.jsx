// Import Dependencies
import { CloudIcon } from "@heroicons/react/24/outline";
import { FaMoneyBillWave, FaShapes } from "react-icons/fa6";
import { Link } from "react-router";

// Local Imports
import { Page } from "components/shared/Page";
import { randomId } from "utils/randomId";
import { Avatar, Card } from "components/ui";

// ----------------------------------------------------------------------

const apps = [
  {
    id: randomId(),
    logo: CloudIcon,
    color: "secondary",
    name: "File Manager",
    text: "Manage and organize your files easily.",
    path: "/apps/filemanager",
  },
  {
    id: randomId(),
    logo: FaMoneyBillWave,
    color: "warning",
    name: "Point of Sales",
    text: "Handle sales and transactions quickly and securely.",
    path: "/apps/pos",
  },
];

export default function AppsList() {
  return (
    <Page title="Applications">
      <div className="transition-content px-(--margin-x) pb-8">
        <div className="mt-12 text-center">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-rose-500 text-white">
            <FaShapes className="size-8" />
          </div>
          <h3 className="mt-3 text-xl font-semibold text-gray-800 dark:text-dark-100">
            Applications
          </h3>
        </div>
        <div className="mx-auto mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {apps.map((app) => (
            <Card className="flex flex-col p-4 sm:p-5" key={app.id}>
              <Avatar size={12} initialColor={app.color}>
                <app.logo className="size-6" />
              </Avatar>
              <h2 className="mt-5 line-clamp-1 text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
                {app.name}
              </h2>
              <p className="mt-1 grow">{app.text}</p>
              <div className="mt-5 pb-1">
                <Link
                  to={app.path}
                  className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
                >
                  View Application
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}
