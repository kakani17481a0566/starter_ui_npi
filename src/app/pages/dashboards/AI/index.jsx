// src/app/pages/dashboards/Attendence/page.jsx

import { Page } from "components/shared/Page";
import VoiceInputCard from '../teacher/Ai/VoiceInputCard';
// import ImageGenerator from "../teacher/Ai/ImageGeneration";
import AlphabetTutor from'../teacher/AiNew';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
// import StatusCards from '../teacher/AiNew/Result';
export default function AI() {
  const handle = useFullScreenHandle();
  return (
    <Page title="Attendance">
      <div
        className="transition-content w-full pt-5 lg:pt-6"
        style={{ paddingLeft: "var(--margin-x)", paddingRight: "var(--margin-x)" }}
      >
        <FullScreen handle={handle}>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
           Artificial Intelligience
          </h2>
        </div>

        <VoiceInputCard/>
        {/* <ImageGenerator/> */}
        <AlphabetTutor/>
        {/* <StatusCards/> */}
        </FullScreen>
      </div>
    </Page>
  );
}

