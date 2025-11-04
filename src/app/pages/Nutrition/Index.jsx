import { Page } from "components/shared/Page";

function ManiKLayout({ children }) {
  return (
    <div
      className="
        relative min-h-screen flex flex-col overflow-hidden
        bg-[#EFFCEB]
        bg-[url('/images/nutration/ManiKLayoutBackground.svg')]
        bg-repeat
        bg-[length:1000px_1000px]
        bg-center
      "
    >
      {/* Foreground content */}
      <div className="relative z-10 flex-1">{children}</div>
    </div>
  );
}

export default function Nutrition() {
  return (
    <Page title="Example">
      <ManiKLayout>
        <div className="transition-content w-full px-[--margin-x] pt-5 lg:pt-6">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              Example Page
            </h2>
          </div>
        </div>
      </ManiKLayout>
    </Page>
  );
}
