import { useEffect, useRef } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface SparklineChartProps {
  data: number[];
  color: string;
  height?: number;
}

const SparklineChart = ({ data, color, height = 48 }: SparklineChartProps) => {
  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparklineChart;
