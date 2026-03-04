import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Customer } from "@/types/database";
import { toast } from "sonner";

export function useCustomers() {
    return useQuery({
        queryKey: ["customers"],
        queryFn: async () => {
            const {data, error } = await supabase
                .from("customers")
                .select("*")
                .order("name", { ascending: true })

            if (error) throw error
            return data as Customer[]
        },
    })
}

export function useCreateCustomer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (customer: Omit<Customer, "id" | "created_at">) => {
            const { data, error } = await supabase
                .from("customers")
                .insert(customer)
                .select()
                .single()
                
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] })
            queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] }) //Invalida as métricas do dashboard para atualizar o total de clientes
            toast.success("Cliente criado com sucesso!")
        },
        onError: (error) => {
            toast.error(`Erro ao criar cliente: ${error.message}`)
        }
    })
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...customer}: Partial<Customer> & { id: string }) => {
            const { data, error } = await supabase
                .from("customers")
                .update(customer)
                .eq("id", id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] })
            toast.success("Cliente atualizado com sucesso!")
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar cliente: ${error.message}`)
        }
    })
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("customers")
                .delete()
                .eq("id", id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] })
            queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] })
            toast.success("Cliente deletado com sucesso!")
        },
        onError: (error) => {
            toast.error(`Erro ao deletar cliente: ${error.message}`)
        }
    })
}