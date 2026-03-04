import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { startOfMonth, subMonths, format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

//Tipos de retorno
export interface MonthlyRevenue {
    month: string //"Jan", "Fev" e etc..
    revenue: number //Valor total de vendas no mês
    orders: number //Número total de pedidos no mês
}

export interface TopProducts {
    name: string
    category: string
    total_sold: number //quantidade total de vendas
    revenue: number //receita total gerada
}

export interface OrdersByStatus {
    status: string
    count: number
}

export interface CategoryRevenue {
    category: string
    revenue: number
    orders: number
}

export interface DashboardMetrics {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    averageTicket: number
    monthlyRevenue: MonthlyRevenue[]
    topProducts: TopProducts[]
    ordersByStatus: OrdersByStatus[]
    categoryRevenue: CategoryRevenue[]
    lowStockProducts: { name: string; stock: number}[]
}

//Hook para buscar as métricas do dashboard

async function fetchKPIs(from: Date, to: Date) {
    //Busca total de clientes
    const { count: customersCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        //head: true para não retornar os dados, apenas o count

    //Busca total de pedidos (excluindo cancelados para métricas reais)
    const { data: orders } = await supabase
        .from("orders")
        .select('total, status')
        .neq('status', 'cancelled') //Exclui pedidos cancelados
        //.neq = not equal, ou seja, status diferente de "cancelled"
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())
        //.lte = "less than or equal" - WHERE created_at <= data

    const totalRevenue = orders?.reduce((sum, o) => sum + o.total, 0) ?? 0
    const totalOrders = orders?.length ?? 0
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
        totalRevenue,
        totalOrders,
        totalCustomers: customersCount ?? 0,
        averageTicket,
    }
}

async function fetchMonthlyRevenue(from: Date, to: Date): Promise<MonthlyRevenue[]> {
    //Pega os ultimos 6 meses
    //const sixMonthAgo = startOfMonth(subMonths(new Date(), 5)) //Pega o início do mês de 6 meses atrás

    const { data } = await supabase
        .from("orders")
        .select ("total, created_at, status")
        .gte("created_at", from.toISOString()) //Filtra pedidos a partir de 6 meses atrás
        //.gte = greater than or equal, ou seja, created_at maior ou igual a sixMonthAgo
        .lte('created_at', to.toISOString())
        .neq("status", "cancelled") //Exclui pedidos cancelados
        .order("created_at", { ascending: true }) //Ordena por data de criação

        if (!data) return []

    //Agrupa por mês
    // O Supabase tem funções de agregação, mas fazer no JS é mais flexível
    const grouped = data.reduce<Record<string, { revenue: number; orders: number }>>((acc, order) => {
        //Cria uma chave "2024-01" para cada mês
        const key = format(new Date(order.created_at), "yyyy-MM")

        if (!acc[key]) {
            acc[key] = { revenue: 0, orders: 0 }
        }

        acc[key].revenue += order.total
        acc[key].orders += 1
        return acc
    }, {})

    //Transforma o objeto agrupado em array e formata o mês para "Jan", "Fev", etc
    return Object.entries(grouped).map(([key, value]) => ({
        month: format(new Date(key + "-01"), "MMM"), //Pega o mês da chave e formata para "Jan", "Fev", etc
        revenue: Math.round(value.revenue * 100) / 100, //Arredonda para 2 casas decimais
        orders: value.orders,
    }))
}

async function fetchTopProducts(from: Date, to: Date): Promise<TopProducts[]> {
    //Essa query usa JOIN: busca order_items junto com products
    //O supabase faz JOINs com a sintaxe de seleção aninhada
    const { data } = await supabase
        .from("order_items")
        .select (`
            quantity,
            unit_price,
            products (
                name,
                category
            ),
            orders!inner (status, created_at) -- JOIN com orders para filtrar por status
        `)
        .neq("orders.status", "cancelled") //Exclui pedidos cancelados      
        .gte('orders.created_at', from.toISOString())
        .lte('orders.created_at', to.toISOString())

        if (!data) return []

        //Agrega por produto
        const productMap = data.reduce<Record<string, TopProducts>>((acc, item) => {
            const product = item.products as { name: string; category: string } | null
            if (!product) return acc

            if (!acc[product.name]) {
                acc[product.name] = { name: product.name, category: product.category, total_sold: 0, revenue: 0}
            }
            acc[product.name].total_sold += item.quantity
            acc[product.name].revenue += item.quantity * item.unit_price

            return acc
        }, {})

        //Transforma em array, ordena por total_sold e pega os top 5
        return Object.values(productMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
}

async function fetchOrdersByStatus(from: Date, to: Date): Promise<OrdersByStatus[]> {
    const { data } = await supabase
        .from("orders")
        .select("status")
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())

        if (!data) return []

        const statusMap = data.reduce<Record<string, number>>((acc, order) => {
            acc[order.status] = (acc[order.status] ?? 0) + 1
            return acc
        }, {})

        return Object.entries(statusMap).map(([status, count]) => ({
            status,
            count,
        }))
}

async function fetchCategoryRevenue(from: Date, to: Date): Promise<CategoryRevenue[]> {
    const { data } = await supabase
    .from('order_items')
    .select (`
        quantity,
        unit_price,
        products ( category ),
        orders!inner ( status, created_at )
    `)
    .neq('orders.status', 'canceled')
    .gte('orders.created_at', from.toISOString())
    .lte('orders.created_at', to.toISOString())

    if (!data) return []

    const map = data.reduce<Record<string, CategoryRevenue>>((acc, item) => {
        const product = item.products as { category: string } | null
        if (!product) return acc
        const cat = product.category
        if (!acc[cat]) acc[cat] = { category: cat, revenue: 0, orders: 0 }
        acc[cat].revenue += item.quantity * item.unit_price
        acc[cat].orders += item.quantity
        return acc
    }, {})

    return Object.values(map).sort((a, b) => b.revenue - a.revenue)
}

async function fetchLowStockProducts() {
    const {data} = await supabase
    .from('products')
    .select('name, stock')
    .lte('stock', 15)
    //Produtos com estoque <= 15
    .order('stock', { ascending: true })
    .limit(5)

    return data ?? []
}

//Hook principal que combina todas as métricas
export function useDashboardMetrics(dateRange?: DateRange) {
    //Define o período padrão: Últimos 6 meses
    const from = dateRange?.from ?? subMonths(startOfMonth(new Date()), 5)
    const to = dateRange?.to ?? new Date()

    return useQuery({
        // A queryKey inclui as datas — quando mudar o filtro,
        // o React Query faz uma nova busca automaticamente!
        //queryKey: identificador unico do cache, se outro componente usar a mesma key recebe os dados do cache
        queryKey: ["dashboard-metrics", from.toISOString(), to.toISOString()],

        queryFn: async (): Promise<DashboardMetrics> => {
            //Executa todas as queries em paralelo com Promise.all para otimizar o tempo de resposta
            const [kpis, monthlyRevenue, topProducts, ordersByStatus, categoryRevenue, lowStockProducts] = await Promise.all([
                fetchKPIs(from, to),
                fetchMonthlyRevenue(from, to),
                fetchTopProducts(from, to),
                fetchOrdersByStatus(from, to),
                fetchCategoryRevenue(from, to),
                fetchLowStockProducts()
            ])

            return {
                ...kpis,
                monthlyRevenue,
                topProducts,
                ordersByStatus,
                categoryRevenue,
                lowStockProducts
            }
        }
    })
}