// temp.js
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  BuildingOfficeIcon,

} from "@heroicons/react/24/outline";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { getSessionData } from "utils/sessionStorage";

const ROOT_DASHBOARDS = "/FrontDesk";
const path = (root, item) => `${root}${item}`;

let dynamicChilds = [];
const { role = "" } = getSessionData();
const normalizedRole = role.toLowerCase();

if (normalizedRole === "nanny") {
  dynamicChilds = [
    {
      id: "dashboards.mark-attendance",
      path: path(ROOT_DASHBOARDS, "/mark-attendance"),
      type: NAV_TYPE_ITEM,
      title: "Mark Attendance",
      transKey: "nav.dashboards.mark",
      Icon: ClipboardDocumentCheckIcon,
    },
  ];
} else if (normalizedRole === "teacher") {
  dynamicChilds = [
    {
      id: "dashboards.home",
      path: path(ROOT_DASHBOARDS, "/FrontDesk"),
      type: NAV_TYPE_ITEM,
      title: "Week Plan",
      transKey: "nav.FrontDesk.frontdeskmain",
      Icon: HomeIcon,
    },
    {
      id: "dashboards.branch",
      path: path(ROOT_DASHBOARDS, "/Branch"),
      type: NAV_TYPE_ITEM,
      title: "Branch",
      transKey: "nav.FrontDesk.branch",
      Icon: HomeIcon,
    },

  ];
} else if (normalizedRole === "admin") {
  dynamicChilds = [
    {
      id: "dashboards.home",
      path: path(ROOT_DASHBOARDS, "/FrontDesk"),
      type: NAV_TYPE_ITEM,
      title: "Week Plan",
      transKey: "nav.FrontDesk.frontdeskmain",
      Icon: HomeIcon,
    },
    {
      id: "dashboards.branch",
      path: path(ROOT_DASHBOARDS, "/Branch"),
      type: NAV_TYPE_ITEM,
      title: "Branch",
      transKey: "nav.FrontDesk.branch",
      Icon: HomeIcon,
    },
  ];
}

export const FrontDesk = {
  id: "FrontDesk",
  type: NAV_TYPE_ROOT,
  path: ROOT_DASHBOARDS,
  title: "Front Desk",
  transKey: "nav.FrontDesk.FrontDesk",
  Icon: BuildingOfficeIcon,
  childs: dynamicChilds,
};
