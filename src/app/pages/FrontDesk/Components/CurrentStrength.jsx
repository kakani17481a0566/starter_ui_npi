
// Import Dependencies
import Chart from "react-apexcharts";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

const options = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      columnWidth: "25%",
      borderRadius: 5,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },

  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val + " thousands";
      },
    },
  },

};

export function CurrentStrength() {
  const { primaryColorScheme } = useThemeContext();

  const series = [
    {
      name: "Net Profit",
      data: [44],
    },
    {
      name: "Revenue",
      data: [76],
    },
  ];

  const categories = ["Feb"];

  const chartOptions = {
    ...options,
    colors: ["#ff9800", primaryColorScheme[500]],
    xaxis: {
      categories,
    },
  };

  return (
    <div className="max-w-lg">
      <Chart series={series} type="bar" height="350" options={chartOptions} />
    </div>
  );
}
