import { useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";
import { jwtDecode } from "jwt-decode";

// Local Imports
import axios from "utils/axios";
import { isTokenValid, setSession } from "utils/jwt";
import { AuthContext } from "./context"; // ✅ already the Provider
import { setSessionData, clearSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  userProfile: null,
  userId: null,
  tenantId: null,
};

const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, userProfile } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      userProfile,
    };
  },
  LOGIN_REQUEST: (state) => ({ ...state, isLoading: true }),
  LOGIN_SUCCESS: (state, action) => ({
    ...state,
    isAuthenticated: true,
    isLoading: false,
    userProfile: action.payload.userProfile,
  }),
  LOGIN_ERROR: (state, action) => ({
    ...state,
    errorMessage: action.payload.errorMessage,
    isLoading: false,
  }),
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    userProfile: null,
  }),
};

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  return handler ? handler(state, action) : state;
};

let logoutTimerRef = null;

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const scheduleAutoLogout = (token) => {
    try {
      const decoded = jwtDecode(token);
      const minutes = (decoded.exp * 1000 - Date.now()) / 60000;
      console.log(`Token will expire in ~${minutes.toFixed(1)} minutes`);
      const expiresAt = decoded.exp * 1000;
      const timeUntilExpiry = expiresAt - Date.now();

      if (logoutTimerRef) clearTimeout(logoutTimerRef);
      logoutTimerRef = setTimeout(() => {
        logout();
      }, timeUntilExpiry);
    } catch (e) {
      console.error("Failed to decode token for auto logout:", e);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const userProfileString = localStorage.getItem("userProfile");
        const parsedUserProfile = userProfileString
          ? JSON.parse(userProfileString)
          : null;

        if (authToken && isTokenValid(authToken)) {
          setSession(authToken);
          scheduleAutoLogout(authToken);

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              userProfile: parsedUserProfile,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              userProfile: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            userProfile: null,
          },
        });
      }
    };

    init();
  }, []);

  const login = async ({ username, password }) => {
    dispatch({ type: "LOGIN_REQUEST" });

    try {
      const response = await axios.get(
        `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/User/login?username=${username}&password=${password}`,
      );

      const {
        tenantId,
        userId,
        userName,
        roleName,
        departmentId,
        userImageUrl,
        token,
      } = response.data.data;

      if (!isString(token)) throw new Error("Invalid token format");
      let branchId, weekId, termId, courses, userProfile;
      if(roleName==='PARENT'){
        const res=await axios.get(`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/parent/${userId}/tenant/${tenantId}`);
        ({ branchId, weekId, termId, courses, userProfile } = res.data.data);
      }
      else{
        const ids = await axios.get(
        `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/department/${userId}/user/${tenantId}`,
      );

      ({ branchId, weekId, termId, courses, userProfile } = ids.data.data);

      }
      

      setSessionData({
        token,
        tid: tenantId,
        uid: userId,
        userName,
        roleName,
        departmentId,
        branchId,
        weekId,
        termId,
        courses,
        userImageUrl,
        userProfile,
      });

      setSession(token);
      scheduleAutoLogout(token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { userProfile },
      });
    } catch (err) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: { errorMessage: err },
      });
    }
  };

  const logout = () => {
    setSession(null);
    clearSessionData();
    localStorage.removeItem("authToken");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("userId");

    dispatch({ type: "LOGOUT" });
    window.location.href = "/dashboards";
  };

  if (!children) return null;

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
        userProfile: state.userProfile,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
