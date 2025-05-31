import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

import type { ChartOptions } from "chart.js";

// 색상 정의
const COLOR = {
  ORANGE_1: "rgba(255, 108, 61, 1)",
  GRAY_A4: "#A4A4A4",
  BLACK: "#000000",
};

const ScoreRadarChart: React.FC<{ scores: number[] }> = ({ scores }) => {
  const chartData = {
    labels: ["국어", "수학", "영어", "사회", "과학"],
    datasets: [
      {
        // label: "학생 점수", // 중복이라 제거
        data: scores,
        backgroundColor: "rgba(255, 108, 61, 0.2)",
      },
      ...[20, 40, 60, 80, 100].map((v) => ({
        label: `배경${v}`,
        data: Array(5).fill(v),
        borderColor: COLOR.GRAY_A4,
        backgroundColor: "white",
        borderWidth: 1,
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
      })),
    ],
  };

  const chartOptions: ChartOptions<"radar"> = {
    elements: {
      line: {
        borderWidth: 2,
        borderColor: COLOR.ORANGE_1,
      },
      point: {
        backgroundColor: COLOR.ORANGE_1,
      },
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          display: false,
        },
        grid: {
          color: COLOR.GRAY_A4,
        },
        pointLabels: {
          font: {
            size: 12,
            weight: "bold",
            family: "Pretendard",
          },
          color: "#636262",
        },
        angleLines: {
          display: false,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
    animation: { duration: 500 },
  };

  return <Radar data={chartData} options={chartOptions} />;
};

export default ScoreRadarChart;
