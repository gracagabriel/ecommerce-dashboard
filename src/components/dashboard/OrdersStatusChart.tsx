import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { OrdersByStatus } from "@/hook/useDashboardMetrics";

//Mapeamento de status para Português
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendente", color: "#f59e0b" }, //Amarelo
    processing: { label: "Processando", color: "#3b82f6" }, //Azul
    shipped:    { label: 'Enviado',     color: '#8b5cf6' },
    delivered: { label: "Entregue", color: "#10b981" }, //Verde
    cancelled: { label: "Cancelado", color: "#ef4444" }, //Vermelho
}

interface OrdersStatusChartProps {
    data: OrdersByStatus[]
    isLoading: boolean
}

export function OrdersStatusChart({ data, isLoading }: OrdersStatusChartProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full rounded-full mx-auto" />
                </CardContent>
            </Card>
        )
    }

    const total = data.reduce((sum, item) => sum + item.count, 0)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Status dos Pedidos</CardTitle>
                <CardDescription>{total} pedidos no total</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            dataKey="count"
                            paddingAngle={3}
                        >
                            {data.map((entry) => (
                                <Cell
                                    key={entry.status}
                                    fill={STATUS_CONFIG[entry.status]?.color || "#94a3b8"}
                                />
                            ))} 
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [
                                value,
                                STATUS_CONFIG[name as string]?.label || name,
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/*Legenda personalizada */}
                <div className="space-y-2 mt-2">
                    {data.map((entry) => {
                        const config = STATUS_CONFIG[entry.status]
                        const pct = ((entry.count / total) * 100).toFixed(0)
                        return (
                            <div key={entry.status} className="flex items-center justify-between text-sm">
                               <div className="flex items-center gap-2">
                                <div 
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: config?.color }}
                                />
                                <span className="text-gray-600">{config?.label}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{entry.count}</span>
                                <span className="text-gray-400 text-xs">({pct}%)</span>
                               </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
