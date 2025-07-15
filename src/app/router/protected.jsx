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
                Component: (await import("app/pages/dashboards/home")).default,
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
              path: "mark-attendance",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/mark-attendance")
                ).default,
              }),
            },
          ],
        },
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
                Component: (await import("app/pages/settings/sections/General"))
                  .default,
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
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };
