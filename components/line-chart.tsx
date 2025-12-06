"use client"

import React from 'react';
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export interface LineChartDataPoint {
  category: string;
  [key: string]: string | number;
}

export interface LineChartProps {
  title?: string;
  description?: string;
  data: LineChartDataPoint[];
  dataKeys: string[];
  categoryKey?: string;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: string;
  curved?: boolean;
}

// Default colors for chart series
const DEFAULT_COLORS = [
  "#2563eb", // blue
  "#60a5fa", // light blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
];

export function LineChart({
  title,
  description,
  data,
  dataKeys,
  categoryKey = "category",
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  height = "350px",
  curved = true,
}: LineChartProps) {
  // Build chart config from data keys
  const chartConfig: ChartConfig = dataKeys.reduce((config, key, index) => {
    config[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: colors[index % colors.length],
    };
    return config;
  }, {} as ChartConfig);

  return (
    <div className="w-full max-w-3xl mx-auto my-4 border border-gray-700 rounded-lg overflow-hidden bg-gray-900 p-6">
      {/* Header */}
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>
      )}

      {/* Chart */}
      <ChartContainer config={chartConfig} className={`w-full`} style={{ height }}>
        <RechartsLineChart accessibilityLayer data={data}>
          {showGrid && <CartesianGrid vertical={false} />}
          <XAxis
            dataKey={categoryKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => {
              // Truncate long labels
              return value.length > 10 ? value.slice(0, 10) + '...' : value;
            }}
          />
          {showTooltip && (
            <ChartTooltip content={<ChartTooltipContent />} />
          )}
          {showLegend && (
            <ChartLegend />
          )}
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type={curved ? "monotone" : "linear"}
              dataKey={key}
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </RechartsLineChart>
      </ChartContainer>
    </div>
  );
}

