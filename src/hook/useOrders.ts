import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Order, OrderStatus } from "@/types/database";
import { toast } from "sonner";

export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("orders")
                .select(`*,
                    customers(id, name, email)
                    `)
                    //Inclui os dados do cliente relacionado a cada pedido usando relacionamento definido no Supabase
                .order("created_at", { ascending: false })

            if (error) throw error
            return data as Order[]
        },
    })
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, status}: { id: string, status: OrderStatus }) => {
            const { data, error } = await supabase
                .from("orders")
                .update({ status })
                .eq("id", id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] }) //Invalida as métricas do dashboard para atualizar os dados relacionados a pedidos
            toast.success("Status do pedido atualizado com sucesso!")
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar status do pedido: ${error.message}`)
        }
    })
}

export function useDeleteOrder() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("orders")
                .delete()
                .eq("id", id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] })
            toast.success("Pedido deletado com sucesso!")
        },
        onError: (error) => {
            toast.error(`Erro ao deletar pedido: ${error.message}`)
        }
    })
}