import { NAV_TYPE_ITEM } from "constants/app.constant";
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import DashboardsIcon from "assets/dualicons/dashboards.svg?react";
import AppsIcon from 'assets/dualicons/applications.svg?react'

export const baseNavigation = [
  {
    id: "dashboards",
    type: NAV_TYPE_ITEM,
    path: "/dashboards",
    title: "Dashboards",
    transKey: "nav.dashboards.dashboards",
    Icon: DashboardsIcon, // semantic for dashboards/analytics
  },

  {
    id: "parentDashboard",
    type: NAV_TYPE_ITEM,
    path: "/parent",
    title: "Parent Dashboards",
    transKey: "nav.parent.parent",
    Icon: UsersIcon, // semantic for parents/people
  },
  {
    id: "studentEnquiry",
    type: NAV_TYPE_ITEM,
    path: "/student",
    title: "Student Enquiry",
    transKey: "nav.student.student",
    Icon: ClipboardDocumentListIcon, // semantic for enquiry/form
  },
    {
    id: "FrontDesk",
    type: NAV_TYPE_ITEM,
    path: "/student",
    title: "Front Desk",
    transKey: "nav.FrontDesk.FrontDesk",
    Icon: BuildingOfficeIcon, // semantic for enquiry/form
  },
   {
        id: 'apps',
        type: NAV_TYPE_ITEM,
        path: '/apps',
        title: 'Applications',
        transKey: 'nav.apps.apps',
        Icon: AppsIcon,
    },


];
