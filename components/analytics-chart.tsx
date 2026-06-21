"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface ChartData {
  date: string
  views: number
}

interface AnalyticsChartProps {
  data: ChartData[]
}

const chartConfig = {
  views: {
    label: "Page Views",
    color: "var(--color-primary)",
  },
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <Card className="col-span-full xl:col-span-3 border-slate-100 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Page Views Trend
          </CardTitle>
          <CardDescription>Daily traffic impressions for the last 7 days</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="var(--color-muted-foreground)"
              fontSize={11}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
              content={<ChartTooltipContent hideIndicator />}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
