import * as React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import {
  CalendarMonth,
  Today,
  ArchiveOutlined,
} from "@mui/icons-material";

// Import your tab components
import WeeklyPlan from "./WeeklyPlan";
import DailyMealPlanner from "./DailyMealPlanner";
import ArchiveTab from "./Archive"; // renamed to avoid icon conflict

// ----------------------------------------------------------------------

const tabData = [
  { key: "weeklyplan", label: "Weekly Plan", icon: <CalendarMonth fontSize="small" /> },
  { key: "DailyMealPlanner", label: "Daily Plan", icon: <Today fontSize="small" /> },
  { key: "archive", label: "Archive", icon: <ArchiveOutlined fontSize="small" /> },
];

// ----------------------------------------------------------------------

export default function DynamicTabs() {
  const [value, setValue] = React.useState(tabData[0].key);

  const handleChange = (event, newValue) => setValue(newValue);

  const renderContent = () => {
    switch (value) {
      case "weeklyplan":
        return <WeeklyPlan />;
      case "DailyMealPlanner":
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
        bgcolor: "transparent", // ✅ full transparency
        borderRadius: 2,
        boxShadow: "none",
        p: { xs: 1.5, sm: 2.5 },
      }}
    >
      {/* Tabs Header */}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor="secondary"
        indicatorColor="secondary"
        allowScrollButtonsMobile
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            minHeight: 48,
            minWidth: { xs: 100, sm: 140 },
          },
          "& .MuiTabs-indicator": {
            height: "3px",
            background: "linear-gradient(90deg, #33cdcd, #7b2ff7)",
            borderRadius: "3px",
          },
        }}
      >
        {tabData.map((tab) => (
          <Tab
            key={tab.key}
            value={tab.key}
            icon={tab.icon}
            iconPosition="start"
            label={tab.label}
            sx={{
              color: "text.primary",
              "&.Mui-selected": {
                color: "#33cdcd", // optional: highlight color
                backgroundColor: "transparent", // ✅ no white bg
              },
            }}
          />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: "transparent", // ✅ transparent background
          border: "none",         // ✅ remove border
          boxShadow: "none",      // ✅ no shadow
          minHeight: 120,
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}
