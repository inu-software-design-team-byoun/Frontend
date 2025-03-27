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

const ScoreRadarChart: React.FC = () => {
  // 팀 점수 예시 데이터
  const teamScores = [3, 7, 5, 6, 8];

  const chartData = {
    labels: ["국어", "수학", "영어", "사회", "과학"],
    datasets: [
      {
        label: "팀 점수",
        data: teamScores,
        backgroundColor: "rgba(255, 108, 61, 0.2)",
      },
      {
        label: "배경1",
        data: [2.5, 2.5, 2.5, 2.5, 2.5],
        borderColor: COLOR.GRAY_A4,
        backgroundColor: "white",
        borderWidth: 1,
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
      },
      {
        label: "배경2",
        data: [5, 5, 5, 5, 5],
        borderColor: COLOR.GRAY_A4,
        backgroundColor: "white",
        borderWidth: 1,
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
      },
      {
        label: "배경3",
        data: [7.5, 7.5, 7.5, 7.5, 7.5],
        borderColor: COLOR.GRAY_A4,
        backgroundColor: "white",
        borderWidth: 1,
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
      },
      {
        label: "배경4",
        data: [10, 10, 10, 10, 10],
        borderColor: COLOR.GRAY_A4,
        backgroundColor: "white",
        borderWidth: 1,
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
      },
    ],
  };

  const chartOptions: ChartOptions<"radar"> & ChartOptions = {
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
        ticks: {
          stepSize: 2.5,
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
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 0,
    },
  };

  return <Radar data={chartData} options={chartOptions} />;
};

export default ScoreRadarChart;
