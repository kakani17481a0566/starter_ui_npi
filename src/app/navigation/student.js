import {
  // HomeIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
// import DashboardsIcon from "assets/dualicons/dashboards.svg?react";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { getSessionData } from "utils/sessionStorage";

const ROOT_DASHBOARDS = "/student";

const path = (root, item) => `${root}${item}`;
let dynamicChilds=[];
const {role}=getSessionData();
if(role.toUpperCase()==='NANNY'){
dynamicChilds=[{
      id: "studentEnquiry",
      path: "student/enquiryForm",
      type: NAV_TYPE_ITEM,
      title: " Student Enquiry Form",
      transKey: "nav.student.enquiryForm",
      Icon: ClipboardDocumentCheckIcon,
    }
  ]
}
else if(role ==='TEACHER'){
  dynamicChilds=[
    {
      id: "studentEnquiry",
      path: "student/enquiryForm",
      type: NAV_TYPE_ITEM,
      title: " Student Enquiry Form",
      transKey: "nav.student.enquiryForm",
      Icon: ClipboardDocumentCheckIcon,
    },
    // {
    //   id: "dashboards.Term",
    //   path: path(ROOT_DASHBOARDS, "/term"),
    //   type: NAV_TYPE_ITEM,
    //   title: "Term",
    //   transKey: "nav.dashboards.term",
    //   Icon: ClipboardDocumentCheckIcon, // e.g., Heroicons outline icon
    // },
    // {
    //   id: "parent.dashboard",
    //   path: path(ROOT_DASHBOARDS, "/visitor"),
    //   type: NAV_TYPE_ITEM,
    //   title: "Dashboard",
    //   transKey: "nav.parent.dashboard",
    //   Icon: HomeIcon,
    // },
  ]
}
else if(role.toLowerCase()==="admin"){
  dynamicChilds=[
    {
      id: "studentEnquiry",
      path: path(ROOT_DASHBOARDS, "/enquiryForm"),
      type: NAV_TYPE_ITEM,
      title: " Student Enquiry Form",
      transKey: "nav.student.enquiryForm",
      Icon: ClipboardDocumentCheckIcon,
    },
    // {
    //   id: "dashboards.attendence",
    //   path: path(ROOT_DASHBOARDS, "/attendance"),
    //   type: NAV_TYPE_ITEM,
    //   title: "Attendance",
    //   transKey: "nav.dashboards.attendance",
    //   Icon: ClipboardDocumentCheckIcon, // e.g., Heroicons outline icon
    // },
    // {
    //   id: "dashboards.Term",
    //   path: path(ROOT_DASHBOARDS, "/term"),
    //   type: NAV_TYPE_ITEM,
    //   title: "Term",
    //   transKey: "nav.dashboards.term",
    //   Icon: ClipboardDocumentCheckIcon, // e.g., Heroicons outline icon
    // },
    // {
    //   id: "dashboards.mark-attendance",
    //   path: "dashboards/mark-attendance",
    //   type: NAV_TYPE_ITEM,
    //   title: "Mark Attendance",
    //   transKey: "nav.dashboards.mark",
    //   Icon: ClipboardDocumentCheckIcon,
    // },
    //     {
    //   id: "dashboards.Registration",
    //   path: path(ROOT_DASHBOARDS, "/registrationForm"),
    //   type: NAV_TYPE_ITEM,
    //   title: "RegistrationForm",
    //   transKey: "nav.parent.registrationForm",
    //   Icon: ClipboardDocumentCheckIcon, // e.g., Heroicons outline icon
    // },
  ]
}

export const StudentEnquiry = {
  id: "parentDashboards",
  type: NAV_TYPE_ROOT,
  path: "/student",
  title: "ParentDashboards",
  transKey: "nav.student.student",
  Icon: AcademicCapIcon,
  childs: dynamicChilds
};
