// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";
import RoleBasedRedirect from "./RoleBasedRedirect";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards" />, // ✅ fixed
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <RoleBasedRedirect/>,
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home/indexL")).default,
              }),
            },
             {
              path: "week",
              lazy: async () => ({
                Component: (await import("app/pages/academics/weeklyplan")).default,
              }),
            },
              {
              path: "term",
              lazy: async () => ({
                Component: (await import("app/pages/academics/termplan")).default,
              }),
            },
            {
              path: "attendance",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/Attendence"))
                  .default,
              }),
            },
              {
              path: "ai",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/teacher/TestRegistartion"))
                  .default,
              }),
            },
            {
              path: "result",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/teacher/AiNew/Result"))
                  .default,
              }),
            },
            {
              path: "mark-attendance",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/mark-attendance")
                ).default,
              }),
            },
          ],
        },
        {
          path: "parent",
          children: [
            {
              index: true,
              element: <Navigate to="/parent" />,
            },
            {
              path: "dashboard",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/Parent")).default,
              }),
            },
             {
              path: "week",
              lazy: async () => ({
                Component: (await import("app/pages/academics/weeklyplan")).default,
              }),
            },
            {
              path: "visitor",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/Visitor")).default,
              }),
            },
            {
              path: "registrationForm",
              lazy: async () => ({
                Component: (await import("app/pages/forms/RegistrationForm")).default,
              }),
            },
             {
              path: "ParentStudent",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/ParentStudent")).default,
              }),
            },
          ]
        },
        {
          path: "student",
          children: [
            {
              index: true,
              element: <Navigate to="/student" />,
            },
            {
              path: "enquiryForm",
              lazy: async () => ({
                Component: (await import("app/pages/forms/AdmissionEnquiry")).default,
              }),
            },
             {
              path: "StudentRegistrationForm",
              lazy: async () => ({
                Component: (await import("app/pages/forms/StudentRegistrationForm")).default,
              }),
            },
            {
              path: "visitor",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/Visitor")).default,
              }),
            },
            {
              path: "registrationForm",
              lazy: async () => ({
                Component: (await import("app/pages/forms/RegistrationForm")).default,
              }),
            },
          ]
        }
      ],
    },
    // The app layout supports only the main layout. Avoid using it for other layouts.
    {
      Component: AppLayout,
      children: [
      {
  path: "settings",
  lazy: async () => ({
    Component: (await import("app/pages/settings/Layout")).default,
  }),
  children: [
    {
      index: true,
      element: <Navigate to="/settings/general" />,
    },
    {
      path: "general",
      lazy: async () => ({
        Component: (await import("app/pages/settings/sections/General")).default,
      }),
    },
    {
      path: "appearance",
      lazy: async () => ({
        Component: (
          await import("app/pages/settings/sections/Appearance")
        ).default,
      }),
    },
    {
      path: "change-password", // ✅ Add this block
      lazy: async () => ({
        Component: (
          await import("app/pages/settings/sections/change-password")
        ).default,
      }),
    },
  ],
},

      ],
    },
  ],
};

export { protectedRoutes };
