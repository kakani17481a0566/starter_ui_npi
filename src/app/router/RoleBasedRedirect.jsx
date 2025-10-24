import { Navigate } from "react-router";
import { getSessionData } from "utils/sessionStorage";

export default function RoleBasedRedirect() {
  const { role } = getSessionData();
  if (role === "Nanny") return <Navigate to="/dashboards/mark-attendance" />;
  if(role==="USER") return <Navigate to="/genetics/genetics"/>;
  return <Navigate to="/dashboards/home" />;
}
