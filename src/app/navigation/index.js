import { getSessionData } from "utils/sessionStorage";
import { dashboards } from "./dashboards";
import {ParentDashboards} from "./ParentDashboard";
import {StudentEnquiry} from "./student";
import { FrontDesk } from "./FrontDesk"
import { apps } from "./apps";
import {Genetics} from "./genetics";
import {nutrition} from "./nutrition";


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
    navigation=[dashboards,ParentDashboards,StudentEnquiry, FrontDesk,apps,Genetics,nutrition]
}
else if( role.toLowerCase() ===PARENT){
    navigation=[ParentDashboards,Genetics   ]
}

export {navigation}
export { baseNavigation } from './baseNavigation'
