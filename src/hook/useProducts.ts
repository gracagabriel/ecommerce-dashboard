import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/database";
import { toast } from "sonner";

//Busca todos os produtos
export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("name", { ascending: false })

            if (error) throw error

            return data as Product[]
        },
    })
}

//Cria um novo produto
export function useCreateProduct() {
    const queryClient = useQueryClient()
    //useQueryClient para acessar o cliente do React Query e invalidar a cache após criar um produto

    return useMutation({
        mutationFn: async (product: Omit<Product, "id" | "created_at">) => {
            //Omit<Product, "id" | "created_at"> é um tipo que tem todas as propriedades de Product exceto id e created_at, que são gerados automaticamente pelo banco
            const { data, error } = await supabase
                .from("products")
                .insert(product)
                .select()
                .single()
                // .single() retorna o produto criado em vez de um array

            if (error) throw error
            return data
        },
        onSuccess: () => {
            //Invalida a cache de "products" para refetch automático com o novo produto
            queryClient.invalidateQueries({ queryKey: ["products"] })
            toast.success("Produto criado com sucesso!")
        },
        onError: (error) => {
            toast.error(`Erro ao criar produto: ${error.message}`)
        },
    })
}

//Atualiza um produto existente
export function useUpdateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            ...product
        }: Partial<Product> & { id: string }) => {
            //Partial<Product> & { id: string } é um tipo que tem todas as propriedades de Product como opcionais, exceto id que é obrigatório para identificar qual produto atualizar
            const { data, error } = await supabase
                .from("products")
                .update(product)
                .eq("id", id)
                // .eq("id", id) é a condição para atualizar o produto com o id correspondente
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] }) //Invalida as métricas do dashboard para atualizar os dados relacionados a produtos
            toast.success("Produto atualizado com sucesso!")
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar produto: ${error.message}`)
        }
    })
}

//Deleta um produto
export function useDeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] })
            toast.success("Produto deletado com sucesso!")
        },
        onError: (error) => {
            toast.error(`Erro ao deletar produto: ${error.message}`)
        }
    })  
}