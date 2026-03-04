import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { CategoryRevenue } from "@/hook/useDashboardMetrics";

//Cor única por categoria
const COLORS: Record<string, string> = {
  'Calçados':    '#3b82f6',
  'Roupas':      '#8b5cf6',
  'Acessórios':  '#f59e0b',
  'Eletrônicos': '#10b981',
  'Móveis':      '#f43f5e',
  'Esportes':    '#f97316',
}

const currency = (v: number) => 
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact',
    }).format(v)

function CustomTooltip({ active, payload}: any) {
    if (!active || !payload?.length) return null 
    const d = payload[0].payload as CategoryRevenue
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
            <p className="font-semibold text-gray-800 mb-1">{d.category}</p>
            <p className="text-gray-600">
                Receita:{' '}
                <span className="font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(d.revenue)}
                </span>
            </p>
            <p className="text-gray-600">
                Unidades: <span className="font-bold text-gray-900">{d.orders}</span>
            </p>
        </div>
    )
}

interface CategoryChartProps {
    data: CategoryRevenue[]
    isLoading?: boolean
}

export function CategoryChart({ data, isLoading }: CategoryChartProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-36" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-56 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Receita por Categoria</CardTitle>
                <CardDescription>Desempenho de cada categoria no período</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        {/* vertical={false} remove as linhas verticais — visual mais limpo */}
                        <XAxis 
                            dataKey="category"
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={currency}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                        <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={52}>
                            {/* radius=[top-left, top-right, bottom-right, bottom-left] */}
                            {data.map((entry) => (
                                <Cell 
                                    key={entry.category}
                                    fill={COLORS[entry.category] ?? '#94a3b8'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}