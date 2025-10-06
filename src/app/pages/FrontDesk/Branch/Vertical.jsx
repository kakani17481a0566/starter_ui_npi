import { Box, Button } from "components/ui";

const Horizontal = () => {
  return (
    <div className="flex items-stretch gap-6">
      {/* Left side */}
      <Box className="flex w-full items-center justify-center rounded-lg bg-gray-200 p-6 dark:bg-dark-500">
        <p className="text-xl font-semibold">Branch</p>
      </Box>

      {/* Divider */}
      <div className="flex flex-col items-center justify-center px-2">
        <div className="flex-1 w-px bg-gray-200 dark:bg-dark-500" />
        <p className="my-2 text-sm text-gray-600">OR</p>
        <div className="flex-1 w-px bg-gray-200 dark:bg-dark-500" />
      </div>

      {/* Right side */}
      <Box className="flex w-full items-center justify-center gap-4 rounded-lg bg-gray-200 p-6 dark:bg-dark-500">
        <Button color="success" size="sm">
          Add
        </Button>
        <Button color="primary" size="sm">
          Update
        </Button>
        <Button variant="outlined" size="sm">
          Cancel
        </Button>
      </Box>
    </div>
  );
};

export { Horizontal };
