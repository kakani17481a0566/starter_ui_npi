
import { Box } from "components/ui";
import { DividerDropDown } from "../components/DividerDropDown";

const FeeDropDownVertical = () => {
  return (
    <>
      <Box className="flex h-10 w-full items-center justify-left rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-sm"> <DividerDropDown /> </p>
      </Box>
      {/* START: Divider */}
      <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>
      {/* END: Divider */}
     
    </>
  );
};

export { FeeDropDownVertical };
