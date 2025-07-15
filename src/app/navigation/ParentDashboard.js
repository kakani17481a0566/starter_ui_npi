import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
// import DashboardsIcon from "assets/dualicons/dashboards.svg?react";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { getSessionData } from "utils/sessionStorage";

const ROOT_DASHBOARDS = "/parent";

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
      id: "parent.dashboard",
      path: path(ROOT_DASHBOARDS, "/dashboard"),
      type: NAV_TYPE_ITEM,
      title: "Dashboard", 
      transKey: "nav.parent.dashboard",
      Icon: HomeIcon,
    },
    {
      id: "dashboards.Term",
      path: path(ROOT_DASHBOARDS, "/term"),
      type: NAV_TYPE_ITEM,
      title: "Term",
      transKey: "nav.dashboards.term",
      Icon: ClipboardDocumentCheckIcon, // e.g., Heroicons outline icon
    }
  ]
}
else if(role.toLowerCase()==="admin"){
  dynamicChilds=[
    {
      id: "dashboards.home",
      path: path(ROOT_DASHBOARDS, "/week"),
      type: NAV_TYPE_ITEM,
      title: "Week Plan", 
      transKey: "nav.dashboards.week",
      Icon: HomeIcon,
    },
    {
      id: "dashboards.attendence",
      path: path(ROOT_DASHBOARDS, "/attendance"),
      type: NAV_TYPE_ITEM,
      title: "Attendance",
      transKey: "nav.dashboards.attendance",
      Icon: ClipboardDocumentCheckIcon, // e.g., Heroicons outline icon
    },
    {
      id: "dashboards.Term",
      path: path(ROOT_DASHBOARDS, "/term"),
      type: NAV_TYPE_ITEM,
      title: "Term",
      transKey: "nav.dashboards.term",
      Icon: ClipboardDocumentCheckIcon, // e.g., Heroicons outline icon
    },
    {
      id: "dashboards.mark-attendance",
      path: "dashboards/mark-attendance",
      type: NAV_TYPE_ITEM,
      title: "Mark Attendance",
      transKey: "nav.dashboards.mark",
      Icon: ClipboardDocumentCheckIcon,
    }
  ]
}

export const ParentDashboards = {
  id: "parentDashboards",
  type: NAV_TYPE_ROOT,
  path: "/parent",
  title: "ParentDashboards",
  transKey: "nav.parent.parent",
  Icon: AcademicCapIcon,
  childs: dynamicChilds
};
