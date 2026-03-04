import { useState } from "react";
import { Search, ShoppingCart, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from "@/hook/useOrders";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { OrderStatus } from "@/types/database";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const currency = (v: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(v)

const ALL_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'canceled']

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    'Pendente',
  processing: 'Processando',
  shipped:    'Enviado',
  delivered:  'Entregue',
  canceled:  'Cancelado',
}

export function OrdersPage() {
  const { data: orders, isLoading } = useOrders()
  const updateStatus = useUpdateOrderStatus()
  const deleteOrder = useDeleteOrder()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = orders?.filter((o) => {
    const customer = o.customer as { name: string; email: string } | undefined
    const matchSearch =
      customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  }) ?? []

  //Contagem por status para os chips de filtro
  const countByStatus = orders?.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {}) ?? {}

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pedidos</h2>
        <p className="text-gray-500 text-sm mt-1">
          {orders?.length ?? 0} pedidos no total
        </p>
      </div>

      {/*Chips de status com contagem */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 pt-1.5 rounded-lg text-sm font-medium transition-colors ${ statusFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Todos ({orders?.length ?? 0})
        </button>
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === status ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {STATUS_LABELS[status]} ({countByStatus[status] ?? 0})
          </button>
        ))}
      </div>

      {/*Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar por cliente ou ID.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/*Tabela */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">
            {filtered.length} pedido{filtered.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6}).map((_, i) => (
                  <TableRow key={i}> 
                    {Array.from({ length: 6}).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => {
                  const customer = order.customer as { name: string} | undefined
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs text-gray-500">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer?.name ?? '-'}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {format(new Date(order.created_at), 'dd MM yyyy', {locale: ptBR})}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {currency(order.total)}
                      </TableCell>
                      <TableCell>
                        {/*
                          Select inline para mudar o status diretamente na tabela
                          Sem precisar abrir um modal!
                        */}
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            updateStatus.mutate({
                              id: order.id,
                              status: value as OrderStatus
                            })
                          }
                        >
                          <SelectTrigger className="w-36 h-8 text-xs border-0 p-0 shadow-none focus:ring-0">
                            <SelectValue>
                              <StatusBadge status={order.status as OrderStatus} />
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                <StatusBadge status={s} />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingId(order.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover pedido?</AlertDialogTitle>
            <AlertDialogDescription>O pedido e todos os seus itens serão removidos permanentemente!</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => { await deleteOrder.mutateAsync(deletingId!); setDeletingId(null) }}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}