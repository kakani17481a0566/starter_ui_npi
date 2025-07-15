import { getSessionData } from "utils/sessionStorage";
import { dashboards } from "./dashboards";
const TEACHER='teacher';
const NANNY='nanny';
const ADMIN='admin';

const {role}=getSessionData();
let navigation=[];
if(role.toLowerCase()===NANNY){
navigation=[dashboards];
}
else if(role.toLowerCase() ===TEACHER  || role.toLowerCase() ===ADMIN){
    navigation=[dashboards]
}

export {navigation} 
export { baseNavigation } from './baseNavigation'
