import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import DashboardsIcon from "assets/dualicons/dashboards.svg?react";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { getSessionData } from "utils/sessionStorage";

const ROOT_DASHBOARDS = "/dashboards";

const path = (root, item) => `${root}${item}`;
let dynamicChilds=[];
const {role}=getSessionData();
if(role.toUpperCase()==='NANNY'){
dynamicChilds=[{
      id: "dashboards.mark-attendance",
      path: "dashboards/mark-attendance",
      type: NAV_TYPE_ITEM,
      title: "Mark Attendance",
      transKey: "nav.dashboards.mark",
      Icon: ClipboardDocumentCheckIcon,
    }
  ]
}
else if(role ==='Teacher'){
  dynamicChilds=[
    {
      id: "dashboards.home",
      path: path(ROOT_DASHBOARDS, "/home"),
      type: NAV_TYPE_ITEM,
      title: "Home",
      transKey: "nav.dashboards.home",
      Icon: HomeIcon,
    },
    {
      id: "dashboards.attendence",
      path: path(ROOT_DASHBOARDS, "/attendance"),

      // path: "dashboards/attendence",
      type: NAV_TYPE_ITEM,
      title: "Attendance",
      transKey: "nav.dashboards.attendance",
      Icon: ClipboardDocumentCheckIcon, // e.g., Heroicons outline icon
    }
  ]
}

export const dashboards = {
  id: "dashboards",
  type: NAV_TYPE_ROOT,
  path: "/dashboards",
  title: "Dashboards",
  transKey: "nav.dashboards.dashboards",
  Icon: DashboardsIcon,
  childs: dynamicChilds
};
