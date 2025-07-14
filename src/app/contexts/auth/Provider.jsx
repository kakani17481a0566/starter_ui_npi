// Import Dependencies
import { useEffect, useReducer } from "react";
// import isObject from "lodash/isObject";
import PropTypes from "prop-types";
import isString from "lodash/isString";

// Local Imports
import axios from "utils/axios";
import { isTokenValid, setSession } from "utils/jwt";
import { AuthContext } from "./context";
import { setSessionData, clearSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  userProfile: null,
  userId: null,
  tenantId: null
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

  LOGIN_REQUEST: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },

  LOGIN_SUCCESS: (state, action) => {
    const { userProfile } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      userProfile,
    };
  },

  LOGIN_ERROR: (state, action) => {
    const { errorMessage } = action.payload;

    return {
      ...state,
      errorMessage,
      isLoading: false,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    userProfile: null,
  }),
};

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const authToken = window.localStorage.getItem("authToken");
        const userProfileString = localStorage.getItem("userProfile");

        const parsedUserProfile = userProfileString ? JSON.parse(userProfileString) : null;


        if (authToken && isTokenValid(authToken)) {
          setSession(authToken);

          //  const response = await axios.get("/user/profile");

          // const { user } = response.data;

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              parsedUserProfile

            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
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
    dispatch({
      type: "LOGIN_REQUEST",
    });

    try {
      //const response = await axios.get(`https://localhost:7171/api/User/login?username=${username}&password=${password}`);
      const response = await axios.get(`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/User/login?username=${username}&password=${password}`);

      // const { tenantId, userId, userName,roleName,departmentId} = response.data.data;
      const { tenantId, userId, userName, roleName, departmentId, userImageUrl } = response.data.data;

      const token = response.data.data.token;
      if (!isString(token)) {
        throw new Error("Response is not vallid");
      }
      const ids=await axios.get(`https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/department/${departmentId}/user/${userId}`);
      // console.log(ids.data.data);
      const{branchId,weekId,termId,courses,userProfile}=ids.data.data;

      // localStorage.setItem("authToken", token);
      // localStorage.setItem("tenantId", tenantId);
      // localStorage.setItem("userId", userId);
      // localStorage.setItem("departmentId", departmentId);
      // localStorage.setItem("branchId", branchId);
      // localStorage.setItem("weekId", weekId);
      // localStorage.setItem("termId", termId);
      // localStorage.setItem("courses", JSON.stringify(courses));
      // localStorage.setItem("userProfile", JSON.stringify(userProfile));
      // localStorage.setItem("roleName",roleName);

      setSessionData({ token: token, tid: tenantId, uid: userId,
         userName: userName,roleName:roleName, departmentId:departmentId , 
         branchId:branchId, weekId:weekId, termId:termId,courses:courses,userImageUrl: userImageUrl,userProfile: userProfile });



      setSession(token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          userId
        },
      });
    } catch (err) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          errorMessage: err,
        },
      });
    }
  };

  // const logout = async () => {
  //   setSession(null);
  //   clearSessionData();
  //   dispatch({ type: "LOGOUT" });
  // };


  const logout = async () => {
  // Remove the auth token from axios headers
  setSession(null);

  // Clear session data from localStorage or sessionStorage
  clearSessionData();

  // Remove auth-related items explicitly from localStorage
  localStorage.removeItem("authToken");
  localStorage.removeItem("tenantId");
  localStorage.removeItem("userId");

  // Update state to logged out
  dispatch({ type: "LOGOUT" });

  // Optional: redirect user to login page (if you have react-router)
  window.location.href = "/login";
};


  if (!children) {
    return null;
  }

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