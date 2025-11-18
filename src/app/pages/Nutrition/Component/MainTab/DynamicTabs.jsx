import * as React from "react";
import { Tabs, Tab, Box } from "@mui/material";

// ----------------------------------------------------------------------
// Import Tab Components
// ----------------------------------------------------------------------
import WeeklyPlan from "./WeeklyPlan";
import DailyMealPlanner from "./DailyMealPlanner";
import ArchiveTab from "./Archive";

// ----------------------------------------------------------------------
// Tab Configuration
// ----------------------------------------------------------------------
const tabData = [
  { key: "weeklyplan", label: "Weekly Plan" },
  { key: "dailymealplanner", label: "Daily Plan" },
  { key: "archive", label: "Archive" },
];

// ----------------------------------------------------------------------
// Component Definition
// ----------------------------------------------------------------------
export default function DynamicTabs() {
  const [value, setValue] = React.useState(tabData[0].key);

  const handleChange = (event, newValue) => setValue(newValue);

  // Render tab-specific content
  const renderContent = () => {
    switch (value) {
      case "weeklyplan":
        return <WeeklyPlan />;
      case "dailymealplanner":
        return <DailyMealPlanner />;
      case "archive":
        return <ArchiveTab />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "transparent",
        borderRadius: 2,
        p: { xs: 1.5, sm: 2.5 },
      }}
    >
      {/* Tabs Header */}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor="inherit"
        allowScrollButtonsMobile
        sx={{
          "& .MuiTabs-indicator": {
            height: "3px",
            borderRadius: "3px",
            backgroundColor: "#1A4255", // Active underline color
            transition: "background-color 0.3s ease",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#1A4255", // ✅ Always dark blue text
            minHeight: 48,
            minWidth: { xs: 110, sm: 140 },
            borderBottom: "3px solid transparent", // baseline border
            transition: "all 0.3s ease-in-out",
            marginX: 1.5, // ✅ gap between tabs

            // 🔸 Unselected state
            "&:not(.Mui-selected)": {
              borderBottom: "3px solid #EB5633", // orange underline
            },

            // 🔹 Selected state
            "&.Mui-selected": {
              color: "#1A4255", // stays the same dark blue
              borderBottom: "3px solid #1A4255", // dark blue underline
              backgroundColor: "transparent",
            },

            "&:hover": {
              color: "#1A4255", // stays same
              opacity: 0.9,
            },
          },
        }}
      >
        {tabData.map((tab) => (
          <Tab key={tab.key} value={tab.key} label={tab.label} />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: "transparent",
          border: "none",
          boxShadow: "none",
          minHeight: 120,
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}
