import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerFormData, customerSchema } from "./customerSchema";
import { useCreateCustomer, useUpdateCustomer } from "@/hook/useCostumers";
import { Customer } from "@/types/database";

interface Props {
    open: boolean
    onClose: () => void
    customer?: Customer | null
}

export function CustomerFormModal({open, onClose, customer }: Props) {
    const isEditing = !!customer
    const createCustomer = useCreateCustomer()
    const updateCustomer = useUpdateCustomer()

    const form = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: { name: '', email: '', phone: '', city: '', state: ''},
    })

    useEffect(() => {
        if (customer) {
            form.reset({
                name: customer.name,
                email: customer.email,
                phone: customer.phone ?? '',
                city: customer.city ?? '',
                state: customer.state ?? '',
            })
        } else {
            form.reset({ name: '', email: '', phone: '', city: '', state: '' })
        }
    }, [customer, form])

    async function onSubmit(data: CustomerFormData) {
        try {
            if (isEditing && customer) {
                await updateCustomer.mutateAsync({ id: customer.id, ...data})
            } else {
                await createCustomer.mutateAsync(data)
            }
            onClose()
        } catch {
            {/*Toast já mostra o erro */}
        }
    }

    const  isPending = createCustomer.isPending || updateCustomer.isPending

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome completo</FormLabel>
                                <FormControl><Input placeholder="Ana Souza" {...field} /></FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}                    
                        />

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl><Input type="email" placeholder="ana@email.com" {...field}/></FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}     
                        />

                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone <span className="text-gray-400">(opcional)</span></FormLabel>
                                <FormControl><Input placeholder="11999990000" {...field}/></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl><Input placeholder="São Paulo" {...field} /></FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}    
                            />

                            <FormField control={form.control} name="state" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl><Input placeholder="SP" maxLength={2} {...field} /></FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}    
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Salvando.." : isEditing ? "Salvar" : "Criar Cliente"}
                            </Button>
                        </DialogFooter>                 
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}