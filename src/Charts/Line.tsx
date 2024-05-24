import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import "chart.js/auto";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface LineChartProps {
  labels: string[];
  data1: number[];
  data2: number[];
  label: string;
  title1: string;
  title2: string;
  backgroundColor: string;
  borderColor1: string;
  borderColor2: string;
}

export const LineChart = ({
  data1 = [],
  data2 = [],
  labels = [],
  title1,
  title2,
  backgroundColor,
  borderColor1,
  borderColor2,
}: LineChartProps) => {
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  const data: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        label: title1,
        data: data1,
        backgroundColor,
        borderColor: borderColor1,
        borderWidth: 1,
      },
      {
        label: title2,
        data: data2,
        backgroundColor,
        borderColor: borderColor2,
        borderWidth: 1,
      },
    ],
  };
  return <Line data={data} options={options} />;
};
