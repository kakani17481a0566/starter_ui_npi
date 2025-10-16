import {
  // HomeIcon,
  ClipboardDocumentCheckIcon,
//   ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
// import DashboardsIcon from "assets/dualicons/dashboards.svg?react";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
// import { GenIcon } from "react-icons";
import { getSessionData } from "utils/sessionStorage";

const ROOT_DASHBOARDS = "/genetics";

const path = (root, item) => `${root}${item}`;
let dynamicChilds=[];
const {role}=getSessionData();
 if(role ==='TEACHER'){
  dynamicChilds=[
    
        {
      id: "StudentRegistrationForm",
      path: path(ROOT_DASHBOARDS, "/genetics"),
      type: NAV_TYPE_ITEM,
      title: " Mohith Genetics Centre",
      transKey: "nav.genetics.genetics",
      Icon: ClipboardDocumentCheckIcon,
    },
  ]
}

export const Genetics = {
  id: "Genetics",
  type: NAV_TYPE_ROOT,
  path: "/genetics",
  title: "Genetics",
  transKey: "nav.genetics.genetics",
  Icon: ClipboardDocumentCheckIcon,
  childs: dynamicChilds
};
