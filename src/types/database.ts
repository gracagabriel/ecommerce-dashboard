export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';

export interface Customer {
    id: string
    name: string
    email: string
    phone: string | null
    city: string | null
    state: string | null
    created_at: string
}

export interface Product {
    id: string
    name: string
    category: string
    price: number
    stock: number
    created_at: string
}

export interface Order {
    id: string
    customer_id: string
    status: OrderStatus
    total: number
    created_at: string
    //Relação (quando buscar com join)
    customer?: Customer
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    quantity: number
    unit_price: number
    //Relações
    product?: Product
}