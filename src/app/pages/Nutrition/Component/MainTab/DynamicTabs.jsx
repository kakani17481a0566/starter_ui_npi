import * as React from "react";
import { Tabs, Tab, Box } from "@mui/material";

// ----------------------------------------------------------------------
// Import Tab Components
// ----------------------------------------------------------------------
import WeeklyPlan from "./WeeklyPlan";
import DailyMealPlanner from "./DailyMealPlanner";
import ArchiveTab from "./Archive";

// ----------------------------------------------------------------------
// Tab Definitions
// ----------------------------------------------------------------------
const tabData = [
  { key: "weeklyplan", label: "Weekly Plan" },
  { key: "dailymealplanner", label: "Daily Plan" },
  { key: "archive", label: "Archive" },
];

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
export default function DynamicTabs() {
  const [value, setValue] = React.useState("weeklyplan");
  const [selectedDate, setSelectedDate] = React.useState(null); // Format: yyyy-MM-dd

  // 🔹 Switch between tabs
  const handleChange = (event, newValue) => setValue(newValue);

  // 🔹 When WeeklyCard → Create/Edit is clicked
  const handleWeeklyCreateClick = (dateString) => {
    setSelectedDate(dateString);           // store selected date globally
    setValue("dailymealplanner");          // switch to daily plan
  };

  // ----------------------------------------------------------------------
  // Render selected tab screen
  // ----------------------------------------------------------------------
  const renderContent = () => {
    switch (value) {
      case "weeklyplan":
        return (
          <WeeklyPlan
            onCreateClick={handleWeeklyCreateClick}
            selectedDate={selectedDate}   // highlight card in weekly
          />
        );

      case "dailymealplanner":
        return <DailyMealPlanner selectedDate={selectedDate} />;

      case "archive":
        return <ArchiveTab />;

      default:
        return null;
    }
  };

  // ----------------------------------------------------------------------
  // UI Layout
  // ----------------------------------------------------------------------
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "transparent",
        borderRadius: 2,
        p: { xs: 1.5, sm: 2.5 },
      }}
    >
      {/* ---------------- HEADER ---------------- */}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        textColor="inherit"
        sx={{
          "& .MuiTabs-indicator": {
            height: "3px",
            backgroundColor: "#1A4255",
            borderRadius: "3px",
          },

          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#1A4255",
            minHeight: 48,
            minWidth: { xs: 100, sm: 140 },
            marginX: 1.5,
            transition: "all 0.25s ease-in-out",
            borderBottom: "3px solid transparent",

            "&:not(.Mui-selected)": {
              borderBottomColor: "#EB5633",
            },

            "&.Mui-selected": {
              borderBottomColor: "#1A4255",
            },

            "&:hover": {
              opacity: 0.85,
            },
          },
        }}
      >
        {tabData.map((tab) => (
          <Tab key={tab.key} value={tab.key} label={tab.label} />
        ))}
      </Tabs>

      {/* ---------------- CONTENT ---------------- */}
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
