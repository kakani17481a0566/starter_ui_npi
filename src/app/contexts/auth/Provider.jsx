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
    console.log("[Reducer] INITIALIZE:", action.payload);
    const { isAuthenticated, userProfile } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      userProfile,
    };
  },
  LOGIN_REQUEST: (state) => {
    console.log("[Reducer] LOGIN_REQUEST");
    return { ...state, isLoading: true };
  },
  LOGIN_SUCCESS: (state, action) => {
    console.log("[Reducer] LOGIN_SUCCESS:", action.payload);
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      userProfile: action.payload.userProfile,
    };
  },
  LOGIN_ERROR: (state, action) => {
    console.error("[Reducer] LOGIN_ERROR:", action.payload.errorMessage);
    return {
      ...state,
      errorMessage: action.payload.errorMessage,
      isLoading: false,
    };
  },
  LOGOUT: (state) => {
    console.log("[Reducer] LOGOUT triggered");
    return {
      ...state,
      isAuthenticated: false,
      userProfile: null,
    };
  },
};

const reducer = (state, action) => {
  console.log("[Reducer Dispatch]", action.type);
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
      const expiresAt = decoded.exp * 1000;
      const timeUntilExpiry = expiresAt - Date.now();

      console.log(
        `[Auth] Token decoded:`,
        decoded,
        `\nExpires in ~${minutes.toFixed(1)} minutes`
      );

      if (logoutTimerRef) clearTimeout(logoutTimerRef);
      logoutTimerRef = setTimeout(() => {
        console.warn("[Auth] Token expired, auto-logging out");
        logout();
      }, timeUntilExpiry);
    } catch (e) {
      console.error("[Auth] Failed to decode token for auto logout:", e);
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log("[Auth] Initializing AuthProvider...");
      try {
        const authToken = localStorage.getItem("authToken");
        const userProfileString = localStorage.getItem("userProfile");
        const parsedUserProfile = userProfileString
          ? JSON.parse(userProfileString)
          : null;

        console.log("[Auth] Retrieved from storage:", {
          authToken,
          parsedUserProfile,
        });

        if (authToken && isTokenValid(authToken)) {
          console.log("[Auth] Token valid, setting session...");
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
          console.warn("[Auth] No valid token found, initializing as guest");
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              userProfile: null,
            },
          });
        }
      } catch (err) {
        console.error("[Auth] Init error:", err);
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
    console.log("[Auth] Login attempt:", { username, password });
    dispatch({ type: "LOGIN_REQUEST" });

    try {
      const response = await axios.get(
        `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/User/login?username=${username}&password=${password}`
      );
      console.log("[Auth] Login API response:", response.data);

      const {
        tenantId,
        userId,
        userName,
        roleName,
        departmentId,
        userImageUrl,
        token,
        userProfile
      } = response.data.data;

      if (!isString(token)) throw new Error("Invalid token format");

      let branchId,
        weekId,
        termId,
        courses
      if(roleName==="USER"){
        // console.log("This is user");
      }
      else if (roleName === "PARENT") {
            // console.log("[Auth] Fetching parent profile...");
            const res = await axios.get(
            `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/ParentStudents/user/${userId}/tenant/${tenantId}/courses`
            );
            ({ branchId, weekId, termId, courses } = res.data.data);
          } else {
            // console.log("[Auth] Fetching department profile...");
            const ids = await axios.get(
            `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/department/${userId}/user/${tenantId}`
            );
            ({ branchId, weekId, termId, courses } = ids.data.data);
          }


      // console.log("[Auth] Session data prepared:", {
      //   tenantId,
      //   userId,
      //   userName,
      //   roleName,
      //   departmentId,
      //   branchId,
      //   weekId,
      //   termId,
      //   courses,
      // });

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

      // console.log("[Auth] Login successful, user authenticated");
    } catch (err) {
      console.error("[Auth] Login error:", err);
      dispatch({
        type: "LOGIN_ERROR",
        payload: { errorMessage: err },
      });
    }
  };

  const logout = () => {
    // console.log("[Auth] Manual logout triggered");

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
