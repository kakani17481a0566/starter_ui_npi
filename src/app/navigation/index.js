import { getSessionData } from "utils/sessionStorage";
import { dashboards } from "./dashboards";
import {ParentDashboards} from "./ParentDashboard";
import {StudentEnquiry} from "./student";
const TEACHER='teacher';
const NANNY='nanny';
const ADMIN='admin';
const PARENT='parent';


const {role}=getSessionData();
let navigation=[];
if(role.toLowerCase()===NANNY){
navigation=[dashboards];
}
else if(role.toLowerCase() ===TEACHER  || role.toLowerCase() ===ADMIN){
    navigation=[dashboards,ParentDashboards,StudentEnquiry]
}
else if( role.toLowerCase() ===PARENT){
    navigation=[ParentDashboards]
}

export {navigation}
export { baseNavigation } from './baseNavigation'
