import type React from "react"

interface MetricCardProps {
  title: string
  value: number
  unit: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon: Icon, description }) => (
  <div className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-green-100 p-3 rounded-full">
        <Icon className="h-7 w-7 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-green-800">{title}</h3>
      <div className="text-3xl font-bold text-green-700">
        {value} <span className="text-sm font-normal text-green-600">{unit}</span>
      </div>
      {description && <p className="mt-2 text-sm text-muted-foreground text-center">{description}</p>}
    </div>
  </div>
)

export default MetricCard

