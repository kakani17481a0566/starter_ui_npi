import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { getSessionData } from "utils/sessionStorage";
import NutritionIcon from "../../../public/images/nutration/NutritionIcon.svg?react";



const ROOT_DASHBOARDS = "/nutrition";
const path = (root, item) => `${root}${item}`;
let dynamicChilds = [];
const { role } = getSessionData();
if (role === "TEACHER") {
  dynamicChilds = [
    {
      id: "StudentRegistrationForm",
      path: path(ROOT_DASHBOARDS, "/nutrition"),
      type: NAV_TYPE_ITEM,
      title: " Mohith Genetics Centre",
      transKey: "nav.genetics.genetics",
      Icon: ClipboardDocumentCheckIcon,
    },
  ];
} else if (role === "PARENT") {
  dynamicChilds = [
    {
      id: "StudentRegistrationForm",
      path: path(ROOT_DASHBOARDS, "/genetics"),
      type: NAV_TYPE_ITEM,
      title: " Mohith Genetics Centre",
      transKey: "nav.genetics.genetics",
      Icon: ClipboardDocumentCheckIcon,
    },
  ];
}

export const nutrition = {
  id: "Genetics",
  type: NAV_TYPE_ROOT,
  path: "/nutrition",
  title: "Genetics",
  transKey: "nav.nutrition.nutrition",
  Icon: NutritionIcon,
  childs: dynamicChilds,
};
