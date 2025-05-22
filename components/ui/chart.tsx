import type * as React from "react"

const ChartStyle = {
  root: "flex flex-col",
}

interface ChartTooltipContentProps {
  label: string
  value: string
  color?: string
}

const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ label, value, color }) => {
  return (
    <div className="flex items-center space-x-2">
      {color && <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>}
      <span>{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

interface ChartTooltipProps {
  children: React.ReactNode
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ children }) => {
  return <div className="bg-gray-800 rounded-md p-2 shadow-md">{children}</div>
}

interface ChartLegendContentProps {
  label: string
  color?: string
}

const ChartLegendContent: React.FC<ChartLegendContentProps> = ({ label, color }) => {
  return (
    <div className="flex items-center space-x-2">
      {color && <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>}
      <span>{label}</span>
    </div>
  )
}

interface ChartLegendProps {
  children: React.ReactNode
}

const ChartLegend: React.FC<ChartLegendProps> = ({ children }) => {
  return <div className="flex items-center space-x-4">{children}</div>
}

interface ChartContainerProps {
  children: React.ReactNode
}

const ChartContainer: React.FC<ChartContainerProps> = ({ children }) => {
  return <div className={ChartStyle.root}>{children}</div>
}

interface ChartProps {
  children: React.ReactNode
}

const Chart: React.FC<ChartProps> = ({ children }) => {
  return <>{children}</>
}

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle }
