import { useState } from "react";
import { Plus, Search, Pencil, Trash2, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers, useDeleteCustomer } from "@/hook/useCostumers";
import { CustomerFormModal } from "./CustomerFormModal";
import { Customer } from "@/types/database";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"

//Gera iniciais a partir do nome completo
function getInitials(name: string) {
  return name.split('').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

//Gera uma cor de avatar consistente baseada no nome
const AVATAR_COLORS =[
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
]
function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}

export function CustomersPage() {
  const { data: customers, isLoading } = useCustomers()
  const deleteCustomer = useDeleteCustomer()

  const [formOpen, setFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('all')

  const filtered = customers?.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchState = stateFilter === 'all' || c.state === stateFilter
    return matchSearch && matchState
  }) ?? []

  const states = [...new Set(customers?.map((c) => c.state).filter(Boolean) ?? [])]

  function handleEdit(customer: Customer) {
    setEditingCustomer(customer)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setTimeout(() => setEditingCustomer(null), 300)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-500 text-sm mt-1">
            {customers?.length ?? 0} clientes cadastrados
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar por nome ou e-mail.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <MapPin className="h-4 w-4 text-gray-400" />
              <button 
                onClick={() => setStateFilter('all')} 
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${ stateFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Todos
              </button>
              {states.map((state) => (
                <button
                  key={state}
                  onClick={() => setStateFilter(state!)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      stateFilter === state ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">
            {filtered.length} resultado{filtered.length != 1 ? "s" : "" }
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5}).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 5}).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        Nenhum cliente encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={`text-xs front-semibold ${getAvatarColor(customer.name)}`}>
                                {getInitials(customer.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{customer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="text-gray-900">{customer.email}</p>
                            {customer.phone && (
                              <p className="text-gray-400">{customer.phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.city && customer.state
                          ? `${customer.city}, ${customer.state}`
                        : <span className="text-gray-400">-</span>
                        }
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {format(new Date(customer.created_at), "dd MM yyyy", { locale: ptBR})}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                              <Pencil className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeletingId(customer.id)}>
                              <Trash2 className="h4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
        </CardContent>
      </Card>

      <CustomerFormModal open={formOpen} onClose={handleCloseForm} customer={editingCustomer} />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Ao remover o cliente, todos os seus pedidos também serão removidos (CASCADE), Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={ async () => { await deleteCustomer.mutateAsync(deletingId!); setDeletingId(null) }}
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