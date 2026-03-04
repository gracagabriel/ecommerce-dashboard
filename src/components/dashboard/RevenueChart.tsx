import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { MonthlyRevenue } from '@/hook/useDashboardMetrics'

//Tooltip personalizado ao passar o mouse
function CustomTooltip({ active, payload, label }: any) {
  // Verifica TODAS as condições antes de acessar qualquer propriedade
  if (!active || !payload || payload.length === 0) return null

  const revenueEntry = payload[0]
  const ordersEntry = payload[1]

  // Garante que os dados existem antes de renderizar
  if (!revenueEntry) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-blue-600 text-sm">
        Receita:{' '}
        <span className="font-bold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(revenueEntry.value ?? 0)}
        </span>
      </p>
      {ordersEntry && (
        <p className="text-gray-500 text-sm">
          Pedidos: <span className="font-bold">{ordersEntry.value}</span>
        </p>
      )}
    </div>
  )
}

interface RevenueChartProps {
    data: MonthlyRevenue[]
    isLoading: boolean
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className='h-5 w-40' />
                    <Skeleton className='h-4 w-56' />
                </CardHeader>
                <CardContent>
                    <Skeleton className='h-64 w-full' />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
                <CardDescription>Últimos 6 meses (pedidos entregues)</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
                {/*
                    ResponsiveContainer: faz o gráfico ocupar 100% da largura
                    do container pai, responsivo automaticamente
                */}
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                        {/*
                            defs: define gradientes SVG reutilizáveis
                            Isso cria o efeito de degradê sob a linha
                        */}
                        <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                        <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                        />

                        <YAxis
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) =>
                            new Intl.NumberFormat('pt-BR', {
                            notation: 'compact',
                            style: 'currency',
                            currency: 'BRL',
                            }).format(v)
                        }
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Area principal — receita */}
                        <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        fill="url(#colorRevenue)"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        />

                        {/* Linha de pedidos — sem fill */}
                        <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="none"
                        strokeDasharray="5 5"
                        dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {/* Legenda personalizada */}
                <div className="flex items-center gap-6 mt-4 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-sm text-gray-500">Receita (R$)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-emerald-500 border-dashed border-t-2" />
                            <span className="text-sm text-gray-500">Pedidos</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}