import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { productSchema, ProductFormData } from "./productSchema";
import { useCreateProduct, useUpdateProduct } from "@/hook/useProducts";
import { Product } from "@/types/database";

const CATEGORIES = ['Calçados', 'Roupas', 'Acessórios', 'Eletrônicos', 'Móveis', 'Esportes']

interface ProductFormModalProps {
    open: boolean
    onClose: () => void
    product?: Product | null // se passado, é edição; se null, é criação
}

export function ProductFormModal({ open, onClose, product }: ProductFormModalProps) {
    const isEditing = !!product
    const createProduct = useCreateProduct()
    const updateProduct = useUpdateProduct()

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        // zodResolver conecta o Zod ao React Hook Form
        // Toda validação do Zod vira erro inline no campo automaticamente
        defaultValues: {
            name: '',
            category: '',
            price: 0,
            stock: 0,
        },
    })

    //Quando abrir em modo de edição, preenche os campos com dados já existentes
    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock
            })
        } else {
            form.reset({ name: '', category: '', price: 0, stock: 0 })
        }
    }, [product, form])

    async function onSubmit(data: ProductFormData) {
        try {
            if (isEditing && product) {
                await updateProduct.mutateAsync({ id: product.id, ...data})
            } else {
                await createProduct.mutateAsync(data)
            }
            onClose()
        } catch {
            //Erro já trtado no hook
        }
    }

    const isPending = createProduct.isPending || updateProduct.isPending

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Produto" : "Novo Produto"}
                    </DialogTitle>
                </DialogHeader>

                {/*
                    <Form> do Shadcn é um wrapper que conecta o
                    react-hook-form context aos componentes FormField
                */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome do Produto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Tênis Running Pro" {...field} />
                                </FormControl>
                                {/* FormMessage exibe o erro do Zod automaticamente */}
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}
                        />

                       <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione.." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )} 
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preço (R$)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="0,00" {...field} />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                            />

                            <FormField control={form.control} name="stock" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estoque</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )} 
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Salvando.." : isEditing ? "Salvar" : "Criar produto"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}