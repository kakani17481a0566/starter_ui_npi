// Import Dependencies
import { isRouteErrorResponse, useRouteError } from "react-router";
import { lazy } from "react";
import { Loadable } from "components/shared/Loadable";

// Lazy load error pages
const app = {
  401: lazy(() => import("./401")),
  404: lazy(() => import("./404")),
  429: lazy(() => import("./429")),
  500: lazy(() => import("./500")),
};

function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const Component = Loadable(app[error.status] || app[500]);
    return <Component />;
  }

  // Show raw error detail (non-route error)
  return (
    <div className="p-8 max-w-3xl mx-auto text-left text-red-700 bg-red-50 border border-red-200 rounded shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">⚠️ Unexpected Error</h2>

      <div className="mb-2">
        <strong>Message:</strong>
        <pre className="whitespace-pre-wrap break-words bg-white p-2 rounded mt-1 text-sm">
          {error?.message || "No message provided"}
        </pre>
      </div>

      {error?.stack && (
        <div className="mb-2">
          <strong>Stack Trace:</strong>
          <pre className="whitespace-pre-wrap break-words bg-white p-2 rounded mt-1 text-xs text-gray-700">
            {error.stack}
          </pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        This error is not handled by route-based status code pages (like 404 or 500).
      </div>
    </div>
  );
}

export default RootErrorBoundary;
