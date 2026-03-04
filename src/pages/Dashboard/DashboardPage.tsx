import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react'
import { subMonths, startOfMonth } from 'date-fns'
import { useDashboardMetrics } from '@/hook/useDashboardMetrics'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { OrdersStatusChart } from '@/components/dashboard/OrdersStatusChart'
import { TopProductsCard } from '@/components/dashboard/TopProductsCard'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { LowStockCard } from '@/components/dashboard/LowStockCard'
import { DateRangePicker } from '@/components/dashboard/DateRangePicker'

const currency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export function DashboardPage() {
  // Estado do filtro de período — padrão: últimos 6 meses
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(startOfMonth(new Date()), 5),
    to: new Date(),
  })

  const { data: metrics, isLoading, error } = useDashboardMetrics(dateRange)

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Erro ao carregar dados</p>
          <p className="text-gray-400 text-sm mt-1">{(error as Error).message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Cabeçalho com DateRangePicker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Visão geral do seu e-commerce</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Receita Total"
          value={isLoading ? '...' : currency(metrics?.totalRevenue ?? 0)}
          subtitle="Pedidos não cancelados"
          icon={DollarSign}
          isLoading={isLoading}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="Total de Pedidos"
          value={isLoading ? '...' : String(metrics?.totalOrders ?? 0)}
          subtitle="Pedidos não cancelados"
          icon={ShoppingCart}
          isLoading={isLoading}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          title="Ticket Médio"
          value={isLoading ? '...' : currency(metrics?.averageTicket ?? 0)}
          subtitle="Por pedido no período"
          icon={TrendingUp}
          isLoading={isLoading}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KpiCard
          title="Clientes"
          value={isLoading ? '...' : String(metrics?.totalCustomers ?? 0)}
          subtitle="Total cadastrados"
          icon={Users}
          isLoading={isLoading}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Linha 2: Receita + Status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart data={metrics?.monthlyRevenue ?? []} isLoading={isLoading} />
        </div>
        <OrdersStatusChart data={metrics?.ordersByStatus ?? []} isLoading={isLoading} />
      </div>

      {/* Linha 3: Categorias + Estoque Baixo */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <CategoryChart data={metrics?.categoryRevenue ?? []} isLoading={isLoading} />
        </div>
        <LowStockCard data={metrics?.lowStockProducts ?? []} isLoading={isLoading} />
      </div>

      {/* Linha 4: Top Produtos + Resumo */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TopProductsCard data={metrics?.topProducts ?? []} isLoading={isLoading} />

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-1">Resumo do Período</h3>
          <p className="text-blue-200 text-sm mb-6">Métricas calculadas com base no filtro ativo</p>
          <div className="space-y-4">
            {[
              {
                label: 'Receita por cliente',
                value: metrics && metrics.totalCustomers > 0
                  ? currency(metrics.totalRevenue / metrics.totalCustomers)
                  : 'R$ 0,00',
              },
              {
                label: 'Pedidos por cliente',
                value: metrics && metrics.totalCustomers > 0
                  ? (metrics.totalOrders / metrics.totalCustomers).toFixed(1)
                  : '0',
              },
              {
                label: 'Taxa de cancelamento',
                value: metrics
                  ? (() => {
                      const cancelled = metrics.ordersByStatus.find(s => s.status === 'cancelled')?.count ?? 0
                      const total = metrics.ordersByStatus.reduce((s, o) => s + o.count, 0)
                      return total > 0 ? `${((cancelled / total) * 100).toFixed(1)}%` : '0%'
                    })()
                  : '...',
              },
              {
                label: 'Produtos com estoque baixo',
                value: String(metrics?.lowStockProducts.length ?? 0),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center border-b border-blue-500 pb-3"
              >
                <span className="text-blue-200 text-sm">{item.label}</span>
                <span className="font-bold text-white">{isLoading ? '...' : item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}